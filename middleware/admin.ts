export default defineNuxtRouteMiddleware(async (to, _from) => {
  console.log(`[Admin Middleware] Running for path: ${to.fullPath}`);
  const customer = useState("customer");
  console.log("[Admin Middleware] Customer state from useState:", JSON.stringify(customer.value));

  const initialAuthCheckCompleted = useState<boolean>("initialAuthCheckCompleted", () => false);

  if (!initialAuthCheckCompleted.value) {
    console.log("[Auth Global Middleware] Initial auth check not completed. Allowing navigation.");
    return;
  }

  if (!customer.value) {
    console.log("[Admin Middleware] No customer data in state. Redirecting to /login.");
    return navigateTo("/login");
  }

  if (customer.value.role !== "admin") {
    console.log(
      `[Admin Middleware] User role is "${customer.value.role}". Not admin. Redirecting to /dashboard.`,
    );
    return navigateTo("/dashboard");
  }

  console.log("[Admin Middleware] Admin access granted.");
});
