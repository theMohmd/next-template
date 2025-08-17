#!/bin/bash

# Simple wrapper function to call the Node.js script
update_routes() {
    local path="$1"
    
    if [ -z "$path" ]; then
        echo "Error: Please provide a directory path"
        return 1
    fi
    
    # Call the Node.js script
    node scripts/utils/add_page/add-route.js "$path"
}
