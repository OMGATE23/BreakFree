import { useAuth0 } from "@auth0/auth0-react"
import HistoryGraphs from "../../components/HistoryGraphs"
import Header from "../../components/Header"

export default function Analytics() {
  const obj = useAuth0()
  console.log(obj)
  return (
    <div>
        <Header/>
        <HistoryGraphs />
    </div>
  )
}
