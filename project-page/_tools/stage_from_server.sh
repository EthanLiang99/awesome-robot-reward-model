#!/usr/bin/env bash
# Re-stage the benchmark clips and saved model outputs from the lab server, then rebuild the
# page data from them:
#
#   bash project-page/_tools/stage_from_server.sh <ssh-host> <codebase-root> <stage-dir>
#   python project-page/_tools/build_data.py --stage <stage-dir> --paper <paper-repo>
#
# <codebase-root> is the directory on the server that holds Rewardbox/ and Rewardbox_release/.
# The server needs python3 and ffmpeg with libx264. The script works in a scratch directory
# under /tmp on the server and removes it afterwards.
set -euo pipefail

USAGE="usage: stage_from_server.sh <ssh-host> <codebase-root> <stage-dir>"
HOST="${1:?$USAGE}"
ROOT="${2:?$USAGE}"
STAGE="${3:?$USAGE}"
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REMOTE="/tmp/rrm_page_stage_${RANDOM}${RANDOM}"

echo "staging on $HOST:$REMOTE"
ssh -o BatchMode=yes "$HOST" "mkdir -p '$REMOTE'"
cleanup() { ssh -o BatchMode=yes "$HOST" "rm -rf '$REMOTE'" || true; }
trap cleanup EXIT
scp -q "$HERE/remote/stage_remote.py" "$HERE/remote/mosaic_remote.py" "$HOST:$REMOTE/"
ssh -o BatchMode=yes "$HOST" "python3 '$REMOTE/stage_remote.py' '$ROOT' '$REMOTE/stage' && python3 '$REMOTE/mosaic_remote.py' '$ROOT' '$REMOTE/stage'"

echo "copying to $STAGE"
mkdir -p "$STAGE"
scp -q -r "$HOST:$REMOTE/stage/*" "$STAGE/"
echo "next: python project-page/_tools/build_data.py --stage \"$STAGE\" --paper <paper-repo>"
