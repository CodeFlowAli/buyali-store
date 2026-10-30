# BuyAli — E-commerce Store

**BuyAli** is a React-based e-commerce website powered by Supabase. It allows customers to browse products, explore categories, view product details, and place orders through WhatsApp.

🌐 **Live Website:** https://buyali.co.uk  
📦 **GitHub Repository:** https://github.com/CodeFlowAli/buyali-store

---

## 1. Project Overview

BuyAli is an online shopping platform designed to make product browsing and ordering simple.

The project includes a public-facing shopping website and a secure admin panel. The admin manages products, categories, payment methods, return policies, product images, and publishing status.

Customers do not need to create an account or log in. They can browse products and contact the store through WhatsApp to place an order.

### Main Objectives

- Provide a responsive online shopping experience.
- Allow administrators to manage store content.
- Store product information in Supabase.
- Upload and display product images.
- Provide WhatsApp-based ordering.
- Apply database-level access control using Supabase RLS.
- Support SEO for products and public pages.

---

## 2. Main Features

### Customer Features

- Browse published products.
- View product categories.
- Open individual product detail pages.
- View product prices and discounts.
- Check product stock information.
- View product images and videos.
- Read product specifications and features.
- View available payment methods.
- View return policies.
- Place orders through WhatsApp.
- Access About, Contact, and Privacy Policy pages.

### Admin Features

- Admin login using Supabase Authentication.
- Admin role verification.
- Add, edit, and delete products.
- Manage product categories.
- Manage payment methods.
- Manage return policies.
- Upload product images.
- Add product video URLs.
- Set product prices and stock.
- Publish or unpublish products.
- Add product SEO information.

---

## 3. Technology Stack

### Frontend

- React.js — Component-based user interface.
- React DOM — Rendering React components.
- Vite — Development server and build tool.
- React Router DOM — Client-side routing.
- JavaScript — Application logic.
- HTML5 — Page structure.
- CSS3 — Styling and responsive layouts.
- Lucide React — Icons, if installed in the project.

### Backend and Database

- Supabase — Backend-as-a-Service.
- PostgreSQL — Relational database.
- Supabase Auth — Admin authentication.
- Supabase Storage — Product media storage.
- Row Level Security (RLS) — Database access control.
- PostgreSQL Functions — Admin verification and profile creation.
- Database Triggers — Automatic profile creation.

### Development Tools

- Node.js
- npm
- Visual Studio Code
- Git
- GitHub

---

## 4. Project Installation

### Requirements

Install these tools before running the project:

- Node.js
- npm
- Git
- Visual Studio Code

### Step 1 — Clone Repository

Open Terminal, Command Prompt, or VS Code terminal.

```bash
git clone https://github.com/CodeFlowAli/buyali-store.git
```

### Step 2 — Open Project Folder

```bash
cd buyali-store
```

### Step 3 — Install Dependencies

```bash
npm install
```

This command installs the dependencies listed in `package.json`.

### Step 4 — Configure Environment Variables

Create a `.env` file in the project root.

Add your Supabase project configuration:

```env
VITE_SUPABASE_URL=YOUR_SUPABASE_PROJECT_URL
VITE_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_OR_PUBLISHABLE_KEY
```

Use the actual variable names expected by your Supabase client configuration. Never put a Supabase service-role secret in frontend code or a `VITE_` variable.

### Step 5 — Start Development Server

```bash
npm run dev
```

Vite will display a local development URL, usually:

```text
http://localhost:5173
```

### Step 6 — Build for Production

```bash
npm run build
```

### Step 7 — Preview Production Build

```bash
npm run preview
```

---

## 5. Supabase Configuration

BuyAli uses Supabase for its database, authentication, and product media storage.

### Database Tables

The following five tables have been verified in the `public` schema:

| Table | Purpose |
|---|---|
| `categories` | Stores product categories |
| `payment_methods` | Stores available payment methods |
| `products` | Stores product information |
| `profiles` | Stores user profiles and roles |
| `return_policies` | Stores return policies |

