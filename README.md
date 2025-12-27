# 🚀 NotesAI – AI-Powered Note-Taking App
A modern, intelligent note-taking application that helps you write better, stay organized, and find information instantly.  
Powered by **AI enhancements**, **smart tagging**, **full-text search**, and a **clean, minimal UI**.

---

## ✨ Why NotesAI?
Most note-taking apps store text — **NotesAI improves it**.

NotesAI helps you:
- ✍️ Write better (AI improve, summarize, or expand your notes)
- 🧠 Stay organized (color-coded tags, fast search)
- ⚡ Work faster (autosave + real-time UI)
- 🔐 Stay secure (Supabase RLS, protected routes)
- ☁️ Sync seamlessly (cloud-backed database storage)

A perfect starter template for building AI-enhanced productivity tools.

---

## 🌟 Core Features

### 🤖 AI-Powered Enhancements
Use AI to:
- Improve clarity, grammar, and tone  
- Summarize long notes  
- Expand ideas into detailed sections  

### 🏷️ Smart Tagging System
- Color-coded tags  
- Attach multiple tags to a note  
- Filter + organize easily  

### 🔍 Full-Text Search
- Search by title or content  
- Instant result updates  

### ⚡ Fast & Reactive Notes Editor
- Auto-save on each keystroke  
- Smooth and responsive UI  
- Minimal, distraction-free layout  

### 🔐 Secure Authentication
- Supabase Auth (email/password)  
- Row Level Security  
- User-specific note isolation  

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS, shadcn/ui |
| **Backend** | Next.js API Routes |
| **Database** | Supabase (PostgreSQL + RLS) |
| **Authentication** | Supabase Auth |
| **AI Engine** | GROQ AI |
| **Data Fetching** | React Server Components, Server Actions |

---

## 📁 Project Structure

```text
app/
├─ app/                 # Protected authenticated routes
├─ login/               # Login page
├─ signup/              # Signup page
├─ api/                 # Backend API endpoints
│  ├─ notes/            # CRUD for notes
│  ├─ tags/             # CRUD for tags
│  └─ ai/               # AI enhancement endpoints
└─ page.tsx             # Landing page

components/
├─ auth/                # Authentication UI components
├─ notes/               # Notes UI components
├─ notes-app.tsx        # Main notes workspace
├─ note-editor.tsx      # Editor + autosave
├─ notes-list.tsx       # Sidebar with notes
└─ ai-enhance-button.tsx# AI action buttons

lib/
├─ supabase-client.ts   # Client-side Supabase SDK
├─ supabase-server.ts   # Server-side Supabase SDK
└─ auth-utils.ts        # User session helpers
```
---

## 🧭 Future Enhancements

Planned improvements:

- 📝 Rich Text Editor (TipTap / Quill)
- 🧩 Note Templates
- ⌨️ Keyboard Shortcuts
- 📡 Offline Mode (PWA)
- 🫂 Real-time Collaboration
- 🕒 Version History
- 📤 Export to PDF & Markdown
- 📱 Mobile App (React Native)

---

## 📝 License

This project is open-source and available under the **MIT License**.

You are free to use, modify, and distribute this project for personal or commercial purposes, as long as the original license is included.

