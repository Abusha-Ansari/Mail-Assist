# 📬 Mail Assist

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.0-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-2.0-3ECF8E?style=for-the-badge&logo=supabase)](https://supabase.com/)
[![Resend](https://img.shields.io/badge/Resend-API-00A3FF?style=for-the-badge)](https://resend.com/)

A modern, credit-based email sending platform built with Next.js 14, TypeScript, and Supabase. Send custom emails or use professional templates with a streamlined interface.

## ✨ Features

### 🔐 Authentication & User Management
- **Secure Authentication**: Supabase Auth with email/password
- **User Profiles**: Custom profiles with credit management
- **Session Management**: Persistent login sessions

### 📧 Email Sending System
- **Custom Emails**: Send personalized emails (5 credits each)
- **Professional Templates**: Pre-built templates for common scenarios (10 credits each)
  - Interview Invitations
  - Event Reminders
  - Job Offers
  - Thank You Notes
  - Payment Confirmations
- **Live Preview**: Real-time email preview before sending
- **Batch Processing**: Send emails to multiple recipients via CSV

### 🎨 Custom Template Builder
- **Visual Editor**: Drag-and-drop interface for creating custom templates
- **Block-Based System**: Modular email components
- **Template Library**: Save and reuse custom templates
- **Real-time Preview**: See changes instantly

### 📊 Dashboard & Analytics
- **Email History**: Complete tracking of sent emails
- **Search & Filter**: Advanced email management
- **Credit System**: Track and manage email credits
- **User Statistics**: Detailed usage analytics

### 🎯 User Experience
- **Responsive Design**: Works on all devices
- **Dark/Light Theme**: Automatic theme switching
- **Modern UI**: Built with ShadCN/UI components
- **Smooth Animations**: Framer Motion powered interactions

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: [ShadCN/UI](https://ui.shadcn.com/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth
- **Email Service**: [Resend](https://resend.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account
- Resend account

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/mail-assist.git
   cd mail-assist
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory:
   ```env
   # Supabase Configuration
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

   # Resend Configuration
   RESEND_API_KEY=your_resend_api_key

   # Next.js Configuration
   NEXTAUTH_SECRET=your_nextauth_secret
   NEXTAUTH_URL=http://localhost:3000
   ```

4. **Set up the database**
   Run the following SQL in your Supabase SQL editor:
   ```sql
   -- Create profiles table
   CREATE TABLE profiles (
     id UUID REFERENCES auth.users(id) PRIMARY KEY,
     username TEXT UNIQUE NOT NULL,
     credits INTEGER DEFAULT 300,
     created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
   );

   -- Create user_mails table
   CREATE TABLE user_mails (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     user_id UUID REFERENCES profiles(id) NOT NULL,
     mail_id TEXT NOT NULL,
     mail_time TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
     status TEXT DEFAULT 'sent'
   );

   -- Enable Row Level Security
   ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
   ALTER TABLE user_mails ENABLE ROW LEVEL SECURITY;

   -- Create policies
   CREATE POLICY "Users can view own profile" ON profiles
     FOR SELECT USING (auth.uid() = id);

   CREATE POLICY "Users can update own profile" ON profiles
     FOR UPDATE USING (auth.uid() = id);

   CREATE POLICY "Users can view own emails" ON user_mails
     FOR SELECT USING (auth.uid() = user_id);

   CREATE POLICY "Users can insert own emails" ON user_mails
     FOR INSERT WITH CHECK (auth.uid() = user_id);
   ```

5. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
Mail-Assist/
├── app/                                    # Next.js App Router
│   ├── (Pages)/                           # Route groups
│   │   ├── buy-credits/                   # Credit purchase
│   │   ├── create-template/               # Template creation
│   │   └── dashboard/                     # User dashboard
│   ├── api/                               # API routes
│   │   ├── auth/signup/                   # User registration
│   │   ├── custom-mail/                   # Custom email API
│   │   ├── send/                          # Email sending API
│   │   ├── send-batch/                    # Batch email processing
│   │   └── user-mails/                    # Email history API
│   ├── auth/                              # Authentication pages
│   │   ├── login/                         # Login interface
│   │   └── signup/                        # Registration interface
│   ├── features/                          # Features showcase
│   ├── help/                              # Help documentation
│   ├── send/                              # Email sending interface
│   │   ├── [templates]/                   # Dynamic template routes
│   │   ├── all-custom-templates/          # Custom templates listing
│   │   ├── batch-email/                   # Batch email processing
│   │   ├── custom-template/               # Custom template editor
│   │   └── customTemplate/                # Custom template creation
│   ├── globals.css                        # Global styles
│   ├── layout.tsx                         # Root layout
│   ├── page.tsx                           # Homepage
│   └── providers/                         # Context providers
├── components/                            # Reusable components
│   ├── ui/                                # ShadCN/UI components
│   ├── AnimatedHome.tsx                   # Animated homepage
│   ├── MailFormLayout.tsx                 # Email form layout
│   ├── motion.tsx                         # Motion components
│   ├── navbar.tsx                         # Navigation bar
│   └── TemplateCard.tsx                   # Template selection card
├── context/                               # React contexts
│   └── UserContext.tsx                    # User state management
├── interfaces/                            # TypeScript definitions
│   └── interfaces.ts                      # Type interfaces
├── lib/                                   # Utility libraries
│   ├── csvParser.ts                       # CSV parsing utilities
│   ├── rateLimiter.ts                     # Rate limiting
│   ├── supabaseClient.ts                  # Supabase client
│   ├── toast.util.tsx                     # Toast notifications
│   ├── utils.ts                           # General utilities
│   └── withRateLimit.ts                   # Rate limiting middleware
├── templates/                             # Email templates
│   ├── EmailTemplate.tsx                  # Base template
│   ├── EventReminderTemplate.tsx          # Event reminder
│   ├── InterviewInviteTemplate.tsx        # Interview invitation
│   ├── JobOfferTemplate.tsx               # Job offer
│   ├── PaymentConfirmationTemplate.tsx    # Payment confirmation
│   └── ThankYouTemplate.tsx               # Thank you
├── utils/                                 # Application utilities
│   ├── auth.ts                            # Authentication helpers
│   └── userMail.utils.ts                  # Email utilities
└── public/                                # Static assets
```

## 💰 Credit System

- **Starting Credits**: 300 credits for new users
- **Custom Emails**: 5 credits per email
- **Template Emails**: 10 credits per email
- **Credit Purchase**: Buy additional credits through the dashboard
- **Secure Deduction**: Credits deducted server-side after successful sends

## 🔒 Security Features

- **Server-side API Keys**: Resend API key never exposed client-side
- **Rate Limiting**: API endpoints protected against abuse
- **Authentication Required**: All email operations require user authentication
- **Input Validation**: Comprehensive validation and sanitization
- **Row Level Security**: Database-level security with Supabase RLS

## 🚀 Deployment

### Vercel (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

### Other Platforms

The app can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the [help page](/help) for detailed guides
- **Issues**: Report bugs and request features on GitHub
- **Email**: Contact support at support@mailassist.com

## 🔮 Roadmap

- [ ] Email scheduling and queueing
- [ ] Advanced analytics and reporting
- [ ] Email templates marketplace
- [ ] Team collaboration features
- [ ] API for third-party integrations
- [ ] Mobile app development
- [ ] Advanced email personalization
- [ ] A/B testing for email campaigns

---

Made with ❤️ by the Mail Assist team



  

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

  