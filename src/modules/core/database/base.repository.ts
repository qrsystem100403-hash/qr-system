import { supabaseAdmin } from "@/lib/supabase/admin";

export abstract class BaseRepository {
  protected async db() {
    return supabaseAdmin;
  }
}