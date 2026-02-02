import { ObjectId } from "mongodb";
import { connectDB } from "../db/mongo.js";


const getWorkouts = async (req, res) => {
  try {
    const db = await connectDB();
    const user_id = new ObjectId(req.user._id);

    const workouts = await db
        .collection("workouts")
        .find({ user_id, deleted: { $ne: true } })
        .sort({ createdAt: -1 })
        .toArray();

    res.status(200).json(workouts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const addNotes = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const user_id = new ObjectId(req.user._id);
    const { note } = req.body;

    if (!note) {
      return res.status(400).json({ error: "Note cannot be empty" });
    }

    const result = await db.collection("workouts").updateOne(
        { _id: new ObjectId(id), user_id },
        {
          $push: {
            notes: note
          },
          $set: { updatedAt: new Date() }
        }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "WorkoutItem not found" });
    }

    res.status(200).json({ success: true });
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
      user_id: new ObjectId(req.user._id),
      deleted: { $ne: true }
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
    const user_id = new ObjectId(req.user._id);
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
    const user_id = new ObjectId(req.user._id);

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

    await logWorkoutAction(db, result.insertedId, user_id, "CREATE");

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
    const user_id = new ObjectId(req.user._id);

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

const workoutStats = async (req, res) => {
  try {
    const db = await connectDB();
    const user_id = new ObjectId(req.user._id);

    const stats = await db.collection("workouts").aggregate([
      { $match: { user_id, deleted: { $ne: true } } },
      {
        $group: {
          _id: "$type",
          totalWorkouts: { $sum: 1 },
          avgWeight: { $avg: "$weight" }
        }
      },
      { $sort: { totalWorkouts: -1 } }
    ]).toArray();

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const logWorkoutAction = async (db, workoutId, userId, action) => {
  await db.collection("logs").insertOne({
    workoutId,
    userId,
    action,
    timestamp: new Date()
  });
};

const softDeleteWorkout = async (req, res) => {
  try {
    const db = await connectDB();
    const { id } = req.params;
    const user_id = new ObjectId(req.user._id);

    const result = await db.collection("workouts").updateOne(
        { _id: new ObjectId(id), user_id },
        {
          $set: { deleted: true, updatedAt: new Date() }
        }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ error: "No such workout" });
    }

    await logWorkoutAction(db, id, user_id, "SOFT_DELETE");

    res.status(200).json({ success: true, softDeleted: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createWorkout,
  getWorkouts,
  getWorkout,
  updateWorkout,
  searchWorkouts,
  addNotes,
  softDeleteWorkout,
  workoutStats
};
