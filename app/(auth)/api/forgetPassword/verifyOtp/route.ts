import { ConnectedToDB } from "@/lib/db/ConnectToDB"
import DashboardUser from "@/lib/models/DashboardUser";
import { NextRequest, NextResponse } from "next/server"


export const POST = async (req: NextRequest) => {
    try {

        await ConnectedToDB();

        const { inputArr, userEmail } = await req.json()

        const otp = Number(inputArr.toString().replaceAll(",", ""));

        const email = decodeURIComponent(userEmail)
        const user = await DashboardUser.findOne({ email });

        
        if (!user) {
            return NextResponse.json({ message: "User not found", error: true, success: false }, { status: 400 });
        };

        const verifyOTP = user.forgotPasswordOTP === otp;

        if(!verifyOTP){
            return NextResponse.json({ message: "OTP incorrect", error: true, success: false }, { status: 401 });
        }

        const expiryOTP = new Date(user.forgotPasswordOTPExpiry) > new Date();

        if(!expiryOTP){
            return NextResponse.json({ message: "Expiry OTP", error: true, success: false }, { status: 401 });
        }

        user.forgotPasswordToken = undefined;
        user.forgotPasswordTokenExpiry = undefined;
        await user.save();

        return NextResponse.json({ message: "Token verifyed", error: false, success: true, userId: user._id }, { status: 200 })

    } catch (error) {
        console.log("[verifiedToken]", error);
        return new NextResponse("Internal Server Error", { status: 500 });
    }
}