import { useAuth0 } from "@auth0/auth0-react"
import LoginButton from "../LoginButton"
import { LogoutButton } from "../LogoutButton"
import { NavLink } from "react-router-dom"

export default function Header() {
  const {isAuthenticated} = useAuth0()
  return (
    
    <nav className="p-4 bg-white top-0 text-2xl w-[100vw] flex justify-between items-center ">
        <img className='block w-[48px]' src={'./assets/plant.png'} />
        {isAuthenticated && <div className="text-lg flex justify-center gap-12 w-[50%]">
          <NavLink className="text-green-700" style={({isActive}) => ({cursor : isActive ? 'default' : 'pointer' , fontWeight : isActive ? 'bold' : 'normal'})}  to='/'>Timers</NavLink>
          <NavLink className="text-green-700" to='/analytics' style={({isActive}) => ({cursor : isActive ? 'default' : 'pointer' , fontWeight : isActive ? 'bold' : 'normal'})} >Analytics</NavLink>
        </div>}
        {!isAuthenticated && <LoginButton/>}
      {isAuthenticated && <LogoutButton/>}
    </nav>
  )
}
