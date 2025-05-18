export default defineNuxtPlugin(async (_nuxtApp) => {
  if (import.meta.client) {
    try {
      console.log("Auth plugin running, checking for stored token...");

      const token = localStorage.getItem("authToken");
      if (token) {
        console.log("Found auth token, attempting to restore session");

        try {
          // Try to get current user data using the stored token
          const user = await useGetCustomer();
          console.log("Session restoration result:", user ? "Success" : "Failed");

          const justLoggedIn = localStorage.getItem("justLoggedIn");
          if (justLoggedIn) {
            localStorage.removeItem("justLoggedIn");
          }
        } catch (e) {
          console.error("Failed to restore session:", e);
        }
      } else {
        console.log("No auth token found");
      }
    } catch (error) {
      console.error("Error in auth plugin:", error);
    }
  }
});
