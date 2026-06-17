"use client";

import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatDate";
import {
  Column,
  Row,
  Heading,
  Text,
  SmartLink,
  Line,
  Skeleton,
} from "@once-ui-system/core";

interface RepoDetails {
  name: string;
  description: string;
  pushed_at: string;
  topics: string[];
}

interface FileNode {
  name: string;
  path: string;
  type: "dir" | "file";
  download_url: string | null;
}

export default function DynamicBlogViewer({ id }: { id: string }) {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [contentDir, setContentDir] = useState<string>("");
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);
  
  // New States for File Explorer
  const [currentSubPath, setCurrentSubPath] = useState<string>("");
  const [fileTree, setFileTree] = useState<FileNode[]>([]);
  const [viewingCode, setViewingCode] = useState<string | null>(null);

  // 1. Initial Mount: Fetch Repo Details
  useEffect(() => {
    setMounted(true);
    const fetchRepo = async () => {
      try {
        const repoRes = await fetch(`https://api.github.com/repos/navinh2k4/${id}`);
        if (!repoRes.ok) {
          if (repoRes.status === 404) notFound();
          throw new Error("Failed to fetch repo details");
        }
        setRepoDetails(await repoRes.json());
      } catch (err) {
        console.error(err);
        setError(true);
      }
    };
    if (!repoDetails) fetchRepo();
  }, [id, repoDetails]);

  // 2. Fetch Directory Contents on SubPath Change
  useEffect(() => {
    const fetchContents = async () => {
      setLoading(true);
      try {
        const fetchPath = currentSubPath ? `contents/${currentSubPath}` : "contents";
        const contentRes = await fetch(`https://api.github.com/repos/navinh2k4/${id}/${fetchPath}`);

        if (!contentRes.ok) {
          throw new Error("Failed to fetch directory contents");
        }

        const data = await contentRes.json();

        if (Array.isArray(data)) {
          // Sort: Directories first, then files
          const sortedTree = data.sort((a: FileNode, b: FileNode) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === "dir" ? -1 : 1;
          });
          setFileTree(sortedTree);
          setContentDir(currentSubPath ? currentSubPath + "/" : "");

          // Check for README.md in the current directory
          const readmeNode = data.find((node: FileNode) => node.name.toLowerCase() === "readme.md");
          if (readmeNode && readmeNode.download_url) {
            const readmeRes = await fetch(readmeNode.download_url);
            if (readmeRes.ok) {
              setContent(await readmeRes.text());
            } else {
              setContent(null);
            }
          } else {
            setContent(null);
          }
          setViewingCode(null);
        }
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    if (mounted) fetchContents();
  }, [id, currentSubPath, mounted]);

  const handleItemClick = async (node: FileNode) => {
    if (node.type === "dir") {
      setCurrentSubPath(node.path);
    } else if (node.type === "file" && node.download_url) {
      setLoading(true);
      try {
        const fileRes = await fetch(node.download_url);
        if (!fileRes.ok) throw new Error("Failed to fetch file");
        const text = await fileRes.text();

        const isMarkdown = node.name.toLowerCase().endsWith(".md");
        if (isMarkdown) {
          setContent(text);
          setViewingCode(null);
          const lastSlash = node.path.lastIndexOf('/');
          setContentDir(lastSlash !== -1 ? node.path.substring(0, lastSlash) + "/" : "");
        } else {
          setContent(null);
          setViewingCode(text);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
  };

  const handleNavigateUp = () => {
    if (!currentSubPath) return;
    const lastSlash = currentSubPath.lastIndexOf('/');
    if (lastSlash === -1) {
      setCurrentSubPath("");
    } else {
      setCurrentSubPath(currentSubPath.substring(0, lastSlash));
    }
  };

  if (!mounted || (error && !repoDetails)) {
    return (
      <Row fillWidth horizontal="center" paddingTop="80">
        {error && !repoDetails ? <Text variant="body-strong-m" onBackground="danger-weak">Failed to load content from GitHub.</Text> : null}
      </Row>
    );
  }

  // Regex filter to catch LaTeX style arrow artifacts and enforce clean Unicode arrows
  const sanitizedContent = content
    ? content
        // 1. Convert back raw latex math symbols into clean text
        .replace(/\$4\\text\{ KB\}\$/g, "4 KB")
        .replace(/\$4\\text\{KB\}\$/g, "4 KB")
        
        // 2. Fix the broken C++ pointer operators inside source code blocks
        // Intercept the mutated Unicode arrow and restore it to standard '->' code representation
        .replace(/([a-zA-Z0-9_])→([a-zA-Z0-9_])/g, "$1->$2")
        
        // 3. Keep the baseline Markdown alignment arrow filters intact
        .replace(/\$\\rightarrow\$/g, "→")
        .replace(/\\rightarrow/g, "→")
    : "";

  return (
    <Column fillWidth horizontal="center" align="center">
      <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24" style={{ margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "center", width: "100%", maxWidth: "var(--responsive-width-m)", padding: "0 16px" }}>
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>

            {loading && !repoDetails ? (
              <Column fillWidth gap="12" align="center" horizontal="center">
                <Skeleton shape="line" />
                <Skeleton shape="line" />
                <Skeleton shape="line" />
              </Column>
            ) : repoDetails ? (
              <>
                <Text variant="body-default-xs" onBackground="neutral-weak" marginBottom="12">
                  {formatDate(repoDetails.pushed_at)} | {repoDetails.topics?.join(", ") || "GitHub Sync"}
                </Text>
                <Heading variant="display-strong-m" style={{ textTransform: "capitalize" }}>
                  {repoDetails.name.replace(/-/g, " ")}
                </Heading>
                {repoDetails.description && (
                  <Text variant="body-default-l" onBackground="neutral-weak" align="center">
                    {repoDetails.description}
                  </Text>
                )}
              </>
            ) : null}
          </Column>

          <Line maxWidth="40" marginTop="24" marginBottom="24" />

          {/* File Explorer UI */}
          <Column fillWidth maxWidth="m" gap="8" marginBottom="32" style={{ border: "1px solid var(--neutral-border-weak)", borderRadius: "var(--radius-m)", padding: "16px", background: "var(--surface-overlay)", width: "100%" }}>
            <Text variant="label-strong-m" marginBottom="16">File Explorer {currentSubPath ? `(/${currentSubPath})` : ""}</Text>
            {currentSubPath && (
              <Row 
                gap="12" 
                vertical="center" 
                style={{ cursor: "pointer", padding: "8px", borderRadius: "var(--radius-s)", borderBottom: "1px solid var(--neutral-border-weak)" }} 
                onClick={handleNavigateUp}
              >
                <Text variant="body-default-m">.. (Quay lại thư mục cha)</Text>
              </Row>
            )}
            {fileTree.map((node) => (
              <Row 
                key={node.path} 
                gap="12" 
                vertical="center" 
                style={{ cursor: "pointer", padding: "8px", borderRadius: "var(--radius-s)", borderBottom: "1px solid var(--neutral-border-weak)" }} 
                onClick={() => handleItemClick(node)}
              >
                <Text variant="body-default-m">{node.type === "dir" ? "📁" : "📄"}</Text>
                <Text variant="body-default-m" onBackground={node.type === "dir" ? "brand-strong" : "neutral-strong"}>{node.name}</Text>
              </Row>
            ))}
            {loading && <Text variant="body-default-s" onBackground="neutral-weak" marginTop="8">Loading folder contents...</Text>}
          </Column>

          {loading && !fileTree.length ? (
            <Column fillWidth gap="16" maxWidth="s">
              <Skeleton shape="line" />
              <Skeleton shape="line" />
              <Skeleton shape="line" />
              <Skeleton shape="line" />
              <Skeleton shape="line" />
              <Skeleton shape="block" />
            </Column>
          ) : error ? (
            <Column fillWidth gap="16" maxWidth="s" horizontal="center">
              <Text variant="body-strong-m" onBackground="danger-weak">
                Failed to load file contents from GitHub.
              </Text>
            </Column>
          ) : (
            <Column as="article" maxWidth="m" fillWidth style={{ margin: "0 auto", display: "flex", flexDirection: "column", alignItems: "flex-start", textAlign: "left", width: "100%", maxWidth: "var(--responsive-width-m)", padding: "0 16px", overflowX: "hidden", paddingBottom: "80px" }}>
              {viewingCode !== null ? (
                <Column fillWidth style={{ overflowX: "auto" }} marginBottom="16" radius="m" border="neutral-medium" background="surface">
                  <pre style={{ margin: 0, padding: "16px", overflowX: "auto", fontFamily: "monospace", fontSize: "14px", textAlign: "left", display: "block", width: "100%", whiteSpace: "pre" }}>
                    <code>{viewingCode}</code>
                  </pre>
                </Column>
              ) : content !== null ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    img: ({ node, src, alt, ...props }: any) => {
                      if (!src) return null;
                      
                      let finalSrc = src;
                      if (src.includes("github.com/user-attachments/assets/")) {
                        finalSrc = src.includes("?raw=true") ? src : `${src}?raw=true`;
                      } else {
                        const isAbsolute = src.startsWith("http://") || src.startsWith("https://") || src.startsWith("data:");
                        const cleanSrc = src.startsWith("/") ? src.substring(1) : src;
                        finalSrc = isAbsolute ? src : `https://raw.githubusercontent.com/navinh2k4/${id}/main/${contentDir}${cleanSrc}`;
                      }
                      
                      return (
                        <img 
                          src={finalSrc} 
                          alt={alt || ""} 
                          style={{ maxWidth: "100%", height: "auto", display: "block", margin: "16px auto", borderRadius: "var(--radius-m)" }} 
                          {...props} 
                        />
                      );
                    },
                    h1: ({ node, ...props }: any) => <Heading as="h1" variant="heading-strong-xl" marginTop="48" marginBottom="24" {...props} />,
                    h2: ({ node, ...props }: any) => <Heading as="h2" variant="heading-strong-l" marginTop="40" marginBottom="16" {...props} />,
                    h3: ({ node, ...props }: any) => <Heading as="h3" variant="heading-strong-m" marginTop="32" marginBottom="16" {...props} />,
                    h4: ({ node, ...props }: any) => <Heading as="h4" variant="heading-strong-s" marginTop="24" marginBottom="16" {...props} />,
                    p: ({ node, ...props }: any) => <Text as="p" variant="body-default-m" marginBottom="16" {...props} />,
                    a: ({ node, ...props }: any) => <SmartLink href={props.href || "#"} {...props} />,
                    ul: ({ node, ...props }: any) => <Column as="ul" gap="8" paddingLeft="24" marginBottom="16" style={{ listStyleType: "disc" }} {...props} />,
                    ol: ({ node, ...props }: any) => <Column as="ol" gap="8" paddingLeft="24" marginBottom="16" style={{ listStyleType: "decimal" }} {...props} />,
                    li: ({ node, ...props }: any) => <Text as="li" variant="body-default-m" {...props} />,
                    blockquote: ({ node, ...props }: any) => (
                      <Column as="blockquote" paddingLeft="16" marginBottom="16" style={{ borderLeft: "4px solid var(--neutral-border-medium)", fontStyle: "italic" }}>
                        <Text variant="body-default-m" onBackground="neutral-weak" {...props} />
                      </Column>
                    ),
                    hr: ({ node, ...props }: any) => <Line marginTop="24" marginBottom="24" {...props} />,
                    table: ({ node, ...props }: any) => (
                      <div style={{ overflowX: "auto", WebkitOverflowScrolling: "touch", width: "100%", marginBottom: "16px" }}>
                        <table style={{ minWidth: "100%", borderCollapse: "collapse" }} {...props} />
                      </div>
                    ),
                    th: ({ node, ...props }: any) => (
                      <th style={{ borderBottom: "2px solid var(--neutral-border-medium)", padding: "12px 8px", textAlign: "left" }}>
                        <Text variant="label-strong-m" {...props} />
                      </th>
                    ),
                    td: ({ node, ...props }: any) => (
                      <td style={{ borderBottom: "1px solid var(--neutral-border-weak)", padding: "12px 8px" }}>
                        <Text variant="body-default-m" {...props} />
                      </td>
                    ),
                    pre: ({ node, ...props }: any) => (
                      <Column fillWidth style={{ overflowX: "auto" }} marginBottom="16" radius="m" border="neutral-medium" background="surface">
                        <pre style={{ margin: 0, padding: "16px", overflowX: "auto", fontFamily: "monospace", fontSize: "14px", textAlign: "left", display: "block", width: "100%", whiteSpace: "pre" }} {...props} />
                      </Column>
                    ),
                    code: ({ node, className, children, ...props }: any) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <code className={className} style={{ textAlign: "left" }} {...props}>
                          {children}
                        </code>
                      ) : (
                        <code style={{ background: "var(--surface-overlay)", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace", fontSize: "14px" }} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {sanitizedContent}
                </ReactMarkdown>
              ) : (
                <Text variant="body-default-m" onBackground="neutral-weak">No content available to display.</Text>
              )}
            </Column>
          )}
        </Column>
    </Column>
  );
}
