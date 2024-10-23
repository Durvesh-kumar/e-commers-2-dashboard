import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Collection from "@/lib/models/Collection";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import DashboardUser from "@/lib/models/DashboardUser";

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

        if (token.role === "Gernal") {
            return NextResponse.json({ message: "User role note Verified", error: true, success: false }, { status: 400 });
        };

        const user = await DashboardUser.findById(token?.sub);

        if (user.collections) {
            return NextResponse.json({ message: `User already created Collection id: ${user.collections.toString()} and find on collections page`, error: true, success: false }, { status: 400 })
        }

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

        const collection = await Collection.create({ title, discription, image, state, city, address, phoneNo, pinCode, country, userId: token.sub });

        if (user) {
            user.collections = collection._id;
            await user.save()
        };

        await collection.save();

        return NextResponse.json({ message: "Collection created successully", error: false, success: true }, { status: 200 });

    } catch (error) {
        console.log("[collections_POST]", error);
        return NextResponse.json({ message: "Internal Server Error", error: true, success: false }, { status: 500 });
    }
};



export const GET = async () => {

    try {
        await ConnectedToDB()
        const collections = await Collection.find().populate({ path: "products", model: Product }).populate("userId").sort({ createdAt: "desc" });

        if (!collections) {
            return NextResponse.json({
                message: "Collections not found",
                error: true,
                success: false
            }, { status: 400 })
        }

        return NextResponse.json(collections, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        });

    } catch (error) {
        console.log("[collections_GET]", error);
        return NextResponse.json({ message: "Internal Server Error", error: true, success: false }, { status: 500 })
    }
}