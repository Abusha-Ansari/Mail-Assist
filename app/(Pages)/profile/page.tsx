"use client";

import { useEffect, useState } from "react";
// import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
// import { toast } from "@/lib/toast.util";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { container, failure } from "@/lib/toast.util";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";

interface AuthUser {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  role: string;
}

export default function ProfilePage() {
  // const supabase = createClientComponentClient();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [username, setUsername] = useState("");
  const [editing, setEditing] = useState(false);
  const [usernameLoading, setUsernameLoading] = useState(false);
  const [usernameError, setUsernameError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUser() {
      setLoading(true);
      setError(null);
      try {
        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user) {
          setError("Failed to fetch user info.");
          setLoading(false);
          return;
        }
        const { id, email, created_at, last_sign_in_at, role } = userData.user;
        setUser({
          id: id || "",
          email: email || "",
          created_at: created_at || "",
          last_sign_in_at: last_sign_in_at || "",
          role: role || "authenticated",
        });
        // Fetch username from profiles table
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", id)
          .single();
        if (profileError) {
          setUsername("");
        } else {
          setUsername(profileData?.username || "");
        }
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      failure("Failed to sign out", 2000);
      // toast("Failed to sign out", "destructive");
    } else {
      window.location.href = "/auth/login";
    }
  };

  const handleEditUsername = () => {
    setEditing(true);
    setUsernameError(null);
  };

  const handleCancelEdit = () => {
    setEditing(false);
    setUsernameError(null);
  };

  const handleSaveUsername = async () => {
    if (!username.trim()) {
      setUsernameError("Username cannot be empty.");
      return;
    }
    setUsernameLoading(true);
    setUsernameError(null);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ username: username.trim() })
        .eq("id", user?.id || "");
      if (error) {
        setUsernameError("Failed to update username.");
      } else {
        setEditing(false);
      }
    } catch{
      setUsernameError("An unexpected error occurred.");
    } finally {
      setUsernameLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background py-8">
      {container}
      <Card className="w-full max-w-md shadow-lg border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">Profile</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="py-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="animate-spin w-6 h-6 text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center">{error}</div>
          ) : user ? (
            <div className="space-y-6">
              <div className="space-y-2">
                {/* Username Row - now at the top */}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Username:</span>
                  {editing ? (
                    <>
                      <Input
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className="w-40 h-8 text-foreground border-border focus:border-primary focus:ring-primary"
                        disabled={usernameLoading}
                        autoFocus
                        maxLength={32}
                      />
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleSaveUsername}
                        disabled={usernameLoading}
                        className="p-1"
                        aria-label="Save username"
                      >
                        <Check className="w-4 h-4 text-green-600" />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleCancelEdit}
                        disabled={usernameLoading}
                        className="p-1"
                        aria-label="Cancel edit"
                      >
                        <X className="w-4 h-4 text-destructive" />
                      </Button>
                    </>
                  ) : (
                    <>
                      <span className="text-foreground font-medium">{username || "-"}</span>
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleEditUsername}
                        className="p-1"
                        aria-label="Edit username"
                      >
                        <Pencil className="w-4 h-4 text-muted-foreground" />
                      </Button>
                    </>
                  )}
                </div>
                {usernameError && (
                  <div className="text-xs text-destructive mt-1 ml-2">{usernameError}</div>
                )}
                {/* Email Row - now below username */}
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Email:</span>
                  <span className="text-foreground">{user.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Role:</span>
                  <span className="text-foreground">{user.role || "authenticated"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Joined:</span>
                  <span className="text-foreground">{user.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-muted-foreground">Last Sign In:</span>
                  <span className="text-foreground">{user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleString() : "-"}</span>
                </div>
              </div>
              <Separator />
              <div className="flex flex-col gap-2">
                <Button variant="destructive" onClick={handleSignOut} className="w-full">
                  Sign Out
                </Button>
              </div>
            </div>
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
}
