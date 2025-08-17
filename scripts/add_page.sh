#!/bin/bash

source "scripts/utils/common/dir_select.sh"
source "scripts/utils/add_page/update_routes.sh"
source "scripts/utils/add_page/create_page.sh"

add_page() {
  local dir
  dir=$(dir_select "src/app")
  local exit_code=$?

  if [[ $exit_code -eq 0 && -n "$dir" && -d "$dir" ]]; then
    update_routes "$dir"
    create_page "$dir"
    return 0
  else
    echo "No directory selected (exit code: $exit_code)"
    return 1
  fi
}
