// src/lib/auth-client.js
import { createAuthClient } from "better-auth/react";

const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

// Clean production-ready client utilizing your real MongoDB database connection fields
export const authClient = createAuthClient({ 
  baseURL: backendUrl,
  fetchOptions: {
    credentials: "include", // Required to share cross-origin cookie payloads between ports 3000 and 3001
  }
});