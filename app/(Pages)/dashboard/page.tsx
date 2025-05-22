"use client";

import { useUser } from "@/context/UserContext";
import { getUserProfile } from "@/utils/auth";
import { useEffect, useState } from "react";

export interface UserProfile {
  id: string;
  username: string;
  credits: number;
}

export interface UserMailData {
  id: string;
  user_id: string;
  mail_id: string;
  mail_time: string; // ISO 8601 timestamp
  status: "send" | "failed" | "queued" | string; // Extend as needed
  to_email: string | null;
  subject: string | null;
  html: string | null;
}

export type UserMailResponse = UserMailData[];

export default function Dashboard() {
  const { loggedIn } = useUser();
  const [userProfile, setuserProfile] = useState<UserProfile>();
  const [userMails, setUserMails] = useState<UserMailResponse>([]);

  useEffect(() => {
    if (loggedIn) {
      const fetchUserAndMails = async () => {
        const profile = await getUserProfile();

        if (profile) {
          setuserProfile(profile);
          // console.log("User profile:", profile);

          const res = await fetch("/api/user-mails", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_id: profile.id }),
          });
          const data: UserMailResponse = await res.json();
          setUserMails(data);
          // console.log("User mails:", data);
        } else {
          // console.log("No user profile found");
        }
      };
      fetchUserAndMails();
    } else {
      return;
    }
  }, [loggedIn]);

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <h1 className="text-4xl font-bold">Access Denied</h1>
        <p className="mt-4 text-lg">You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-10 px-4">
      <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
      <p className="text-lg mb-6">Welcome to your dashboard!</p>

      {userProfile && (
  <div className="w-full max-w-2xl bg-white text-black dark:bg-black dark:text-white shadow-md rounded-xl p-4 mb-6 transition-colors border border-black dark:border-white">
    <h2 className="text-2xl font-semibold mb-2">User Info</h2>
    <p>
      <strong>Username:</strong> {userProfile.username}
    </p>
    <p>
      <strong>Credits Left:</strong> {userProfile.credits}
    </p>
  </div>
)}

<div className="w-full max-w-4xl bg-white text-black dark:bg-black dark:text-white shadow-md rounded-xl p-4 transition-colors border border-black dark:border-white">
  <h2 className="text-2xl font-semibold mb-4">Sent Emails</h2>
  {userMails.length > 0 ? (
    <table className="w-full table-auto text-left border border-black dark:border-white">
      <thead className="bg-white text-black dark:bg-black dark:text-white border-b border-black dark:border-white">
        <tr>
          <th className="px-4 py-2">#</th>
          <th className="px-4 py-2">To</th>
          <th className="px-4 py-2">Subject</th>
          <th className="px-4 py-2">Status</th>
          <th className="px-4 py-2">Time</th>
        </tr>
      </thead>
      <tbody>
        {userMails.map((mail, index) => (
          <tr
            key={mail.id}
            className="border-t border-black dark:border-white"
          >
            <td className="px-4 py-2">{index + 1}</td>
            <td className="px-4 py-2">{mail.to_email || "N/A"}</td>
            <td className="px-4 py-2">{mail.subject || "N/A"}</td>
            <td className="px-4 py-2">{mail.status}</td>
            <td className="px-4 py-2">
              {new Date(mail.mail_time).toLocaleString()}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  ) : (
    <p>No sent emails found.</p>
  )}
</div>

    </div>
  );
}
