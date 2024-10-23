import { ConnectedToDB } from "@/lib/db/ConnectToDB"
import DashboardUser from "@/lib/models/DashboardUser";
import { NextRequest, NextResponse } from "next/server"


export const POST = async(req:NextRequest)=>{
    try {
        const {token} = await req.json()

        await ConnectedToDB();

        const user = await DashboardUser.findOne({forgotPasswordToken: token, forgotPasswordTokenExpiry: {$get : Date.now()}});

        if(!user){
            return NextResponse.json({message: "User not found", error: true, success:false}, {status: 400});
        };

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({message: "Token verifyed", error:false, success: true, userId: user._id}, {status:200})

    } catch (error) {
        console.log("[verifiedToken]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}