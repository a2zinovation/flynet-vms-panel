// src/services/auth.js
// Hybrid API: mock enabled but easily switch to real API

const API_BASE = "https://your-real-api.com"; // <-- CHANGE THIS

// Toggle mock mode on/off
const USE_MOCK = false;  // true = simulate backend, false = real backend

// Simulated delay (for loading UI realism)
const wait = (ms) => new Promise((res) => setTimeout(res, ms));

export const authService = {
  login: async (email, password) => {
    if (USE_MOCK) {
      await wait(800);

      if (email === "test@gmail.com" && password === "123456") {
        return {
          success: true,
          token: "MOCK_TOKEN_123",
          user: {
            id: 1,
            name: "Test User",
            email,
          },
        };
      }

      return { success: false, message: "Invalid credentials" };
    }

    // REAL API ======================================
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      return data; // must contain { token, user }
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  requestPasswordReset: async (email) => {
    if (USE_MOCK) {
      await wait(700);
      return { success: true };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },

  loginWithQR: async (qrToken) => {
    if (USE_MOCK) {
      await wait(1200);
      return {
        success: true,
        token: "QR_MOCK_TOKEN_999",
        user: {
          id: 1,
          name: "QR User",
          email: "qr@user.com",
        },
      };
    }

    try {
      const res = await fetch(`${API_BASE}/auth/qr-login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qrToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      return data;
    } catch (err) {
      return { success: false, message: err.message };
    }
  },
};
