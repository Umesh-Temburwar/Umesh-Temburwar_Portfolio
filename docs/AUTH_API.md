# Authentication API Documentation

## Overview

This document describes the authentication API endpoints implemented for the Supabase Complete Setup system. The API provides user registration, login, logout, password reset, and token refresh functionality with JWT-based authentication and security best practices.

## Requirements Implemented

- **Requirement 1.1**: Auth Service supports user registration with email and password ✅
- **Requirement 1.2**: Auth Service supports user login with email and password ✅
- **Requirement 1.3**: Successfully authenticated users receive JWT tokens valid for API calls ✅
- **Requirement 1.4**: User logout invalidates JWT tokens ✅
- **Requirement 1.5**: Auth Service supports password reset via email verification ✅
- **Requirement 1.6**: Session expiration redirects unauthenticated users ✅
- **Requirement 1.7**: User credentials stored securely with Supabase Auth ✅
- **Requirement 1.8**: Invalid login attempts rejected and logged ✅

## API Endpoints

### 1. POST /api/auth/register

**Description**: Register a new user account

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Response (201 Created)**:
```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com"
  },
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "sbp_1234567890...",
    "expires_in": 3600
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields, invalid email, or weak password
- `409 Conflict`: Email already registered
- `500 Internal Server Error`: Server configuration error

**Validation Rules**:
- Email must match pattern: `^[^\s@]+@[^\s@]+\.[^\s@]+$`
- Password must be at least 8 characters
- First name and last name must be 1-100 characters each
- All fields are required

---

### 2. POST /api/auth/login

**Description**: Authenticate user and create session

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123"
}
```

**Response (200 OK)**:
```json
{
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "sbp_1234567890...",
    "expires_in": 3600
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing required fields or invalid email format
- `401 Unauthorized`: Invalid email or password
- `429 Too Many Requests`: Rate limit exceeded (5 attempts per 15 minutes)
- `500 Internal Server Error`: Server configuration error

**Security Features**:
- Rate limiting: Maximum 5 login attempts per IP per 15-minute window
- Generic error messages to prevent user enumeration
- JWT token validation for claims (sub, email, aud, exp)

**JWT Token Validation**:
The endpoint validates that the returned JWT token contains:
- `sub`: User UUID (UUID format)
- `email`: User email address
- `aud`: "authenticated"
- `exp`: Non-expired timestamp

---

### 3. POST /api/auth/logout

**Description**: Invalidate current session

**Request Headers**:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK)**:
```json
{
  "success": true
}
```

**Error Responses**:
- `401 Unauthorized`: Missing or invalid Authorization header
- `405 Method Not Allowed`: Non-POST request
- `500 Internal Server Error`: Server configuration error

---

### 4. POST /api/auth/reset-password

**Description**: Send password reset email to user

**Request Body**:
```json
{
  "email": "user@example.com"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Password reset email sent. Please check your inbox."
}
```

**Error Responses**:
- `400 Bad Request`: Missing email or invalid format
- `405 Method Not Allowed`: Non-POST request
- `500 Internal Server Error`: Server configuration error

**Security Features**:
- Always returns success for security (prevents user enumeration)
- Email is case-insensitive (converted to lowercase)
- Redirect URL configurable via `SUPABASE_REDIRECT_TO` environment variable

---

### 5. POST /api/auth/refresh

**Description**: Refresh expired access token using refresh token

**Request Body**:
```json
{
  "refresh_token": "sbp_1234567890..."
}
```

**Response (200 OK)**:
```json
{
  "session": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "sbp_new_refresh_token...",
    "expires_in": 3600
  }
}
```

**Error Responses**:
- `400 Bad Request`: Missing or invalid refresh_token format
- `401 Unauthorized`: Invalid or expired refresh token
- `405 Method Not Allowed`: Non-POST request
- `500 Internal Server Error`: Server configuration error

**JWT Token Validation**:
New access token is validated for required claims before returning.

---

## JWT Token Structure

All access tokens follow JWT standard format with Supabase-specific claims:

```json
{
  "iss": "https://project.supabase.co",
  "sub": "550e8400-e29b-41d4-a716-446655440000",
  "aud": "authenticated",
  "exp": 1234567890,
  "iat": 1234567800,
  "email": "user@example.com",
  "email_confirmed_at": "2024-01-01T00:00:00Z",
  "app_metadata": {
    "provider": "email",
    "providers": ["email"]
  },
  "user_metadata": {
    "first_name": "John",
    "last_name": "Doe"
  },
  "role": "authenticated"
}
```

**Claims**:
- `sub`: User UUID (required)
- `email`: User email address (required)
- `aud`: Audience - "authenticated" for authenticated tokens (required)
- `exp`: Expiration timestamp in seconds (required)
- `iat`: Issued at timestamp in seconds
- `email_confirmed_at`: Email verification timestamp

---

## Environment Variables

### Required Environment Variables

**Development/Production**:
```env
# Public Supabase URL
SUPABASE_URL=https://your-project.supabase.co

