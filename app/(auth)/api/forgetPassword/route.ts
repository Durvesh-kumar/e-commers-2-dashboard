import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import DashboardUser from "@/lib/models/DashboardUser";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs"

export const POST = async (req: NextRequest) => {
    try {
        const { id, password, confirmPassword } = await req.json();

        if (!id || !password || !confirmPassword) {
            return NextResponse.json({ message: "Invalid user! Please try agian", error: true, success: false }, { status: 400 })
        };

        if(password !== confirmPassword){
            return NextResponse.json({ message: "Password and Confirm Password not matche", error: true, success: false }, { status: 400 })
        };

        await ConnectedToDB();

        const user = await DashboardUser.findById(id);

        if (!user) {
            return NextResponse.json({ message: "Invalid User", error: true, success: false }, { status: 400 });
        };

        const salt = await bcrypt.genSalt(15);
        const hasshPassword = await bcrypt.hash(password, salt);

        await DashboardUser.findByIdAndUpdate(user._id, { password: hasshPassword });

        return NextResponse.json({ message: "Update password successfully", error: false, success: true }, { status: 200 });

    } catch (error) {
        console.log("[forgetPassword_POST]", error);
        return new NextResponse("Internal server Error", { status: 500 })
    };
};