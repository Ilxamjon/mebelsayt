#!/usr/bin/env node
/**
 * After each agent turn, commit local changes (if any) and push to origin.
 * Secrets (.env) and local DBs stay ignored via .gitignore.
 */
import { execSync } from "node:child_process";
import { createInterface } from "node:readline";

async function readStdin() {
  const chunks = [];
  for await (const chunk of createInterface({ input: process.stdin, crlfDelay: Infinity })) {
    chunks.push(chunk);
  }
  const raw = chunks.join("\n").trim();
  if (!raw) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}

function run(cmd, opts = {}) {
  return execSync(cmd, {
    encoding: "utf8",
    stdio: ["ignore", "pipe", "pipe"],
    ...opts,
  }).trim();
}

function safeRun(cmd) {
  try {
    return run(cmd);
  } catch (error) {
    return error.stdout?.toString?.()?.trim() || error.message || "";
  }
}

await readStdin();

const remotes = safeRun("git remote");
if (!remotes.includes("origin")) {
  console.log(JSON.stringify({}));
  process.exit(0);
}

const status = safeRun("git status --porcelain");
if (status) {
  try {
    run("git add -A");
    const stamp = new Date().toISOString().replace("T", " ").slice(0, 19);
    run(`git commit -m "chore: auto-sync ${stamp}"`);
  } catch {
    // nothing to commit or commit failed — continue to push if ahead
  }
}

const branch = safeRun("git rev-parse --abbrev-ref HEAD") || "master";
const ahead = safeRun(`git rev-list --count origin/${branch}..HEAD`);

if (ahead && Number(ahead) > 0) {
  try {
    run(`git push -u origin HEAD`);
  } catch (error) {
    console.error(error.stderr?.toString?.() || error.message);
  }
}

console.log(JSON.stringify({}));
process.exit(0);
