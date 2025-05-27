import { ThankYouTemplateProps } from "@/interfaces/interfaces";

export const ThankYouTemplate = ({
  recipientName,
  message,
}: ThankYouTemplateProps) => (
  <div
    style={{
      maxWidth: "600px",
      margin: "0 auto",
      padding: "24px",
      backgroundColor: "#fefce8",
      color: "#333",
      fontFamily: "Arial, sans-serif",
      borderRadius: "12px",
      border: "1px solid #facc15",
    }}
  >
    <div style={{ textAlign: "center", marginBottom: "24px" }}>
      <h1 style={{ fontSize: "24px", color: "#ca8a04", margin: "0" }}>
        🙏 Thank You, {recipientName}!
      </h1>
    </div>

    <p style={{ fontSize: "14px", marginBottom: "16px", lineHeight: "1.6" }}>
      {message}
    </p>

    <p
      style={{
        fontSize: "14px",
        textAlign: "right",
        marginTop: "32px",
        fontStyle: "italic",
        color: "#555",
      }}
    >
      Best regards,<br />
      <strong>Mail Assist</strong>
    </p>
  </div>
);
