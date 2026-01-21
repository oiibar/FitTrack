import WorkoutList from "./components/WorkoutList";
import WorkoutForm from "./components/WorkoutForm";
import useWorkouts from "./hooks/useWorkouts";

const Home = () => {
  const { workouts, loading, refetchWorkouts } = useWorkouts();

  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center p-2">
      <WorkoutForm onFormSubmit={refetchWorkouts} />
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <WorkoutList workouts={workouts} />
      )}
    </div>
  );
};

export default Home;
