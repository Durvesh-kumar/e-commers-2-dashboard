"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    Form,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { role } from "@/helpers/UserType"

const formSchema = z.object({
    role: z.string().min(2, {
        message: "Please select role.",
    }),
    id: z.string()
});

interface RolePropes{
    isOpen: boolean;
    setIsOpen: (value:boolean) => void;
    userdData: DashboardUserType |null;
    setIsEffect: (value:boolean) => void;
    isEffect:boolean;
}

export const Role:React.FC<RolePropes> = ({isOpen, setIsOpen, userdData, isEffect, setIsEffect})=> {

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            role: "",
            id: userdData?._id
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        const res = await fetch("/api/users",{
            method: "POST",
            body:JSON.stringify(values)
        });

        if(res.ok){
            setIsOpen(!isOpen)
            setIsEffect(!isEffect)
        }
    }
    return (
        <div className="flex items-center justify-center h-screen w-full">
            <Card className="w-[350px] bg-white">
                <CardHeader>
                    <CardTitle className="text-center text-xl font-bold">Change a Role</CardTitle>
                    <CardDescription></CardDescription>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a role" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectGroup className="bg-white">
                                                    {
                                                        role?.map((item) => (
                                                            <SelectItem key={item.id} value={item.name}>{item.name}</SelectItem>
                                                        ))
                                                    }
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-between">
                            <Button type="reset" onClick={()=> setIsOpen(!isOpen)} className="bg-red-600 text-white hover:bg-white hover:text-black border-2 hover:border-black">Cancel</Button>
                            <Button type="submit" className="bg-blue-600 text-white hover:bg-white hover:text-black border-2 hover:border-black">Apply</Button>
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    )
}
