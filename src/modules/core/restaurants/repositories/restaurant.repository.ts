import { BaseRepository } from "@/modules/core/database/base.repository";

const RESTAURANT_SELECT = `
  id,
  name,
  slug,
  logo,
  primary_color,
  domain,
  phone,
  address,
  tagline,
  gst_number,
  fssai_number,
  workflow_mode,
  table_workflow_mode
`;

export class RestaurantRepository extends BaseRepository {
  async findByDomain(domain: string) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("restaurants")
      .select(RESTAURANT_SELECT)
      .eq("domain", domain)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }

  async findById(id: string) {
    const supabase = await this.db();

    const { data, error } = await supabase
      .from("restaurants")
      .select(RESTAURANT_SELECT)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      throw error;
    }

    return data;
  }
}