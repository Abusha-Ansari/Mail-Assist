export interface EmailTemplateProps {
    Body: string;
}

export interface EmailProps {
    to: string;
    subject: string;
    from: string;
    bodyMessage: string;
}
