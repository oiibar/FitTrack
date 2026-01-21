import { useState } from "react";
import axios from "axios";
import { useAuthContext } from "../../hooks/useAuthContext";
import { BASE_URL } from "../../apiurl";

export const useAuth = (mode) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const authenticate = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const url =
        mode === "signup"
          ? `${BASE_URL}/signup`
          : `${BASE_URL}/login`;
      const response = await axios.post(url, { email, password });

      const data = response.data;
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });

      return true;
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { authenticate, isLoading, error };
};
