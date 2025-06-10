export default defineNuxtPlugin(async (_nuxtApp) => {
  console.log("[Auth.client Plugin] Running...");
  const customerState = useCustomer();
  const token = localStorage.getItem("authToken");
  const initialAuthCheckCompleted = useState<boolean>("initialAuthCheckCompleted", () => false);

  console.log("[Auth.client Plugin] Initial customer state:", JSON.stringify(customerState.value));
  console.log("[Auth.client Plugin] Token from localStorage:", token ? "Found" : "Not Found");

  if (token) {
    if (!customerState.value) {
      console.log(
        "[Auth.client Plugin] Token found and customer state is empty. Attempting to restore session via useGetCustomer().",
      );
      try {
        await useGetCustomer();
        console.log(
          "[Auth.client Plugin] After useGetCustomer() call. Current customer state:",
          JSON.stringify(customerState.value),
        );
      } catch (error) {
        console.error(
          "[Auth.client Plugin] Error during useGetCustomer() call from plugin:",
          error,
        );
        if (customerState.value !== null) {
          customerState.value = null;
        }
        localStorage.removeItem("authToken");
      }
    } else {
      console.log(
        "[Auth.client Plugin] Token found, but customer state was already populated. Skipping fetch.",
        JSON.stringify(customerState.value),
      );
    }
  } else {
    console.log("[Auth.client Plugin] No token found. Ensuring customer state is null.");
    if (customerState.value !== null) {
      customerState.value = null;
    }
  }

  if (localStorage.getItem("justLoggedIn")) {
    console.log("[Auth.client Plugin] Removing 'justLoggedIn' flag.");
    localStorage.removeItem("justLoggedIn");
  }

  initialAuthCheckCompleted.value = true;
  console.log("[Auth.client Plugin] Finished, initialAuthCheckCompleted set to true.");
});
