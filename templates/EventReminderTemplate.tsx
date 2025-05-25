import { EventReminderTemplateProps } from "@/interfaces/interfaces";

export const EventReminderTemplate = ({ eventName, date, time, venue }: EventReminderTemplateProps) => (
  <div>
    <h1>⏰ Reminder: {eventName}</h1>
    <p>Your event is coming up!</p>
    <ul>
      <li><strong>Date:</strong> {date}</li>
      <li><strong>Time:</strong> {time}</li>
      <li><strong>Venue:</strong> {venue}</li>
    </ul>
    <p>Looking forward to your presence.</p>
  </div>
);
