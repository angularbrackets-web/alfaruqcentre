#!/bin/bash
# setup-cron.sh
# Installs a cron job that runs sync-campaign-stats.js every minute.
# Run once: bash scripts/setup-cron.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
NODE_BIN="$(which node)"
LOG_FILE="/tmp/campaign-sync.log"

CRON_LINE="* * * * * cd \"$PROJECT_DIR\" && $NODE_BIN scripts/sync-campaign-stats.js >> $LOG_FILE 2>&1"

# Check if already installed
if crontab -l 2>/dev/null | grep -qF "sync-campaign-stats.js"; then
  echo "Cron job already installed."
  crontab -l | grep "sync-campaign-stats.js"
  exit 0
fi

# Append to existing crontab (preserves other jobs)
( crontab -l 2>/dev/null; echo "$CRON_LINE" ) | crontab -

echo "Cron job installed:"
echo "  $CRON_LINE"
echo ""
echo "Logs: tail -f $LOG_FILE"
echo "Remove: crontab -e  (delete the sync-campaign-stats line)"
