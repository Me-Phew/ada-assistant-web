export default defineNuxtRouteMiddleware(async (to, from) => {
  const customer = useState("customer");
  console.log(
    `[Auth Global Middleware] Path: ${to.fullPath}. Customer state: ${JSON.stringify(customer.value)}`,
  );

  const publicPages = ["/", "/login", "/register", "/forgot-password", "/spotifycallback"];
  const isPublicPage = publicPages.includes(to.path) || to.path.startsWith("/reset-password");

  if (!customer.value) {
    if (!isPublicPage) {
      console.log(
        `[Auth Global Middleware] No customer. Redirecting to /login from ${to.fullPath}.`,
      );
      return navigateTo("/login", { replace: true });
    }
    console.log("[Auth Global Middleware] No customer, but path is public. Allowing.");
  } else {
    if (
      isPublicPage &&
      to.path !== "/" &&
      to.path !== "/reset-password" &&
      to.path !== "/spotifycallback"
    ) {
      console.log(
        `[Auth Global Middleware] Authenticated user on a public page (${to.path}). Redirecting to appropriate dashboard.`,
      );
      const destination = customer.value.role === "admin" ? "/admin-dashboard" : "/dashboard";
      return navigateTo(destination, { replace: true });
    }
    console.log("[Auth Global Middleware] Customer authenticated. Allowing navigation.");
  }
});
