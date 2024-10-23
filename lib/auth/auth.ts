import type { NextAuthOptions } from "next-auth";
import credentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { ConnectedToDB } from "../db/ConnectToDB";
import DashboardUser from "../models/DashboardUser";


export const authOptions: NextAuthOptions = {
    providers: [
        credentialsProvider({
            name: "Credentials",
            id: "credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials: any): Promise<any> {

                try {
                    await ConnectedToDB()

                    const user = await DashboardUser.findOne({ email: credentials?.email });

                    if(user.isVerified !== true){
                        throw new Error("User not verifyed")
                    }

                    if (!user) {
                        throw new Error("Invalid email");
                    }

                    const mathchPassord = await bcrypt.compare(credentials?.password, user.password);

                    if (!mathchPassord) {
                        throw new Error("Wrong password");
                    }
                    
                    return user;
                } catch (error: any) {
                    throw new Error(error);
                }
            },
        }),
    ],
    
    session: {
        strategy: "jwt",
    },
    callbacks: {
        async jwt({ token, user }) {
            if(user){
                return{
                    ...token,
                    role : user?.role,
                    isVerified : user?.isVerified,
                    collection: user?.collections
                }
                
            }
            
            return token;
        },
        async session({ session, token }) {
            if(token){
                return{
                    ...session,
                    role: token.role,
                    isVerified: token.isVerified,
                    collection: token?.collections
                }
            }
            
            return session;
        }
    },
    secret: process.env.AUTH_SECRET
};

export const dynamic = "force-dynamic";