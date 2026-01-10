# Austin Luxury Living

A full-stack luxury real estate platform for Austin, Texas, featuring property listings, lead management, and an admin CRM.

## 🏡 About

Austin Luxury Living is a modern real estate website built for showcasing luxury properties in Austin's premier neighborhoods including Westlake, Barton Creek, and beyond. The platform features a public-facing property showcase and a comprehensive admin panel for managing listings and leads.

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: Shadcn/ui + Radix UI + Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth + Storage)
- **State Management**: TanStack React Query v5
- **Forms**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Routing**: React Router

## 📋 Features

### Public Features
- Property listings with search and filters
- Property detail quick view modals
- Contact forms for inquiries and showing requests
- Home valuation request form
- Responsive design for all devices

### Admin Panel
- **Properties Management**: Add, edit, delete listings with image uploads
- **CRM Leads Table**: View and manage all inquiries
- **Analytics Dashboard**: Track leads by source, property views, and metrics
- **Search & Filters**: Find properties and leads quickly
- **Authentication**: Secure admin access via Supabase Auth

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+ and npm/bun installed
- Supabase account and project

### Installation

```sh
# Clone the repository
git clone https://github.com/Ryz3nPlayZ/austin-luxury-living.git

# Navigate to project directory
cd austin-luxury-living

# Install dependencies
npm install
# or
bun install

# Start development server
npm run dev
# or
bun dev
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Run migrations in your Supabase project:
   - Navigate to SQL Editor in Supabase Dashboard
   - Execute migration files from `supabase/migrations/` in order

2. Set up Storage:
   - Create a `property-images` bucket
   - Set it to public

## 📦 Project Structure

```
src/
├── components/       # React components
│   ├── admin/       # Admin panel components
│   ├── properties/  # Property-related components
│   ├── ui/          # Shadcn UI components
│   └── ...
├── hooks/           # Custom React hooks
├── lib/
│   └── services/    # API service layer
├── pages/           # Route pages
├── types/           # TypeScript types
└── integrations/    # Third-party integrations
    └── supabase/
```

## 🚢 Deployment

This project can be deployed to:
- **Vercel** (recommended): `vercel deploy`
- **Netlify**: Connect your GitHub repo
- **Any static host**: `npm run build` and serve the `dist/` folder

## 📄 License

MIT License - feel free to use this project as a template for your own real estate websites.
