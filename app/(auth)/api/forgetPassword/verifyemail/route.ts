import { sendEmail } from "@/helpers/nodemailer";
import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import DashboardUser from "@/lib/models/DashboardUser";
import { NextRequest, NextResponse } from "next/server"

export const POST = async (req:NextRequest)=>{
    
    try {
        const {email} = await req.json();
        
        if(!email){
            return NextResponse.json({message:"Please enter email", error:true, sucess:false}, {status: 400});
        }
        await ConnectedToDB();
        
        const user = await DashboardUser.findOne({email});

        if(!user){
            return NextResponse.json({message: "Invalid User", error:true, success:false}, {status: 400});
        }
        await sendEmail({email,  emailType: "RESET", userId:user._id});
        
        return NextResponse.json({message:"Verify User", date:user._id, success:true, error:false}, {status:200});
    } catch (error) {
        console.log("[forgetPassword_verifuemail]", error);
        return new NextResponse("Internal Server Error", {status:500})
    }
}