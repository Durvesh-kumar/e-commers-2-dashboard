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
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

const formSchema = z.object({
    password: z.string().min(2).max(50),
    confirmPassword: z.string().min(2).max(50),
    id: z.string().min(5)
}).refine((data) => data.password === data.confirmPassword, {
    message: "Password do not match",
    path: ["confirmPassword"]
  });

function ForgetPassword({ params }: { params: { forgetPassword: string } }) {

    const userId = decodeURIComponent(params.forgetPassword);
    
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
            id: userId,
        },
    });

    async function onSubmit(values: z.infer<typeof formSchema>) {
        console.log("HII");
        
        try {
            const res = await fetch(`/api/forgetPassword`, {
                method: "POST",
                body: JSON.stringify(values)
            });
            const data = await res.json()
            if (data.success) {
                toast.success(data.message);
                router.replace('/login');
            }
            if (data.error) {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error);
            toast.error("Somthing wrong! please try agian")
        }
    }
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault()
        }
    }
    return (
        <div className="flex items-center justify-center h-screen bg-slate-50">
            <div className="flex flex-col p-5 border shadow-lg rounded-lg bg-white w-72">
                <center className="font-bold my-5 text-3xl">Reset Password</center>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" onKeyDown={handleKeyPress} placeholder="Enter password...." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-orange-500 text-sm" />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" onKeyDown={handleKeyPress} placeholder="Enter confirm password..." {...field} />
                                    </FormControl>
                                    <FormMessage className="text-orange-500 text-sm" />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end items-center">
                        <Button type="submit" className="bg-blue-700 text-white hover:bg-white hover:text-black border border-black">Submit</Button>
                        </div>

                    </form>
                </Form>
            </div>
        </div>
    )
}

export const dynamic = "force-dynamic"
export default ForgetPassword;