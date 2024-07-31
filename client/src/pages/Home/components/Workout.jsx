import React from "react";
import { FaTrash } from "react-icons/fa";
import { useWorkoutsContext } from "../../../hooks/useWorkoutsContext";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { BASE_URL } from "../../../apiurl";
import { formatDate } from "../helpers/date.helper";

const Workout = ({ workout }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();

  const handleDelete = async () => {
    const response = await fetch(`${BASE_URL}/workouts/${workout._id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error(data.error);
    } else {
      dispatch({ type: "DELETE_WORKOUT", payload: data });
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
