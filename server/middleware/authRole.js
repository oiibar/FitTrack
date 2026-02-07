import { connectDB } from "../db/mongo.js";
import { ObjectId } from "mongodb";

export const requireRole = (roles) => {
  const allowed = Array.isArray(roles) ? roles : [roles];
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authorized" });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires role ${allowed.join(',')}` });
    }
    next();
  };
};

export const ensureOwnership = ({ collection, idParam = 'id', allowAdmin = true }) => {
  return async (req, res, next) => {
    try {
      if (!req.user) return res.status(401).json({ error: "Not authorized" });

      const id = req.params[idParam];
      if (!ObjectId.isValid(id)) return res.status(404).json({ error: "Resource not found" });

      const db = await connectDB();
      const doc = await db.collection(collection).findOne({ _id: new ObjectId(id) });
      if (!doc) return res.status(404).json({ error: "Resource not found" });

      // If owner
      if (doc.user_id && doc.user_id.equals(req.user._id)) {
        return next();
      }

      // Admin allowed
      if (allowAdmin && req.user.role === 'admin') {
        return next();
      }

      return res.status(403).json({ error: "Forbidden: not owner" });
    } catch (error) {
      console.error('ensureOwnership error:', error);
      return res.status(500).json({ error: 'Server error' });
    }
  };
};

