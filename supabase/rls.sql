-- Enable RLS on all tables
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE custom_orders ENABLE ROW LEVEL SECURITY;

-- 1. Categories & Products: Anyone can read, only Service Role (or authenticated Admin) can write.
-- (The service_role key automatically bypasses RLS, so we only need to write policies for public reading)
CREATE POLICY "Allow public read access to categories" ON categories FOR SELECT TO anon USING (true);
CREATE POLICY "Allow public read access to products" ON products FOR SELECT TO anon USING (true);

-- 2. Orders, Order Items, Custom Orders: Lock down completely for 'anon'.
-- Only our backend Next.js API routes (using service_role key) will be able to insert or update these.
-- No policies needed for anon on these tables, because when RLS is enabled without policies, access is denied by default!
