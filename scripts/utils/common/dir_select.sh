#!/bin/bash

dir_select() {
  local initial_path="${1:-$(pwd)}"
  local current_path="$initial_path"

  # Check if fzf is installed
  if ! command -v fzf >/dev/null 2>&1; then
    echo "Error: fzf is required but not installed. Please install fzf first." >&2
    return 1
  fi

  # Ensure the initial path exists and is a directory
  if [[ ! -d "$current_path" ]]; then
    echo "Error: '$current_path' is not a valid directory" >&2
    return 1
  fi

  while true; do
    # Build options array
    local options=()

    # Get directories (sorted)
    while IFS= read -r -d '' dir; do
      local basename_dir=$(basename "$dir")
      options+=("📂 $basename_dir")
    done < <(find "$current_path" -maxdepth 1 -mindepth 1 -type d -print0 2>/dev/null | sort -z)

    # Add control options
    options+=("✅ CURRENT")
    options+=("📁 NEW")
    options+=("⬆️ BACK")
    options+=("❌ QUIT")

    # Show fzf menu
    local selection
    selection=$(printf '%s\n' "${options[@]}" | fzf \
      --height=15 \
      --border \
      --prompt="Directory: " \
      --header="Current: $current_path" \
      --bind='q:abort,ctrl-c:abort' \
      --no-multi)

    local fzf_exit=$?

    # Handle fzf exit codes
    if [[ $fzf_exit -ne 0 ]]; then
      return 1
    fi

    # Process selection
    case "$selection" in
      "✅ CURRENT")
        echo "$current_path"
        return 0
        ;;

      "📁 NEW")
        echo >&2
        echo "Current directory: $current_path" >&2
        echo -n "Enter new directory name: " >&2

        local new_name
        read -r new_name </dev/tty

        if [[ -z "$new_name" ]]; then
          echo "No name provided. Press Enter to continue..." >&2
          read -r </dev/tty
          continue
        fi

        # Sanitize directory name (remove dangerous characters)
        new_name=$(echo "$new_name" | tr -s ' ' '-' )

        if [[ -z "$new_name" ]]; then
          echo "Invalid directory name. Press Enter to continue..." >&2
          read -r </dev/tty
          continue
        fi

        local new_path="$current_path/$new_name"

        if [[ -e "$new_path" ]]; then
          echo "Directory '$new_name' already exists. Press Enter to continue..." >&2
          read -r </dev/tty
          continue
        fi

        if mkdir -p "$new_path" 2>/dev/null; then
          echo "Created: $new_path" >&2
          echo "$new_path"
          return 0
        else
          echo "Failed to create directory. Press Enter to continue..." >&2
          read -r </dev/tty
          continue
        fi
        ;;

      "⬆️ BACK")
        local parent_dir=$(dirname "$current_path")
        if [[ "$parent_dir" != "$current_path" ]]; then
          current_path="$parent_dir"
        else
          echo "Already at root. Press Enter to continue..." >&2
          read -r </dev/tty
        fi
        ;;

      "❌ QUIT")
        return 1
        ;;

      📂*)
        # Extract directory name
        local dir_name="${selection#📂 }"
        local target_path="$current_path/$dir_name"

        if [[ -d "$target_path" ]]; then
          current_path="$target_path"
        else
          echo "Directory no longer exists. Press Enter to continue..." >&2
          read -r </dev/tty
        fi
        ;;

      "")
        # Empty selection (shouldn't happen with current fzf settings)
        return 1
        ;;

      *)
        echo "Unknown selection: $selection. Press Enter to continue..." >&2
        read -r </dev/tty
        ;;
    esac
  done
}

# Test function
dir_select_test() {
  local dir
  dir=$(dir_select "src/app")
  local exit_code=$?

  if [[ $exit_code -eq 0 && -n "$dir" && -d "$dir" ]]; then
    echo "Selected: $dir"
    #logic
    return 0
  else
    echo "No directory selected (exit code: $exit_code)"
    return 1
  fi
}
