import nodemailer from "nodemailer";

import bcrypt from "bcryptjs";
import DashboardUser from "@/lib/models/DashboardUser";
import { ConnectedToDB } from "@/lib/db/ConnectToDB";

export const sendEmail = async ({ email, emailType, userId }: { email: string, emailType: string, userId: string }) => {
    try {
        const hashToken = await bcrypt.hash(userId.toString(), 10);

        await ConnectedToDB();

        if (emailType === "VERIFY") {

            await DashboardUser.findByIdAndUpdate(userId, {
                $set:{
                    verifyToken: hashToken,
                    verifyTokenExpiry: Date.now() + 3600000
                }
                
            }, { new: true, runVaidators: true });

        } else if (emailType === "RESET") {

            await DashboardUser.findByIdAndUpdate(userId, {
                $set:{
                    forgotPasswordToken: hashToken,
                    forgotPasswordTokenExpiry: Date.now() + 3600000
                }
                
            }, { new: true, runVaidators: true });
        }


        // Looking to send emails in production? Check out our Email API/SMTP product!
        const transport = nodemailer.createTransport({
            service: "gmail",
            logger: true,
            debug: true,
            port: 587,
            secure: false,
            auth: {
              user: "durvesh88999@gmail.com",
              pass: "gftedcqlqoalhzkt"
            },
            tls: {
                rejectUnauthorized: true
            }
          });
        
        const mailOptions = {
            from: process.env.SEND_EMAL,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<p>Click <a href= "${process.env.DASHBOARD_PUBLIC_URL}/verifyemail?tikken=${hashToken}">Cleck_here</a> 
            to ${emailType === "VERIFY" ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD"}
             or copy paste the link blow in your browser.`
        };

        const mailresponse = await transport.sendMail(mailOptions);
        
        return mailresponse;

    } catch (error: any) {
        throw new Error(error)
    }
}