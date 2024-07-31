import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Workout from "../components/Workout";
import WorkoutForm from "../components/WorkoutForm";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { BASE_URL } from "../apiurl";

const Home = () => {
  const { workouts, dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchWorkouts = async () => {
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
      }
    };

    fetchWorkouts();
  }, [dispatch, user, navigate]);

  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center p-2">
      <WorkoutForm />
      <div className="flex flex-wrap justify-center gap-4 w-full">
        {workouts &&
          workouts.map((workout) => (
            <Workout key={workout._id} workout={workout} />
          ))}
      </div>
    </div>
  );
};

export default Home;
