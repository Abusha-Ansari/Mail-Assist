# 📬 Mail Assist

  

Mail Assist is a streamlined email-sending platform built with **Next.js**, **TypeScript**, **Supabase**, **ShadCN/UI**, and **Resend**. It allows authenticated users to send custom or templated emails, track their email history, and manage credit-based usage.

  

---

  

## 🔧 Tech Stack

  

-  **Next.js 14**

-  **TypeScript**

-  **Tailwind CSS**

-  **ShadCN/UI**

-  **Supabase** (Auth & Database)

-  **Resend** (Transactional Email API)

-  **PostgreSQL** (via Supabase)

  

---

  

## 🧠 Features

  

### ✅ Authentication

- Supabase Auth (Email/Password, OAuth optional)

- Profiles stored in `profiles` table with credits management

  

### ✉️ Sending Emails

- Send custom emails (cost: 5 credits)

- Choose from predefined templates (cost: 10 credits), including:

- Interview Invite

- Event Reminder

- Thank You

- Payment Confirmation

  

### 🧾 Template Forms

- Each template has its own form page with dynamic fields

- Live preview renders the email content in real time

  

### 📊 Dashboard

- View current credits and username

- Sent emails table with pagination, search, and filter (via ShadCN UI)

- Columns: serial number, recipient email, subject, sent date/time, status

  

### 🛠️ API Routes

-  `/api/send` handles sending emails securely server-side using Resend

- Email activities logged in `user_mails` table

- API keys are never exposed client-side

  

---

  

## 🧱 Database Structure

  

### `profiles` Table

| Column | Type | Description |

|-------------|----------|----------------------------------|

| id | UUID | Primary key, references `auth.users` |

| username | text | Unique display name |

| credits | int | Defaults to 300 |

| created_at | timestamp| Time of profile creation |

  

### `user_mails` Table

| Column | Type | Description |

|------------|----------|---------------------------------|

| id | UUID | Primary key |

| user_id | UUID | References `profiles.id` |

| mail_id | text | Resend email ID |

| mail_time | timestamp| When the mail was sent |

| status | text | Delivery status (e.g., sent) |

  

---

  

## 🧭 Folder Structure

  ```

app/

├─ (Pages)/

│ ├─ buy-credits/page.tsx # Buy credits

│ ├─ create-template/page.tsx # Create template

│ ├─ dashboard/page.tsx # User dashboard

├─ api/

│ ├─ custom-mail/route.ts # Custom mail API

│ ├─ send/route.ts # Send mail API

│ └─ user-mails/route.ts # User mails API

├─ auth/

│ ├─ login/page.tsx # Login page

│ └─ signup/page.tsx # Signup page

├─ providers/theme-provider.tsx # Theme provider

├─ send/

│ ├─ all-custom-templates/page.tsx # List custom templates

│ ├─ custom-template/[templateId]/page.tsx # Custom template editor

│ ├─ customTemplate/page.tsx # Custom template main

│ ├─ [templates]/

│ │ ├─ event-reminder/page.tsx

│ │ ├─ interview-invite/page.tsx

│ │ ├─ job-offer/page.tsx

│ │ ├─ normal/page.tsx

│ │ ├─ payment-confirmation/page.tsx

│ │ ├─ thank-you/page.tsx

│ │ ├─ layout.tsx

│ │ └─ page.tsx # Templates index

│ └─ page.tsx # Send selector

├─ globals.css # Global styles

├─ layout.tsx # Root layout

└─ page.tsx # Root page

  

components/

├─ ui/ # Reusable UI components (button, card, input, etc.)

├─ AnimatedHome.tsx

├─ MailFormLayout.tsx

├─ motion.tsx

├─ navbar.tsx

└─ TemplateCard.tsx

  

context/

└─ UserContext.tsx # User context provider

  

interfaces/

└─ interfaces.ts # TypeScript interfaces

  

lib/

├─ supabaseClient.ts # Supabase setup

├─ toast.util.tsx # Toast utils

└─ utils.ts # General utils

  

templates/ # Email template React components

├─ EmailTemplate.tsx

├─ EventReminderTemplate.tsx

├─ InterviewInviteTemplate.tsx

├─ JobOfferTemplate.tsx

├─ PaymentConfirmationTemplate.tsx

└─ ThankYouTemplate.tsx

  

utils/

├─ auth.ts # Auth helpers

└─ userMail.utils.ts # User mail helpers

  
   ```



  

## 💰 Credit System


- Users start with **300 credits**

- Sending a **custom email** costs **5 credits**

- Sending a **template email** costs **10 credits**

- Credits deducted server-side after successful sends

  

---

  

## 🛡️ Security

  

- Resend API key used only server-side

- API endpoints verify user and manage credits securely

- Public pages (login/signup) require no authentication

  

---

  

## 🚀 Getting Started

  ```

1. Clone the repo

2. Configure environment variables for Supabase and Resend API keys

3. Run development server:

  

```bash

npm run dev

# or

yarn dev



4. Open http://localhost:3000

  ```

---

  

## 📬 Future Features (Planned)


  

Email scheduling and queueing

  

Export sent email history

  

User profile settings (e.g., update name, email)

  