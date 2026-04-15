# Bug Description: OOM Kill During Bash Tool Execution

## Environment

- **OS:** Debian VPS
- **RAM:** 2GB
- **Swap:** Disabled (no swap)
- **Node.js:** v24 (64-bit)

## Issue

The application is killed by the kernel's OOM (Out-Of-Memory) killer specifically during/after **bash tool calls**.

## Reproduction

1. Run `qwen-code` on the VPS
2. Send a query that triggers bash tool execution (e.g., "check the current branch and see what are the changes")
3. The process gets killed by OOM-kill

## Key Observations

1. **Timing:** Happens even on the **first query** - not caused by accumulation over time
2. **Specific to bash tools:** Other tool calls (file read/write) work fine
3. **Memory limit doesn't help:** Even setting `--max-old-space-size=1000` doesn't prevent the OOM
4. **Output size:** The actual command output (e.g., `git status && git diff`) shouldn't be large enough to cause OOM

## Implications

The memory spike occurs somewhere in the shell execution flow itself, not from:

- Accumulated state over multiple queries
- Large output buffering
- General memory leaks over time

## Potential Areas to Investigate

- Shell execution service
- PTY (pseudo-terminal) handling
- Terminal rendering/serialization
- LLM API response handling after bash execution
