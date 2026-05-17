---
description: List, install, or uninstall brain modules
---

## Without arguments
Show:
- Installed modules (`/root/brain/modules/` subdirs with valid `module.yaml`)
- Pending/available modules (from local marketplace + `slots.md`)
- Brain version compatibility

## With `install <name>`
Run: `bash /root/brain/scripts/modules.sh install <name>`

## With `uninstall <name>`
Run: `bash /root/brain/scripts/modules.sh uninstall <name>` (rollback safe)

## With `info <name>`
Show module README + dependencies.

See `/root/brain/modules/SLOTS.md` for the slot architecture.
