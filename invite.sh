#!/bin/bash
# Invite a candidate to the repo as a collaborator
# Usage: ./invite.sh <github-username-or-email>

if [ -z "$1" ]; then
  echo "Usage: ./invite.sh <github-username-or-email>"
  exit 1
fi

gh api repos/acqwiz/plexai-task/collaborators/"$1" -X PUT -f permission=push

echo "Invitation sent to $1 with push access."
