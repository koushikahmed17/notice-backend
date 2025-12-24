# Notice Management API Documentation

## Overview
The Notice Management API allows you to create, retrieve, update, and manage notices with support for draft/published/unpublished statuses.

## Base URL
```
http://localhost:3000/api/notices
```

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Endpoints

### 1. Create a Notice
**POST** `/api/notices`

**Authentication:** Required

**Request Body:**
```json
{
  "targetDepartmentOrIndividual": "IT Department",
  "targetType": "department",
  "noticeTitle": "System Maintenance Notice",
  "employeeId": "EMP001",
  "employeeName": "John Doe",
  "position": "Senior Developer",
  "noticeType": "Maintenance",
  "publishDate": "2024-12-25T00:00:00.000Z",
  "noticeBody": "The system will undergo maintenance on December 25, 2024 from 2 AM to 4 AM.",
  "attachments": ["file1.pdf", "file2.jpg"],
  "status": "draft"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resource created successfully",
  "data": {
    "_id": "...",
    "targetDepartmentOrIndividual": "IT Department",
    "targetType": "department",
    "noticeTitle": "System Maintenance Notice",
    "status": "draft",
    "createdBy": "...",
    "createdAt": "2024-12-23T10:00:00.000Z",
    "updatedAt": "2024-12-23T10:00:00.000Z"
  },
  "statusCode": 201
}
```

### 2. Get All Notices
**GET** `/api/notices`

**Authentication:** Not required (public)

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `status` (optional): Filter by status - `draft`, `published`, or `unpublished`
- `noticeType` (optional): Filter by notice type
- `targetType` (optional): Filter by target type - `department` or `individual`

**Example Requests:**
```
GET /api/notices
GET /api/notices?status=published
GET /api/notices?status=draft&page=1&limit=20
GET /api/notices?targetType=department&noticeType=Maintenance
```

**Response:**
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {
    "data": [
      {
        "_id": "...",
        "noticeTitle": "System Maintenance Notice",
        "status": "published",
        ...
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 25,
      "totalPages": 3
    }
  },
  "statusCode": 200
}
```

### 3. Get Single Notice
**GET** `/api/notices/:id`

**Authentication:** Not required (public)

**Response:**
```json
{
  "success": true,
  "message": "Resource retrieved successfully",
  "data": {
    "_id": "...",
    "targetDepartmentOrIndividual": "IT Department",
    "targetType": "department",
    "noticeTitle": "System Maintenance Notice",
    "noticeType": "Maintenance",
    "publishDate": "2024-12-25T00:00:00.000Z",
    "noticeBody": "The system will undergo maintenance...",
    "status": "published",
    "createdBy": {
      "_id": "...",
      "name": "Admin User",
      "email": "admin@example.com"
    },
    "createdAt": "2024-12-23T10:00:00.000Z",
    "updatedAt": "2024-12-23T10:00:00.000Z"
  },
  "statusCode": 200
}
```

### 4. Update Notice
**PUT** `/api/notices/:id`

**Authentication:** Required

**Request Body:** (All fields optional)
```json
{
  "noticeTitle": "Updated Notice Title",
  "noticeBody": "Updated notice body content",
  "status": "published"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Resource updated successfully",
  "data": {
    "_id": "...",
    "noticeTitle": "Updated Notice Title",
    ...
  },
  "statusCode": 200
}
```

### 5. Update Notice Status
**PATCH** `/api/notices/:id/status`

**Authentication:** Required (Admin or Moderator only)

**Request Body:**
```json
{
  "status": "published"
}
```

**Valid Status Values:**
- `draft` - Notice is saved but not published
- `published` - Notice is live and visible
- `unpublished` - Notice is taken down

**Response:**
```json
{
  "success": true,
  "message": "Notice status updated successfully",
  "data": {
    "_id": "...",
    "status": "published",
    ...
  },
  "statusCode": 200
}
```

### 6. Delete Notice
**DELETE** `/api/notices/:id`

**Authentication:** Required (Admin only)

**Response:**
```json
{
  "success": true,
  "message": "Resource deleted successfully",
  "data": null,
  "statusCode": 204
}
```

## Notice Model Fields

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `targetDepartmentOrIndividual` | String | Yes | Target department name or individual name |
| `targetType` | Enum | Yes | `department` or `individual` |
| `noticeTitle` | String | Yes | Title of the notice |
| `employeeId` | String | No | Employee ID (for individual notices) |
| `employeeName` | String | No | Employee full name (for individual notices) |
| `position` | String | No | Employee position/department |
| `noticeType` | String | Yes | Type of notice (e.g., "Maintenance", "Announcement") |
| `publishDate` | Date | Yes | Date when notice should be published |
| `noticeBody` | String | Yes | Main content of the notice |
| `attachments` | Array[String] | No | Array of attachment file paths/URLs |
| `status` | Enum | No | `draft`, `published`, or `unpublished` (default: `draft`) |
| `createdBy` | ObjectId | Yes | ID of user who created the notice |

## Example Usage with cURL

### Create a Notice
```bash
curl -X POST http://localhost:3000/api/notices \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "targetDepartmentOrIndividual": "IT Department",
    "targetType": "department",
    "noticeTitle": "System Maintenance",
    "noticeType": "Maintenance",
    "publishDate": "2024-12-25T00:00:00.000Z",
    "noticeBody": "System will be down for maintenance."
  }'
```

### Get Published Notices
```bash
curl http://localhost:3000/api/notices?status=published
```

### Update Notice Status
```bash
curl -X PATCH http://localhost:3000/api/notices/NOTICE_ID/status \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "published"
  }'
```

## Error Responses

### 400 Bad Request (Validation Error)
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "path": "body.noticeTitle",
      "message": "Notice title is required"
    }
  ],
  "statusCode": 400
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Unauthorized access",
  "statusCode": 401
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Notice not found",
  "statusCode": 404
}
```




