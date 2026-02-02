import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext.js";
import { useWorkoutsContext } from "../../hooks/useWorkoutsContext.js";
import "react-toastify/dist/ReactToastify.css";
import { toast } from "react-toastify";
import {api} from "../../api/api.js";

export const useLogout = () => {
  const { dispatch } = useAuthContext();
  const { dispatch: workoutsDispatch } = useWorkoutsContext();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/user/logout");
    } catch (err) {
      console.error("Logout failed:", err);
    }

    dispatch({ type: "LOGOUT" });
    workoutsDispatch({ type: "SET_WORKOUTS", payload: [] });
    navigate("/login");
    toast("Logged out successfully");
  };

  return { logout };
};
