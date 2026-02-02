import { useState, useEffect, useCallback } from "react";
import { useWorkoutsContext } from "./useWorkoutsContext";
import { useAuthContext } from "./useAuthContext";
import { api } from "../api/api";

const useWorkouts = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    if (!user) return;

    setLoading(true);
    try {
      const response = await api.get("/workouts");
      dispatch({ type: "SET_WORKOUTS", payload: response.data });
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
    } finally {
      setLoading(false);
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  return { workouts, loading, refetchWorkouts: fetchWorkouts };
};

export default useWorkouts;
