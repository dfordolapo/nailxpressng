import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import CustomOrdersClient from './CustomOrdersClient';

export const dynamic = 'force-dynamic';

export default async function AdminCustomOrdersPage() {
  const supabase = createServerComponentClient({ cookies });
  
  // We can fetch initial data here if we want, or just let client do it.
  // We'll let the client fetch it so it's consistent with products/orders
  
  return <CustomOrdersClient />;
}
