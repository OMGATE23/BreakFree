import Header from "../../components/Header";
import HomeLoggedIn from "../../components/HomeLoggedIn";
import HomeNotLoggedIn from "../../components/HomeNotLoggedIn";
import "./landingpage.css";
import { useAuthContext } from "../../hooks/useAuthContext";

export default function LandingPage() {
  const { state } = useAuthContext();
  let { authIsReady, user } = state;
  if (!authIsReady) {
    return (
      <div className="flex w-[100vw] h-[100vh] flex-col justify-center items-center gap-8">
        <img className="w-[200px] plant" src="./assets/plant.png" />
        <p className="text-3xl text-green-600">Hang in there!</p>
      </div>
    );
  }

  return (
    <div>
      <Header />

      {user && (
        <div>
          <HomeLoggedIn />
        </div>
      )}
      {!user && <HomeNotLoggedIn />}
    </div>
  );
}
