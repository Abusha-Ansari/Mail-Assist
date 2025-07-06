# CHANGELOG.md

## [2024-12-19] - Initial Changelog System Implementation

### Added
- **CHANGELOG.md**: Comprehensive changelog system with detailed project documentation
- **Project Overview Section**: Complete project description, file structure, and user journey documentation
- **Changelog Entry Template**: Standardized format for tracking all project changes

### Changed
- **Documentation Standards**: Implemented mandatory changelog updates for all future changes
- **Project Context Management**: Added requirement to reference CHANGELOG.md before making edits

### Technical Details
- **Files Modified**: Created new `CHANGELOG.md` file
- **Documentation Structure**: Implemented detailed project overview with file descriptions
- **User Journey Mapping**: Documented complete email sending workflows

### User Feedback & Open Questions
- None at this time - initial implementation

---

## Project Overview

### Purpose and Main Features

**Mail Assist** is a comprehensive email-sending platform built with modern web technologies that enables authenticated users to send both custom and templated emails through a credit-based system. The platform provides a streamlined interface for professional email communication with built-in templates for common business scenarios.

#### Core Features:
1. **User Authentication**: Secure login/signup system using Supabase Auth
2. **Credit-Based Email System**: Users start with 300 credits, with different costs for custom (5 credits) vs templated (10 credits) emails
3. **Email Templates**: Pre-built templates for common business scenarios:
   - Interview Invite
   - Event Reminder
   - Job Offer
   - Thank You
   - Payment Confirmation
4. **Custom Email Builder**: Visual drag-and-drop interface for creating custom email templates
5. **Email History**: Complete tracking of sent emails with search and filtering capabilities
6. **Dashboard**: User-friendly interface showing credits, email history, and account management
7. **Batch Email Processing**: Support for sending emails to multiple recipients via CSV upload

### Complete File and Directory Structure

