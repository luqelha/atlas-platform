# 📚 API Specification

The Atlas Platform API is built using **NestJS** and follows RESTful principles.

## 🔗 Swagger / OpenAPI

The most up-to-date, interactive API documentation is auto-generated and available via Swagger UI.
When running the application locally, you can access the Swagger UI at:

> **URL:** `http://localhost:3000/api/docs`

You can also download the OpenAPI JSON specification at `http://localhost:3000/api/docs-json`.

## 🌐 Base URL

All API endpoints are prefixed with `/api`.
For example, the login endpoint is: `POST /api/auth/login`

## 🔐 Authentication & Authorization

The API uses **JWT (JSON Web Tokens)** for authentication.

1. **Login:** Send credentials to `/api/auth/login` to receive an `access_token` and `refresh_token`.
2. **Bearer Token:** For protected routes, include the `access_token` in the `Authorization` header:
   ```
   Authorization: Bearer <your_access_token>
   ```

## 🏢 Multi-Tenancy

Atlas Platform is a multi-tenant system. Most API endpoints (especially in the CMS module) are scoped to a specific tenant.
To provide the context for which tenant the request is for, the client must send the `X-Tenant-ID` header:

```
X-Tenant-ID: <tenant_id>
```

If the user is accessing a resource that requires tenant context without this header, the server will respond with a `400 Bad Request` or `403 Forbidden` error.

## 📦 Core Modules

- **Auth Module (`/api/auth`)**: Endpoints for register, login, logout, and token refresh.
- **User Module (`/api/users`)**: Endpoints for managing users and retrieving profiles.
- **Tenant Module (`/api/tenants`)**: Endpoints for creating and managing tenants.
- **Category Module (`/api/categories`)**: Endpoints for managing content categories. Requires `X-Tenant-ID`.
- **Content Module (`/api/contents`)**: Endpoints for managing headless CMS content. Requires `X-Tenant-ID`. Features include draft/published statuses, pagination, filtering, and search.
- **Media Module (`/api/media`)**: Endpoints for file uploads and media management. Requires `X-Tenant-ID`.

## ✅ Standardized Responses & Error Handling

All successful responses typically return standard JSON payloads.

**Error Responses:**
The application uses global exception filters to provide standardized error responses. Example:

```json
{
  "statusCode": 400,
  "timestamp": "2026-08-04T12:00:00.000Z",
  "path": "/api/contents",
  "message": [
    "title must be a string",
    "status must be a valid enum value"
  ],
  "error": "Bad Request"
}
```

Validation errors (HTTP 400) will typically return an array of specific validation messages.
