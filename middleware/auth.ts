export default defineNuxtRouteMiddleware(async (_to, _from) => {
  const customer = useState("customer");

  // If we already have customer data in state, allow navigation
  if (customer.value) {
    return;
  }

  try {
    // Try to get customer data from server/token
    const user = await useGetCustomer();

    // If we couldn't get user data, redirect to login
    if (!user) {
      return navigateTo("/login");
    }
  } catch (error) {
    // On error, redirect to login
    console.error("Auth middleware error:", error);
    return navigateTo("/login");
  }
});
