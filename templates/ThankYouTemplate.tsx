import { ThankYouTemplateProps } from "@/interfaces/interfaces";

export const ThankYouTemplate = ({ recipientName, message }: ThankYouTemplateProps) => (
  <div>
    <h1>🙏 Thank You, {recipientName}!</h1>
    <p>{message}</p>
    <p>Best regards,<br />Mail Assist</p>
  </div>
);
