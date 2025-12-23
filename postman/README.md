# Postman Collection for Nebs Backend Notice API

This directory contains Postman collections and environment files for testing the Notice Management API.

## Files

- `Nebs_Backend_Notice_API.postman_collection.json` - Complete API collection
- `Nebs_Backend_Environment.postman_environment.json` - Environment variables

## Import Instructions

### 1. Import Collection

1. Open Postman
2. Click **Import** button (top left)
3. Select **File** tab
4. Choose `Nebs_Backend_Notice_API.postman_collection.json`
5. Click **Import**

### 2. Import Environment

1. Click **Environments** in the left sidebar
2. Click **Import**
3. Choose `Nebs_Backend_Environment.postman_environment.json`
4. Click **Import**
5. Select the imported environment from the dropdown (top right)

## Collection Structure

### Authentication
- **Register User** - Create a new user account
- **Login** - Login and get JWT token (automatically saves token to environment)

### Notices
- **Create Notice (Draft)** - Create a draft notice (saves notice_id automatically)
- **Create Notice (Individual)** - Create notice for individual employee
- **Get All Notices** - Get all notices with pagination
- **Get Published Notices** - Filter by published status
- **Get Draft Notices** - Filter by draft status
- **Get Notices by Type** - Filter by notice type
- **Get Notices by Target Type** - Filter by department/individual
- **Get Single Notice** - Get notice by ID
- **Update Notice** - Update notice details
- **Update Notice Status to Published** - Publish a notice
- **Update Notice Status to Unpublished** - Unpublish a notice
- **Update Notice Status to Draft** - Change status to draft
- **Delete Notice** - Delete a notice (Admin only)

### Health Check
- **Health Check** - Check server status

## Environment Variables

The collection uses the following environment variables:

- `base_url` - API base URL (default: `http://localhost:3000`)
- `auth_token` - JWT token (automatically set after login)
- `user_id` - Current user ID (automatically set after login)
- `notice_id` - Notice ID (automatically set after creating a notice)

## Usage Flow

1. **Start the server:**
   ```bash
   npm run dev
   ```

2. **Login or Register:**
   - Run the **Login** request (or Register if you don't have an account)
   - The auth token will be automatically saved to the environment

3. **Create a Notice:**
   - Run **Create Notice (Draft)**
   - The notice ID will be automatically saved

4. **Test Other Endpoints:**
   - Use the saved notice_id to test update, status change, and delete endpoints

## Quick Start

1. Import both files into Postman
2. Select the "Nebs Backend - Local" environment
3. Run **Login** request (use admin@example.com / admin123 if you've seeded the database)
4. Run **Create Notice (Draft)** to create a test notice
5. Run **Get All Notices** to see all notices
6. Run **Update Notice Status to Published** to publish the notice

## Testing Different Scenarios

### Test Published Notices
1. Create a notice with status "draft"
2. Update status to "published"
3. Use **Get Published Notices** to filter

### Test Individual Notices
1. Use **Create Notice (Individual)** to create a notice for a specific employee
2. Use **Get Notices by Target Type** with `targetType=individual`

### Test Filtering
- Use query parameters in **Get All Notices**:
  - `?status=published` - Only published
  - `?status=draft` - Only drafts
  - `?noticeType=Maintenance` - Filter by type
  - `?targetType=department` - Filter by target type
  - Combine: `?status=published&noticeType=Maintenance&page=1&limit=10`

## Notes

- Authentication is required for most endpoints (except GET requests)
- Status updates require Admin or Moderator role
- Delete requires Admin role
- The collection automatically saves tokens and IDs after successful requests
- Make sure your server is running on `http://localhost:3000` (or update the `base_url` variable)

## Troubleshooting

### Token Not Saved
- Make sure you're using the correct environment
- Check that the Login request returns a 200 status code
- Verify the response structure matches the test script

### 401 Unauthorized
- Run the **Login** request again to refresh the token
- Check that the token is set in the environment variables

### 404 Not Found
- Make sure the server is running
- Verify the `base_url` is correct
- Check that the notice_id exists

### 403 Forbidden
- Status updates and deletes require Admin/Moderator role
- Login with an admin account (admin@example.com / admin123)



