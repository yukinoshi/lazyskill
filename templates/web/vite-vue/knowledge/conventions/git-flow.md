# Git Flow Conventions

## Branching

- `dev` — daily development work. All feature branches branch from and merge back to `dev`.
- `main` — release branch. Only updated from `dev` or via approved PR.
- Never commit directly to `main`.

## Commit Format (Conventional Commits)

```
<type>(<scope>): <subject>
```

- **Types**: `feat`, `fix`, `test`, `refactor`, `chore`, `docs`.
- **Scope**: feature name in parentheses — `feat(auth): add login form validation`.
- **Subject**: imperative mood, lowercase, no trailing period.

## Commit Discipline

- One scenario = one commit. RED (failing test) and GREEN (passing implementation) can be separate commits.
- Never amend commits. Always create a new commit.
- Never use `--no-verify`. If a hook fails, fix the root cause.
- Use HEREDOC for multi-line commit messages:

```bash
git commit -m "$(cat <<'EOF'
feat(auth): add login form validation

- Validate email format
- Validate password length >= 8
- Show inline error messages
EOF
)"
```

## Project State Checkpoints

- State files in `.project-state/` are committed separately:
  - `chore: checkpoint` — general state save.
  - `chore: feature <name> complete` — feature fully implemented and tested.
  - `chore: handoff checkpoint` — session handoff, all WIP state saved.

## Pull Requests

- PRs not required for solo development.
- `main` branch is protected — no direct pushes, even for solo dev.
- Feature branches merge to `dev` freely. `dev` merges to `main` for releases.
