import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Review from "@/lib/models/Review";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest, { params }: { params: { reviewId: string } }) => {
    try {

        await ConnectedToDB();

        const { name, message, rating, image, clerkId } = await req.json();

        if (!name || !message || !rating || !image || !clerkId) {
            return new NextResponse("not enough data", { status: 400 });
        }

        const review = await Review.findById(params.reviewId);

        if (review.clerkId != clerkId) {
            return new NextResponse("Unauthorrized", { status: 400 });
        };

        if (!review) {
            return new NextResponse("Review not found", { status: 400 });
        };

        const updateReview = await Review.findByIdAndUpdate(review._id, { name, message, rating, image });

        return NextResponse.json(updateReview, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "POST",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        });
    } catch (error) {
        console.log("[reviews-reviewId_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

export const GET = async (req: NextRequest, { params }: { params: { reviewId: string } }) => {
    try {
        await ConnectedToDB();
        const reviews = await Review.findById(params.reviewId);

        if (!reviews) {
            return new NextResponse("Product not found", { status: 400 })
        }

        return NextResponse.json(reviews, { status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
         });

    } catch (error) {
        console.log("[reviews-reviewId_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};


export const DELETE = async (req: NextRequest, { params }: { params: { reviewId: string } }) => {
    try {

        const secret = process.env.AUTH_SECRET!

        const token = await getToken({ req, secret });

        await ConnectedToDB();
        const reviews = await Review.findById(params.reviewId);

        if (!reviews) {
            return new NextResponse("Product not found", { status: 400 })
        }

        if (token?.role === "Owner") {

            await Review.findByIdAndDelete(reviews._id)

            return NextResponse.json(reviews, { status: 200 });
        }

    } catch (error) {
        console.log("[reviews-reviewId_DELETE]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};