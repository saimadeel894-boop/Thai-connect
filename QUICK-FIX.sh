#!/bin/bash

# Quick verification script
echo "🔍 Checking Supabase Setup..."
echo ""

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local exists"
    
    # Check if vars are set (without showing values)
    if grep -q "NEXT_PUBLIC_SUPABASE_URL=https://" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_URL looks good"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_URL missing or wrong format"
    fi
    
    if grep -q "NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ" .env.local; then
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY looks good"
    else
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY missing or wrong format"
    fi
else
    echo "❌ .env.local file not found!"
    echo "Create it at: $(pwd)/.env.local"
fi

echo ""
echo "📋 Next steps:"
echo "1. Edit .env.local with your Supabase credentials"
echo "2. Run migrations in Supabase SQL Editor"
echo "3. Restart: npm run dev"
