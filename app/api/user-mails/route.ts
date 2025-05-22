import { supabase } from "@/lib/supabaseClient";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    const { user_id } = await request.json();
    // console.log(user_id)
  const { data, error } = await supabase
    .from("user_mails")
    .select("*")
    .eq("user_id", user_id)
    .order("mail_time", { ascending: false });
    if(data){
        // console.log("User mails:", data);
    }
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}
