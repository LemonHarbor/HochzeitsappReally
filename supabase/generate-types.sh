#!/bin/bash

# Supabase Type Generator Script
# This script generates TypeScript types from the Supabase schema

# Ensure we're in the right directory
cd "$(dirname "$0")"

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm install
fi

# Set environment variables
export SUPABASE_URL="https://cwuygosoynoitfrikdts.supabase.co"
export SUPABASE_KEY="XWeTCWRb5wQ6NMDMPW43h6YL+PLRpg78rDxfZMpMrZQothSTvYP+/BjG8hR6ZpO4EWae9fhsjOstZ1srzEH1PA=="

# Generate types
echo "Generating TypeScript types from Supabase schema..."
npx supabase gen types typescript --project-id cwuygosoynoitfrikdts --schema public > ../src/types/supabase-generated.ts

# Check if generation was successful
if [ $? -eq 0 ]; then
  echo "Types generated successfully at src/types/supabase-generated.ts"
  
  # Add import to models.ts to integrate with unified interfaces
  echo -e "\n// Add this import to your models.ts file to integrate with unified interfaces:\n// import { Database } from './supabase-generated';\n"
else
  echo "Error generating types. Please check your Supabase credentials and connection."
fi
