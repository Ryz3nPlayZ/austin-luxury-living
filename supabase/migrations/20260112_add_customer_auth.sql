-- Create user profiles table for role management
CREATE TABLE public.user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('admin', 'customer')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on user profiles
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can view their own profile
CREATE POLICY "Users can view own profile"
ON public.user_profiles
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- User profiles: Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.user_profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id);

-- User profiles: Allow insert for new users (trigger will handle this)
CREATE POLICY "Allow profile creation"
ON public.user_profiles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = id);

-- Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, role)
  VALUES (NEW.id, 'customer');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Trigger to create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Update properties RLS policies to restrict pocket listings
-- Drop existing policy
DROP POLICY IF EXISTS "Anyone can view properties" ON public.properties;

-- New policy: Public can view non-pocket listings, authenticated users can view all
CREATE POLICY "Public can view non-pocket properties"
ON public.properties
FOR SELECT
USING (is_pocket_listing = false);

CREATE POLICY "Authenticated users can view all properties"
ON public.properties
FOR SELECT
TO authenticated
USING (true);

-- Update leads policies to allow authenticated users to manage their own leads
-- Drop existing leads policies and recreate
DROP POLICY IF EXISTS "Anyone can submit leads" ON public.leads;
DROP POLICY IF EXISTS "Authenticated users can view leads" ON public.leads;

-- Leads: Anyone can submit (but we'll associate with user if authenticated)
CREATE POLICY "Anyone can submit leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Leads: Authenticated users can view leads associated with properties they can access
CREATE POLICY "Authenticated users can view accessible leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  property_id IS NULL OR
  EXISTS (
    SELECT 1 FROM properties
    WHERE properties.id = leads.property_id
  )
);

-- Leads: Users can view their own leads (by email match - for customer leads)
CREATE POLICY "Users can view their own leads"
ON public.leads
FOR SELECT
TO authenticated
USING (email = (SELECT email FROM auth.users WHERE id = auth.uid()));
