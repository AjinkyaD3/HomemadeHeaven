# Database Schema Documentation

## Tables

### profiles
User profiles and authentication data.

```sql
CREATE TABLE profiles (
  id uuid PRIMARY KEY REFERENCES auth.users,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  phone text,
  role text DEFAULT 'customer',
  is_verified boolean DEFAULT false,
  last_login timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

### products
Product catalog information.

```sql
CREATE TABLE products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  price decimal(10,2) NOT NULL,
  category text NOT NULL,
  image_url text NOT NULL,
  customizable boolean DEFAULT false,
  materials text[] NOT NULL,
  dimensions jsonb,
  in_stock boolean DEFAULT true,
  featured boolean DEFAULT false,
  likes integer DEFAULT 0,
  sku text,
  seo_title text,
  seo_description text,
  seo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

### categories
Product categories and hierarchy.

```sql
CREATE TABLE categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text,
  image_url text,
  parent_id uuid REFERENCES categories(id),
  is_active boolean DEFAULT true,
  seo_title text,
  seo_description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

### orders
Customer orders and transaction data.

```sql
CREATE TABLE orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  status text DEFAULT 'pending',
  payment_status text DEFAULT 'pending',
  payment_method text NOT NULL,
  payment_id text,
  subtotal decimal(10,2) NOT NULL,
  tax decimal(10,2) NOT NULL,
  shipping decimal(10,2) NOT NULL,
  discount decimal(10,2),
  total decimal(10,2) NOT NULL,
  shipping_address_id uuid REFERENCES addresses(id) NOT NULL,
  billing_address_id uuid REFERENCES addresses(id) NOT NULL,
  coupon_code text,
  notes text,
  tracking_number text,
  tracking_url text,
  status_history jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

### order_items
Individual items within orders.

```sql
CREATE TABLE order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  variation_id uuid REFERENCES product_variations(id),
  quantity integer NOT NULL,
  price decimal(10,2) NOT NULL,
  customizations jsonb,
  created_at timestamptz DEFAULT now()
);
```

### addresses
Customer shipping and billing addresses.

```sql
CREATE TABLE addresses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  name text NOT NULL,
  street text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  country text NOT NULL,
  phone text NOT NULL,
  is_default boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

### coupons
Discount codes and promotions.

```sql
CREATE TABLE coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text UNIQUE NOT NULL,
  type text NOT NULL,
  value decimal(10,2) NOT NULL,
  min_purchase decimal(10,2),
  max_discount decimal(10,2),
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  usage_limit integer,
  usage_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  applicable_products uuid[],
  applicable_categories uuid[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

### product_variations
Product variants with different attributes.

```sql
CREATE TABLE product_variations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) NOT NULL,
  sku text NOT NULL,
  attributes jsonb NOT NULL,
  price decimal(10,2),
  stock integer NOT NULL DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

### product_favorites
User favorite products.

```sql
CREATE TABLE product_favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) NOT NULL,
  product_id uuid REFERENCES products(id) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);
```

### reviews
Product reviews and ratings.

```sql
CREATE TABLE reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) NOT NULL,
  user_id uuid REFERENCES profiles(id) NOT NULL,
  user_name text NOT NULL,
  rating integer NOT NULL CHECK (rating >= 1 AND rating <= 5),
  title text,
  content text NOT NULL,
  images text[],
  helpful_count integer DEFAULT 0,
  is_verified_purchase boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz
);
```

## Indexes

```sql
-- Products
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(featured) WHERE featured = true;
CREATE INDEX idx_products_search ON products USING GIN (to_tsvector('english', name || ' ' || description));

-- Orders
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);

-- Order Items
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);

-- Addresses
CREATE INDEX idx_addresses_user_id ON addresses(user_id);

-- Product Variations
CREATE INDEX idx_product_variations_product_id ON product_variations(product_id);

-- Reviews
CREATE INDEX idx_reviews_product_id ON reviews(product_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Favorites
CREATE INDEX idx_product_favorites_user_id ON product_favorites(user_id);
CREATE INDEX idx_product_favorites_product_id ON product_favorites(product_id);
```

## Row Level Security (RLS)

### profiles
```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Users can read their own profile
CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);
```

### orders
```sql
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Users can read their own orders
CREATE POLICY "Users can read own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create orders
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Admins can read all orders
CREATE POLICY "Admins can read all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ));
```

### addresses
```sql
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Users can read their own addresses
CREATE POLICY "Users can read own addresses"
  ON addresses FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Users can create addresses
CREATE POLICY "Users can create addresses"
  ON addresses FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- Users can update their own addresses
CREATE POLICY "Users can update own addresses"
  ON addresses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Users can delete their own addresses
CREATE POLICY "Users can delete own addresses"
  ON addresses FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());
```

## Functions

### toggle_product_favorite
```sql
CREATE OR REPLACE FUNCTION toggle_product_favorite(product_id_param uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  favorite_exists boolean;
BEGIN
  -- Check if favorite exists
  SELECT EXISTS (
    SELECT 1
    FROM product_favorites
    WHERE user_id = auth.uid()
    AND product_id = product_id_param
  ) INTO favorite_exists;
  
  -- Toggle favorite
  IF favorite_exists THEN
    DELETE FROM product_favorites
    WHERE user_id = auth.uid()
    AND product_id = product_id_param;
    RETURN false;
  ELSE
    INSERT INTO product_favorites (user_id, product_id)
    VALUES (auth.uid(), product_id_param);
    RETURN true;
  END IF;
END;
$$;
```

### update_product_likes
```sql
CREATE OR REPLACE FUNCTION update_product_likes()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE products
    SET likes = likes + 1
    WHERE id = NEW.product_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE products
    SET likes = likes - 1
    WHERE id = OLD.product_id;
  END IF;
  RETURN NULL;
END;
$$;

CREATE TRIGGER product_likes_trigger
AFTER INSERT OR DELETE ON product_favorites
FOR EACH ROW
EXECUTE FUNCTION update_product_likes();
```

## Migrations

All database changes should be made through migrations. Migration files are stored in the `supabase/migrations` directory and are executed in alphabetical order.

Example migration file structure:
```
supabase/migrations/
├── 20240101000000_initial_schema.sql
├── 20240102000000_add_product_indexes.sql
├── 20240103000000_add_rls_policies.sql
└── 20240104000000_add_functions.sql
```

## Backups

Database backups are automatically handled by Supabase:
- Daily backups retained for 7 days
- Weekly backups retained for 4 weeks
- Monthly backups retained for 6 months

## Performance Considerations

1. Use appropriate indexes for frequently queried columns
2. Implement pagination for large result sets
3. Use materialized views for complex queries
4. Regular VACUUM and ANALYZE maintenance
5. Monitor query performance with pg_stat_statements

## Security Best Practices

1. Always use RLS policies
2. Never expose sensitive data
3. Use parameterized queries
4. Regular security audits
5. Principle of least privilege