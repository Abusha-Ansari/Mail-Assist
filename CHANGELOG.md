# CHANGELOG.md

## [2024-12-19] - Centralized Theming System Implementation

### Added
- **Theme Toggle Component**: New `components/ui/theme-toggle.tsx` with smooth animations and proper theme switching
- **Smooth Theme Transitions**: Added 150ms CSS transitions for background-color, border-color, and color changes
- **Enhanced Navbar**: Integrated theme toggle button in both desktop and mobile navigation
- **Centralized Color System**: Converted hardcoded colors to use ShadCN CSS variables throughout navbar, AnimatedHome component, features page, help page, dashboard page, send page, buy-credits page, login page, and signup page

### Changed
- **Navbar Color Scheme**: Replaced hardcoded blue/purple gradients with primary color variables
- **User Menu Styling**: Updated dropdown menu to use popover and border CSS variables
- **Mobile Menu**: Converted mobile menu background to use card and border variables
- **Button Styling**: Updated signup buttons and logout buttons to use semantic color variables
- **Logo Branding**: Converted logo gradients to use primary color variables
- **AnimatedHome Component**: Complete color system overhaul:
  - Hero section gradients converted to use primary/accent variables
  - Feature icons updated to use semantic colors (primary, accent, destructive)
  - All text colors converted to foreground/muted-foreground
  - Background sections updated to use card/muted variables
  - Button styling unified with primary color system
  - Footer colors converted to use muted/foreground variables
- **Features Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Hero section updated with primary color gradients
  - Feature cards converted to use card/border variables
  - Button styling unified with primary color system
  - Trust signals and badges updated to use card/border variables
  - CTA section converted to use semantic color variables
- **Help Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Hero section updated with primary color gradients
  - FAQ cards converted to use card/border variables
  - Button styling unified with primary color system
  - Trust signals and badges updated to use card/border variables
  - Troubleshooting cards updated to use semantic color variables
  - Contact support section converted to use primary/accent variables
- **Dashboard Page**: Complete color system conversion:
  - Background gradients converted to use background/muted variables
  - Header section updated with primary color gradients
  - User profile card converted to use card/border variables
  - Stats cards updated to use semantic color variables
  - Email management section converted to use card/border variables
  - Table styling updated to use muted/border variables
  - Search and filter controls converted to use card/border variables
  - Pagination controls updated to use primary color system
  - Email preview modal converted to use card/border variables
  - All text colors converted to foreground/muted-foreground
- **Send Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Header section updated with primary color gradients
  - Search bar converted to use primary/card/border variables
  - Template cards updated to use card/border variables
  - Button styling unified with primary color system
  - Empty state converted to use semantic color variables
  - All text colors converted to foreground/muted-foreground
- **Buy-Credits Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Header section updated with primary color gradients
  - Credit plan cards updated to use card/border variables
  - Button styling unified with primary color system
  - QR code payment section converted to use card/border variables
  - All text colors converted to foreground/muted-foreground
- **Login Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Card styling updated to use card/border variables
  - Icon container converted to use primary color variables
  - Title gradients updated to use foreground/primary variables
  - Form inputs converted to use border/primary focus variables
  - Button styling unified with primary color system
  - Divider and separator styling updated to use border/card variables
  - Link colors converted to use primary color variables
  - All text colors converted to foreground/muted-foreground
- **Signup Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Card styling updated to use card/border variables
  - Icon container converted to use primary color variables
  - Title gradients updated to use foreground/primary variables
  - Form inputs converted to use border/primary focus variables
  - Button styling unified with primary color system
  - Divider and separator styling updated to use border/card variables
  - Link colors converted to use primary color variables
  - All text colors converted to foreground/muted-foreground
- **Navbar Component**: Enhanced color system conversion:
  - Badge colors updated to use destructive/accent color variables
  - User menu text colors converted to foreground variables
  - Divider styling updated to use border variables
  - Mobile menu text colors converted to foreground variables
  - All remaining hardcoded colors replaced with CSS variables
- **Custom Template Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Background decorations updated to use primary color variables
  - Icon container converted to use primary color variables
  - Title gradients updated to use foreground/primary variables
  - Description text converted to use muted-foreground variables
  - Primary button styling unified with primary color system
  - Outline button converted to use card/border variables
  - Feature highlight card updated to use card/border variables
  - All text colors converted to foreground/muted-foreground
- **All Custom Templates Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Background decorations updated to use primary color variables
  - Title gradients updated to use foreground/primary variables
  - Search bar converted to use card/border/primary variables
  - Empty state icon and text updated to use muted/primary variables
  - Template cards converted to use card/border variables
  - Template icons updated to use primary color variables
  - Placeholder badges converted to use primary color variables
  - Primary button styling unified with primary color system
  - Outline button converted to use card/border variables
  - All text colors converted to foreground/muted-foreground
- **Create Template Page**: Complete color system conversion:
  - Removed theme forcing logic (commented out useTheme hook)
  - Background gradients converted to use background/muted variables
  - Header icon and text updated to use primary/foreground variables
  - Template name input converted to use card/border variables
  - Action buttons unified with primary color system
  - Add blocks section converted to use card/border variables
  - Block type buttons updated to use primary/accent color variables
  - Block editor cards converted to use card/border variables
  - Content editor inputs updated to use muted/border variables
  - Style controls converted to use muted/border variables
  - Block preview areas updated to use muted/card variables
  - Placeholder manager converted to use card/border variables
  - Live preview section updated to use card/border variables
  - All text colors converted to foreground/muted-foreground
- **Normal Template Page**: Complete color system conversion:
  - Form labels converted to use foreground variables
  - Input fields updated to use border/primary focus variables
  - Textarea converted to use border/primary focus variables
  - Checkbox styling updated to use primary/border variables
  - Schedule date/time inputs converted to use border/primary variables
  - Submit button unified with primary color system
  - All text colors converted to foreground variables

### Technical Details
- **Files Modified**: 
  - `app/globals.css` - Added smooth transitions
  - `components/ui/theme-toggle.tsx` - New theme toggle component
  - `components/navbar.tsx` - Integrated theme toggle and converted colors
  - `components/AnimatedHome.tsx` - Complete color system conversion
  - `app/features/page.tsx` - Complete color system conversion and theme logic removal
  - `app/help/page.tsx` - Complete color system conversion and theme logic removal
  - `app/(Pages)/dashboard/page.tsx` - Complete color system conversion
  - `app/send/page.tsx` - Complete color system conversion and theme logic removal
  - `app/(Pages)/buy-credits/page.tsx` - Complete color system conversion and theme logic removal
  - `app/auth/login/page.tsx` - Complete color system conversion and theme logic removal
  - `app/auth/signup/page.tsx` - Complete color system conversion and theme logic removal
  - `app/send/customTemplate/page.tsx` - Complete color system conversion and theme logic removal
  - `app/send/all-custom-templates/page.tsx` - Complete color system conversion and theme logic removal
  - `app/(Pages)/create-template/page.tsx` - Complete color system conversion and theme logic removal
  - `app/send/[templates]/normal/page.tsx` - Complete color system conversion
- **Color Variables Used**: primary, primary-foreground, popover, border, card, destructive, accent, foreground, muted-foreground, background, muted
- **Animation**: Added hover and tap animations for theme toggle with Framer Motion
- **Shadow System**: Implemented consistent shadow-md and shadow-lg usage
- **Theme Logic**: Removed forced dark theme logic from features, help, send, buy-credits, login, signup, customTemplate, all-custom-templates, and create-template pages for proper theme switching

### User Feedback & Open Questions
- None at this time - theming system implementation

---

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