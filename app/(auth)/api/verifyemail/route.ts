import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import DashboardUser from "@/lib/models/DashboardUser";
import { NextRequest, NextResponse } from "next/server"


export const POST = async (req: NextRequest) => {
    try {

        await ConnectedToDB()

        const { inputArr, userEmail } = await req.json()

        const otp = Number(inputArr.toString().replaceAll(",", ""));

        const email = decodeURIComponent(userEmail)
        const user = await DashboardUser.findOne({ email });


        if (!user) {
            return new NextResponse("Invalid token", { status: 400 });
        }

        const verifyOTP = user.verifyOTP === otp;

        if (!verifyOTP) {
            return NextResponse.json({ message: "OTP incorrect", error: true, success: false }, { status: 401 });
        }

        const expiryOTP = new Date(user.verifyOTPExpiry) > new Date()

        if (!expiryOTP) {
            return NextResponse.json({ message: "Expiry OTP", error: true, success: false }, { status: 401 });
        }

        user.isVerified = true;
        user.verifyOTP = undefined;
        user.verifyOTPExpiry = undefined;

        await user.save()
        return NextResponse.json({ message: "OTP verify successfully", error: false, success: true }, { status: 200 })

    } catch (error) {
        console.log("[verifyemail_POST", error);

        return new NextResponse("Internal Server Error", { status: 500 })
    }
}

export const dynamic = "force-dynamic"