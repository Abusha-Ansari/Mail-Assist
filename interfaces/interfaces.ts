// export interface EmailTemplateProps {
//     Body: string;
// }

// export interface EmailProps {
//     to: string;
//     subject: string;
//     from: string;
//     bodyMessage: string;
// }

export interface EmailForm {
    to: string;
    subject:string;
    body: string;
    from: string;
}


// interfaces/interfaces.ts

// For default email template
export interface EmailTemplateProps {
  Body: string;
}

// For job offer email template
export interface JobOfferTemplateProps {
  company: string;
  position: string;
  description: string;
}

// For handling all email sending POST requests
export interface EmailProps {
  to: string;
  from: string;
  subject: string;
  bodyMessage?: string; // Used for default emails
  templateType?: string; // e.g. 'job-offer', 'default'
  templateData?: Record<string, any>; // Holds specific template data (e.g., job offer)
}


export interface InterviewInviteTemplateProps {
  to: string;
  company: string;
  position: string;
  date: string;
  time: string;
  location: string;
}

export interface EventReminderTemplateProps {
  eventName: string;
  date: string;
  time: string;
  venue: string;
}

export interface ThankYouTemplateProps {
  // to: string;
  recipientName: string;
  message: string;
}

export interface PaymentConfirmationTemplateProps {
  recipientName: string;
  amount: string;
  transactionId: string;
  date: string;
}