### 5.1 Categories Table

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Unique category ID |
| `name` | TEXT | Category name |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### 5.2 Payment Methods Table

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Unique payment method ID |
| `name` | TEXT | Payment method name |
| `details` | TEXT | Payment instructions/details |
| `is_active` | BOOLEAN | Active status |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

### 5.3 Products Table

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Unique product ID |
| `title` | TEXT | Product title |
| `description` | TEXT | Full description |
| `category_id` | UUID | Related category |
| `price` | NUMERIC | Current price |
| `old_price` | NUMERIC | Previous price |
| `stock` | INTEGER | Available stock |
| `images` | TEXT[] | Product image paths/URLs |
| `video_url` | TEXT | Product video URL |
| `whatsapp_number` | TEXT | WhatsApp ordering number |
| `payment_method_id` | UUID | Related payment method |
| `return_policy_id` | UUID | Related return policy |
| `is_published` | BOOLEAN | Public visibility |
| `created_at` | TIMESTAMPTZ | Creation timestamp |
| `updated_at` | TIMESTAMPTZ | Last update timestamp |
| `short_description` | TEXT | Short product description |
| `specifications` | TEXT | Product specifications |
| `features` | TEXT | Product features |
| `seo_title` | TEXT | SEO page title |
| `seo_description` | TEXT | SEO meta description |
| `focus_keyword` | TEXT | SEO focus keyword |

### 5.4 Profiles Table

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Auth user ID |
| `full_name` | TEXT | User's full name |
| `role` | TEXT | User role; default is `user` |
| `created_at` | TIMESTAMPTZ | Profile creation time |

### 5.5 Return Policies Table

| Column | Type | Purpose |
|---|---|---|
| `id` | UUID | Unique policy ID |
| `title` | TEXT | Policy title |
| `description` | TEXT | Policy description |
| `is_active` | BOOLEAN | Active status |
| `created_at` | TIMESTAMPTZ | Creation timestamp |

---

## 6. Database Relationships

The following foreign key relationships have been verified:

| Source | Foreign Key | Reference |
|---|---|---|
| `products` | `category_id` | `categories.id` |
| `products` | `payment_method_id` | `payment_methods.id` |
| `products` | `return_policy_id` | `return_policies.id` |

These relationships connect each product to its category, payment method, and return policy.

---

## 7. Database SQL Commands

**Important:** The original SQL Editor history was deleted. The following are reconstructed equivalent SQL commands based on the verified current database schema. They are documentation examples, not a claim that these exact statements were originally executed.

Do not run these commands on an existing production database without checking for existing objects and reviewing the migration plan.

### 7.1 Create Categories Table

```sql
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Purpose:** Stores product categories. The unique constraint prevents duplicate category names.

### 7.2 Create Payment Methods Table

```sql
CREATE TABLE public.payment_methods (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    details TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Purpose:** Stores payment method names, details, and active status.

### 7.3 Create Return Policies Table

```sql
CREATE TABLE public.return_policies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Purpose:** Stores return policy information that can be associated with products.

### 7.4 Create Products Table

```sql
CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category_id UUID REFERENCES public.categories(id),
    price NUMERIC NOT NULL DEFAULT 0,
    old_price NUMERIC,
    stock INTEGER NOT NULL DEFAULT 0,
    images TEXT[] DEFAULT '{}',
    video_url TEXT,
    whatsapp_number TEXT,
    payment_method_id UUID REFERENCES public.payment_methods(id),
    return_policy_id UUID REFERENCES public.return_policies(id),
    is_published BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    short_description TEXT,
    specifications TEXT,
    features TEXT,
    seo_title TEXT,
    seo_description TEXT,
    focus_keyword TEXT
);
```

**Purpose:** Stores the store's main product information, prices, stock, media, relationships, publishing status, and SEO fields.

### 7.5 Create Profiles Table

```sql
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY,
    full_name TEXT,
    role TEXT NOT NULL DEFAULT 'user',
    created_at TIMESTAMPTZ DEFAULT now()
);
```

**Purpose:** Stores user profile information and role-based authorization data. The current schema shows a UUID primary key; verify any additional Auth foreign key constraint separately.

---

## 8. Database Indexes

The following indexes were verified in the database:

```sql
CREATE UNIQUE INDEX categories_name_key
ON public.categories USING btree (name);

