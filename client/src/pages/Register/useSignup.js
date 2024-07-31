import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { BASE_URL } from "../../apiurl";

export const useSignup = () => {
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // Initialize with false
  const { dispatch } = useAuthContext();

  const signup = async (email, password) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${BASE_URL}/user/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle error case
        setError(data.error);
        return false;
      }

      // Handle successful signup
      localStorage.setItem("user", JSON.stringify(data));
      dispatch({ type: "LOGIN", payload: data });
      return true;
    } catch (error) {
      // Handle any other errors (e.g., network issues)
      setError(error.message);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { signup, isLoading, error };
};
