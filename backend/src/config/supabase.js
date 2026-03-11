import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error(
    "FATAL: Missing Supabase env vars.",
    `SUPABASE_URL=${supabaseUrl ? "set" : "MISSING"}`,
    `SUPABASE_SERVICE_ROLE_KEY=${supabaseServiceRoleKey ? "set" : "MISSING"}`,
  );
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

export { supabase };