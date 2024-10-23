import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import DashboardUser from "@/lib/models/DashboardUser";
import { NextRequest, NextResponse } from "next/server"


export const POST = async (req: NextRequest) => {
    try {
        const token = await req.json();

        await ConnectedToDB()
        
        const user = await DashboardUser.findOne({ verifyToken:token, verifyTokenExpiry:{ $gt: Date.now() } });
        

        if (!user) {
            return new NextResponse("Invalid token", {status:400});
        }
        user.isVerified = true;
        user.verifyToken = undefined;
        user.verifyTokenExpiry = undefined;

        await user.save()
        return NextResponse.json('is verify', {status:200})

    } catch (error) {
        console.log("[verifyemail_POST", error);
        
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"