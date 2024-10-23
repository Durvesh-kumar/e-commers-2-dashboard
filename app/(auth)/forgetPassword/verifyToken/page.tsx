"use client"

import Loader from '@/app/components/custom/Loader';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast';

function VerifyToken() {
  const router = useRouter()

  const [token, setToken] = useState("")
  const [isVerifyed, setIsVerifyed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [userData, setUserData] = useState('')

  const verifyUserEmail = async () => {
    try {
      const res = await fetch("/api/verifyToken", {
        method: "POST",
        body: JSON.stringify(token)
      });

      const data = await res.json()
      setLoading(false)
      if (data.success) {
        toast.success(data.massege);
        setUserData(data.userId)
        setIsVerifyed(true);
      }
      if (data.error) {
        toast.error(data.massege);
        setError(true)
      }
    } catch (error) {
      console.log("[VerifyToken]", error);
      setError(true);
    };
  }

  useEffect(() => {
    const urlToken = window.location.search.split("=")[1];
    setToken(urlToken || "")
  }, [])

  useEffect(() => {
    if (token.length > 0) {
      verifyUserEmail()

    }
  }, [token])
  return loading ? <Loader /> : (
    <div className="flex items-center flex-col justify-center min-h-screen gap-4">
      <div className="flex items-center flex-col gap-5 p-5 border shadow-lg">
        <h1 className="text-4xl text-white flex items-center justify-center">Verify Email</h1>

        {isVerifyed && (
          <div className="flex flex-col items-center justify-center p-4">
            <h2>Email Verified</h2>
            {
              token && (
                <div className="flex items-center justify-center">
                  <Button onClick={() => router.replace(`/forgetPassword/${userData}`)} className="bg-blue-500 text-white hover:bg-white hover:text-black">Login</Button>
                </div>
              )
            }
          </div>
        )}
        {error && (
          <div className="text-xl bg-red-500 p-3">Error</div>
        )}
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic"
export default VerifyToken;