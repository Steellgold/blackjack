import type { Database } from "./types";
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient<Database>(
  "https://sidzseaxauxrhmqrminp.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNpZHpzZWF4YXV4cmhtcXJtaW5wIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQ3MjEwMTYsImV4cCI6MjA1MDI5NzAxNn0.PK0JqB9YhTy83lAeNKR2eUUpxSRwiAtFOwnLSqyXB1Y"
);