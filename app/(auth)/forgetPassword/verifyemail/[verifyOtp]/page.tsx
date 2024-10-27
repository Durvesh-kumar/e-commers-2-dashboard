"use client"

import Loader from '@/app/components/custom/Loader';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useEffect, useRef, useState } from 'react'
import toast from 'react-hot-toast';

function VerifyToken({params}:{params:{verifyOtp: string}}) {
  const userEmail = decodeURIComponent(params.verifyOtp)
  const router = useRouter()

  const [inputs, setInput] = useState(new Array(6).fill(""));
  const [inputArr, setInputArr] = useState(inputs)
  const [loading, setLoading] = useState(false);

  const verifyUserOtp = async () => {


    try {
      setLoading(true)
      const res = await fetch(`/api/forgetPassword/verifyOtp`, {
        method: "POST",
        body:JSON.stringify({inputArr, userEmail})
      });

      const data = await res.json()
      if (data.success) {
        toast.success(data.message);
        setLoading(false);
        router.replace(`/forgetPassword/${data.userId}`);

      }
      if (data.error) {
        toast.error(data.message);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false);
      console.log("[VerifyToken]", error);
    };
  }

  const handleInput = (e:any, index: number) => {
    const val = e.target.value;

    if (!Number(val)) return;

    const copyArray = [...inputArr]
    copyArray[index] = val

    setInputArr(copyArray);

    if (index < inputArr.length - 1) {
      refs[index + 1].current.focus()
    }

  }

  const handlePressKey = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {

    if (e.key === "Enter") {
      e.preventDefault()
    }

    if (e.key === "Backspace") {
      const copyuArr = [...inputArr]
      copyuArr[index] = "";
      setInputArr(copyuArr)
      if (index > 0) {
        refs[index - 1].current.focus()
      }

    }

    if (e.key === "ArrowRight") {
      if (index < inputArr.length - 1) {
        refs[index + 1].current.focus();
      }

    }

    if (e.key === "ArrowLeft") {
      if (index > 0) {
        refs[index - 1].current.focus();
      }

    }

  }

  const refs: any = [useRef(), useRef(), useRef(), useRef(), useRef(), useRef()];

  useEffect(() => {
    refs[0].current.focus()
  }, []);

  return loading ? <Loader /> : (
    <div className="flex items-center flex-col justify-center min-h-screen gap-4">
      <div className='p-5 border-black border shadow-lg rounded-lg'>
        <h1 className='text-2xl font-bold text-center my-5'>Veryfy OTP</h1>
        <p className='font-medium'>user: {userEmail}</p>
        <section className="grid gap-3">
          <h4 className="font-medium">Enter OTP:</h4>
          <div className=" flex items-center justify-center gap-2">
            {
              inputs.map((curr, index: number) => (
                <input
                  key={index}
                  type="text"
                  min={0}
                  max={9}
                  maxLength={1}
                  onKeyDown={(e) => handlePressKey(e, index)}
                  value={inputArr[index]}
                  ref={refs[index]}

                  className=" outline-none border-[2px] w-10 h-10 font-bold  text-center
                    text-lg hover:border-black rounded-md focus:border-blue-600"
                  onChange={(e) => handleInput(e, index)}
                />
              )
              )
            }
          </div>

          <div className="flex items-center justify-end">
            <Button onClick={() => {
              inputArr.map((curVal, index: number) => {
                if (curVal === "") {
                  toast.error("Please fill all Inputs");
                  return;
                }
                verifyUserOtp()
              })
            }} className="bg-green-700 text-white font-bold">Verify OTP</Button>
          </div>
        </section>
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
export default VerifyToken;