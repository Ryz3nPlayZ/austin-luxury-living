-- Add missing policies for leads table to allow authenticated users to delete and update leads

-- Leads: Authenticated users can delete leads
CREATE POLICY "Authenticated users can delete leads"
ON public.leads
FOR DELETE
TO authenticated
USING (true);

-- Leads: Authenticated users can update leads
CREATE POLICY "Authenticated users can update leads"
ON public.leads
FOR UPDATE
TO authenticated
USING (true);
