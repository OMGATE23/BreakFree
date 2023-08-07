import { Route, Routes } from "react-router";
import LandingPage from "./LandingPage"
import Login from "./Login"
import Signup from "./Signup"

interface AllRoutes  {
    title: string;
    path: string;
    element: JSX.Element;
}

export default function AllRoutes() {
    const allRoutes : AllRoutes[] = [
        {title : "LandingPage" , path : "" , element : <LandingPage/>},
        {title : "Login" , path : "login" , element : <Login/>},
        {title : "Signup" , path : "signup" , element : <Signup/> }
    ]
  return (
    <Routes>
        {allRoutes.map(({title, path , element}) => (
            <Route key={title} path={path} element = {element}/>
        ))}
    </Routes>
  )
}
