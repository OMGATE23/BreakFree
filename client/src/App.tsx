import "./App.css";
import AllRoutes from "./routes";
import { useAuthContext } from "./hooks/useAuthContext";
function App() {
  let { state } = useAuthContext();
  let { authIsReady } = state;
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
