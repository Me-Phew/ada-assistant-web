interface IAuthData {
  email: string;
  password: string;
  name?: string;
}

interface Customer {
  id?: string;
  email: string;
  name?: string;
  avatar?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const useUrl = () => {
  const config = useRuntimeConfig();

  return `${config.public.apiBaseUrl}api`;
};

export const useCustomer = () => useState<Customer | null>("customer");

/**
 * Method used to create a customer
 * @param data - register credentials (email, password, name)
 * @returns Created customer || null
 */
export const useRegister = async (data: IAuthData) => {
  try {
    // get base url
    const baseURL = useUrl();

    // send request to create customer
    const response = await $fetch<any>("/users/register", {
      method: "POST",
      body: data,
      baseURL,
      credentials: "include",
    });

    // Store user data and token
    const customer = useCustomer();
    if (response.user) {
      customer.value = response.user;

      // Store token if provided
      if (response.token) {
        localStorage.setItem("authToken", response.token);
      }
    }

    return response.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Method used to log a user in
 * @param data - login credentials (email, password)
 * @returns Logged in user
 */
export const useLogin = async (data: IAuthData) => {
  try {
    const baseURL = useUrl();

    const customer = useCustomer();

    const requestBody = {
      login: data.email,
      password: data.password,
    };

    console.log("Sending login request to:", baseURL + "/auth/login");
    const response = await $fetch<any>("/auth/login", {
      method: "POST",
      body: requestBody,
      baseURL,
      credentials: "include",
    });

    console.log("Login response received:", response);

    if (response.user) {
      console.log("Setting customer state with user data");
      customer.value = response.user;
    } else {
      console.warn("No user data in login response");
    }

    if (response.accessToken) {
      console.log("Storing auth token in localStorage");
      localStorage.setItem("authToken", response.accessToken);
    } else if (response.token) {
      console.log("Storing auth token in localStorage (using token field)");
      localStorage.setItem("authToken", response.token);
    } else {
      console.warn("No token in login response");
    }

    return response.user;
  } catch (error) {
    console.error("Login function error:", error);
    throw error;
  }
};

/**
 * Method used to load the logged in user
 * @returns Logged in user or null
 */
export const useGetCustomer = async () => {
  const customer = useCustomer();
  const baseURL = useUrl();

  try {
    const token = localStorage.getItem("authToken");
    if (!token) {
      console.log("[useGetCustomer] No auth token found in localStorage.");
      if (customer.value !== null) customer.value = null;
      return null;
    }

    console.log("[useGetCustomer] Found token, fetching user data from /auth/me");

    const headers = {
      Authorization: `Bearer ${token}`,
    };

    const response = await $fetch<{ user: Customer | null }>("/auth/me", {
      method: "GET",
      baseURL,
      credentials: "include",
      headers,
    });

    console.log("[useGetCustomer] User data response:", response);

    if (response && response.user) {
      customer.value = response.user;
      console.log(
        "[useGetCustomer] Customer state set with user data:",
        JSON.stringify(response.user),
      );
      if (response.user.role) {
        localStorage.setItem("userRole", response.user.role);
      }
      return response.user;
    } else {
      console.warn(
        "[useGetCustomer] No user data in response or response structure unexpected. Clearing customer state and token.",
      );
      customer.value = null;
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
      return null;
    }
  } catch (error: any) {
    console.error("[useGetCustomer] Error fetching user data:", error.message);
    if (customer.value !== null) customer.value = null;

    const status = error?.response?.status;
    if (status === 401 || status === 403) {
      console.log(`[useGetCustomer] Authentication error (${status}), removing token.`);
      localStorage.removeItem("authToken");
      localStorage.removeItem("userRole");
    }
    return null;
  }
};

/**
 * Method used to log a customer out (client-side only)
 */
export const useLogout = async () => {
  try {
    localStorage.removeItem("authToken");
    const customer = useCustomer();
    customer.value = null;

    return navigateTo("/login");
  } catch (error) {
    console.error("Logout error:", error);
    localStorage.removeItem("authToken");
    const customer = useCustomer();
    customer.value = null;

    return navigateTo("/login");
  }
};
