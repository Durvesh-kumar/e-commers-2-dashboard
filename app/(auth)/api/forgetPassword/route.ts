import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import DashboardUser from "@/lib/models/DashboardUser";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req: NextRequest) => {
    try {
        const { email, password } = await req.json();

        if (!email || !password) {
            return NextResponse.json({ message: "Invalid user! Please try agian", error: true, success: false }, { status: 400 })
        }

        await ConnectedToDB();

        const user = await DashboardUser.findOne({ email });

        if (!user) {
            return NextResponse.json({ message: "Invalid User", error: true, success: false }, { status: 400 });
        }

        await DashboardUser.findByIdAndUpdate(user._id, { password: password });

        return NextResponse.json({ message: "Update password successfully", error: false, success: true }, { status: 200 });

    } catch (error) {
        console.log("[forgetPassword_POST]", error);
        return new NextResponse("Internal server Error", { status: 500 })
    }
}