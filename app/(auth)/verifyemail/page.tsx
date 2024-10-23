"use client"

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"

export default function VerifyEmail() {

  const router = useRouter()
  const [verified, setVerified] = useState(false);
  const [token, setToken] = useState("");
  const [error, setError] = useState(false)
  const verifyUserEmail = async () => {

    try {
      const res = await fetch('/api/verifyemail', {
        method: "POST",
        body: JSON.stringify(token)
      })
      if (res.ok) {
        setVerified(true);
      }

    } catch (error) {
      console.log("[verifyemail_POST]", error);
      setError(true)
    }
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

  return (
    <div className="flex items-center flex-col justify-center min-h-screen gap-4">
      <div className="flex items-center flex-col gap-5 p-5 border shadow-lg">
        <h1 className="text-4xl text-white flex items-center justify-center">Verify Email</h1>

        {verified && (
          <div className="flex flex-col items-center justify-center p-4">
            <h2>Email Verified</h2>
            {
              token && (
                <div className="flex items-center justify-center">
                   <Button onClick={() => router.replace('/login')} className="bg-blue-500 text-white hover:bg-white hover:text-black">Login</Button>
                </div>
              )
            }
          </div>
        )}
        {error && (
          <div className="text-xl bg-red-500">Error</div>
        )}
      </div>
    </div>
  )
}
