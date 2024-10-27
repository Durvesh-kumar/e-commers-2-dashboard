import { ConnectedToDB } from "@/lib/db/ConnectToDB"
import Collection from "@/lib/models/Collection"
import Product from "@/lib/models/Product";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req:NextRequest,{ params }: { params: { collectionId: string } }) => {
    try {
        await ConnectedToDB()

        const collection = await Collection.findOne({id:params.collectionId});
        if (!collection) {
            return Response.json({ message: "Collection not found", error: true, success: false }, { status: 400 })
        }

        const findCollection = await Collection.findById(collection._id)?.populate({path:"products", model:Product})

        return NextResponse.json(findCollection, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        });


    } catch (error) {
        console.log("[collectionId_GET]", error);
        return Response.json({ message: "Internal Server Error", error: true, success: false }, { status: 500 })
    }
}

export const POST = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
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

        const { title, discription, image, state, city, country = "India", phoneNo, pinCode, address } = await req.json();

        if (!title || !discription || !image || !address || !state || !city || !country || !phoneNo || !pinCode) {
            return NextResponse.json({
                message: "Please fill all fields",
                error: true,
                success: false
            }, { status: 400 })
        }

        const findUser = await Collection.findOne({ title });

        if (findUser) {
            return NextResponse.json({
                message: "Collection already exist",
                error: true,
                success: false
            }, { status: 400 })
        }

        const collection = await Collection.findById(params.collectionId);

        if (collection._id === token.sub || token?.role === "Owner") {
            return Response.json({ message: "Unauthorizw user", error: true, success: false }, { status: 400 })
        }


        if (!collection) {
            return Response.json({ message: "Collection not found", error: true, success: false }, { status: 400 })
        }

         await Collection.findByIdAndUpdate(collection._id, { title, discription, image, state, city, country, phoneNo, pinCode, address });


        return NextResponse.json({ message: "Collection update", error: false, success: true }, { status: 200 });


    } catch (error) {
        console.log("[collectionId_POST]", error);
        return Response.json({ message: "Internal Server Error", error: true, success: false }, { status: 500 })
    }
}

export const DELETE = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
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

        if (token.role === "Owner") {


            const collection = await Collection.findById(params.collectionId);
            if (!collection) {
                return Response.json({ message: "Collection not found", error: true, success: false }, { status: 400 })
            }

             await Collection.findByIdAndDelete(collection._id);

            return NextResponse.json({ message: "Collection deldete successfully", error: false, success: true }, { status: 200 });


        };

        return NextResponse.json({ message: "User role note Verified", error: true, success: false }, { status: 400 });


    } catch (error) {
        console.log("[collectionId_DELETE]", error);
        return Response.json({ message: "Internal Server Error", error: true, success: false }, { status: 500 })
    }
}