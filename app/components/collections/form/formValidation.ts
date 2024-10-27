import { z } from "zod"

export const formSchema = z.object({
    title: z.string().min(2, {
      message: "Title must be at least 2 characters.",
    }),

    discription: z.string().min(2),
    image: z.string(),
    state: z.string().min(3),
    city: z.string().min(3),
    phoneNo: z.string().min(9).max(10),
    address: z.string().min(5),
    pinCode: z.string().min(4).max(6),
    country: z.string()
  });
  