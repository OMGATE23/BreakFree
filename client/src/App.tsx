import "./App.css";
import AllRoutes from "./routes";
import { useAuthContext } from "./hooks/useAuthContext";
import { useEffect } from "react";
function App() {
  let { state } = useAuthContext();
  let { authIsReady, user } = state;
  useEffect(() => {
    if (user) {
      localStorage.setItem("user_id", user.uid);
    }
  }, [user]);
  return (
    <div>
      {authIsReady && (
        <div className="font-poppins">
          <AllRoutes />
        </div>
      )}
    </div>
  );
}

export default App;
