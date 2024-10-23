"use client"
import { signIn } from "next-auth/react";
import Link from "next/link";

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import React from "react"
import Image from "next/image";
import toast from "react-hot-toast";

const formSchema = z.object({
  email: z.string().min(2).email("Invalid email"),
  password: z.string().min(8).max(10),
})
const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: ""
    },
  })
  async function onSubmit(values: z.infer<typeof formSchema>) {
    const res = await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false
    })
    if (res?.error) {
      toast.error(res.error as string)
    }
    if (res?.ok) {
      toast.success("User login successfully");
      window.location.replace('/')
    }
  }

  const handlePressKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }
  return (
    <div className="flex relative flex-col h-screen items-center justify-center p-10">
      <Image src='/logo.png' alt="logo" width={1000} height={1000} className="h-[650px] w-ful absolute top-[-40px] animate-bounce   object-scale-down -z-50" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-10 py-5 border shadow-lg rounded-lg bg-transparent border-black">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" onKeyDown={handlePressKey} placeholder="Enter email..." {...field} />
                </FormControl>
                <FormMessage className="text-orange-700 text-sm font-normal" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" onKeyDown={handlePressKey} placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage className="text-orange-700 text-sm font-normal" />
              </FormItem>
            )}
          />

          <Link href='/forgetPassword/verifyemail' className="text-sm hover:text-blue-400">forget password{" "}?</Link>
          <div className="flex items-center justify-end pb-4">
            <Button type="submit" className="bg-blue-700 text-white hover:bg-white hover:text-black border border-black">Submit</Button>
          </div>
            <Link
              href="/register"
              className="text-sm text-gray-950 transition my-5 duration-150 ease hover:text-blue-700">
              Don &apos;t have an account? Register
            </Link>

        </form>

      </Form>
    </div>

  )
}
export const dynamic = "force-dynamic";
export default Login;