```
Mail-Assist/
├── app/                                    # Next.js App Router directory
│   ├── (Pages)/                           # Route groups for better organization
│   │   ├── buy-credits/
│   │   │   └── page.tsx                   # Credit purchase interface
│   │   ├── create-template/
│   │   │   └── page.tsx                   # Template creation form
│   │   └── dashboard/
│   │       └── page.tsx                   # User dashboard with email history
│   ├── api/                               # API routes for server-side operations
│   │   ├── auth/
│   │   │   └── signup/
│   │   │       └── route.ts               # User registration endpoint
│   │   ├── custom-mail/
│   │   │   └── route.ts                   # Custom email sending API
│   │   ├── send/
│   │   │   └── route.ts                   # Main email sending endpoint
│   │   ├── send-batch/                    # Batch email processing
│   │   │   ├── preview/
│   │   │   │   └── route.ts               # Batch email preview API
│   │   │   └── route.ts                   # Batch email sending API
│   │   └── user-mails/
│   │       └── route.ts                   # User email history API
│   ├── auth/                              # Authentication pages
│   │   ├── login/
│   │   │   └── page.tsx                   # User login interface
│   │   └── signup/
│   │       └── page.tsx                   # User registration interface
│   ├── features/
│   │   └── page.tsx                       # Features showcase page
│   ├── help/
│   │   └── page.tsx                       # Help and documentation page
│   ├── send/                              # Email sending interface
│   │   ├── [templates]/                   # Dynamic template routes
│   │   │   ├── event-reminder/
│   │   │   │   └── page.tsx               # Event reminder template form
│   │   │   ├── interview-invite/
│   │   │   │   └── page.tsx               # Interview invite template form
│   │   │   ├── job-offer/
│   │   │   │   └── page.tsx               # Job offer template form
│   │   │   ├── normal/
│   │   │   │   └── page.tsx               # Standard email template form
│   │   │   ├── payment-confirmation/
│   │   │   │   └── page.tsx               # Payment confirmation template form
│   │   │   ├── thank-you/
│   │   │   │   └── page.tsx               # Thank you template form
│   │   │   ├── layout.tsx                 # Template layout wrapper
│   │   │   └── page.tsx                   # Template selection page
│   │   ├── all-custom-templates/
│   │   │   └── page.tsx                   # Custom templates listing
│   │   ├── batch-email/
│   │   │   └── [id]/
│   │   │       └── page.tsx               # Batch email processing interface
│   │   ├── custom-template/
│   │   │   └── [templateId]/
│   │   │       └── page.tsx               # Custom template editor
│   │   ├── customTemplate/
│   │   │   └── page.tsx                   # Custom template creation
│   │   └── page.tsx                       # Email sending main page
│   ├── globals.css                        # Global CSS styles
│   ├── layout.tsx                         # Root layout component
│   ├── not-found.tsx                      # 404 error page
│   ├── page.tsx                           # Homepage
│   └── providers/
│       └── theme-provider.tsx             # Theme context provider
├── components/                            # Reusable React components
│   ├── ui/                                # ShadCN/UI components
│   │   ├── accordion.tsx                  # Collapsible content component
│   │   ├── badge.tsx                      # Status badge component
│   │   ├── button.tsx                     # Button component variants
│   │   ├── card.tsx                       # Card layout component
│   │   ├── dialog.tsx                     # Modal dialog component
│   │   ├── input.tsx                      # Input field component
│   │   ├── label.tsx                      # Form label component
│   │   ├── select.tsx                     # Dropdown select component
│   │   ├── separator.tsx                  # Visual separator component
│   │   ├── table.tsx                      # Data table component
│   │   ├── tabs.tsx                       # Tab navigation component
│   │   └── textarea.tsx                   # Multi-line text input
│   ├── AnimatedHome.tsx                   # Animated homepage component
│   ├── MailFormLayout.tsx                 # Email form layout wrapper
│   ├── motion.tsx                         # Framer Motion animations
│   ├── navbar.tsx                         # Navigation bar component
│   └── TemplateCard.tsx                   # Template selection card
├── context/
│   └── UserContext.tsx                    # User state management context
├── interfaces/
│   └── interfaces.ts                      # TypeScript type definitions
├── lib/                                   # Utility libraries and configurations
│   ├── csvParser.ts                       # CSV file parsing utilities
│   ├── rateLimiter.ts                     # API rate limiting implementation
│   ├── supabaseClient.ts                  # Supabase database client
│   ├── toast.util.tsx                     # Toast notification utilities
│   ├── utils.ts                           # General utility functions
│   └── withRateLimit.ts                   # Rate limiting middleware
├── templates/                             # Email template React components
│   ├── EmailTemplate.tsx                  # Base email template
│   ├── EventReminderTemplate.tsx          # Event reminder email template
│   ├── InterviewInviteTemplate.tsx        # Interview invitation template
│   ├── JobOfferTemplate.tsx               # Job offer email template
│   ├── PaymentConfirmationTemplate.tsx    # Payment confirmation template
│   └── ThankYouTemplate.tsx               # Thank you email template
├── utils/                                 # Application utilities
│   ├── auth.ts                            # Authentication helper functions
│   └── userMail.utils.ts                  # Email management utilities
├── public/                                # Static assets
│   ├── file.svg                           # File icon
│   ├── globe.svg                          # Globe icon
│   ├── next.svg                           # Next.js logo
│   ├── QR-Basic.jpg                       # Basic plan QR code
│   ├── QR-Code.png                        # Generic QR code
│   ├── QR-Premium.jpg                     # Premium plan QR code
│   ├── QR-VIP.jpg                         # VIP plan QR code
│   ├── vercel.svg                         # Vercel logo
│   └── window.svg                         # Window icon
├── components.json                        # ShadCN/UI configuration
├── eslint.config.mjs                      # ESLint configuration
├── next.config.ts                         # Next.js configuration
├── package.json                           # Project dependencies and scripts
├── postcss.config.mjs                     # PostCSS configuration
├── tailwind.config.ts                     # Tailwind CSS configuration
└── tsconfig.json                          # TypeScript configuration
```

### Core User Journeys and Workflows

