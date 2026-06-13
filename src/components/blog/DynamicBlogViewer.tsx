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

export default function DynamicBlogViewer({ id }: { id: string }) {
  const [mounted, setMounted] = useState(false);
  const [content, setContent] = useState<string | null>(null);
  const [repoDetails, setRepoDetails] = useState<RepoDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. Fetch repo metadata
        const repoRes = await fetch(`https://api.github.com/repos/navinh2k4/${id}`);
        if (!repoRes.ok) {
          if (repoRes.status === 404) {
            notFound();
            return;
          }
          throw new Error("Failed to fetch repo details");
        }
        const repoData = await repoRes.json();
        setRepoDetails(repoData);

        // 2. Fetch repo README.md
        const contentRes = await fetch(
          `https://api.github.com/repos/navinh2k4/${id}/contents/README.md`,
          {
            headers: {
              Accept: "application/vnd.github.v3.raw",
            },
          }
        );

        if (!contentRes.ok) {
          throw new Error("Failed to fetch markdown content");
        }

        const text = await contentRes.text();
        setContent(text);
      } catch (err) {
        console.error("Error fetching dynamic blog:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (!mounted || (error && !repoDetails)) {
    return (
      <Row fillWidth horizontal="center" paddingTop="80">
        {error && !repoDetails ? <Text variant="body-strong-m" onBackground="danger-weak">Failed to load content from GitHub.</Text> : null}
      </Row>
    );
  }

  return (
    <Row fillWidth>
      <Row maxWidth={12} m={{ hide: true }} />
      <Row fillWidth horizontal="center">
        <Column as="section" maxWidth="m" horizontal="center" gap="l" paddingTop="24" style={{ margin: "0 auto", width: "100%", padding: "0 16px" }}>
          <Column maxWidth="s" gap="16" horizontal="center" align="center">
            <SmartLink href="/blog">
              <Text variant="label-strong-m">Blog</Text>
            </SmartLink>

            {loading ? (
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

          {loading ? (
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
                Failed to load README.md from GitHub.
              </Text>
            </Column>
          ) : (
            <Column as="article" maxWidth="s" fillWidth style={{ margin: "0 auto", width: "100%", padding: "0 16px", overflowX: "hidden", paddingBottom: "80px" }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
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
                  code: ({ node, inline, className, children, ...props }: any) => {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline ? (
                      <Column fillWidth style={{ overflowX: "auto" }} marginBottom="16" radius="m" border="neutral-medium" background="surface">
                        <pre style={{ margin: 0, padding: "16px", overflowX: "auto", fontFamily: "monospace", fontSize: "14px" }}>
                          <code className={className} {...props}>
                            {children}
                          </code>
                        </pre>
                      </Column>
                    ) : (
                      <code style={{ background: "var(--surface-overlay)", padding: "2px 6px", borderRadius: "4px", fontFamily: "monospace", fontSize: "14px" }} {...props}>
                        {children}
                      </code>
                    );
                  },
                }}
              >
                {content || ""}
              </ReactMarkdown>
            </Column>
          )}
        </Column>
      </Row>
    </Row>
  );
};
