const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ukfwpourkksctwmdgrci.supabase.co';
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrZndwb3Vya2tzY3R3bWRncmNpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NDE1MDc2MSwiZXhwIjoyMDk5NzI2NzYxfQ._LpoXALdQ_eWEtIMoCGuwjLLI--1l94LF28pEFVke1o';

const supabase = createClient(supabaseUrl, serviceRoleKey);

async function clearOrders() {
  console.log('Clearing order_items and orders...');
  
  // Delete all order items first to satisfy foreign key constraints
  const { error: itemsError } = await supabase
    .from('order_items')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (itemsError) {
    console.error('Error deleting order_items:', itemsError);
  } else {
    console.log('Successfully cleared order_items.');
  }

  // Delete all orders
  const { error: ordersError } = await supabase
    .from('orders')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (ordersError) {
    console.error('Error deleting orders:', ordersError);
  } else {
    console.log('Successfully cleared orders.');
  }

  // Also clear test custom orders if needed
  const { error: customOrdersError } = await supabase
    .from('custom_orders')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');

  if (customOrdersError) {
    console.error('Error deleting custom_orders:', customOrdersError);
  } else {
    console.log('Successfully cleared custom_orders.');
  }

  console.log('All orders data reset clean.');
}

clearOrders();
