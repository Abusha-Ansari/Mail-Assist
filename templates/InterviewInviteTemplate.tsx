import { InterviewInviteTemplateProps } from "@/interfaces/interfaces";

export const InterviewInviteTemplate = ({
  company,
  position,
  date,
  time,
  location,
}: InterviewInviteTemplateProps) => (
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
      <h1 style={{ fontSize: "24px", marginBottom: "8px", color: "#4F46E5" }}>
        🎯 Interview Invitation
      </h1>
      <h2 style={{ fontSize: "20px", margin: "0", fontWeight: "bold" }}>
        From {company}
      </h2>
    </div>

    <div style={{ marginBottom: "16px" }}>
      <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>Dear Candidate,</p>
      <p style={{ fontSize: "14px", margin: "0 0 10px 0" }}>
        We’re pleased to invite you for an interview for the position of{" "}
        <strong>{position}</strong>.
      </p>
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
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
        <strong>Date:</strong> {date}
      </p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
        <strong>Time:</strong> {time}
      </p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
        <strong>Location:</strong> {location}
      </p>
    </div>

    <p
      style={{
        fontSize: "14px",
        fontStyle: "italic",
        textAlign: "center",
        color: "#444",
      }}
    >
      Please confirm your availability. We look forward to meeting you!
    </p>
  </div>
);
