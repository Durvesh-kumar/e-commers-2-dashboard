'use client'
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { z } from "zod";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { IndianRupee } from "lucide-react";
import { useState, useEffect } from "react";
import MultiTexts from "@/app/components/custom/MultiText";
import ImageUploader from "@/app/components/custom/UploadImage";
import { formSchema, productValidationType } from "./formValidation";
import Loader from "@/app/components/custom/Loader";
import MultiSelects from "../../custom/MultiSelects";
import { categorys } from "@/helpers/Categorys";

interface ProductFormPropes {
    initialData?: ProductType | null;
    collectionId?: string | any
}

const ProductForm: React.FC<ProductFormPropes> = ({ initialData, collectionId }) => {

    const [collections, setCollections] = useState<CollectionType[]>([])
    const [loading, setLoading] = useState(false)
    const router = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData ? { ...initialData } : productValidationType,
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {

        try {
            setLoading(true)
            const url = initialData ? `/api/products/${initialData._id}` : "/api/products";
            const res = await fetch(url, {
                method: "POST",
                body: JSON.stringify(values)
            })
            const data = await res.json()
            setLoading(false)
            if (data.success) {
                toast.success(`Products ${initialData ? 'updated' : 'created'} succesfully`);
                const pageURL = collectionId ? "/collections/collectionProducts":  "/products"
                router.replace(pageURL);
            }
            if (data.error) {
                toast.error(data.message)
            }
        } catch (error) {
            console.log('[Products_POST]', error);
            toast.error('Something went wrong! Please try agian');
        }
        // console.log(values)
    }

    const getCollection = async () => {
        const res = await fetch('/api/collections', {
            method: "GET"
        });

        if (res.ok) {
            const data = await res.json()
            setCollections(data)
        }
    }

    useEffect(() => {
        getCollection()
    }, [])

    const handelKeyPress = (
        e: | React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
    ) => {
        if (e.key === "Enter") {
            e.preventDefault()
        }
    }

    return loading ? <Loader /> : (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input
                                    onKeyDown={handelKeyPress}
                                    placeholder="Please enter title...." {...field} />
                            </FormControl>
                            <FormMessage className=" text-sm text-orange-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="discription"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Discription</FormLabel>
                            <FormControl>
                                <Textarea
                                    rows={6}
                                    onKeyDown={handelKeyPress}
                                    placeholder="Please enter description...." {...field} />
                            </FormControl>
                            <FormMessage className=" text-sm text-orange-500" />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="media"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Image</FormLabel>
                            <FormControl>
                                <ImageUploader
                                    value={field.value}
                                    onChange={(url) => field.onChange(field.value = [...field.value, url])}
                                    onRemove={(url) => field.onChange([...field.value.filter((image) => image !== url)])}
                                />
                            </FormControl>
                            <FormMessage className=" text-sm text-orange-500" />
                        </FormItem>
                    )}
                />
                <section className="grid items-center gap-8 md:grid-cols-2 xl:grid-rows-1 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-rows-4 sm:grid-cols-1 w-full ">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><span>Price</span><IndianRupee className="w-4 h-4" /></FormLabel>
                                <FormControl>
                                    <Input type="number" min={10} placeholder="Please Enter price" onKeyDown={handelKeyPress} {...field} className="w-full" />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="pay"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel className="flex items-center gap-1"><span>Pay</span><IndianRupee className="w-4 h-4" /></FormLabel>
                                <FormControl>
                                    <Input type="number" min={10} placeholder="Please Enter pay" onKeyDown={handelKeyPress} {...field} className="w-full" />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="brand"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Brand</FormLabel>
                                <FormControl>
                                    <Input type="text" placeholder="Please Enter product brand" onKeyDown={handelKeyPress} {...field} className="w-full" />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Category</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white">
                                        <SelectGroup>
                                            {
                                                categorys?.map((category) => (
                                                    <SelectItem value={category.name} key={category.id}>{category.name}</SelectItem>
                                                ))
                                            }
                                        </SelectGroup>

                                    </SelectContent>
                                </Select>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="collections"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Collection</FormLabel>
                                <FormControl>
                                    <MultiSelects
                                        values={field.value ? [field.value] : []}
                                        onChange={(select) => field.onChange(select)}
                                        placeholder="Please select collection"
                                        collections={collections}
                                        onRemonve={() => field.onChange('')}
                                    />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sizes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Sizes</FormLabel>
                                <FormControl>
                                    <MultiTexts
                                        values={field.value}
                                        onChange={(text) => field.onChange([...field.value, text])}
                                        onRemove={(text) => field.onChange([...field.value.filter((item => item !== text))])}
                                        placeholder='Please enter sizes'
                                    />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="colors"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Colors</FormLabel>
                                <FormControl>
                                    <MultiTexts
                                        values={field.value}
                                        onChange={(text) => field.onChange([...field.value, text])}
                                        onRemove={(text) => field.onChange([...field.value.filter((item => item !== text))])}
                                        placeholder='Please enter colors'
                                    />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="tags"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Tags</FormLabel>
                                <FormControl>
                                    <MultiTexts
                                        values={field.value}
                                        onChange={(text) => field.onChange([...field.value, text])}
                                        onRemove={(text) => field.onChange([...field.value.filter((item => item !== text))])}
                                        placeholder='Please enter tags'
                                    />
                                </FormControl>
                                <FormMessage className=" text-sm text-orange-500" />
                            </FormItem>
                        )}
                    />
                </section>
                <div className="flex item-center justify-around">
                    <Button
                        onClick={() => router.push('/products')}
                        className="bg-red-500 text-white border hover:bg-white hover:text-black hover:border-black" type="button">
                        Back
                    </Button>
                    <Button className="bg-blue-500 text-white border hover:bg-white hover:text-black hover:border-black" type="submit">Submit</Button>
                </div>
            </form>
        </Form>
    )
}

export default ProductForm;