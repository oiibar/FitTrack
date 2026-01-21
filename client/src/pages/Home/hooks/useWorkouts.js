import { useState, useEffect, useCallback } from "react";
import { useWorkoutsContext } from "../../../hooks/useWorkoutsContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { BASE_URL } from "../../../apiurl";

const useWorkouts = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [loading, setLoading] = useState(false);

  const fetchWorkouts = useCallback(async () => {
    if (!user || !user.token) return;

    setLoading(true);
    try {
      const response = await fetch(`${BASE_URL}/workouts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();

      if (response.ok) {
        dispatch({ type: "SET_WORKOUTS", payload: data });
      } else {
        console.error(data.error);
      }
    } catch (error) {
      console.error("Failed to fetch workouts:", error);
    } finally {
      setLoading(false);
    }
  }, [user, dispatch]);

  useEffect(() => {
    fetchWorkouts();
  }, [fetchWorkouts]);

  const refetchWorkouts = async () => {
    await fetchWorkouts();
  };

  return { workouts, loading, refetchWorkouts };
};

export default useWorkouts;
