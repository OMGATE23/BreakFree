import { Route, Routes } from "react-router";
import LandingPage from "./LandingPage";
import Analytics from "./Analytics";
import { Link } from "react-router-dom";
import BreakFreeIframe from "./BreakFreeIframe";
interface AllRoutes {
  title: string;
  path: string;
  element: JSX.Element;
}
const allRoutes: AllRoutes[] = [
  { title: "LandingPage", path: "", element: <LandingPage /> },
  { title: "Analytics", path: "analytics", element: <Analytics /> },
  {
    title: "BreakFreeIframe",
    path: "breakfreeiframe",
    element: <BreakFreeIframe />,
  },
  {
    title: "Catch",
    path: "*",
    element: (
      <div className="flex h-[100vh] justify-center items-center">
        <Link
          className="text-2xl flex flex-col justify-center items-center gap-6"
          to="/"
        >
          <img className="w-[200px]" src="./assets/plant.png" />
          Click me to come back!
        </Link>
      </div>
    ),
  },
];
export default function AllRoutes() {
  return (
    <Routes>
      {allRoutes.map(({ title, path, element }) => (
        <Route key={title} path={path} element={element} />
      ))}
    </Routes>
  );
}
