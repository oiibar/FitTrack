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

    const [note, setNote] = useState(""); // New state for note

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
        } catch (error) {
            toast.error(error.response?.data?.error || "Update failed");
        }
    };

    const handleAddNote = async () => {
        if (!note || note.trim() === "") return toast.error("Note cannot be empty");

        try {
            await axios.patch(
                `${BASE_URL}/workouts/${workout._id}/note`,
                { note },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                }
            );

            dispatch({ type: "ADD_NOTE", payload: { workoutId: workout._id, note } });
            toast.success("Note added");
            setNote(""); // clear input
        } catch (error) {
            toast.error(error.response?.data?.error || "Failed to add note");
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <form
                onSubmit={handleUpdate}
                className="bg-slate-800 text-black p-6 rounded-lg w-96 flex flex-col gap-3"
            >
                <h2 className="text-xl font-bold text-green-400">Edit Workout</h2>

                <input name="title" value={formState.title} onChange={handleChange} placeholder="Title" />
                <input name="weight" value={formState.weight} onChange={handleChange} placeholder="Weight" />
                <input name="type" value={formState.type} onChange={handleChange} placeholder="Type" />
                <input name="sets" value={formState.sets} onChange={handleChange} placeholder="Sets" />
                <input name="reps" value={formState.reps} onChange={handleChange} placeholder="Reps" />

                {/* Add Notes Section */}
                <div className="flex gap-2 text-white">
                    <input
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder="Add a note"
                        className="flex-1 p-2 rounded bg-slate-700 text-white"
                    />
                    <button
                        type="button"
                        onClick={handleAddNote}
                        className="btn btn-green"
                    >
                        Add Note
                    </button>
                </div>

                <div className="flex gap-2 mt-4 text-white">
                    <button type="submit" className="btn btn-green w-full">
                        Save Workout
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
