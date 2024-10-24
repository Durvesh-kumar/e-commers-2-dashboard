import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Review from "@/lib/models/Review";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {

        await ConnectedToDB();
        const productId = params.productId;
        const { email, name, message, rating, image, clerkId } = await req.json();

        if (!email || !name || !message || !rating || !image || !productId || !clerkId) {
            return new NextResponse("not enough data", { status: 400 });
        };
        
        const newReview = await Review.create({ email, name, message, rating, productId, image, clerkId });

        const review = await newReview.save();


        return NextResponse.json(review, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "POST, GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        });
    } catch (error) {
        console.log("[reviews_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async (req:NextRequest,{ params }: { params: { productId: string } }) => {
    try {
        await ConnectedToDB();
        const reviews = await Review.find({ productId: params.productId });

        if (!reviews) {
            return new NextResponse("Product not found", { status: 400 });
        };
        return NextResponse.json(reviews, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        });

    } catch (error) {
        console.log("[reviews_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};