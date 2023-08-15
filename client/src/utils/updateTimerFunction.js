const TIMER_UPDATE = `
mutation TimerUpdate($updateTimer : TimeInput , $updateId : ID!) {
    timerUpdate(by: {id : $updateId} input: {timer : $updateTimer }){
      timer {
        timer {
          hours
          minutes
          seconds
        }
      }
    }
  }
`;

export default async function updateTimerFunction(id , timer , token) {
  console.log('updating timer')
  console.log({id , timer , token})
  if(!token){
    return 'Token not found , Please log back in!'
  }

  if(!id){
    return 'No id passed'
  }

  if(timer.hours === 0 && timer.minutes === 0 && timer.seconds ===0){
    return 'Input Valid Time'
  }

  try {
    const res = await fetch("http://localhost:4000/graphql", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: TIMER_UPDATE,
        variables: {
          updateId : id,
          updateTimer : {
            hours : timer.hours,
            minutes : timer.minutes,
            seconds : timer.seconds
          }
        },
      }),
    });

    const dataRecieved = await res.json();
    console.log(dataRecieved)
    if(dataRecieved.data){
      return 'Timer Updated Successfully!'
    }
    if (dataRecieved.errors[0]) {
      return (
          JSON.stringify(dataRecieved.errors[0])
    
      );
    }
    
  } catch (err) {
    return JSON.stringify(err);
  }
}
