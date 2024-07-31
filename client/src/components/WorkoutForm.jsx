import { useState } from "react";
import { useWorkoutsContext } from "../hooks/useWorkoutsContext";
import { useAuthContext } from "../hooks/useAuthContext";
import { BASE_URL } from "../apiurl";

const WorkoutForm = () => {
  const { dispatch } = useWorkoutsContext();
  const [title, setTitle] = useState("");
  const [weight, setWeight] = useState("");
  const [type, setType] = useState("");
  const [sets, setSets] = useState("");
  const [reps, setReps] = useState("");
  const [err, setErr] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);
  const { user } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setErr("Log in first");
      return;
    }

    const workout = { title, sets, reps, type, weight };
    const response = await fetch(`${BASE_URL}/workouts`, {
      method: "POST",
      body: JSON.stringify(workout),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user.token}`,
      },
    });

    const json = await response.json();

    if (!response.ok) {
      setErr(json.error);
      setEmptyFields(json.emptyFields);
    }

    if (response.ok) {
      setTitle("");
      setWeight("");
      setReps("");
      setSets("");
      setType("");
      setErr(null);
      dispatch({ type: "CREATE_WORKOUT", payload: json });
      setEmptyFields([]);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Add a New Workout</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full p-6 border rounded-lg shadow-lg bg-gray-800 text-white"
        onSubmit={handleSubmit}
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            name="title"
            className={`input ${
              emptyFields.includes("title") ? "border-red-500" : ""
            }`}
            onChange={(e) => setTitle(e.target.value)}
            value={title}
            placeholder="Bench Press"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="weight">Weight (kg)</label>
          <input
            type="text"
            name="weight"
            className={`input ${
              emptyFields.includes("weight") ? "border-red-500" : ""
            }`}
            onChange={(e) => setWeight(e.target.value)}
            value={weight}
            placeholder="80"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="type">Type</label>
          <input
            type="text"
            name="type"
            className={`input ${
              emptyFields.includes("type") ? "border-red-500" : ""
            }`}
            onChange={(e) => setType(e.target.value)}
            value={type}
            placeholder="Chest"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="sets">Sets</label>
          <input
            type="text"
            name="sets"
            className={`input ${
              emptyFields.includes("sets") ? "border-red-500" : ""
            }`}
            onChange={(e) => setSets(e.target.value)}
            value={sets}
            placeholder="4"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="reps">Reps</label>
          <input
            type="text"
            name="reps"
            className={`input ${
              emptyFields.includes("reps") ? "border-red-500" : ""
            }`}
            onChange={(e) => setReps(e.target.value)}
            value={reps}
            placeholder="10"
          />
        </div>

        <button type="submit" className="btn btn-green">
          Submit
        </button>

        {err && <div className="error mt-4 text-red-500 col-span-2">{err}</div>}
      </form>
    </div>
  );
};

export default WorkoutForm;
