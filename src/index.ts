#!/usr/bin/env node

import { existsSync } from "fs";
import { promisify } from "util";
import { exec as execCallback } from "child_process";
import { generateMessage } from "./openai";
const exec = promisify(execCallback);

async function getDiff() {
  const { stdout, stderr } = await exec("git diff --cached");
  if (stderr) {
    throw new Error(stderr);
  }
  const stagedFiles = stdout.trim().split("\n").join("");
  return stagedFiles;
}

function isGitInit() {
  return existsSync(".git");
}

async function main() {
  if (!isGitInit()) {
    console.log("Git must be initialized using 'git init'");
    return;
  }

  console.log(
    "Ensure changes are staged with 'git add <filename>' or 'git add .'.\n"
  );

  const changes = await getDiff();

  if (changes.length === 0) {
    console.log("Lenght of Changes: ", changes.length);
    console.log("No changes detected.");
    return;
  }

  console.log("Generating commit message...\n");
  console.log(await generateMessage(changes));
}

main().catch((error: any) => {
  console.error(error?.message ?? error);
  process.exit(1);
});
