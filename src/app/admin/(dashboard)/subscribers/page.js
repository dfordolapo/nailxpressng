import SubscribersClient from "./SubscribersClient";
import { supabaseAdmin } from "@/lib/supabaseAdmin";
import { FALLBACK_SUBSCRIBERS } from "@/lib/fallbackData";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Subscribers & Restock Leads | Nail Express Admin",
};

export default async function SubscribersPage() {
  const { data, error } = await supabaseAdmin
    .from("subscribers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(300);

  const list = !error && data && data.length > 0 ? data : FALLBACK_SUBSCRIBERS;
  return <SubscribersClient initialSubscribers={list} />;
}
