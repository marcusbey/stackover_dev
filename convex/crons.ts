import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.daily(
  "sync tool activity from GitHub",
  { hourUTC: 6, minuteUTC: 0 },
  internal.syncActivity.syncAllTools,
);

export default crons;
