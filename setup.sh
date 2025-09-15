#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

echo "📂 Creating directory structure..."
mkdir -p src/components/ui
mkdir -p src/components/dictionary
mkdir -p src/components/layout
mkdir -p src/lib/utils
mkdir -p src/lib/types
mkdir -p src/lib/data
mkdir -p src/app/api/dictionary
mkdir -p src/app/admin
mkdir -p src/app/contribute
mkdir -p src/app/browse
mkdir -p public/data

echo "📄 Creating placeholder files..."
touch src/lib/data/ga-words.ts
touch src/lib/types/dictionary.ts
touch src/lib/utils/cn.ts

echo "✅ Project structure created successfully!"
