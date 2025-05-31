import { useUrl } from "~/composables/register";

/**
 * Service for handling Spotify integration
 */
export default {
  /**
   * Checks if the user is connected to Spotify
   * @returns Promise with connection status
   */
  async getConnectionStatus() {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    try {
      const cachedStatus = localStorage.getItem("spotifyConnected");
      if (cachedStatus === "true") {
        console.log("Using cached Spotify connection status: connected");
        return { authorized: true };
      }

      console.log("Checking Spotify connection status from API");
      const response = await $fetch<{ authorized: boolean }>("/spotify/status", {
        method: "GET",
        baseURL,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.authorized) {
        localStorage.setItem("spotifyConnected", "true");
      } else {
        localStorage.removeItem("spotifyConnected");
      }

      return response;
    } catch (error) {
      console.error("Error checking Spotify connection status:", error);
      return { authorized: false };
    }
  },

  /**
   * Initiates Spotify authorization
   * Redirects the user to Spotify's authorization page
   * Includes authentication token to validate user
   */
  async initiateAuth() {
    try {
      const baseURL = useUrl();
      const token = localStorage.getItem("authToken");

      if (!token) {
        console.error("No authentication token found");
        window.location.href = "/login";
        return;
      }

      window.location.href = `${baseURL}/spotify/auth?token=${token}`;
    } catch (error) {
      console.error("Failed to initiate Spotify authorization:", error);
    }
  },

  /**
   * Disconnects the user's Spotify account
   * @returns Promise with disconnect result
   */
  async disconnectSpotify() {
    const baseURL = useUrl();
    const token = localStorage.getItem("authToken");

    try {
      const response = await $fetch("/spotify/disconnect", {
        method: "POST",
        baseURL,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      localStorage.removeItem("spotifyConnected");

      return response;
    } catch (error) {
      console.error("Error disconnecting Spotify:", error);
      throw error;
    }
  },
};
