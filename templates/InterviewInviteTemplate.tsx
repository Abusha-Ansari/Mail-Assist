import { InterviewInviteTemplateProps } from "@/interfaces/interfaces";

export const InterviewInviteTemplate = ({
  company,
  position,
  date,
  time,
  location,
}: InterviewInviteTemplateProps) => (
  <div>
    <h1>Interview Invitation from {company}</h1>
    <p>Dear Candidate,</p>
    <p>
      We’re pleased to invite you for an interview for the position of <strong>{position}</strong>.
    </p>
    <p>
      <strong>Date:</strong> {date}<br />
      <strong>Time:</strong> {time}<br />
      <strong>Location:</strong> {location}
    </p>
    <p>Please confirm your availability.</p>
  </div>
);
