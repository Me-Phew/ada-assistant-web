export default defineNuxtRouteMiddleware(async (to, from) => {
  console.log(`[Auth Middleware] Running for path: ${to.fullPath}. From: ${from.fullPath}`);

  if (import.meta.client) {
    await new Promise((resolve) => setTimeout(resolve, 0));
  }

  const customer = useState("customer");
  console.log(
    "[Auth Middleware] Customer state (after potential yield):",
    JSON.stringify(customer.value),
  );

  if (!customer.value) {
    console.log("[Auth Middleware] No customer data in state. User not authenticated.");
    if (to.path !== "/login") {
      console.log(`[Auth Middleware] Redirecting to /login from ${to.fullPath}.`);
      return navigateTo("/login", { replace: true });
    } else {
      console.log(
        "[Auth Middleware] Already on /login or navigating to /login. No redirect action.",
      );
    }
  } else {
    console.log(
      "[Auth Middleware] Customer data found in state. User authenticated. Allowing navigation.",
    );
  }
});
