"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { container, failure, success } from "@/lib/toast.util";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

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
        setUserEmail(userData.user.email || "");
      } catch {
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }
    fetchUser();
  }, []);

  const handleChangePassword = async () => {
    if (!userEmail) return;
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(userEmail, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) {
        failure("Failed to send password reset email.", 3000);
      } else {
        success("Password reset link sent to your email.", 3000);
      }
    } catch {
      failure("Failed to send password reset email.", 3000);
    }
  };

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      failure("Failed to sign out.", 2000);
    } else {
      router.push("/auth/login");
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      // This should be implemented as a secure API route using the Supabase service role key
      // Example: await fetch('/api/delete-user', { method: 'POST' });
      await new Promise((res) => setTimeout(res, 1500)); // Simulate network
      setDeleting(false);
      setShowDeleteConfirm(false);
      failure("Account deletion is not implemented in demo.", 3000);
      // On real delete: router.push('/auth/signup');
    } catch {
      setDeleting(false);
      setShowDeleteConfirm(false);
      failure("Failed to delete account.", 3000);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-background py-8">
      {container}
      <Card className="w-full max-w-lg shadow-lg border border-border bg-card">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-foreground">Settings</CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="py-6 space-y-8">
          {/* Account Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Account</h2>
            <div className="flex flex-col gap-3">
              {loading ? (
                <div className="flex items-center gap-2 text-muted-foreground"><Loader2 className="animate-spin w-4 h-4" /> Loading...</div>
              ) : error ? (
                <div className="text-destructive">{error}</div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-muted-foreground">Email:</span>
                    <span className="text-foreground">{userEmail}</span>
                  </div>
                  <div className="flex gap-2 mt-2">
                    <Button variant="outline" onClick={handleChangePassword} className="w-fit">Change Password</Button>
                    <Button variant="secondary" onClick={handleSignOut} className="w-fit">Sign Out</Button>
                  </div>
                </>
              )}
            </div>
          </section>

          <Separator />

          {/* Preferences Section */}
          <section>
            <h2 className="text-lg font-semibold text-foreground mb-2">Preferences</h2>
            <div className="flex items-center gap-4">
              <span className="font-medium text-muted-foreground">Theme:</span>
              <ThemeToggle />
            </div>
          </section>

          <Separator />

          {/* Danger Zone Section */}
          <section>
            <h2 className="text-lg font-semibold text-destructive mb-2">Danger Zone</h2>
            <div className="flex flex-col gap-2">
              <Button variant="destructive" onClick={() => setShowDeleteConfirm(true)} disabled={deleting} className="w-fit">Delete Account</Button>
              {showDeleteConfirm && (
                <div className="mt-2 p-3 bg-destructive/10 border border-destructive/30 rounded-lg">
                  <div className="mb-2 text-destructive font-medium">Are you sure you want to delete your account? This action cannot be undone.</div>
                  <div className="flex gap-2">
                    <Button variant="destructive" onClick={handleDeleteAccount} disabled={deleting} className="w-fit">
                      {deleting ? <Loader2 className="animate-spin w-4 h-4 mr-2" /> : null}
                      Yes, Delete
                    </Button>
                    <Button variant="outline" onClick={() => setShowDeleteConfirm(false)} disabled={deleting} className="w-fit">Cancel</Button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </CardContent>
      </Card>
    </div>
  );
} 