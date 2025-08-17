create_page() {
    local dir_path="$1"
    
    # Check if directory path is provided
    if [ -z "$dir_path" ]; then
        echo "Error: Please provide a directory path"
        return 1
    fi

    # Check if directory exists
    if [ ! -d "$dir_path" ]; then
        echo "Error: Directory '$dir_path' does not exist"
        return 1
    fi

    # Get the last directory name from the path
    local dir_name=$(basename "$dir_path")

    # Convert to PascalCase for the component name
    # Handle dynamic routes: remove brackets, colon, and "Id" suffix, then convert to PascalCase
    local component_name=$(echo "$dir_name" | \
        sed 's/\[://g' | \
        sed 's/\]//g' | \
        sed 's/Id$//g' | \
        sed 's/[-_]/ /g' | \
        sed 's/\b\w/\u&/g' | \
        sed 's/ //g')

    # Ensure it ends with "Page"
    if [[ ! "$component_name" =~ Page$ ]]; then
        component_name="${component_name}Page"
    fi

    # Create the page.tsx file
    local page_file="$dir_path/page.tsx"

    # Check if page.tsx already exists
    if [ -f "$page_file" ]; then
        echo "Warning: page.tsx already exists in '$dir_path'"
        read -p "Overwrite? (y/n): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            echo "Operation cancelled"
            return 1
        fi
    fi

    # Create Next.js page component with dynamic name
    cat > "$page_file" << EOF
export default function ${component_name}() {
  return (
    <div>
      <h1>${component_name}</h1>
    </div>
  )
}
EOF
    mkdir "$dir_path/(utils)"

    echo "> Created page.tsx with component '${component_name}' in '$dir_path'"
    echo
}
