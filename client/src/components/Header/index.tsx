import { useAuthContext } from "../../hooks/useAuthContext";
import LoginButton from "../LoginButton";
import { LogoutButton } from "../LogoutButton";
import { NavLink } from "react-router-dom";

export default function Header() {
  let { state } = useAuthContext();
  let { user } = state;
  return (
    <nav className="p-4 bg-white top-0 text-2xl w-[100vw] flex justify-between items-center ">
      <img className="block w-[48px]" src={"./assets/plant.png"} />
      {user && (
        <div className="text-lg flex justify-center gap-12 w-[50%]">
          <NavLink
            className="text-green-700"
            style={({ isActive }) => ({
              cursor: isActive ? "default" : "pointer",
              fontWeight: isActive ? "bold" : "normal",
            })}
            to="/"
          >
            Timers
          </NavLink>
          <NavLink
            className="text-green-700"
            to="/analytics"
            style={({ isActive }) => ({
              cursor: isActive ? "default" : "pointer",
              fontWeight: isActive ? "bold" : "normal",
            })}
          >
            Analytics
          </NavLink>
        </div>
      )}
      {!user && <LoginButton />}
      {user && <LogoutButton />}
    </nav>
  );
}