CREATE UNIQUE INDEX categories_pkey
ON public.categories USING btree (id);

CREATE UNIQUE INDEX payment_methods_pkey
ON public.payment_methods USING btree (id);

CREATE INDEX products_category_idx
ON public.products USING btree (category_id);

CREATE UNIQUE INDEX products_pkey
ON public.products USING btree (id);

CREATE INDEX products_published_idx
ON public.products USING btree (is_published);

CREATE UNIQUE INDEX profiles_pkey
ON public.profiles USING btree (id);

CREATE UNIQUE INDEX return_policies_pkey
ON public.return_policies USING btree (id);
```

**Purpose:**

- Primary key indexes enforce unique record IDs.
- `categories_name_key` prevents duplicate category names.
- `products_category_idx` supports category-based product filtering.
- `products_published_idx` supports filtering by publication status.

Note: Primary key and unique indexes are normally created automatically by PostgreSQL when their corresponding constraints are created. The statements above document the resulting indexes; they should not be rerun independently on an existing database.

---

## 9. Database Functions

### 9.1 handle_new_user()

Verified function body:

```sql
BEGIN
    INSERT INTO public.profiles (id, full_name)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
    );

    RETURN NEW;
END;
```

**Purpose:**

- Runs when a new Supabase Auth user is created through the associated trigger.
- Inserts a profile using the Auth user ID.
- Reads `full_name` from user metadata.
- Uses an empty string if the name is missing.
- The profile role uses its default value, `user`.

### 9.2 is_admin()

Verified function body:

```sql
SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = (SELECT auth.uid())
      AND role = 'admin'
);
```

**Purpose:**

- Checks the currently authenticated user's ID.
- Looks up the matching profile.
- Returns `true` if the user's role is `admin`.
- Returns `false` otherwise.
- Used by the verified RLS policies for admin authorization.

---

## 10. Database Trigger

Verified trigger:

| Property | Value |
|---|---|
| Trigger | `on_auth_user_created` |
| Schema | `auth` |
| Table | `users` |
| Event | AFTER INSERT |
| Function | `handle_new_user()` |

Reconstructed equivalent trigger SQL:

```sql
CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();
```

**Purpose:** Automatically creates a corresponding profile when an Auth user is inserted.

The BuyAli admin account was created manually through Supabase Dashboard → Authentication → Users. The trigger is nevertheless configured for Auth user creation generally.

---

## 11. Row Level Security (RLS)

The current database has the following verified policies.

### 11.1 Enable RLS

The current policy results confirm policies exist. The following statements are the standard equivalent commands to enable RLS on the five tables:

```sql
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_methods ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.return_policies ENABLE ROW LEVEL SECURITY;
```

### 11.2 Categories Policies

```sql
CREATE POLICY "Anyone can view categories"
ON public.categories
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Admins can manage categories"
ON public.categories
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
```

**Purpose:** Everyone can read categories; only admins can manage them.

### 11.3 Payment Methods Policies

```sql
CREATE POLICY "Anyone can view active payment methods"
ON public.payment_methods
FOR SELECT
TO anon, authenticated
USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage payment methods"
ON public.payment_methods
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
```

**Purpose:** Visitors can view active payment methods; admins can manage all payment methods.

### 11.4 Products Policies

```sql
CREATE POLICY "Anyone can view published products"
ON public.products
FOR SELECT
TO anon, authenticated
USING (is_published = true OR is_admin());

CREATE POLICY "Admins can insert products"
ON public.products
FOR INSERT
TO authenticated
WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
ON public.products
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());

