"use client"
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
import React, { useState } from "react"
import Image from "next/image";
import toast from "react-hot-toast";
import RegisterImageUploader from "@/app/components/custom/RegisterImage";
import Loader from "@/app/components/custom/Loader"

const formSchema = z.object({
  email: z.string().min(2).email("Invalid email"),
  password: z.string().min(8).max(10),
  name: z.string().min(5).max(50),
  confirmPassword: z.string().max(10).min(8),
  image: z.string().url()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Password do not match",
  path: ["confirmPassword"]
});


const Register = () => {

  const [loading, setLoading] = useState(false)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      name: "",
      image: "",
      confirmPassword: ""
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true)
    const res = await fetch('/api/register', {
      method: "POST",
      body: JSON.stringify(values)
    })

    const data = await res.json()
    if (data.success) {
      setLoading(false)
      toast.success("User login successfully")
      window.location.replace(`/register/${values.email}`);
    }

    if (data.error) {
      setLoading(false)
      toast.error(data.message);
    }
  }

  const handlePressKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }

  return loading ? <Loader /> : (
    <div className="flex relative flex-col h-fit items-center justify-center p-10">
      <Image src='/logo.png' alt="logo" width={1000} height={1000} className="h-[800px] w-ful absolute top-10 bottom-0 animate-bounce flex items-center justify-center  object-scale-down -z-50" />

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 px-10 py-5 border shadow-lg rounded-lg bg-transparent border-black">
          <FormField
            control={form.control}
            name="image"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RegisterImageUploader value={field.value ? [field.value] : []} onChange={(value) => field.onChange(value)} onRemove={() => field.onChange("")} />
                </FormControl>
                <FormMessage className="text-orange-700 text-sm font-normal" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input onKeyDown={handlePressKey} placeholder="Enter full name" {...field} />
                </FormControl>
                <FormMessage className="text-orange-700 text-sm font-normal" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} onKeyDown={handlePressKey} placeholder="Enter email..." />
                </FormControl>
                <FormMessage className="text-orange-700 text-sm font-normal" />
              </FormItem>
            )
            }
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" onKeyDown={handlePressKey} placeholder="Enter password" {...field} className="w-80" />
                </FormControl>
                <FormMessage className="text-orange-700 text-sm font-normal" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fonfirm Password</FormLabel>
                <FormControl>
                  <Input type="password" onKeyDown={handlePressKey} placeholder="Enter confirm password" {...field} />
                </FormControl>
                <FormMessage className="text-orange-700 text-sm font-normal" />
              </FormItem>
            )}
          />
          <div className="flex items-center justify-end mb-10">
            <Button type="submit" className="bg-blue-700 text-white hover:bg-white hover:text-black border border-black">Submit</Button>
          </div>
          <div className="flex items-center justify-center">
            <button
              onClick={() => window.location.replace('/login')}
              className="text-sm text-gray-950 transition flex items-center justify-center duration-150 ease hover:text-blue-700">
              You have an account? LogIn
            </button>
          </div>

        </form>

      </Form>
    </div>

  )
}

export const dynamic = "force-dynamic";
export default Register;