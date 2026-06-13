"use client";

import React, { useEffect, useState } from "react";
import { Grid, Card, Column, Row, Text, Skeleton, Avatar } from "@once-ui-system/core";
import { formatDate } from "@/utils/formatDate";
import { person } from "@/resources";

interface GitHubRepo {
  id: number;
  name: string;
  description: string;
  pushed_at: string;
  topics: string[];
}

export function ExternalBlogFeed() {
  const [mounted, setMounted] = useState(false);
  const [repos, setRepos] = useState<GitHubRepo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setMounted(true);
    const fetchRepos = async () => {
      try {
        const res = await fetch("https://api.github.com/users/navinh2k4/repos?sort=updated&per_page=100");
        if (!res.ok) {
          if (res.status === 403) {
            console.warn("GitHub API rate limit exceeded");
          }
          throw new Error("Failed to fetch repos");
        }
        const data: GitHubRepo[] = await res.json();

        // Filter by topics "writeup" or "blog"
        const filtered = data.filter(repo =>
          repo.topics && (repo.topics.includes("writeup") || repo.topics.includes("blog"))
        );

        setRepos(filtered);
      } catch (err) {
        console.error("Error fetching external posts:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };
    fetchRepos();
  }, []);

  if (!mounted || loading) {
    return (
      <Grid columns="2" s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
        {[1, 2].map((i) => (
          <Card key={i} fillWidth padding="4" radius="l-4" border="transparent" background="surface">
            <Column padding="24" gap="20" fillWidth>
              <Skeleton shape="line" />
              <Skeleton shape="line" />
              <Skeleton shape="line" />
            </Column>
          </Card>
        ))}
      </Grid>
    );
  }

  if (error || repos.length === 0) {
    return null; // Fail gracefully
  }

  return (
    <Grid columns="2" s={{ columns: 1 }} fillWidth marginBottom="40" gap="16">
      {repos.map((repo) => (
        <Card
          fillWidth
          key={repo.id}
          href={`/external-blog/${repo.name}`}
          transition="micro-medium"
          border="transparent"
          background="transparent"
          padding="4"
          radius="l-4"
        >
          <Row fillWidth>
            <Column maxWidth={28} paddingY="24" paddingX="l" gap="20" vertical="center">
              <Row gap="24" vertical="center">
                <Row vertical="center" gap="16">
                  <Avatar src={person.avatar} size="s" />
                  <Text variant="label-default-s">{person.name}</Text>
                </Row>
                <Text variant="body-default-xs" onBackground="neutral-weak">
                  {formatDate(repo.pushed_at, false)}
                </Text>
              </Row>
              <Text variant="heading-strong-l" wrap="balance" style={{ textTransform: "capitalize" }}>
                {repo.name.replace(/-/g, " ")}
              </Text>
              {repo.description && (
                <Text variant="body-default-s" onBackground="neutral-weak" style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {repo.description}
                </Text>
              )}
            </Column>
          </Row>
        </Card>
      ))}
    </Grid>
  );
}
