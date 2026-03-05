"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";

function extractOwnerRepo(githubUrl: string): { owner: string; repo: string } | null {
  try {
    const url = new URL(githubUrl);
    const parts = url.pathname.split("/").filter(Boolean);
    if (parts.length >= 2) {
      return { owner: parts[0], repo: parts[1] };
    }
  } catch {
    // invalid URL
  }
  return null;
}

async function ghFetch(path: string, token?: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github.v3+json",
    "User-Agent": "stackover-dev-activity-sync",
  };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`https://api.github.com${path}`, { headers });
  if (!res.ok) {
    if (res.status === 403 || res.status === 429) {
      throw new Error(`GitHub rate limited: ${res.status}`);
    }
    return null;
  }
  return res.json();
}

export const fetchRepoActivity = internalAction({
  args: { githubUrl: v.string() },
  handler: async (_ctx, args) => {
    const parsed = extractOwnerRepo(args.githubUrl);
    if (!parsed) return null;

    const { owner, repo } = parsed;
    const token = process.env.GITHUB_TOKEN;

    const repoData = await ghFetch(`/repos/${owner}/${repo}`, token);
    if (!repoData) return null;

    const releases = await ghFetch(`/repos/${owner}/${repo}/releases?per_page=1`, token);
    const latestRelease = releases?.[0] ?? null;

    const commitActivity = await ghFetch(`/repos/${owner}/${repo}/stats/commit_activity`, token);

    const since90 = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();
    const closedIssues = await ghFetch(`/repos/${owner}/${repo}/issues?state=closed&since=${since90}&per_page=100`, token);
    const openedIssues = await ghFetch(`/repos/${owner}/${repo}/issues?state=open&since=${since90}&per_page=100`, token);

    const commits = await ghFetch(`/repos/${owner}/${repo}/commits?per_page=1`, token);
    const lastCommitDate = commits?.[0]?.commit?.committer?.date
      ? new Date(commits[0].commit.committer.date).getTime()
      : null;

    const weeklyCommits: number[] = Array.isArray(commitActivity)
      ? commitActivity.map((w: { total: number }) => w.total)
      : [];

    const recentIssuesClosed = Array.isArray(closedIssues) ? closedIssues.length : 0;
    const recentIssuesOpened = Array.isArray(openedIssues) ? openedIssues.length : 0;

    return {
      stars: repoData.stargazers_count ?? 0,
      openIssues: repoData.open_issues_count ?? 0,
      lastCommitDate,
      lastRelease: latestRelease?.tag_name ?? null,
      lastReleaseDate: latestRelease?.published_at
        ? new Date(latestRelease.published_at).getTime()
        : null,
      weeklyCommits,
      recentIssuesClosed,
      recentIssuesOpened,
    };
  },
});
