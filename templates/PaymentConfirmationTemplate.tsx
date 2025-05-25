import { PaymentConfirmationTemplateProps } from "@/interfaces/interfaces";

export const PaymentConfirmationTemplate = ({
  recipientName,
  amount,
  transactionId,
  date,
}: PaymentConfirmationTemplateProps) => (
  <div>
    <h1>💳 Payment Confirmation</h1>
    <p>Hello {recipientName},</p>
    <p>We’ve received your payment of <strong>${amount}</strong> on {date}.</p>
    <p><strong>Transaction ID:</strong> {transactionId}</p>
    <p>Thank you for your purchase!</p>
  </div>
);
