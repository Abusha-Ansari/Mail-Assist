import { supabase } from "@/lib/supabaseClient";

export type MailStatus = "send" | "pending";

export interface UserMail {
  id: string;
  user_id: string;
  mail_id: string;
  mail_time: string;
  status: MailStatus;
}

// Add a mail record for a user
export async function addUserMail({
  userId,
  mailId,
  status = "pending",
}: {
  userId: string;
  mailId: string;
  status?: MailStatus;
}) {
  const { data, error } = await supabase.from("user_mails").insert([
    {
      user_id: userId,
      mail_id: mailId,
      status,
    },
  ]);

  if (error) throw error;
  return data;
}

// Update mail status for a specific mail record
export async function updateMailStatus({
  mailRecordId,
  status,
}: {
  mailRecordId: string;
  status: MailStatus;
}) {
  const { data, error } = await supabase
    .from("user_mails")
    .update({ status })
    .eq("id", mailRecordId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Get all mails for a specific user
export async function getUserMails(userId: string) {
  const { data, error } = await supabase
    .from("user_mails")
    .select("*")
    .eq("user_id", userId)
    .order("mail_time", { ascending: false });

  if (error) throw error;
  return data as UserMail[];
}

// Get mails by status for a specific user
export async function getUserMailsByStatus(userId: string, status: MailStatus) {
  const { data, error } = await supabase
    .from("user_mails")
    .select("*")
    .eq("user_id", userId)
    .eq("status", status)
    .order("mail_time", { ascending: false });

  if (error) throw error;
  return data as UserMail[];
}

// Delete all mail records for a specific user (optional utility)
export async function deleteUserMails(userId: string) {
  const { error } = await supabase.from("user_mails").delete().eq("user_id", userId);
  if (error) throw error;
}




// await addUserMail({ userId: "abc123", mailId: "welcome_email" });

// const mails = await getUserMails("abc123");

// await updateMailStatus({ mailRecordId: "some-mail-uuid", status: "send" });

// const pendingMails = await getUserMailsByStatus("abc123", "pending");
