import { z } from "zod";

export const productValidationType ={
   title: '',
   discription: '',
   price: 10,
   pay: 10,
   brand: '',
   collections: '',
   sizes: [],
   colors: [],
   media: [],
   category: '',
   tags: []
}

export const formSchema = z.object({
    title: z.string().min(1, {
      message: "Title must be at least 2 characters.",
    }).max(30),

    discription: z.string().min(100),
    price: z.coerce.number().min(10).max(300000),
    pay: z.coerce.number().min(10).max(300000),
    brand: z.string().min(3).max(20),
    category: z.string().min(3),
    colors: z.array(z.string().min(2).max(20)),
    sizes: z.array(z.string().min(2).max(10)),
    media: z.array(z.string().url()),
    collections: z.string().min(5).max(200),
    tags: z.array(z.string().min(2).max(20))
  })