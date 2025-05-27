import { JobOfferTemplateProps } from "@/interfaces/interfaces";

export const JobOfferTemplate = ({
  company,
  position,
  description,
}: JobOfferTemplateProps) => (
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
      <h1 style={{ fontSize: "24px", marginBottom: "8px", color: "#16A34A" }}>
        🎉 You're Invited to Join {company}!
      </h1>
    </div>

    <div
      style={{
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #eee",
        marginBottom: "16px",
      }}
    >
      <p style={{ margin: "8px 0", fontSize: "14px", color: "#555" }}>
        <strong>Position:</strong> {position}
      </p>
      <p style={{ margin: "8px 0", fontSize: "14px", color: "#555" }}>
        <strong>Description:</strong> {description}
      </p>
    </div>

    <p
      style={{
        fontSize: "14px",
        textAlign: "center",
        color: "#444",
        fontStyle: "italic",
      }}
    >
      We hope to hear from you soon. Welcome aboard!
    </p>
  </div>
);
