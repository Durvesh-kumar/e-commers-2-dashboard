import nodemailer from "nodemailer";

import DashboardUser from "@/lib/models/DashboardUser";
import { ConnectedToDB } from "@/lib/db/ConnectToDB";

export const sendEmail = async ({ email, emailType, userId }: { email: string, emailType: string, userId: string }) => {
    try {

        const generateOTP = () => {
            const chars = "123456789";
            const leng = chars.length;

            let otp = "";

            for (let i = 0; i < 6; i++) {
                otp += chars[Math.floor(Math.random() * leng)]
            }
            return otp;
        }
        const otp = generateOTP()

        await ConnectedToDB();

        if (emailType === "VERIFY") {

            await DashboardUser.findByIdAndUpdate(userId, {
                $set: {
                    verifyOTP: otp,
                    verifyOTPExpiry: Date.now() + 3600000
                }

            }, { new: true, runVaidators: true });

        } else if (emailType === "RESET") {

            await DashboardUser.findByIdAndUpdate(userId, {
                $set: {
                    forgotPasswordOTP: otp,
                    forgotPasswordOTPExpiry: Date.now() + 3600000
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
                user: process.env.SEND_EMAL,
                pass: process.env.NODETEAP_PASS
            },
            tls: {
                rejectUnauthorized: true
            }
        });

        const mailOptions = {
            from: process.env.SEND_EMAL,
            to: email,
            subject: emailType === "VERIFY" ? "Verify your email" : "Reset your password",
            html: `<div>
            <center>
              <h1>${emailType === "VERIFY" ? "VERIFY YOUR EMAIL" : "RESET YOUR PASSWORD"}</h1>
            </center>
            <h2>Action Required: <span>One-Time Verification Code</span> </h3>
            <p>You are receiving this email becouse a request was made for a one-time code that can be used authentication.</p>
            <p>Plesee enter the following code for verification: </p>
            <center>
               <h3>${otp}</h3>
            </center>
               
            <p> If you did not request this change, please change your password or use the chat in the DK-Store user interface to contact us.</p>
            </div>`
        };

        const mailresponse = await transport.sendMail(mailOptions);

        return mailresponse;

    } catch (error: any) {
        throw new Error(error)
    }
}