#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/.." && pwd)"
source="$(cd "$(dirname "$0")" && pwd)/build-android-apk.yml"
workflows_dir="$repo_root/.github/workflows"

target="$workflows_dir/build-android-apk.yml"

mkdir -p "$workflows_dir"
cp "$source" "$target"

echo "Copied workflow to: $target"
