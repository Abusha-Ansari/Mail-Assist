export interface EmailTemplateProps {
    Body: string;
}

export interface EmailProps {
    to: string;
    subject: string;
    from: string;
    bodyMessage: string;
}

export interface EmailForm {
    to: string;
    subject:string;
    body: string;
    from: string;
}
