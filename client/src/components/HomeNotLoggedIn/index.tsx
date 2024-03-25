import useLogin from "../../hooks/useLogin";
const HomeNotLoggedIn = () => {
  const { login } = useLogin();
  return (
    <div>
      <div className="flex  flex-col items-center md:justify-center w-[90vw] mx-auto mb-12 gap-4 md:gap-8 md:h-[90vh]">
        <img className="block w-[120px]" src={"./assets/plant.png"} />
        <div className="flex flex-col md:flex-row gap-2">
          <div className="flex flex-col items-center text-center md:text-left md:items-start py-8 gap-4">
            <h1 className=" text-4xl  md:text-8xl font-bold text-green-900">
              Break<span className="text-purple-950">Free</span>
            </h1>
            <h2 className=" text-xl md:text-2xl text-green-950">
              Your online tool to help you with your social media addiction!
            </h2>
            <div className="flex flex-col md:flex-row items-center w-fit justify-center md:gap-4">
              <a
                className="w-fit px-6 md:text-xl outline outline-1 outline-green-800 mt-4 bg-green-600 rounded-md py-2 mx-auto text-white hover:bg-green-700 transition-colors duration-100"
                href="https://drive.google.com/drive/folders/1Q0YuvqyID4w68WEAd7SUIh_6jWqT2bsp"
              >
                Get Extension
              </a>
              <button
                className="w-fit px-6 md:text-xl outline outline-1 outline-green-800 mt-4 bg-white-600 rounded-md py-2 mx-auto text-green-700 hover:bg-green-100 transition-colors duration-100"
                onClick={login}
              >
                Start Now!
              </button>
            </div>
          </div>
          <iframe
            className="shadow-md h-[100%] aspect-video  rounded-md"
            src="https://www.youtube.com/embed/ahrDibrKd84?si=KRObLAEGtL9bY6Tg"
            title="YouTube video player"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerPolicy="strict-origin-when-cross-origin"
            allowFullScreen
          ></iframe>
        </div>
        <img className="hidden md:block mt-8" src="./assets/main-logo.svg" />
        <img
          className="block md:hidden mt-8 w-[40%] mx-auto"
          src="./assets/main-logo-vertical.svg"
        />
      </div>
    </div>
  );
};

export default HomeNotLoggedIn;
