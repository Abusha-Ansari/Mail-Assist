import { EventReminderTemplateProps } from "@/interfaces/interfaces";

export const EventReminderTemplate = ({
  eventName,
  date,
  time,
  venue,
}: EventReminderTemplateProps) => (
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
        ⏰ Event Reminder
      </h1>
      <h2 style={{ fontSize: "20px", margin: "0", fontWeight: "bold" }}>
        {eventName}
      </h2>
      <p style={{ fontSize: "14px", color: "#777" }}>
        Don't forget! Here's your event information:
      </p>
    </div>

    <div
      style={{
        backgroundColor: "#fff",
        padding: "16px",
        borderRadius: "8px",
        border: "1px solid #eee",
        marginBottom: "12px",
      }}
    >
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
        <strong>Date:</strong> {date}
      </p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
        <strong>Time:</strong> {time}
      </p>
      <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
        <strong>Venue:</strong> {venue}
      </p>
    </div>

    <p
      style={{
        fontStyle: "italic",
        textAlign: "center",
        marginTop: "20px",
        color: "#444",
      }}
    >
      We're looking forward to your presence. See you there!
    </p>
  </div>
);
