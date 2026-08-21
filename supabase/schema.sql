-- Categories Table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  tagline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  compare_at_price NUMERIC(10, 2),
  category_id UUID REFERENCES categories(id),
  nail_shape TEXT NOT NULL,
  style TEXT NOT NULL,
  lengths TEXT[] NOT NULL DEFAULT '{"short", "medium", "long", "extra-long"}',
  sizes TEXT[] NOT NULL DEFAULT '{"XS", "S", "M", "L", "Custom"}',
  images TEXT[] NOT NULL DEFAULT '{}',
  new_arrival BOOLEAN DEFAULT FALSE,
  bestseller BOOLEAN DEFAULT FALSE,
  stock_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_email TEXT NOT NULL,
  customer_first_name TEXT NOT NULL,
  customer_last_name TEXT NOT NULL,
  customer_phone TEXT,
  shipping_address TEXT NOT NULL,
  shipping_city TEXT NOT NULL,
  shipping_state TEXT NOT NULL,
  total_amount NUMERIC(10, 2) NOT NULL,
  shipping_fee NUMERIC(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'processing', 'shipped', 'delivered', 'cancelled')),
  payment_reference TEXT,
  cancellation_reason TEXT,
  cancellation_next_steps TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  product_name TEXT NOT NULL,
  quantity INTEGER NOT NULL,
  price NUMERIC(10, 2) NOT NULL,
  selected_size TEXT NOT NULL,
  selected_length TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Custom Orders Table
CREATE TABLE custom_orders (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  shape TEXT NOT NULL,
  length TEXT NOT NULL,
  design TEXT NOT NULL,
  color_preference TEXT,
  notes TEXT,
  reference_image_url TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'quoted', 'paid', 'processing', 'completed', 'cancelled')),
  quoted_price NUMERIC(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Initial Categories Data
INSERT INTO categories (name, slug, description, tagline) VALUES
('Handmade', 'handmade', 'Artisan-crafted nail sets painted by hand. Each piece is unique.', 'Artisan Crafted'),
('Factory Made', 'factory', 'Precision-crafted nails for perfect consistency and durability.', 'Precision Perfect');
