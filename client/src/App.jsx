import { RouterProvider } from "react-router-dom";
import { router } from "./router/router";
import { WorkoutsContextProvider } from "./context/workout.context.jsx";
import { AuthContextProvider } from "./context/auth.context.jsx";

function App() {
  return (
    <AuthContextProvider>
      <WorkoutsContextProvider>
        <RouterProvider router={router} />
      </WorkoutsContextProvider>
    </AuthContextProvider>
  );
}

export default App;
