---
description: List / install / uninstall Brain modules (slot architecture)
---
Brain modules live in `/root/brain/modules/<name>/`.

Subcommands:
- `/modules` (no arg) → list all available + installed
- `/modules install <name>` → run `/root/brain/modules/<name>/install.sh`
- `/modules uninstall <name>` → run `/root/brain/modules/<name>/uninstall.sh`
- `/modules status <name>` → show install state + version

For listing:
```
ls -1 /root/brain/modules/ 2>/dev/null
```

Format each module:
```
- name (v2.1.0)  ✓ installed | ⚪ available | 🚧 in development
  description...
```

Pending modules from ROADMAP:
- `media` (v2.2)
- `crypto-live` (gated)
- `connections` (v2.3)
- `voice` (v2.4)
- `vision` (v3.0)
