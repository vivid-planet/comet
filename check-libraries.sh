#!/bin/bash
packages=( 
    admin/admin
    admin/admin-color-picker
    admin/admin-date-time
    admin/admin-icons
    admin/admin-react-select
    admin/admin-rte
    admin/admin-theme
    admin/blocks-admin
    admin/cms-admin
    api/blocks-api
    api/cms-api
    cli
    site/cms-site
)

for package in "${packages[@]}"; do
    if [ ! -d "packages/$package/lib" ]; then
        echo "It seems that package '$package' was not built.";
        exit 1
    fi
done
