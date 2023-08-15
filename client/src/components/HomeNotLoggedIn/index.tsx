const HomeNotLoggedIn = () => {
  return (
    <div>
      <div className='flex flex-col items-center justify-center w-[90vw] mx-auto mb-12 gap-8 md:h-[90vh]'>
      <img className='block w-[120px]' src={'./public/assets/plant.png'} />
        <div className='flex flex-col gap-2 text-center'>
          <h1 className=' text-4xl  md:text-8xl font-bold text-green-900'>Break<span className='text-purple-950'>Free</span></h1>
          <h2 className=' text-xl md:text-2xl text-green-950'>Your online tool to help you with your social media addiction!</h2>
          <button className='w-fit px-6 md:text-xl outline outline-1 outline-green-800 mt-4 bg-green-600 rounded-md py-2 mx-auto text-white hover:bg-green-700 transition-colors duration-100'>Get Started!</button>
          <img className='hidden md:block mt-8' src='./assets/main-logo.svg' />
          <img className='block md:hidden mt-8 w-[40%] mx-auto' src='./assets/main-logo-vertical.svg' />
        </div>
        
      </div>
    </div>
  )
}

export default HomeNotLoggedIn