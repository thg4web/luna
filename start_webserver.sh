#!/bin/bash
# ============================================================
# Luna — Hugo Local Web Server
# Run from the repo root: ./start_webserver.sh
# ============================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
HUGO_DIR="$SCRIPT_DIR"

echo "Luna — Hugo Dev Server"
echo "====================================="

# Check Hugo is installed
if ! command -v hugo &>/dev/null; then
  echo "ERROR: Hugo is not installed or not in PATH."
  echo "Install with: brew install hugo"
  exit 1
fi

echo "Hugo version: $(hugo version)"
echo "Site directory: $HUGO_DIR"
echo ""
echo "Starting server at: http://localhost:1313"
echo "Press Ctrl+C to stop."
echo ""

cd "$HUGO_DIR" && hugo server \
  --buildDrafts \
  --buildFuture \
  --disableFastRender \
  --navigateToChanged \
  --bind 0.0.0.0 \
  --port 1313
