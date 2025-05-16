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

    const response = await $fetch<any>("/auth/login", {
      method: "POST",
      body: requestBody,
      baseURL,
      credentials: "include",
    });

    if (response.user) {
      customer.value = response.user;
    }

    if (response.token) {
      localStorage.setItem("authToken", response.token);
    }

    return response.user;
  } catch (error) {
    throw error;
  }
};

/**
 * Method used to load the logged in user
 * @returns Logged in user or null
 */
export const useGetCustomer = async () => {
  const customer = useCustomer();
  // get base url
  const baseURL = useUrl();

  try {
    // Get the authentication token
    const token = localStorage.getItem("authToken");
    if (!token) {
      customer.value = null;
      return null;
    }

    const headers: Record<string, string> = {
      ...useRequestHeaders(["cookie"]),
      Authorization: `Bearer ${token}`,
    };

    const response = await $fetch<any>("/auth/me", {
      method: "GET",
      baseURL,
      // Include the cookie on the client side
      credentials: "include",
      // Send Authorization header
      headers,
    });

    // Check if the response has user data
    if (!response?.user) {
      customer.value = null;
      return null;
    }

    // set the customer
    customer.value = response.user;
    return response.user;
  } catch (error) {
    customer.value = null;
    return null;
  }
};

/**
 * Method used to log a customer out (client-side only)
 */
export const useLogout = async () => {
  try {
    // Clear local storage and state
    localStorage.removeItem("authToken");
    const customer = useCustomer();
    customer.value = null;

    // Navigate to login page
    return navigateTo("/login");
  } catch (error) {
    console.error("Logout error:", error);
    // Even if an error occurs, still try to clear data
    localStorage.removeItem("authToken");
    const customer = useCustomer();
    customer.value = null;

    // Navigate to login page even if there's an error
    return navigateTo("/login");
  }
};
