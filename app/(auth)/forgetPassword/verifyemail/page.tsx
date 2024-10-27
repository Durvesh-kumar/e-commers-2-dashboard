"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"
import { useState } from "react"
import Loader from "@/app/components/custom/Loader"
import { Button } from "@/components/ui/button"

const formSchema = z.object({
    email: z.string().min(2, {
        message: "Username must be at least 2 characters.",
    }),
})

function VerifyEmail() {
    const [loading, setLoading] = useState(false)
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
        },
    })

    // 2. Define a submit handler.
    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            setLoading(true)
            const res = await fetch('/api/forgetPassword/verifyemail', {
                method: "POST",
                body: JSON.stringify(values)
            });

            const data = await res.json();
            setLoading(false)
            if (data.success) {
                toast.success(data.message);
                router.replace(`/forgetPassword/verifyemail/${values.email}`)
            }
            if(data.error){
                toast.error(data.message)
            }
        } catch (error) {
            console.log("[forgetPassword_veryfyemailPage]", error);
            toast.error("Internal Server Error")
        }
    }

    const handleKeyPress = (e:React.KeyboardEvent<HTMLInputElement>)=>{
        if(e.key === "Enter"){
            e.preventDefault()
        }
    }
    
    return loading ? <Loader/> : (
        <div className='flex items-center justify-center h-screen'>
            <div className='flex flex-col border shadow-lg rounded-lg bg-white p-5 gap-5 w-80'>
                <p className="text-center text-4xl text-gray-950 font-bold flex items-center justify-center flex-wrap p-5">Verify Email Acount</p>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Verification email</FormLabel>
                                    <FormControl>
                                        <Input type="text" onKeyDown={handleKeyPress} placeholder="Enter email...." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-orange-500 text-sm" />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center justify-end">
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}

export const dynamic = "force-dynamic"
export default VerifyEmail;