# Public API Key (safe for client-side)
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIs...

# Server-side Service Role Key (NEVER expose to client)
SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Password reset redirect URL
SUPABASE_REDIRECT_TO=https://yourdomain.com/reset-password
```

---

## Security Considerations

### 1. Input Validation
- All email inputs validated with regex pattern
- Password minimum length enforced (8 characters)
- Names validated for length (1-100 characters)
- All required fields enforced

### 2. Rate Limiting
- Login endpoint: 5 attempts per IP per 15-minute window
- Prevents brute-force password attacks
- Per-IP tracking (not per-account) to prevent DoS

### 3. Error Messages
- Generic error messages returned to prevent user enumeration
- "Invalid email or password" instead of specific failures
- Password reset always returns success

### 4. Token Security
- JWT tokens validated for required claims immediately after generation
- Token expiration checked before returning to client
- Tokens not logged or printed in debug output

### 5. HTTPS Only
- All endpoints must use HTTPS in production
- Set-Cookie headers include Secure flag for production
- Authorization headers required for logout

### 6. CORS & CSRF
- Security headers added to all responses:
  - `X-Content-Type-Options: nosniff`
  - `X-Frame-Options: DENY`

---

## Implementation Stack

- **Framework**: Vercel Edge Runtime (Node.js 18+)
- **Auth Provider**: Supabase Auth (PostgreSQL-backed)
- **Token Format**: JWT (JSON Web Token)
- **Encryption**: PBKDF2 (Supabase Auth default)
- **Database**: PostgreSQL with RLS

---

## Testing

### Test Coverage

Unit tests validate:
- JWT token structure and claims validation
- Email format validation
- Password strength validation
- Name length constraints
- Rate limiting enforcement
- Session token format validation
- Refresh token validation

**Run Tests**:
```bash
npm run test:run -- src/__tests__/api.auth.test.ts
```

**Test Results**: 13 tests passing
- 4 JWT token validation tests
- 3 user registration validation tests
- 2 login rate limiting tests
- 1 password reset security test
- 1 token refresh validation test
- 2 session management tests

---

## Client-Side Integration

### Example: Registration
```typescript
const registerUser = async (email: string, password: string, firstName: string, lastName: string) => {
  const response = await fetch('/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName })
  });
  
  if (response.ok) {
    const { session } = await response.json();
    localStorage.setItem('access_token', session.access_token);
    localStorage.setItem('refresh_token', session.refresh_token);
  }
};
```

### Example: Login
```typescript
const loginUser = async (email: string, password: string) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (response.ok) {
    const { session } = await response.json();
    localStorage.setItem('access_token', session.access_token);
    localStorage.setItem('refresh_token', session.refresh_token);
    // Token expires in session.expires_in seconds
  }
};
```

### Example: Token Refresh
```typescript
const refreshToken = async () => {
  const refreshToken = localStorage.getItem('refresh_token');
  
  const response = await fetch('/api/auth/refresh', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token })
  });
  
  if (response.ok) {
    const { session } = await response.json();
    localStorage.setItem('access_token', session.access_token);
  }
};
```

---

## Troubleshooting

### "Server configuration error"
- Verify `SUPABASE_URL` and `SERVICE_ROLE_KEY` are set
- Check environment variables in deployment platform

### "Invalid login credentials"
- Email or password is incorrect
- Account may be suspended or disabled
- User may not have confirmed email

### "Too many login attempts"
- Rate limit exceeded for IP address
- Wait 15 minutes before attempting again
- Try from different network if possible

### "Invalid session token"
- Token is malformed or corrupted
- Token is missing required claims
- Token has already expired

---

## Future Enhancements

Planned improvements for Task 26 and beyond:
- [ ] Multi-factor authentication (2FA)
- [ ] Social login (Google, GitHub, etc.)
- [ ] Session management and device tracking
- [ ] Enhanced audit logging for auth events
- [ ] IP-based anomaly detection
- [ ] Account recovery options
