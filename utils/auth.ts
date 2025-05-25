import { supabase } from "@/lib/supabaseClient";


//No use
export async function signUpWithProfile({
  email,
  password,
  username,
}: {
  email: string;
  password: string;
  username: string;
}) {
  // Step 1: Sign up the user
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (signUpError) {
    return { error: signUpError };
  }

  // Check if user is returned immediately (only true if email verification is not required)
  const user = signUpData.user;

  if (!user) {
    return {
      error: new Error(
        "Signup successful, but email verification is required before profile can be created."
      ),
    };
  }

  // Step 2: Insert profile only if auth.uid() is available (session active)
  const { error: profileError } = await supabase.from("profiles").insert({
    id: user.id,
    username: user.email?.split("@")[0], // Use email prefix as username if not provided
    email,
    credits: 300,
  });

  if (profileError) {
    return { error: profileError };
  }

  return { data: user };
}


export async function getUserProfile() {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, credits')
    .eq('id', user.id)
    .single();

  if (error) throw error;
  return data;
}


export async function deductCredits(userId: string, credits: number) {
  const { error, data } = await supabase.rpc("deduct_credits", {
    user_id: userId,
    amount: credits,
  });

  if (error) {
    console.error("Error deducting credits:", error);
    throw error;
  }

  return data;
}



export async function addCredits(userId: string, amount: number) {
  const { error } = await supabase.rpc('add_credits', {
    user_id: userId,
    amount: amount,
  });

  if (error) throw error;
}