import WorkoutList from "../components/Workouts/WorkoutList.jsx";
import WorkoutForm from "../components/Workouts/WorkoutForm.jsx";
import useWorkouts from "../hooks/useWorkouts.js";
import Modal from "../components/Modal/Modal.jsx";

const WorkoutsPage = () => {
  const { workouts, loading, refetchWorkouts } = useWorkouts();

  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center p-2">
      <WorkoutForm onFormSubmit={refetchWorkouts} />
      {loading ? (
        <p className="text-white">Loading...</p>
      ) : (
        <WorkoutList workouts={workouts} />
      )}
        <Modal onUpdate={refetchWorkouts} />
    </div>
  );
};

export default WorkoutsPage;
