-- Run this in your Supabase SQL Editor
ALTER TABLE orders 
ADD COLUMN cancellation_reason TEXT,
ADD COLUMN cancellation_next_steps TEXT;
