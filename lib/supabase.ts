import { createClient } from "@supabase/supabase-js"
import { type Database } from "@/lib/database.types"

const supabaseUrl = "https://cweicspxjbbfndvtznwi.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZWljc3B4amJiZm5kdnR6bndpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIxNjcwMjgsImV4cCI6MjA2Nzc0MzAyOH0.zZWXmEqPRkO3GpBJaBgcoBnf796IsFTUr-Ecd964R7Q"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Server-side client for admin operations
export const createServerClient = () => {
  return createClient<Database>(supabaseUrl, "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN3ZWljc3B4amJiZm5kdnR6bndpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MjE2NzAyOCwiZXhwIjoyMDY3NzQzMDI4fQ.aRSSlQcWX9CODgcddS3uP9Zqk8mue9YPGN1EtwtzIuI")
}
