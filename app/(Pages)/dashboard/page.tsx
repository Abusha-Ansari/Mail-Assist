"use client";
import { useUser } from "@/context/UserContext";

export default function Dashboard() {
  const { user, loading, loggedIn } = useUser();

  if (loading) return <p>Loading...</p>;
  if (!loggedIn) return <p>Please log in</p>;

  return (
    <div>
      <h1>Welcome, {user?.username}!</h1>
      <p>Credits: {user?.credits}</p>
    </div>
  );
}
