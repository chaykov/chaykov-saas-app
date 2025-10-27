# API Security Configuration

This document explains the security measures implemented to protect the API endpoints.

## Security Layers

### 1. CORS (Cross-Origin Resource Sharing)

The API is configured to only accept requests from authorized origins:

- **Development**: `http://localhost:3000`
- **Production**: Set via `FRONTEND_URL` environment variable

**Configuration** (`src/server.ts`):
```typescript
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));
```

### 2. API Key Authentication

Protected endpoints require an API key in the request headers.

**Protected Routes**:
- `/api/posts/*` - All post operations
- `/api/comments/*` - All comment operations
- `/api/users/*` - All user operations

**Public Routes** (no API key required):
- `/api/auth/*` - Login and registration
- `/health` - Health check endpoint

**How it works**:
1. Client includes `x-api-key` header in requests
2. Middleware validates against `API_KEY` environment variable
3. Returns 401 if key is missing, 403 if invalid

## Environment Variables

### Backend (`.env.local`)

```bash
# Database
DATABASE_URL=postgresql://user:password@host:5432/dbname
NODE_ENV=production

# API Security
API_KEY=your-secure-api-key-change-this-in-production
FRONTEND_URL=http://localhost:3000
```

### Frontend (`apps/user-application/trv1/.env.local`)

```bash
NODE_ENV="development"
VITE_API_URL=http://localhost:3001/api
VITE_API_KEY=your-secure-api-key-change-this-in-production
```

## Setting Up Security

### 1. Generate a Secure API Key

Generate a strong random API key:

```bash
# Using OpenSSL
openssl rand -hex 32

# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Update Environment Variables

**Backend** (`.env.local`):
```bash
API_KEY=your-generated-key-here
FRONTEND_URL=https://your-production-domain.com
```

**Frontend** (`.env.local`):
```bash
VITE_API_KEY=your-generated-key-here
```

**IMPORTANT**: Use the same API key in both frontend and backend!

### 3. Secure Your Keys

- Never commit `.env.local` files to version control
- Use different API keys for development and production
- Rotate API keys periodically
- Use environment variables in production (not `.env` files)

## Frontend Implementation

The frontend automatically includes the API key in all requests via the `getHeaders()` helper:

```typescript
// src/lib/api.ts
const API_KEY = import.meta.env.VITE_API_KEY;

const getHeaders = (additionalHeaders?: Record<string, string>) => ({
  "x-api-key": API_KEY,
  ...additionalHeaders,
});

// Usage
const response = await fetch(`${API_URL}/posts`, {
  headers: getHeaders(),
});
```

## Testing Security

### Test without API key (should fail):
```bash
curl http://localhost:3001/api/posts
# Expected: 401 Unauthorized
```

### Test with valid API key (should succeed):
```bash
curl -H "x-api-key: your-api-key" http://localhost:3001/api/posts
# Expected: 200 OK with posts data
```

### Test from unauthorized origin (should fail):
```bash
curl -H "Origin: https://malicious-site.com" \
     -H "x-api-key: your-api-key" \
     http://localhost:3001/api/posts
# Expected: CORS error
```

## Production Deployment

1. **Never expose the API key in client-side code** - It's okay for development, but in production consider:
   - Using session-based authentication instead
   - Implementing JWT tokens
   - Using OAuth2 for third-party access

2. **Set production environment variables** on your hosting platform:
   - Vercel/Netlify: Use environment variable settings in dashboard
   - Docker: Use secrets management
   - Kubernetes: Use ConfigMaps and Secrets

3. **Enable HTTPS** - Always use HTTPS in production

4. **Consider additional security measures**:
   - Rate limiting (e.g., `express-rate-limit`)
   - Request validation
   - Helmet.js for security headers
   - API request logging

## Troubleshooting

### "API key is required" error
- Check that `VITE_API_KEY` is set in frontend `.env.local`
- Verify the frontend is including the header in requests
- Check browser DevTools Network tab to see if header is present

### "Invalid API key" error
- Ensure API keys match in both frontend and backend
- Check for extra spaces or quotes in `.env.local` files
- Restart both frontend and backend after changing env variables

### CORS errors
- Verify frontend URL matches `allowedOrigins` in `server.ts`
- Check that `FRONTEND_URL` is set correctly in backend `.env.local`
- Ensure the request includes the correct `Origin` header

## Migration Notes

If you have an existing deployment without API keys:

1. API key check is backwards compatible (skips validation if `API_KEY` not set)
2. Deploy backend with `API_KEY` set
3. Update frontend to include API key
4. Verify everything works
5. Keys are now required for all protected endpoints