CREATE POLICY "Admins can delete products"
ON public.products
FOR DELETE
TO authenticated
USING (is_admin());
```

**Purpose:** Public visitors can view published products. Admins can add, edit, and delete products.

### 11.5 Profiles Policies

```sql
CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
TO authenticated
USING (id = (SELECT auth.uid()) OR is_admin());

CREATE POLICY "Admins can update profiles"
ON public.profiles
FOR UPDATE
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
```

**Purpose:** Users can view their own profile, while admins can view all profiles and update profiles.

### 11.6 Return Policies

```sql
CREATE POLICY "Anyone can view active return policies"
ON public.return_policies
FOR SELECT
TO anon, authenticated
USING (is_active = true OR is_admin());

CREATE POLICY "Admins can manage return policies"
ON public.return_policies
FOR ALL
TO authenticated
USING (is_admin())
WITH CHECK (is_admin());
```

**Purpose:** Public visitors can view active return policies; admins can manage all return policies.

**Security note:** The SQL above is reconstructed from the observed policy definitions. Review existing policies before applying any policy SQL to avoid duplicate policy names.

---

## 12. Admin Authentication

BuyAli uses Supabase Authentication for admin login.

### Admin Account Setup

The admin account was manually created through:

1. Open Supabase Dashboard.
2. Select the BuyAli project.
3. Open Authentication.
4. Select Users.
5. Create the admin user.
6. Assign the `admin` role in the corresponding `public.profiles` record.

The `is_admin()` function checks the role before admin-only database operations are permitted by RLS.

Customers do not need to register or log in to browse products or place WhatsApp orders.

---

## 13. WhatsApp Ordering System

BuyAli uses WhatsApp for customer orders instead of an integrated online card payment gateway.

Typical ordering flow:

1. Customer opens a product.
2. Customer checks its price, details, and stock.
3. Customer selects the WhatsApp order option.
4. The website opens WhatsApp with the configured number and order information.
5. Customer communicates with the store to complete the order.

**Note:** No online card payment gateway is integrated in the current project description.

---

## 14. SEO Configuration

BuyAli includes SEO-related configuration for search engine visibility.

### SEO Files

- `index.html` — Global title, metadata, canonical URL, Open Graph and Twitter metadata.
- `public/robots.txt` — Crawler access rules and sitemap location.
- `public/sitemap.xml` — Static public page URLs.
- Page-level SEO — Titles, descriptions, canonical URLs, and structured data.
- Product SEO — Dynamic product metadata using product SEO fields.

### Important SEO URLs

- Website: https://buyali.co.uk
- Sitemap: https://buyali.co.uk/sitemap.xml
- Robots: https://buyali.co.uk/robots.txt

---

## 15. Deployment

The project is configured for deployment on a web host that supports the included Apache/LiteSpeed `.htaccess` configuration.

### Production Build

```bash
npm run build
```

The production output is generated in the `dist` folder.

Upload the contents of `dist` to the hosting website's document root.

Ensure:

- HTTPS/SSL is enabled.
- The domain points to the correct hosting directory.
- React Router fallback rules are configured.
- Supabase environment values are configured for the production build.
- Public SEO files are included in the deployed output.

---

## 16. Important Security Notes

- Never expose a Supabase service-role key in frontend code.
- Keep private credentials out of GitHub.
- Use environment variables for public Supabase configuration.
- Protect admin operations with RLS.
- Review storage bucket permissions.
- Do not commit `.env` files.
- Keep admin credentials private.

---

## 17. Future Improvements

Potential future improvements include:

- Order management dashboard.
- Customer order tracking.
- Email notifications.
- Inventory alerts.
- Dynamic product sitemap generation.
- Contact form backend integration.
- Analytics integration.
- Additional payment integrations.

---

## 18. License

This project is maintained by the BuyAli project owner.

Contact: codeflowali@gmail.com

**BuyAli — Simple Shopping. Direct Ordering.**
