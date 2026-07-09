// src/lib/auth-client.js
import { createAuthClient } from "better-auth/react";

const getBaseURL = () => {
  
  if (typeof window !== "undefined") {
    return window.location.origin; 
  }
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
};

const realClient = createAuthClient({ 
  baseURL: getBaseURL(),
  fetchOptions: {
    credentials: "include", 
  }
});

// Safe frontend isolation mock engine with dynamic parameters (used only when NEXT_PUBLIC_MOCK_MODE=true)
const mockClient = {
  useSession: () => {
    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("devdeck_mock_session") === "true";
    
    return {
      data: isLoggedIn ? {
        user: {
          name: "Muna Nemme",
          email: "munanemme@gmail.com",
          image: `https://api.dicebear.com/7.x/open-peeps/svg?seed=AlexDevDeck`
        }
      } : null,
      isPending: false,
      error: null
    };
  },
  signOut: async () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("devdeck_mock_session");
    }
    console.log("Mock Mode: Sign out intercepted cleanly.");
    return { success: true };
  },
  signIn: {
    email: async ({ email, password }) => {
      console.log("Mock Mode: Intercepting credential validation loop...");
      if (email === "devdeck@gmail.com" && password === "12345678") {
        if (typeof window !== "undefined") {
          localStorage.setItem("devdeck_mock_session", "true");
        }
        return { 
          data: { user: { name: "Alex Chen", email: "devdeck@gmail.com" } }, 
          error: null 
        };
      } else {
        return { 
          data: null, 
          error: { message: "Invalid credentials. Use devdeck@gmail.com // 12345678" } 
        };
      }
    }
  },
  signUp: {
    email: async ({ email, password, name }) => {
      console.log("Mock Mode: Sign up simulation...");
      return { data: { user: { name, email } }, error: null };
    }
  }
};

// Dynamically exports the appropriate client engine depending strictly on environment configuration
export const authClient = process.env.NEXT_PUBLIC_MOCK_MODE === "true" ? mockClient : realClient;