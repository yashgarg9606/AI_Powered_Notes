# NotesAI - AI-Powered Notes App

A modern note-taking application with AI-powered enhancements, intelligent tagging, and fast search.

## Features

- **AI-Powered Enhancements**: Improve writing clarity, summarize content, or expand notes with AI
- **Smart Tagging**: Organize notes with color-coded tags
- **Full-Text Search**: Quickly find notes by title or content
- **Auto-Save**: Changes are automatically saved as you type
- **Fast & Responsive**: Built with Next.js for optimal performance
- **Secure**: Database-backed storage with Row Level Security

## Setup Instructions

### 1. Connect Supabase Integration
- Click the "Connect" button in the left sidebar
- Search for "Supabase" and connect it
- This will automatically create environment variables

### 2. Run Database Migration
- After Supabase is connected, run the database initialization script
- Execute the script in `scripts/init_db.sql`

### 3. Set Up Environment Variables
The following environment variables are needed:
- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon key
- `OPENAI_API_KEY` - (Optional) For AI features via Vercel AI Gateway

### 4. Deploy to Vercel
- Push your code to GitHub
- Connect your repository to Vercel
- Environment variables will be automatically configured

## File Structure

\`\`\`
app/
├── app/              # Protected app routes
├── login/            # Login page
├── signup/           # Sign up page
├── api/              # API routes
│   ├── notes/        # Notes CRUD endpoints
│   ├── tags/         # Tags CRUD endpoints
│   └── ai/           # AI enhancement endpoints
└── page.tsx          # Landing page

components/
├── auth/             # Auth forms
└── notes/            # Notes app components
  ├── notes-app.tsx   # Main app component
  ├── note-editor.tsx # Note editor
  ├── notes-list.tsx  # Notes list
  └── ai-enhance-button.tsx # AI features

lib/
├── supabase-client.ts
├── supabase-server.ts
└── auth-utils.ts
\`\`\`

## Tech Stack

- **Frontend**: Next.js 16, React 19, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API routes
- **Database**: Supabase (PostgreSQL)
- **AI**: Vercel AI SDK + OpenAI
- **Auth**: Supabase Auth

## Development

\`\`\`bash
# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local

# Run development server
npm run dev
\`\`\`

## Future Enhancements

- Rich text editor (TipTap/Quill)
- Note templates
- Keyboard shortcuts
- Offline support (PWA)
- Collaboration features
- Version history
- Export to PDF/Markdown
- Mobile app

## License

MIT
