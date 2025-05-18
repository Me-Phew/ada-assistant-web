export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const customer = useState("customer");

  // If we already have customer data in state, allow navigation
  if (customer.value) {
    return;
  }

  if (import.meta.client) {
    const token = localStorage.getItem("authToken");

    // No token found, redirect to login
    if (!token) {
      return navigateTo("/login");
    }

    try {
      // Try to get customer data using the token
      const user = await useGetCustomer();

      // If we couldn't get user data, redirect to login
      if (!user) {
        localStorage.removeItem("authToken");
        return navigateTo("/login");
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
      localStorage.removeItem("authToken");
      return navigateTo("/login");
    }
  }
});
