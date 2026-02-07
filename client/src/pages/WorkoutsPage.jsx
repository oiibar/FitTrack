import WorkoutList from "../components/Workouts/WorkoutList.jsx";
import WorkoutForm from "../components/Workouts/WorkoutForm.jsx";
import useWorkouts from "../hooks/useWorkouts.js";
import Modal from "../components/Modal/Modal.jsx";
import AdminPanel from "../components/Admin/AdminPanel.jsx";
import { useAuthContext } from "../hooks/useAuthContext";

const WorkoutsPage = () => {
  const { workouts, loading, refetchWorkouts } = useWorkouts();
  const { user } = useAuthContext();

  const isAdmin = user && String(user.role || '').toLowerCase() === 'admin';

  return (
    <div className="flex flex-col gap-8 items-center justify-center text-center p-2">
      {isAdmin && (
        <div className="w-full flex flex-col items-center">
          <div className="px-4 py-2 bg-yellow-500 text-slate-900 rounded font-bold mb-4">ADMIN MODE</div>
          <AdminPanel />
        </div>
      )}

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
