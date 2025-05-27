<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->
# 📬 Mail Assist

Mail Assist is a streamlined email-sending platform built with **Next.js**, **TypeScript**, **Supabase**, **ShadCN**, and **Resend**. It allows authenticated users to send custom or templated emails, track their email history, and manage credit-based usage.

---

## 🔧 Tech Stack

- **Next.js 14**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN/UI**
- **Supabase** (Auth & Database)
- **Resend** (Transactional Email API)
- **PostgreSQL** (via Supabase)

---

## 🧠 Features

### ✅ Authentication
- Supabase Auth (Email/Password, OAuth optional)
- Profiles stored in `profiles` table with credits management

### ✉️ Sending Emails
- Send custom emails (cost: 5 credits)
- Choose from predefined templates (cost: 10 credits)
  - Interview Invite
  - Event Reminder
  - Thank You
  - Payment Confirmation

### 🧾 Template Forms
- Each template has its own form page with dynamic fields
- Live preview section shows real-time rendered email

### 📊 Dashboard
- View current credits and username
- Table of sent emails with:
  - Serial number
  - Recipient email
  - Subject
  - Sent date/time
  - Status (e.g., sent, failed)
- Search, filter, and pagination (ShadCN UI)

### 🛠️ API Route
- `/api/send` handles sending emails server-side using Resend API
- Protects API key (runs on server side only)
- Logs email activity in `user_mails` table

---

## 🧱 Database Structure

### `profiles` Table
| Column      | Type     | Description                         |
|-------------|----------|-------------------------------------|
| id          | UUID     | Primary key, references `auth.users` |
| username    | text     | Unique display name                 |
| credits     | int      | Defaults to 300                     |
| created_at  | timestamp| Time of profile creation            |

### `user_mails` Table
| Column     | Type     | Description                         |
|------------|----------|-------------------------------------|
| id         | UUID     | Primary key                         |
| user_id    | UUID     | References `profiles.id`            |
| mail_id    | text     | Resend email ID                     |
| mail_time  | timestamp| When the mail was sent              |
| status     | text     | Sent status (e.g., delivered)       |

---

## 🧭 Folder Structure

```
app/
├── layout.tsx                # Shared layout
├── send/
│   ├── page.tsx              # Template selector page
│   └── templates/
│       ├── interview-invite/
│       │   └── page.tsx
│       ├── event-reminder/
│       ├── thank-you/
│       └── payment-confirmation/
├── dashboard/
│   └── page.tsx              # User dashboard with sent mail table
api/
└── send/route.ts             # Server-side mail sending logic
interfaces/
└── interfaces.ts             # TypeScript interfaces
templates/
└── *.tsx                     # Predefined email templates (React components)
```

---

## 💰 Credit System

- Users start with **300 credits**
- Sending a **custom email** costs **5 credits**
- Sending a **template email** costs **10 credits**
- Credit deduction is handled server-side after sending success
- Future plans may include: credit top-up, subscription, or reward system

---

## 🛡️ Security

- No client-side access to Resend API key
- Server-side API endpoint checks authentication and deducts credits
- Public pages (e.g., login, signup) do not require Supabase session cookies

---

## 🚀 Getting Started

1. Clone the repo
2. Set up environment variables for Supabase and Resend
3. Run development server with `npm run dev`
4. Navigate to `localhost:3000`

---

## 📬 Future Features (Planned)
- Custom template builder
- Email scheduling
- Export sent emails
- User settings (name, email updates)
