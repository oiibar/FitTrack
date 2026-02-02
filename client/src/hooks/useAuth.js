import { useState } from "react";
import { useAuthContext } from "./useAuthContext";
import { api } from "../api/api";

export const useAuth = (mode) => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();

  const authenticate = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const url = mode === "signup" ? "/user/signup" : "/user/login";
      const res = await api.post(url, { email, password });

      dispatch({ type: "LOGIN", payload: res.data });

      return true;
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { authenticate, isLoading, error };
};
