
# Development Notes

## Authentication
For testing purposes, you may want to disable email verification in the Supabase dashboard settings to make the login process smoother during development.

## Farmer Role
To test the farmer functionality:
1. Create a new user account
2. In the Supabase dashboard, navigate to the SQL editor
3. Run the following query to grant farmer role to a user (replace [USER_ID] with the actual user ID):
   ```sql
   INSERT INTO public.user_roles (user_id, role) 
   VALUES ('[USER_ID]', 'farmer');
   ```
4. Log in with the user account to access the "Manage Products" feature
