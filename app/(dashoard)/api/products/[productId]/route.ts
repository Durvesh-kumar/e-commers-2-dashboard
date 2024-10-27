import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Product from "@/lib/models/Product";
import { Collection } from "mongoose";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {
        await ConnectedToDB();

        const product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), { status: 400 })
        }

        return NextResponse.json(product, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        })
    } catch (error) {
        console.log('[productId_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export const POST = async (req: NextRequest, { params }: { params: { productId: string } }) => {
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


        const product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), { status: 400 })
        }

        if (token.sub === product.userId.toString() || token?.role === "Owner") {
            const { title, media, collections, pay, price, category, brand, tags, colors, sizes, discription } = await req.json()

            if (!title || !media || !collections || !pay || !price || !category || !brand || !tags || !colors || !sizes || !discription) {
                return new NextResponse('Please fill all fields', { status: 404 });
            }

            const updateProduct = await Product.findByIdAndUpdate(product._id, { title, media, collections, pay, price, category, brand, tags, colors, sizes, discription }, { new: true });

            return NextResponse.json({ message: "Product update successfully", error: false, success: true, product: updateProduct }, { status: 200 })
        }

        return NextResponse.json({ message: "Unauthorized User", error: true, success: false }, { status: 400 })

    } catch (error) {
        console.log('[productId_POST]', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { productId: string } }) => {
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

        const product = await Product.findById(params.productId)
        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), { status: 400 })
        }

        if (token?.role === "Owner") {
            await Product.findByIdAndDelete(product._id);

            await Collection.findOneAndUpdate(product.collections, {
                $pull: { products: product._id }
            })

            return NextResponse.json({ message: "Product deleted successfully", error: false, success: true }, { status: 200 })
        }
        return NextResponse.json({ message: "User role note Verified", error: true, success: false }, { status: 400 });
    } catch (error) {
        console.log('[productId_DELETE]', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}