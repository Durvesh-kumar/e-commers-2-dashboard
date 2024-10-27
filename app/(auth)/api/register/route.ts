import { sendEmail } from "@/helpers/nodemailer";
import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import DashboardUser from "@/lib/models/DashboardUser";
import bcrypt from "bcryptjs"
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        const { name, email, image, password, role = "General" } = await req.json();
        
        if (!name || !email || !image || !password) {
            return NextResponse.json({ message: "Please fill all fields", success: false, error: true }, { status: 400 });
        };
        
        await ConnectedToDB();
        
        const findUser = await DashboardUser.findOne({email:email});
         
        if (findUser?.isVerified === true) {
            return NextResponse.json({ message: "User already exist", error: true, success: false }, { status: 400 });
        };

        if(findUser?.isVerified === false){
            await DashboardUser.findByIdAndDelete(findUser._id);
        };

        const salt = await bcrypt.genSalt(15);
        const hasshPassword = await bcrypt.hash(password, salt);

        const createNew = await DashboardUser.create({ name, email, password: hasshPassword, image, role });

        await sendEmail({ email, emailType: "VERIFY", userId:createNew._id });

        await createNew.save();
        return NextResponse.json({ message: "User create successfylly", user: createNew, error: false, success: true }, { status: 200 })
        

    } catch (error) {
        console.log("[register_POST]", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}


export const GET = async () => {
    try {

        await ConnectedToDB();

        const dbUsers = await DashboardUser.find({});

        return NextResponse.json(dbUsers, { status: 200 })
    } catch (error) {
        console.log(error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}
export const dynamic = "force-dynamic";