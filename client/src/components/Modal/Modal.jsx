import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useWorkoutsContext } from "../../hooks/useWorkoutsContext.js";
import axios from "axios";
import { BASE_URL } from "../../apiurl.js";
import { toast } from "react-toastify";

const Modal = ({ isOpen, onClose, workout }) => {
    const { dispatch } = useWorkoutsContext();
    const { user } = useAuthContext();

    const [formState, setFormState] = useState({
        title: "",
        weight: "",
        type: "",
        sets: "",
        reps: "",
    });

    // Prefill form when workout changes
    useEffect(() => {
        if (workout) {
            setFormState({
                title: workout.title,
                weight: workout.weight,
                type: workout.type,
                sets: workout.sets,
                reps: workout.reps,
            });
        }
    }, [workout]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.put(
                `${BASE_URL}/workouts/${workout._id}`,
                formState,
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            dispatch({ type: "UPDATE_WORKOUT", payload: response.data });
            toast.success("Workout updated");

            onClose();
        } catch (error) {
            toast.error(error.response?.data?.error || "Update failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <form
                onSubmit={handleUpdate}
                className="bg-slate-800 text-black p-6 rounded-lg w-96 flex flex-col gap-3"
            >
                <h2 className="text-xl font-bold text-green-400">Edit Workout</h2>

                <input name="title" value={formState.title} onChange={handleChange} />
                <input name="weight" value={formState.weight} onChange={handleChange} />
                <input name="type" value={formState.type} onChange={handleChange} />
                <input name="sets" value={formState.sets} onChange={handleChange} />
                <input name="reps" value={formState.reps} onChange={handleChange} />

                <div className="flex gap-2 mt-4 text-white">
                    <button type="submit" className="btn btn-green w-full">
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onClose}
                        className="btn btn-gray w-full"
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </div>
    );
};

export default Modal;
