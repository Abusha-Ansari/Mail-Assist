import { PaymentConfirmationTemplateProps } from "@/interfaces/interfaces";

export const PaymentConfirmationTemplate = ({
  recipientName,
  amount,
  transactionId,
  date,
}: PaymentConfirmationTemplateProps) => (
  <div
    style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "24px",
      backgroundColor: "#f9f9f9",
      color: "#333",
      fontFamily: "Arial, sans-serif",
      borderRadius: "12px",
      border: "1px solid #ddd",
    }}
  >
    <div style={{ textAlign: "center", marginBottom: "24px" }}>
      <h1 style={{ fontSize: "24px", color: "#0EA5E9", margin: "0" }}>
        💳 Payment Confirmation
      </h1>
    </div>

    <p style={{ fontSize: "14px", marginBottom: "10px" }}>
      Hello <strong>{recipientName}</strong>,
    </p>

    <p style={{ fontSize: "14px", marginBottom: "10px" }}>
      We’ve received your payment of{" "}
      <strong style={{ color: "#16A34A" }}>${amount}</strong> on{" "}
      <strong>{date}</strong>.
    </p>

    <div
      style={{
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #eee",
        marginBottom: "16px",
      }}
    >
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
        <strong>Transaction ID:</strong> {transactionId}
      </p>
    </div>

    <p
      style={{
        fontSize: "14px",
        color: "#444",
        textAlign: "center",
        fontStyle: "italic",
      }}
    >
      Thank you for your purchase!
    </p>
  </div>
);
