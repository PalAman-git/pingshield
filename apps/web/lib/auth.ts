import { createClient } from "./supabase/client";

export async function requireUser() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user
}