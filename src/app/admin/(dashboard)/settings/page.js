import SettingsClient from './SettingsClient';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Settings - Admin Dashboard',
};

export default async function SettingsPage() {
  const { data } = await supabaseAdmin
    .from('store_settings')
    .select('shipping_standard, shipping_express, delivery_locations, delivery_presets, sitewide_discount')
    .eq('id', 1)
    .maybeSingle();

  return <SettingsClient initialSettings={data || null} />;
}
