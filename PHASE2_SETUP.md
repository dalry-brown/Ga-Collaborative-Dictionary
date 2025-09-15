# Phase 2: Database Integration Setup

This guide will help you set up the database and load real data into your Ga Dictionary application.

## 🛠️ Prerequisites

- Node.js 18+ installed
- Phase 1 (UI Foundation) completed
- `ga_words_final.csv` file in project root

## 📦 Step 1: Install Dependencies

```bash
# Install new dependencies
npm install --legacy-peer-deps

# Generate Prisma client
npm run db:generate
```

## 🗄️ Step 2: Database Setup

### Option A: SQLite (Recommended for Development)

1. **Create environment file:**
```bash
cp .env.example .env
```

2. **Update `.env` with SQLite:**
```bash
DATABASE_URL="file:./dev.db"
```

### Option B: PostgreSQL (Production)

1. **Install PostgreSQL locally or use a service like:**
   - [Supabase](https://supabase.com) (Free tier)
   - [Railway](https://railway.app) (Free tier)
   - [Neon](https://neon.tech) (Free tier)

2. **Update `.env` with PostgreSQL:**
```bash
DATABASE_URL="postgresql://username:password@host:5432/ga_dictionary"
```

## 🏗️ Step 3: Initialize Database

```bash
# Create and apply schema
npm run db:push

# Verify schema (optional)
npm run db:studio
```

## 📊 Step 4: Load CSV Data

1. **Ensure CSV file is in project root:**
```
ga-dictionary/
├── ga_words_final.csv  ← Make sure this exists
├── prisma/
├── src/
└── package.json
```

2. **Run the seed script:**
```bash
npm run db:seed
```

This will:
- ✅ Load all 9,046 Ga words from CSV
- ✅ Create admin user
- ✅ Generate sample contributions
- ✅ Calculate dictionary statistics
- ✅ Set up activity logs

## 🚀 Step 5: Test the Application

```bash
# Start development server
npm run dev

# Open http://localhost:3000
```

## ✅ Verification Checklist

After setup, verify these features work:

- [ ] **Homepage loads** with real statistics
- [ ] **Search functionality** returns actual words from database
- [ ] **Filtering works** (alphabetical, completion status, etc.)
- [ ] **Pagination** works with real data
- [ ] **Word cards** display actual Ga words and meanings
- [ ] **Statistics dashboard** shows correct counts

## 📈 Expected Results

After successful setup, you should see:

- **Total Words:** ~9,046
- **Verified Words:** ~9,046 (all CSV data is marked as verified)
- **Incomplete Words:** Count of entries missing phonemes or meanings
- **Real Ga words** like "aabateŋ", "aabia", "aadɔŋ", etc.

## 🔧 Development Commands

```bash
# Database management
npm run db:generate    # Regenerate Prisma client after schema changes
npm run db:push        # Apply schema changes to database
npm run db:studio      # Open Prisma Studio (database GUI)
npm run db:reset       # Reset database and re-seed (destructive!)

# Development
npm run dev           # Start development server
npm run build         # Build for production
npm run type-check    # Check TypeScript errors
```

## 📊 Database Schema Overview

```
Users (contributors, admins)
Words (main dictionary entries)
Contributions (pending changes)
ContributionReviews (approval workflow)
WordFlags (reported issues)
DictionaryStats (cached statistics)
ActivityLog (audit trail)
SearchQuery (analytics)
```

## 🐛 Troubleshooting

### Database Connection Issues

1. **SQLite permission errors:**
```bash
# Ensure write permissions
chmod 755 .
```

2. **PostgreSQL connection errors:**
```bash
# Test connection string
npx prisma db pull
```

### Seed Script Issues

1. **CSV file not found:**
```bash
# Verify file exists and has correct name
ls -la ga_words_final.csv
```

2. **Memory issues with large dataset:**
```bash
# Run with increased memory
NODE_OPTIONS="--max-old-space-size=4096" npm run db:seed
```

### API Errors

1. **Check server logs:**
```bash
# Look for error messages in terminal
npm run dev
```

2. **Verify database connection:**
```bash
# Test with Prisma Studio
npm run db:studio
```

## 🎯 Next Steps

After Phase 2 completion, you'll be ready for:

- **Phase 3:** User Authentication & Permissions
- **Phase 4:** Contribution Workflow & Admin Panel
- **Phase 5:** Advanced Features (Audio, G2P Integration)

## 📝 Notes

- SQLite database file (`dev.db`) will be created in your project root
- Don't commit the database file to version control (already in `.gitignore`)
- The seed script can be run multiple times safely (it clears existing data)
- All timestamps are in UTC
- CSV data is marked as verified and published by default

## 🆘 Need Help?

If you encounter issues:

1. Check the console for error messages
2. Verify all dependencies are installed
3. Ensure the CSV file is properly formatted
4. Try resetting the database: `npm run db:reset`
5. Check that your environment variables are correct

**Database is now ready! 🎉**