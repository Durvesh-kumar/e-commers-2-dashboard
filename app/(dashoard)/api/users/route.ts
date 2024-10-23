import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Collection from "@/lib/models/Collection";
import DashboardUser from "@/lib/models/DashboardUser";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server"

export const GET = async () => {

    try {
        await ConnectedToDB();

        const users = await DashboardUser.find({isVerified:true}).populate({path:"collections", model:Collection});
        

        return NextResponse.json(users, { status: 200 });
    } catch (error) {
        console.log("[User_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};

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

        if (token.role !== "Owner") {
            return NextResponse.json({ message: "User role note Verified", error: true, success: false }, { status: 400 });
        };

        const {id, role} = await req.json();

         await DashboardUser.findByIdAndUpdate(id, {role});

        return NextResponse.json("Updatae successfully", { status: 200 });
        
    } catch (error) {
        console.log("[User_POST]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
};