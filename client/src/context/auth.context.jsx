import { createContext, useReducer, useEffect } from "react";
import { api } from "../api/api";

export const AuthContext = createContext();

export const AuthReducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
        loading: false,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        loading: false,
      };
    default:
      return state;
  }
};


export const AuthContextProvider = ({ children }) => {
  const [state, dispatch] = useReducer(AuthReducer, {
    user: null,
    loading: true,
  });

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await api.get("/user/me");
        dispatch({ type: "LOGIN", payload: res.data });
      } catch {
        dispatch({ type: "LOGOUT" });
      }
    };

    checkSession();
  }, []);

  return (
      <AuthContext.Provider value={{ ...state, dispatch }}>
        {children}
      </AuthContext.Provider>
  );
};