#### 1. User Registration and Authentication Flow
**Files Involved:**
- `app/auth/signup/page.tsx` → `app/api/auth/signup/route.ts` → `lib/supabaseClient.ts`
- `app/auth/login/page.tsx` → `utils/auth.ts` → `context/UserContext.tsx`

**Steps:**
1. User visits signup/login page
2. Form validation and submission
3. Supabase authentication
4. User context initialization
5. Redirect to dashboard

#### 2. Custom Email Sending Flow
**Files Involved:**
- `app/send/page.tsx` → `app/send/customTemplate/page.tsx` → `app/api/send/route.ts` → `templates/EmailTemplate.tsx`

**Steps:**
1. User selects "Custom Email" from send page
2. Navigate to custom template form
3. Fill email details (to, subject, body)
4. Form validation
5. API call to `/api/send` with custom email data
6. Credit deduction (5 credits)
7. Email sent via Resend API
8. Email logged to database
9. Success notification

#### 3. Template Email Sending Flow
**Files Involved:**
- `app/send/page.tsx` → `app/send/[templates]/page.tsx` → `app/send/[templates]/[template-type]/page.tsx` → `app/api/send/route.ts` → `templates/[TemplateName].tsx`

**Steps:**
1. User selects template type from send page
2. Navigate to specific template form
3. Fill template-specific fields
4. Live preview generation
5. Form validation
6. API call to `/api/send` with template data
7. Credit deduction (10 credits)
8. Template rendering and email sending
9. Email logged to database
10. Success notification

#### 4. Custom Template Creation Flow
**Files Involved:**
- `app/send/customTemplate/page.tsx` → `app/send/custom-template/[templateId]/page.tsx` → `app/api/custom-mail/route.ts`

**Steps:**
1. User accesses custom template builder
2. Drag-and-drop interface for email blocks
3. Real-time preview generation
4. Template saving to database
5. Template listing in custom templates page

#### 5. Batch Email Processing Flow
**Files Involved:**
- `app/send/batch-email/[id]/page.tsx` → `app/api/send-batch/preview/route.ts` → `app/api/send-batch/route.ts` → `lib/csvParser.ts`

**Steps:**
1. User uploads CSV file with recipient data
2. CSV parsing and validation
3. Preview generation
4. User confirmation
5. Batch email sending
6. Credit deduction per email
7. Progress tracking
8. Completion notification

#### 6. Dashboard and Email History Flow
**Files Involved:**
- `app/(Pages)/dashboard/page.tsx` → `app/api/user-mails/route.ts` → `components/ui/table.tsx`

**Steps:**
1. User accesses dashboard
2. Fetch user profile and credits
3. Fetch email history from database
4. Display paginated table with search/filter
5. Real-time updates

### Database Schema

#### `profiles` Table
- `id` (UUID): Primary key, references `auth.users`
- `username` (text): Unique display name
- `credits` (int): Available credits (default: 300)
- `created_at` (timestamp): Profile creation time

#### `user_mails` Table
- `id` (UUID): Primary key
- `user_id` (UUID): References `profiles.id`
- `mail_id` (text): Resend email ID
- `mail_time` (timestamp): Email sent time
- `status` (text): Delivery status

### Architecture Overview

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   API Layer     │    │   External      │
│   (Next.js)     │◄──►│   (Next.js)     │◄──►│   Services      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
│                      │                      │
├─ React Components    ├─ /api/send          ├─ Resend API
├─ ShadCN/UI          ├─ /api/auth          ├─ Supabase Auth
├─ Framer Motion      ├─ /api/user-mails    ├─ Supabase DB
└─ TypeScript         └─ Rate Limiting      └─ PostgreSQL
```

### Security Features
- Server-side API key management (Resend API key never exposed client-side)
- Rate limiting on all API endpoints
- User authentication required for email operations
- Credit validation before email sending
- Input validation and sanitization

### Performance Optimizations
- Server-side rendering with Next.js
- Optimized React components with proper memoization
- Efficient database queries with proper indexing
- Rate limiting to prevent abuse
- Lazy loading of components and routes 