import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from('store_settings')
      .select('shipping_standard, shipping_express, delivery_locations, delivery_presets, sitewide_discount')
      .eq('id', 1)
      .single();

    if (error) {
      console.error('Error fetching settings:', error);
      return NextResponse.json({ shipping_standard: 2500, shipping_express: 5000, delivery_locations: [], delivery_presets: null, sitewide_discount: 0 }, { status: 200 });

    }

    return NextResponse.json(data);
  } catch (err) {
    console.error('API route error:', err);
    return NextResponse.json({ shipping_standard: 2500, shipping_express: 5000, delivery_locations: [], delivery_presets: null, sitewide_discount: 0 }, { status: 200 });
  }
}
