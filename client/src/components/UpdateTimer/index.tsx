// @ts-nocheck

import React, { useState } from 'react'
import updateTimerFunction from '../../utils/updateTimerFunction.js'

const UpdateTimer = ({ setShowUpdateModal, modalData}) => {
    const [response, setResponse] = useState('')
    
    async function formSubmitHandler(e){
        e.preventDefault()
        let formData = new FormData(e.target)
        
        let timer = {
            hours : Number(formData.get('hours')),
            minutes : Number(formData.get('minutes')),
            seconds : Number(formData.get('seconds'))
        }
        let response = await updateTimerFunction(modalData?.timer?.id , timer , modalData?.token)
        
        if(response === 'Timer Updated Successfully!'){
            setTimeout(() => {
                setShowUpdateModal({ show: false, timer: {} })
            } , 1000)
        }
        setResponse(response)
        
    }
    return (<>
        {
            modalData?.show && (
                <div className=' absolute top-0 left-0 w-[100vw] h-[100vh] cursor-pointer flex justify-center items-center'  >
                    <div className='z-[20] p-6 rounded-lg outline outline-1 bg-green-50 text-center'>
                        <h2>Update The Timer for</h2>
                        <h6 className='font-semibold'>{modalData?.timer?.url}</h6>
                        <form className='flex text-center flex-col gap-4 mt-4' onSubmit={formSubmitHandler}>
                            <label htmlFor='hours' className='flex gap-2 justify-between'>
                                Hours:
                                <input name='hours' className='w-[5rem]' max='1' min='0' type='number' />
                            </label>
                            <label htmlFor='minutes' className='flex gap-2 justify-between'>
                                Minutes:
                                <input name='minutes' className='w-[5rem]' max='59' min='0' type='number' />
                            </label>
                            <label htmlFor='seconds' className='flex gap-2 justify-between'>
                                Seconds:
                                <input name='seconds' className='w-[5rem]' max='59' min='0' type='number' />
                            </label>
                            <button className='outline outline-1 rounded-md py-2 bg-green-300' type='submit'>Update</button>
                        </form>
                        {response && <p className='mt-4'>{response}</p>}
                    </div>
                    <div onClick={() => {setShowUpdateModal({ show: false, timer: {} })}} className=' absolute top-0 left-0 w-[100vw] h-[100vh] bg-gray-100 opacity-75 z-[]'>X</div>
                </div>
                
            )
        }
    </>
    )

}

export default UpdateTimer