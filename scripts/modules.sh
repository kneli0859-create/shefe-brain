#!/usr/bin/env bash
# brain modules — list / install / uninstall / info
set -euo pipefail

MODULES_DIR=/root/brain/modules
INSTALLED_DIR=$MODULES_DIR/installed
mkdir -p "$INSTALLED_DIR"

cmd="${1:-list}"

case "$cmd" in
  list|"")
    echo "📦 Brain modules"
    echo
    echo "Installed:"
    for d in "$INSTALLED_DIR"/*/; do
      [[ -d "$d" ]] || continue
      name=$(basename "$d")
      if [[ -f "$d/module.yaml" ]]; then
        ver=$(grep -E '^version:' "$d/module.yaml" | head -1 | awk '{print $2}')
        echo "  ✓ $name $ver"
      fi
    done
    echo
    echo "Available (in marketplace):"
    for d in "$MODULES_DIR"/marketplace/*/; do
      [[ -d "$d" ]] || continue
      name=$(basename "$d")
      [[ -d "$INSTALLED_DIR/$name" ]] && continue
      echo "  ○ $name"
    done
    ;;

  install)
    name="${2:?module name required}"
    src="$MODULES_DIR/marketplace/$name"
    dst="$INSTALLED_DIR/$name"
    [[ -d "$src" ]] || { echo "❌ $name not in marketplace" >&2; exit 1; }
    [[ -d "$dst" ]] && { echo "⚠️  $name already installed" >&2; exit 1; }
    cp -r "$src" "$dst"
    if [[ -x "$dst/install.sh" ]]; then
      echo "🔧 Running install.sh..."
      bash "$dst/install.sh"
    fi
    echo "✅ Installed $name"
    ;;

  uninstall)
    name="${2:?module name required}"
    dst="$INSTALLED_DIR/$name"
    [[ -d "$dst" ]] || { echo "❌ $name not installed" >&2; exit 1; }
    if [[ -x "$dst/uninstall.sh" ]]; then
      echo "🔧 Running uninstall.sh..."
      bash "$dst/uninstall.sh"
    fi
    rm -rf "$dst"
    echo "✅ Removed $name (data preserved in DB)"
    ;;

  info)
    name="${2:?module name required}"
    target="$INSTALLED_DIR/$name"
    [[ -d "$target" ]] || target="$MODULES_DIR/marketplace/$name"
    [[ -d "$target" ]] || { echo "❌ $name not found" >&2; exit 1; }
    echo "── module.yaml ──"
    cat "$target/module.yaml" 2>/dev/null || echo "(missing)"
    echo
    echo "── README.md ──"
    cat "$target/README.md" 2>/dev/null || echo "(missing)"
    ;;

  *)
    echo "Usage: $0 {list|install <name>|uninstall <name>|info <name>}" >&2
    exit 2
    ;;
esac
