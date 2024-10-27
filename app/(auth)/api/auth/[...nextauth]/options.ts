// import CredentialsProvider from "next-auth/providers/credentials"
// import bcrypt from "bcryptjs"
// import { ConnectedToDB } from "@/lib/db/ConnectToDB"
// import DashboardUser from "@/lib/models/DashboardUser"
 
// export const authOptions:any = {
//    providers: [
//     CredentialsProvider({
//         id: "credentials",
//         name: "credentials",
//         credentials: {
//             email: { label: "Email", type: "email" },
//             password: { label: "Password", type: "password" },
//           },
//           async authorize(credentials:any, req): Promise<any> {
//               await ConnectedToDB()
//               try {
//               const user =  await DashboardUser.findOne({email: credentials.indentifier.email});
//               if(!user){
//                 throw new Error('User invalid')
//               }

//               if(!user.isVerified){
//                 throw new Error("Please verify your account before login")
//               }

//               const isVerifiedPassword = await bcrypt.compare(credentials.password, user.password);

//               if(isVerifiedPassword){
//                 return user
//               }else{
//                 throw new Error("Incorrect Password")
//               }
//               } catch (error:any) {
//                 throw new Error(error)
//               }
//           },
//     })
//    ],
//    callbacks:{
//     async session({ session, token }:{
//         session: any;
//         token:any
//     }) {
//         if(token){
//             session.user._id = token._id?.toString();
//             session.user.isVerified = token.isVerified;
//             session.user.isAcceptingMessages = token.isAcceptingMessages;
//             session.user.username = token.username
//         }
//         return session
//       },
//       async jwt({ token, user }:{
//         token:any;
//         user:any
//       }) {
//         if(user){
//             token._id = user._id?.toString();
//             token.isVerified = user.isVerified;
//             token.isAcceptingMessages = user.isAcceptingMessages;
//             token.username = user.username
//         }
//         return token
//       }
//    },
//    pages: {
//     singnIn : '/sign-in'
//    },
//    session: {
//     strategy: "jwt"
//    },
//    secret: process.env.JWT_SECREATE_KEY
// }