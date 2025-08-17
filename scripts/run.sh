#!/bin/bash
source "scripts/utils/common/interactive_menu.sh"

run_selected_script() {
  local script_dir="scripts"

  # Ensure the script directory exists
  if [[ ! -d "$script_dir" ]]; then
    echo "Error: Directory '$script_dir' does not exist." >&2
    return 1
  fi

  # Find all .sh files in the directory (excluding this script)
  local script_files=()
  local current_script="run.sh"

  while IFS= read -r -d '' file; do
    local basename_file="$(basename "$file")"
    # Skip the current script to avoid recursion
    if [[ "$basename_file" != "$current_script" ]]; then
      script_files+=("$basename_file")
    fi
  done < <(find "$script_dir" -maxdepth 1 -name "*.sh" -type f -print0 2>/dev/null | sort -z)

  # Check if any scripts were found
  if [[ ${#script_files[@]} -eq 0 ]]; then
    echo "No .sh scripts found in directory: $script_dir" >&2
    return 1
  fi

  # Show interactive menu
  local selected_index
  selected_index=$(interactive_menu "${script_files[@]}")

  # Check if a script was selected
  if [[ $? -ne 0 || -z "$selected_index" ]]; then
    return 1
  fi

  local selected_script="${script_files[$selected_index]}"
  local script_path="$script_dir/$selected_script"

  # Extract function name (filename without .sh extension)
  local function_name="${selected_script%.sh}"

  # Check if the script file exists and is readable
  if [[ ! -r "$script_path" ]]; then
    echo "Error: Cannot read script file '$script_path'" >&2
    return 1
  fi

  # Source the script to load its functions
  if ! source "$script_path"; then
    echo "Error: Failed to source script '$script_path'" >&2
    return 1
  fi

  # Check if the function exists
  if ! declare -F "$function_name" >/dev/null 2>&1; then
    echo "Error: Function '$function_name' not found in script '$selected_script'" >&2
    return 1
  fi

  # Execute the function
  "$function_name"
}

# Main execution
main() {
  clear
  run_selected_script
}

# Execute main function if script is run directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
  main "$@"
fi
