// import Workout from "../models/workout.model.js";
// import mongoose from "mongoose";
//
// const getWorkouts = async (req, res) => {
//   const user_id = req.user._id;
//   const workouts = await Workout.find({ user_id }).sort({ createdAt: -1 });
//   res.status(200).json(workouts);
// };
//
// const getWorkout = async (req, res) => {
//   const { id } = req.params;
//
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such workout" });
//   }
//
//   const workout = await Workout.findById(id);
//
//   if (!workout) {
//     return res.status(404).json({ error: "No such workout" });
//   }
//   res.status(200).json(workout);
// };
//
// const searchWorkouts = async (req, res) => {
//   try {
//     const user_id = req.user._id;
//     const { q, type } = req.query;
//
//     const query = { user_id };
//
//     if (q && q.trim() !== "") {
//       query.$or = [
//         { title: { $regex: q, $options: "i" } },
//       ];
//     }
//
//     if (type && type.trim() !== "") {
//       query.type = { $regex: type, $options: "i" };
//     }
//
//     const workouts = await Workout.find(query).sort({ createdAt: -1 });
//
//     res.status(200).json({
//       workouts,
//       searchParams: {
//         q: q || "",
//         type: type || ""
//       }
//     });
//
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
//
// const createWorkout = async (req, res) => {
//   const { title, sets, reps, weight, type } = req.body;
//
//   let emptyFields = [];
//
//   if (!title) {
//     emptyFields.push("title");
//   }
//   if (!sets) {
//     emptyFields.push("sets");
//   }
//   if (!reps) {
//     emptyFields.push("reps");
//   }
//   if (!weight) {
//     emptyFields.push("weight");
//   }
//   if (!type) {
//     emptyFields.push("type");
//   }
//   if (emptyFields.length > 0) {
//     return res
//         .status(400)
//         .json({ error: "Fill in all the fields" }, emptyFields);
//   }
//
//   try {
//     const user_id = req.user._id;
//     const workout = await Workout.create({
//       title,
//       sets,
//       reps,
//       weight,
//       type,
//       user_id,
//     });
//     return res.status(201).json(workout);
//   } catch (error) {
//     return res.status(400).json({ error: error.message });
//   }
// };
//
// const updateWorkout = async (req, res) => {
//   const { id } = req.params;
//
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such workout" });
//   }
//
//   const workout = await Workout.findOneAndUpdate({ _id: id }, { ...req.body });
//
//   if (!workout) {
//     return res.status(404).json({ error: "No such workout" });
//   }
//   res.status(200).json(workout);
// };
//
// const deleteWorkout = async (req, res) => {
//   const { id } = req.params;
//
//   if (!mongoose.Types.ObjectId.isValid(id)) {
//     return res.status(404).json({ error: "No such workout" });
//   }
//
//   const workout = await Workout.findOneAndDelete({ _id: id });
//
//   if (!workout) {
//     return res.status(404).json({ error: "No such workout" });
//   }
//   res.status(200).json(workout);
// };
//
// export default {
//   createWorkout,
//   getWorkouts,
//   getWorkout,
//   updateWorkout,
//   deleteWorkout,
//   searchWorkouts,
// };

import { ObjectId } from "mongodb";
import { connectDB } from "../db/mongo.js";

const getWorkouts = async (req, res) => {
  try {
    const db = await connectDB();
    const user_id = req.user._id;

    const workouts = await db
        .collection("workouts")
        .find({ user_id })
        .sort({ createdAt: -1 })
        .toArray();

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getWorkout = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;

    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such workout" });
    }

    const workout = await db.collection("workouts").findOne({
      _id: new ObjectId(id),
    });

    if (!workout) {
      return res.status(404).json({ error: "No such workout" });
    }

    res.status(200).json(workout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const searchWorkouts = async (req, res) => {
  try {
    const db = await connectDB();
    const user_id = req.user._id;
    const { q, type } = req.query;

    const query = { user_id };

    if (q && q.trim() !== "") {
      query.$or = [
        { title: { $regex: q, $options: "i" } },
      ];
    }

    if (type && type.trim() !== "") {
      query.type = { $regex: type, $options: "i" };
    }

    const workouts = await db
        .collection("workouts")
        .find(query)
        .sort({ createdAt: -1 })
        .toArray();

    res.status(200).json({
      workouts,
      searchParams: {
        q: q || "",
        type: type || ""
      }
    });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const createWorkout = async (req, res) => {
  const { title, sets, reps, weight, type } = req.body;

  let emptyFields = [];

  if (!title) emptyFields.push("title");
  if (!sets) emptyFields.push("sets");
  if (!reps) emptyFields.push("reps");
  if (!weight) emptyFields.push("weight");
  if (!type) emptyFields.push("type");

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: "Fill in all the fields",
      emptyFields
    });
  }

  try {
    const db = await connectDB();
    const user_id = req.user._id;

    const workout = {
      title,
      sets,
      reps,
      weight,
      type,
      user_id,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db
        .collection("workouts")
        .insertOne(workout);

    res.status(201).json({
      ...workout,
      _id: result.insertedId
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


const updateWorkout = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const user_id = req.user._id;

    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such workout" });
    }

    const result = await db.collection("workouts").updateOne(
        { _id: new ObjectId(id), user_id },
        {
          $set: {
            ...req.body,
            updatedAt: new Date(),
          },
        }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "No such workout" });
    }

    const updatedWorkout = await db.collection("workouts").findOne({
      _id: new ObjectId(id),
      user_id,
    });

    res.status(200).json(updatedWorkout);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




const deleteWorkout = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const user_id = req.user._id;

    if (!ObjectId.isValid(id)) {
      return res.status(404).json({ error: "No such workout" });
    }

    const result = await db.collection("workouts").deleteOne({
      _id: new ObjectId(id),
      user_id,
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ error: "No such workout" });
    }

    res.status(200).json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export default {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  deleteWorkout,
  searchWorkouts,
};
