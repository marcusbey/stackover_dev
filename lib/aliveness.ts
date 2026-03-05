export interface AlivenessTier {
  label: string;
  color: string;
  bgColor: string;
  dotColor: string;
}

const TIERS: { min: number; tier: AlivenessTier }[] = [
  {
    min: 80,
    tier: {
      label: "Thriving",
      color: "text-green-600",
      bgColor: "bg-green-50",
      dotColor: "bg-green-500",
    },
  },
  {
    min: 50,
    tier: {
      label: "Active",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      dotColor: "bg-blue-500",
    },
  },
  {
    min: 20,
    tier: {
      label: "Slowing",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      dotColor: "bg-yellow-500",
    },
  },
  {
    min: 0,
    tier: {
      label: "Stale",
      color: "text-red-600",
      bgColor: "bg-red-50",
      dotColor: "bg-red-500",
    },
  },
];

export function getAlivenessTier(score: number | undefined): AlivenessTier | null {
  if (score === undefined || score === null) return null;
  const clamped = Math.max(0, Math.min(100, score));
  for (const { min, tier } of TIERS) {
    if (clamped >= min) return tier;
  }
  return TIERS[TIERS.length - 1].tier;
}

export function computeAlivenessScore(params: {
  commitsLast90Days: number;
  avgWeeklyCommits: number;
  daysSinceLastRelease: number | null;
  issuesClosedLast90Days: number;
  issuesOpenedLast90Days: number;
  starsGrowthRate: number;
}): number {
  const commitRatio = params.avgWeeklyCommits > 0
    ? Math.min(params.commitsLast90Days / (params.avgWeeklyCommits * 13), 2)
    : params.commitsLast90Days > 0 ? 1 : 0;
  const commitScore = Math.min(commitRatio * 50, 100);

  let releaseScore = 0;
  if (params.daysSinceLastRelease !== null) {
    releaseScore = Math.max(0, 100 * Math.exp(-params.daysSinceLastRelease / 45));
  }

  const totalIssues = params.issuesClosedLast90Days + params.issuesOpenedLast90Days;
  const issueScore = totalIssues > 0
    ? (params.issuesClosedLast90Days / totalIssues) * 100
    : 50;

  const starScore = Math.min(Math.max(params.starsGrowthRate * 1000, 0), 100);

  const score =
    commitScore * 0.4 +
    releaseScore * 0.3 +
    issueScore * 0.2 +
    starScore * 0.1;

  return Math.round(Math.max(0, Math.min(100, score)));
}
