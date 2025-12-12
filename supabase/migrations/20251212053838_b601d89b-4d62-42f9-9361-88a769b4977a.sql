-- Drop the existing SELECT policy on profiles
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

-- Create new policy that allows users to view their own profile OR superadmins to view all
CREATE POLICY "Users can view profiles" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id 
  OR has_role(auth.uid(), 'superadmin')
);