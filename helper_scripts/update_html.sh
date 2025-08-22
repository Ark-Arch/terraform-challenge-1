#!/usr/bin/env bash

# the above asks env to locate bash in the user's PATH, and run it.

################################################################
# 
# Author: David Agbemuko (davidagbemuko.ad@gmail.com)
#
# Purpose: Helper script to create site on netlify through its apis
#
# Version: v1
#
################################################################

set -e
# set -x
set -u
set -o pipefail


REPO_URL="$1"
WORKDIR=$(mktemp -d)

# configure git
git config --global user.name "Ark-Arch"
git config --global user.email "davidagbemuko.ad@gmail.com"

# If using HTTPS, inject GitHub token (from Terraform env)
if [[ "$REPO_URL" == https* ]] && [[ -n "${GITHUB_TOKEN:-}" ]]; then
    REPO_URL="${REPO_URL/https:\/\//https:\/\/${GITHUB_TOKEN}@}"
fi

# clone the repo
git clone "$REPO_URL" "$WORKDIR"
cd "$WORKDIR"

# find the branch name (main, master, etc.)
CURRENT_BRANCH=$(git symbolic-ref --short HEAD)

# always pull latest with rebase to avoid conflicts
git pull origin "$CURRENT_BRANCH" --rebase || true

# Path to the HTML file inside the repo
HTML_FILE="my_fun_site/index.html"

if [ -f "$HTML_FILE" ]; then
    # Replace placeholder "today_date" with the current timestamp
    sed -i 's|\(You have successfully re-deployed it on \)[^<]*|\1'"$(date)"'|g' "$HTML_FILE"
else
    # Create the file if it doesn’t exist
    mkdir -p "$(dirname "$HTML_FILE")"
    echo "<!DOCTYPE html><html><body><h1>Created on $(date)</h1></body></html>" > "$HTML_FILE"
fi

# commit and push changes
git add "$HTML_FILE"
if git diff --cached --quiet; then
    echo "No changes detected, skipping commit."
else
    git commit -m "Auto-update index.html on $(date)"
    git push origin "$CURRENT_BRANCH"
fi

echo "Repo updated successfully!"

