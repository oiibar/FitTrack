import { useState } from "react";
import { useAuthContext } from "../../../hooks/useAuthContext";
import { useWorkoutsContext } from "../../../hooks/useWorkoutsContext";
import axios from "axios";
import { BASE_URL } from "../../../apiurl";
import { toast } from "react-toastify";

const WorkoutForm = ({ onFormSubmit }) => {
  const { dispatch } = useWorkoutsContext();
  const { user } = useAuthContext();
  const [formState, setFormState] = useState({
    title: "Bench Press",
    weight: "80",
    type: "Chest",
    sets: "4",
    reps: "10",
  });
  const [error, setError] = useState(null);
  const [emptyFields, setEmptyFields] = useState([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const validateForm = () => {
    const fields = Object.keys(formState);
    const newEmptyFields = fields.filter((field) => !formState[field].trim());
    if (newEmptyFields.length) {
      setEmptyFields(newEmptyFields);
      setError("Please fill in all required fields.");
      toast.error("Please fill in all required fields.");
      return false;
    }
    setEmptyFields([]);
    setError(null);
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const response = await axios.post(`${BASE_URL}/workouts`, formState, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      dispatch({ type: "ADD_WORKOUT", payload: response.data });
      toast.success("Workout added successfully");
      setFormState({ title: "", weight: "", type: "", sets: "", reps: "" });
      setError(null);
      setEmptyFields([]);
      if (onFormSubmit) {
        onFormSubmit();
      }
    } catch (error) {
      setError(error.response?.data?.error || error.message);
      setEmptyFields(error.response?.data?.emptyFields || []);
      toast.error("Login first to add a workout");
    }
  };

  const fieldLabels = {
    title: "Title",
    weight: "Weight (kg)",
    type: "Type",
    sets: "Sets",
    reps: "Reps",
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl font-bold mb-6">Add a New Workout</h1>
      <form
        className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-lg w-full p-6 border rounded-lg shadow-lg bg-gray-800 text-white"
        onSubmit={handleSubmit}
      >
        {Object.entries(fieldLabels).map(([name, label]) => (
          <div key={name} className="flex flex-col gap-2">
            <label htmlFor={name}>{label}</label>
            <input
              type="text"
              name={name}
              id={name}
              value={formState[name]}
              onChange={handleChange}
              placeholder={label}
              className={`input ${
                emptyFields.includes(name) ? "border-red-500" : ""
              }`}
            />
          </div>
        ))}
        <button type="submit" className="btn btn-green">
          Submit
        </button>
      </form>
    </div>
  );
};

export default WorkoutForm;
