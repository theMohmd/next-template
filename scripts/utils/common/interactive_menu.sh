#!/bin/bash

interactive_menu() {
    local items=("$@")
    
    # Check if fzf is installed
    if ! command -v fzf >/dev/null 2>&1; then
        echo "Error: fzf is required but not installed. Please install fzf first." >&2
        return 1
    fi
    
    # Check if items array is empty
    if [[ ${#items[@]} -eq 0 ]]; then
        echo "Error: No menu items provided." >&2
        return 1
    fi
    
    # Create numbered options array
    local options=()
    local i=1
    for item in "${items[@]}"; do
        options+=("$i. $item")
        ((i++))
    done
    
    # Add special quit option
    options+=("❌ [QUIT]")
    
    # Show interactive menu
    local selected
    selected=$(printf '%s\n' "${options[@]}" | fzf \
        --height=15 \
        --border \
        --prompt="partial name or ↑↓ to navigate, Enter to select, q to quit: " \
        --bind='q:abort'\
        --header="Choose from ${#items[@]} options" \
        --no-multi)
    
    # Handle selection
    case "$selected" in
        "")
            # User pressed q or Ctrl+C
            echo "Cancelled." >&2
            return 1
            ;;
        "❌ [QUIT]")
            echo "Cancelled." >&2
            return 1
            ;;
        *)
            # Extract index from selection (remove everything after the first dot)
            local index="${selected%%.*}"
            
            # Validate index is a number and within range
            if [[ "$index" =~ ^[0-9]+$ ]] && [[ "$index" -ge 1 ]] && [[ "$index" -le ${#items[@]} ]]; then
                echo "$((index - 1))"  # Return zero-based index
                return 0
            else
                echo "Error: Invalid selection." >&2
                return 1
            fi
            ;;
    esac
}

# Alternative usage with simple array
# test_simple_menu() {
#     echo "Choose your favorite color:"
#     local colors=("Red" "Green" "Blue" "Yellow" "Purple")
#     
#     local choice_index
#     choice_index=$(interactive_menu "${colors[@]}")
#     
#     if [[ $? -eq 0 ]]; then
#         echo "You chose: ${colors[$choice_index]} (index: $choice_index)"
#     else
#         echo "No color selected."
#     fi
# }
