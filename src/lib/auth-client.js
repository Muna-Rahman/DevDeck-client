
import { createAuthClient } from "better-auth/react";

// Automatically selects Vercel production API URL, or falls back to local port 3001
const getBaseURL = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  return "http://localhost:3001"; 
};
const realClient = typeof window !== "undefined" 
  ? createAuthClient({ baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000" })
  : null;

// 2. Safe frontend isolation mock engine with explicit credential validation
const mockClient = {
  useSession: () => {
    const isLoggedIn = typeof window !== "undefined" && localStorage.getItem("devdeck_mock_session") === "true";
    
    return {
      data: isLoggedIn ? {
        user: {
          name: "Muna Nemme",
          email: "munanemme@gmail.com",
          image: "https://api.dicebear.com/7.x/open-peeps/svg?seed=AlexDevDeck"
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

// Fixed: Now cleanly maps to realClient when NEXT_PUBLIC_MOCK_MODE is not "true"
export const authClient = process.env.NEXT_PUBLIC_MOCK_MODE === "true" ? mockClient : realClient;