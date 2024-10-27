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
import { z } from "zod";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';
import { Textarea } from "@/components/ui/textarea";
import { formSchema } from "./formValidation";
import ImageUploader from "@/app/components/custom/UploadImage";
import { useState } from "react";
import Loader from "@/app/components/custom/Loader";


interface NewProps {
  initialData?: CollectionType | null
}

const CollectionForm: React.FC<NewProps> = ({ initialData }) => {

  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData ? { ...initialData } : {
      title: "",
      discription: "",
      image: "",
      address: "",
      phoneNo: "",
      state: "",
      city: "",
      pinCode: "",
      country: "India"

    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {

    try {
      setLoading(true)
      const url = initialData ? `/api/collections/${initialData._id}` : "/api/collections";
      const res = await fetch(url, {
        method: "POST",
        body: JSON.stringify(values)
      })

      const data = await res.json()
      if (data.success) {
        setLoading(false)
        toast.success(`Collection ${initialData ? 'updated' : 'created'} succesfully`);
        router.replace('/collections')
      };

      if (data.error) {
        setLoading(false)
        toast.error(data.message)
      };
    } catch (error) {
      console.log('[collectionNew_POST]', error);
      toast.error('Something went wrong! Please try agian');
    }
    // console.log(values)
  }

  const handelKeyPress = (
    e: | React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault()
    }
  }
  return loading ? <Loader/> : (
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
                  type="text"
                  onKeyDown={handelKeyPress}
                  placeholder="Please enter title...." {...field} />
              </FormControl>
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <ImageUploader
                  value={field.value ? [field.value] : []}
                  onChange={(url) => field.onChange(url)}
                  onRemove={() => field.onChange('')}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="grid md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-3 gap-10">
          <FormField
            control={form.control}
            name="state"
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    onKeyDown={handelKeyPress}
                    placeholder="Please enter state...." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    onKeyDown={handelKeyPress}
                    placeholder="Please enter city...." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pinCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pin Code</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    onKeyDown={handelKeyPress}
                    placeholder="Please enter pin code...." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Country</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    defaultValue={"India"}
                    onKeyDown={handelKeyPress}
                    readOnly
                    placeholder="Indai" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phoneNo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Conntect Number</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    min={0}
                    onKeyDown={handelKeyPress}
                    placeholder="Please enter title...." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  rows={2}
                  onKeyDown={handelKeyPress}
                  placeholder="Please enter address...." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex item-center justify-around">
          <Button
            onClick={() => router.push('/collections')}
            className="bg-red-500 text-white border hover:bg-white hover:text-black hover:border-black" type="button">
            Back
          </Button>
          <Button className="bg-blue-500 text-white border hover:bg-white hover:text-black hover:border-black" type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  )
}
export const dynamic = "force-dynamic"
export default CollectionForm;