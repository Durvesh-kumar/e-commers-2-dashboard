import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {

        const secret = process.env.AUTH_SECRET!

        const token = await getToken({ req, secret });

        await ConnectedToDB();

        if (token?.collections) {
            return NextResponse.json({ message: "Already create collection", error: true, success: false }, { status: 401 });
        }

        if (!token) {
            return NextResponse.json({ message: "Invalid User", error: true, success: false }, { status: 401 });
        };

        if (token?.isVerified !== true) {
            return NextResponse.json({ message: "User not verified", error: true, success: false }, { status: 401 });
        };

        if (token.role === "Gerenal") {
            return NextResponse.json({ message: "User role note Verified", error: true, success: false }, { status: 400 });
        };

        const { title, discription, price, pay, tags, sizes, colors, category, collections, media, brand} = await req.json()

        if (!title || !discription || !pay || !price || !tags || !sizes || !collections || !colors || !category || !media || !brand) {
            return NextResponse.json({message:'Please fill all fields', error:true, success:false}, { status: 400 })
        }

        const product = await Product.create({ title, discription, price, pay, tags, brand,
            collections, colors, sizes, media, category , userId:token.sub});

        await product.save();

        if (collections) {
            const collection = await Collection.findById(collections);

            collection.products.push(product._id)
            await collection.save();
        }

        return NextResponse.json({message: "Product created successfully", error: false, success:true}, { status: 200 })

    } catch (error) {
        console.log("Product_POST", error);
        return NextResponse.json({message:"Internal Server Error", error:true, success:false}, { status: 500 })
    }
}

export const GET = async () => {

    try {
        await ConnectedToDB();

        const products = await Product.find().populate({ path: "collections", model: Collection }).sort({ createdAt: "desc" });

        if (!products) {
            return new NextResponse('Product not found', { status: 400 })
        }

        return NextResponse.json(products, { status: 200,
            headers:{
               "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
         })

    } catch (error) {
        console.log("Product_GET", error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}