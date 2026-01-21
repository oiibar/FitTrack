import mongoose from "mongoose";
const { Schema } = mongoose;

const workoutSchema = new Schema(
  {
    title: { type: String, required: true },
    sets: { type: Number, required: true },
    reps: { type: Number, required: true },
    weight: { type: Number, required: true },
    type: { type: String, required: true },
    user_id: { type: String, required: true },
  },
  { timestamps: true }
);

const Workout = mongoose.model("Workout", workoutSchema);
export default Workout;
