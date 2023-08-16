// @ts-nocheck

import React, { useEffect, useState } from "react";
import { Bar, Line, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";
import { useAuth0 } from "@auth0/auth0-react";
import MultilineGraph from "../MultilineGraph";
import { API_URL } from "../../constants";

ChartJS.register(
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend
);

interface UrlList {
  urlList: String[];
  durList: Number[];
}

interface DateList {
  dateList: String[];
  durList: Number[];
}

interface ByUrlHistory {
  url: String;
  dateList: String[];
  durList: Number[];
}

const GET_HISTORY = `
query HistorySearch($sub : String) {
    historySearch(first: 100 , filter: {sub : {eq : $sub}} ){
      edges {
        node {
          url
          duration
          date
          startTime
        }
      }
    }
  }
`;

const options = {};
const data = {
  labels: ["1", "2", "3", "4"],
  datasets: [
    {
      label: "Watch Time",
      data: [34, 12, 44, 26],
      borderColor: "blue",
      backgroundColor: "blue",
      tension: 0.2,
    },
  ],
};
const HistoryGraphs = () => {
  const [urlListObj, setUrlListObj] = useState<UrlList>({
    urlList: [],
    durList: [],
  });
  const [dateListObj, setDateListObj] = useState<DateList>({
    dateList: [],
    durList: [],
  });
  const [byUrlHistoryObj, setByUrlHistoryObj] = useState();
  const { user } = useAuth0();

  async function getUserHistory() {
    let token = JSON.parse(localStorage.getItem("token") + "");
    
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: GET_HISTORY,
          variables: {
            sub: user?.sub,
          },
        }),
      });

      const dataRecieved = await res.json();
      let data = dataRecieved?.data?.historySearch?.edges;
      let dateListObject: DateList = { dateList: [], durList: [] };
      const tempArr: {date: string, dur: number}[] = []
      data.forEach(({ node }) => {
        if (dateListObject.dateList.indexOf(node.date) < 0) {
          dateListObject.dateList.push(node.date);
          dateListObject.durList.push(node.duration / (60 * 60 * 1000));
          tempArr.push({
            date: node.date,
            dur: node.duration / (60 * 60 * 1000)
          })
        } else {
          dateListObject.durList[dateListObject.dateList.indexOf(node.date)] +=
            node.duration / (60 * 60 * 1000);
            const date = node.date;
            for(let i = 0; i < tempArr.length; i++) {
              if(tempArr[i].date === date) {
                tempArr[i].dur += node.duration / (60 * 60 * 1000); 
              }
            }
        }
      });

      tempArr.sort((a,b) => {
        const datePartsA = a.date.split('-').map(Number);
        const datePartsB = b.date.split('-').map(Number);
      
        // Compare years
        if (datePartsA[2] !== datePartsB[2]) {
          return datePartsA[2] - datePartsB[2];
        }
        
        // Compare months
        if (datePartsA[1] !== datePartsB[1]) {
          return datePartsA[1] - datePartsB[1];
        }
        
        // Compare days
        return datePartsA[0] - datePartsB[0];
      })


      const dateList = tempArr.map(el => el.date);
      const durList = tempArr.map(el => el.dur);

      setDateListObj({dateList, durList});

      let urlListObject: UrlList = { urlList: [], durList: [] };
      data.forEach(({ node }) => {
        if (urlListObject.urlList.indexOf(node.url) < 0) {
          urlListObject.urlList.push(node.url);
          urlListObject.durList.push(node.duration / (60 * 1000));
        } else {
          urlListObject.durList[urlListObject.urlList.indexOf(node.url)] +=
            node.duration / (60 * 1000);
        }
      });

      setUrlListObj(urlListObject);

      function transformData(dataArray) {
        const transformedData = {};
        dataArray.forEach(({node}) => {
          const { url, date, duration } = node;

          if (!transformedData[url]) {
            transformedData[url] = { dates: [], durations: [] };
          }

          const index = transformedData[url].dates.indexOf(date);

          if (index === -1) {
            transformedData[url].dates.push(date);
            transformedData[url].durations.push((duration/(60*1000)));
          } else {
            transformedData[url].durations[index] += (duration/(60*1000));
          }
        });
        
        return transformedData;
      }

      let byUrlHistoryObject = transformData(data);
      setByUrlHistoryObj(byUrlHistoryObject)

      if (dataRecieved.errors[0]) {
        return (
          <>
            <p>Seems like there was an error {":("}</p>
            <p>{dataRecieved.errors[0]}</p>
          </>
        );
      }
    } catch (err) {
      return <p>{JSON.stringify(err)}</p>;
    }
  }
  useEffect(() => {
    setTimeout(async () => {
      await getUserHistory();
    }, 100);
  }, []);

  function generateRandomColorNames(numColors) {
    const colors = [];
    const colorNames = [
      "red",
      "orange",
      "yellow",
      "green",
      "blue",
      "purple",
      "pink",
      "brown",
      "aqua",
      "aquamarine",
      "beige",
      "chocolate",
      "coral",
      "gold",
      "indigo",
      "lavender",
      "lime",
      "maroon",
      "olive",
      "orchid",
      "plum",
      "salmon",
      "sienna",
      "teal",
      "tomato",
      "violet",
    ];
    for (let i = 0; i < numColors; i++) {
      const colorName = colorNames[i];
      colors.push(colorName);
    }

    return colors;
  }

  return (
    <div className="block mt-4 ">
      <h1 className="w-[90vw] m-auto font-semibold text-3xl mb-6 mt-12">Hello there 👋 </h1>
      {/* <div className="w-[90vw] m-auto min-h-[70vh] mb-24 xl:flex justify-center items-center flex-col xl:flex-row gap-4 xl:flex-wrap"> */}
      <div className="w-[90vw] m-auto min-h-[60vh] mb-24 grid grid-cols-1 xl:grid-cols-2 gap-5">
        <div className="w-[90%] mx-auto xl:w-[100%] flex items-center flex-col justify-center gap-8 shadow-xl bg-green-100 p-4">
          <h2 className="w-fit mx-auto text-xl md:text-2xl text-center">Daily Usage {"(In Hours)"}</h2>
          <Bar
            options={options}
            data={{
              labels: dateListObj.dateList,
              datasets: [
                {
                  label: "Watch Time",
                  data: dateListObj.durList,
                  borderColor: "green",
                  backgroundColor: ["#fbbf24", "#f87171", "#38bdf8", "#8b5cf6", "#f97316", "#db2777"],
                  tension: 0.2,
                },
              ],
            }}
          ></Bar>
        </div>

        <div className=" w-[90%] mx-auto xl:w-[100%]  flex items-center flex-col justify-center gap-8 shadow-xl p-4 bg-green-100">
          <h2 className="w-fit mx-auto text-xl md:text-2xl text-center">Usage per Website {"(In Minutes)"}</h2>
          <div>
          <Pie
            options={options}
            data={{
              labels: urlListObj.urlList
              ,datasets: [
                {
                  label: "Watch Time",
                  data: urlListObj.durList,
                  borderColor: "black",
                  borderWidth: 0.75,
                  backgroundColor: generateRandomColorNames(urlListObj.durList.length),
                },
              ],
            }}
          ></Pie>
          </div>
        </div>
      </div>
      {byUrlHistoryObj && <MultilineGraph data = {byUrlHistoryObj} />}
      

    </div>
  );
};

export default HistoryGraphs;
