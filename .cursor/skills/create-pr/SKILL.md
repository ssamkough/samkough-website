---
name: create-pr
description: Creates a GitHub pull request with gh from the current branch, using a HEREDOC body and the full commit range vs the base branch. Use when the user asks to create a PR, open a pull request, or push a branch and open a GitHub PR.
---

# Create PR

Open a GitHub pull request for the current work with `gh`. Do not invent a GitHub UI walkthrough. Return the PR URL when done.

## When to Use

- Use this skill when the user asks to create a PR, open a pull request, or push a branch and open a GitHub PR.
- This skill is helpful for turning local commits into a reviewable GitHub PR with a summary and test plan.
- Use the ask questions tool if you need to clarify requirements with the user (base branch, draft vs ready, title, or whether to include uncommitted work).

## Instructions

- Use `gh` via the Shell tool for GitHub work (issues, PRs, checks, releases). If given a GitHub URL, use `gh` to fetch what you need.
- NEVER update git config.
- Do not use interactive git (`-i` flags).
- Do not use the TodoWrite or Task tools while running this skill.
- Do not push to a remote unless this skill requires it to open the PR, or the user already asked to push.
- NEVER skip hooks (`--no-verify`, `--no-gpg-sign`) unless the user explicitly asks.
- Do not force-push to main/master. Warn if they request it.
- If there is nothing to put in a PR (no commits ahead of the base, no branch divergence), say so and stop. Do not open an empty PR.

### Clarify first if needed

Use the ask questions tool when any of these are unknown and would change the PR:

- Base branch (if it is not obvious from `main`/`master` or the repo default)
- Draft vs ready for review
- Whether uncommitted or untracked work should be committed first (do not commit unless the user asked)
- PR title if the commit history does not make one obvious

### Gather state in parallel

In one turn, run all of these with the Shell tool:

1. `git status` — untracked and uncommitted files
2. `git diff` — staged and unstaged changes that are not in a commit
3. Check whether the current branch tracks a remote and is up to date (`git status -sb` and `git rev-parse --abbrev-ref --symbolic-full-name @{u}` as needed)
4. `git log` and `git diff [base-branch]...HEAD` — full commit history and diff since the branch diverged from the base

Infer `[base-branch]` from the repo default (`gh repo view --json defaultBranchRef`) unless the user named one.

### Draft the PR from all commits

- Read **every** commit that will be in the PR, not only the latest.
- Title: concise, matches repo style if recent PRs exist (`gh pr list` or recent merge commits). Focus on why.
- Body must reflect the full change set. Do not describe only the last commit.
- Do not include files that look like secrets (`.env`, credentials). Warn if those are in the branch.

### Push, then create

Run these sequentially:

1. Create a new branch if the user is on `main`/`master` and asked for a PR. Do not PR directly from the default branch unless they explicitly want that.
2. Push with `-u` if the branch has no upstream:

```bash
git push -u origin HEAD
```

3. Create the PR:

```bash
gh pr create --title "the pr title" --body "$(cat <<'EOF'
## Summary
<1-3 bullet points>

## Test plan
- [ ] <checklist of what to verify>

EOF
)"
```

4. Return the PR URL.

If the user asked for a draft PR, add `--draft`. If they named reviewers or labels, pass `--reviewer` / `--label` only when they asked.

### Summary and test plan

- **Summary:** 1–3 bullets of what reviewers need to know (user-facing or operational impact, not a file list).
- **Test plan:** concrete checks. For this repo, that is often “read the new markdown as the candidate vs interviewer” rather than a test suite.
