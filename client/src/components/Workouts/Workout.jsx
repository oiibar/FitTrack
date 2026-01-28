import { FaTrash, FaEdit } from "react-icons/fa";
import { useState } from "react";
import { useWorkoutsContext } from "../../hooks/useWorkoutsContext.js";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import axios from "axios";
import { BASE_URL } from "../../apiurl.js";
import { formatDate } from "../../helpers/date.helper.ts";
import { toast } from "react-toastify";
import Modal from "../Modal/Modal.jsx";

const Workout = ({ workout }) => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();
    const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = async () => {
      dispatch({ type: "DELETE_WORKOUT", payload: workout });

      try {
          await axios.delete(`${BASE_URL}/workouts/${workout._id}`, {
              headers: {
                  Authorization: `Bearer ${user.token}`,
              },
          });

          toast.success("Workout deleted");
      } catch (error) {
          toast.error(error.response?.data?.error || "Delete failed");
      }
  };

  return (
    <div className="flex flex-col w-full sm:w-1/4 gap-2 p-4 bg-slate-800 rounded-md">
      <h4 className="text-green-400 font-bold text-xl">{workout.title}</h4>
      <p>
        <strong>Load: </strong>
        {workout.weight} kg
      </p>
      <p>
        <strong>Sets: </strong>
        {workout.sets} x {workout.reps}
      </p>
      <p>
        <strong>Type: </strong>
        {workout.type}
      </p>
        <p>
            <strong>Notes:</strong>
        </p>
        {workout.notes && workout.notes.length > 0 ? (
            <ul className="ml-4 list-disc space-y-1">
                {workout.notes.flat().map((note, index) => (
                    <li key={index} className="text-gray-200">
                        {note}
                    </li>
                ))}
            </ul>
        ) : (
            <p className="text-gray-400 ml-2">No notes yet.</p>
        )}


        <p>{formatDate(workout.createdAt)}</p>
          <button onClick={handleDelete} className="btn btn-red">
              <FaTrash />
          </button>
        <button
            onClick={() => setIsModalOpen(true)}
            className="btn btn-green"
        >
            <FaEdit />
        </button>
        <Modal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            workout={workout}
        />
    </div>
  );
};

export default Workout;
