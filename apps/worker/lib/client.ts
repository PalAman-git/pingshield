import { Database } from "@repo/db"
import { createClient } from "@supabase/supabase-js"

export function createDb() {
    return createClient<Database>(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    )
}