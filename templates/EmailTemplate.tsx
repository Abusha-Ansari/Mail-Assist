import { EmailTemplateProps } from "@/interfaces/interfaces";

export const EmailTemplate = ({ Body }: EmailTemplateProps) => (
  <div>
    <h1>
      {Body}
    </h1>
  </div>
);
