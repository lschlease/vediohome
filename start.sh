#!/bin/bash

echo "🎥 VedioHome - Quick Start Script"
echo "================================="
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "❌ .env.local file not found!"
    echo "📝 Creating .env.local from template..."
    cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Cloudflare R2
R2_ACCOUNT_ID=your_account_id
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key
R2_BUCKET_NAME=your_bucket_name
R2_PUBLIC_URL=your_r2_public_url
EOF
    echo "✅ .env.local created! Please edit it with your actual credentials."
    echo ""
    echo "📖 See SETUP.md for detailed instructions on getting these values."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
    echo ""
fi

# Check if environment variables are set
if grep -q "your_supabase_url" .env.local; then
    echo "⚠️  Warning: .env.local contains placeholder values!"
    echo "📝 Please update .env.local with your actual credentials before running."
    echo ""
    echo "Need help? Check SETUP.md for instructions."
    exit 1
fi

echo "✅ Environment configured!"
echo "🚀 Starting development server..."
echo ""

npm run dev
