import React, { useState } from 'react'
import { Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
} from "chart.js";

ChartJS.register(
    LineElement,
    PointElement,
    CategoryScale,
    LinearScale,
    Tooltip,
    Legend
  );

const MultilineGraph = ({data}) => {
    let keys = Object.keys(data)
    const [currKey , setCurrKey] = useState(keys[0])
    console.log(data)
  return (
    <div className='w-[80vw] mx-auto mt-12 xl:flex flex-col gap-8'>
        <h2 className='w-fit mx-auto text-xl xl:text-2xl text-center'>Time spent per Website Visited {'in mins'}</h2>
        {data && <div className='flex justify-center flex-col gap-4'>
        <select id="urlSelect" onChange={(e) => {setCurrKey(e.target.value)}} className='outline outline-1 w-fit m-auto  rounded-md bg-green-300 py-1 px-4'>
        {Object.keys(data).map(url => (
          <option key={url} value={url} className='py-1 px-4 bg-gray-200'>
            {url}
          </option>
        ))}
      </select>
        <div className='w-[100%] bg-green-100 h-fit xl:w-[50%] mx-auto my-4 p-4 shadow-xl'>
            
        <Line options={{}} data={{
              labels: data[currKey].dates,
              datasets: [
                {
                  label: "Watch Time",
                  data: data[currKey].durations,
                  borderColor: "green",
                  backgroundColor: "green",
                  tension: 0.2,
                },
              ],
            }}>

        </Line>
        </div>
        </div>}
    </div>
  )
}

export default MultilineGraph