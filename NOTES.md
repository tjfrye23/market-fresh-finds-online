# Development Notes

## Authentication

For testing purposes, you may want to disable email verification in the Supabase dashboard settings to make the login process smoother during development.

## User Roles

The application supports two user roles:

- **Customer**: Regular users who can browse and purchase products
- **Farmer**: Users who can sell products in the marketplace

When creating a new account, users can select their role. The role is automatically assigned during registration.

## Farmer Role

You can also manually assign the farmer role to existing users:

1. In the Supabase dashboard, navigate to the SQL editor
2. Run the following query to grant farmer role to a user (replace [USER_ID] with the actual user ID):
   ```sql
   INSERT INTO public.user_roles (user_id, role)
   VALUES ('[USER_ID]', 'farmer');
   ```
3. Log in with the user account to access the "Manage Products" feature

## Database Tables

The application uses the following tables:

- `user_roles`: Stores user roles (user, farmer, admin)
- `products`: Stores product information added by farmers

## TypeScript Types

When working with Supabase queries, make sure to properly type the query results to avoid TypeScript errors.
