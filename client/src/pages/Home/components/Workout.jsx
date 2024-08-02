import React from "react";
import { FaTrash } from "react-icons/fa";
import { useWorkoutsContext } from "../../../hooks/useWorkoutsContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import axios from "axios";
import { BASE_URL } from "../../../apiurl";
import { formatDate } from "../helpers/date.helper";
import { toast } from "react-toastify";

const Workout = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `${BASE_URL}/workouts/${workout._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      dispatch({ type: "DELETE_WORKOUT", payload: response.data });
      toast.success("Workout deleted successfully");
    } catch (error) {
      console.error(error.response?.data?.error || error.message);
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
      <p>{formatDate(workout.createdAt)}</p>
      <button onClick={handleDelete} className="btn btn-red">
        <FaTrash />
      </button>
    </div>
  );
};

export default Workout;
