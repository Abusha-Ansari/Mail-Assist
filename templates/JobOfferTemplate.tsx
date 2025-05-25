// templates/JobOfferTemplate.tsx
import { JobOfferTemplateProps } from "@/interfaces/interfaces";

export const JobOfferTemplate = ({ company, position, description }: JobOfferTemplateProps) => (
  <div>
    <h1>You're Invited to Join {company}!</h1>
    <p><strong>Position:</strong> {position}</p>
    <p><strong>Description:</strong> {description}</p>
    <p>We hope to hear from you soon.</p>
  </div>
);
