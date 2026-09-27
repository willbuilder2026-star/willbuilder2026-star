import { supabase } from "./supabaseClient";

// Pulls together everything entered for one Will, across every stage table,
// so the Review, Document and Signing pages can all share one fetch.
export async function fetchWillData(willId) {
  const [
    wills,
    about,
    partner,
    children,
    guardians,
    executors,
    properties,
    pensions,
    gifts,
    charityGifts,
    beneficiaries,
    settings,
    adminNotes,
  ] = await Promise.all([
    supabase.from("wills").select("*").eq("id", willId).maybeSingle(),
    supabase.from("will_about").select("*").eq("will_id", willId).maybeSingle(),
    supabase.from("will_partner").select("*").eq("will_id", willId).maybeSingle(),
    supabase.from("children").select("*").eq("will_id", willId).order("created_at"),
    supabase.from("guardians").select("*").eq("will_id", willId).order("created_at"),
    supabase.from("executors").select("*").eq("will_id", willId).order("created_at"),
    supabase.from("properties").select("*").eq("will_id", willId).order("created_at"),
    supabase.from("pensions").select("*").eq("will_id", willId).maybeSingle(),
    supabase.from("gifts").select("*").eq("will_id", willId).order("created_at"),
    supabase.from("charity_gifts").select("*").eq("will_id", willId).order("created_at"),
    supabase.from("residuary_beneficiaries").select("*").eq("will_id", willId).order("created_at"),
    supabase.from("residuary_settings").select("*").eq("will_id", willId).maybeSingle(),
    supabase.from("admin_notes").select("*").eq("will_id", willId).order("created_at"),
  ]);

  return {
    will: wills.data || null,
    about: about.data || null,
    partner: partner.data || null,
    children: children.data || [],
    guardians: guardians.data || [],
    executors: executors.data || [],
    properties: properties.data || [],
    pensions: pensions.data || null,
    gifts: gifts.data || [],
    charityGifts: charityGifts.data || [],
    beneficiaries: beneficiaries.data || [],
    settings: settings.data || null,
    adminNotes: adminNotes.data || [],
  };
}

export const JURISDICTION_LABELS = {
  england_wales: "England & Wales",
  scotland: "Scotland",
  northern_ireland: "Northern Ireland",
};
