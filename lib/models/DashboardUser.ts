import mongoose from "mongoose";

const deshboardUserSchema = new mongoose.Schema({
    email: {
        type: String,
        required:[true, "Email is required"],
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Email is invalid",
          ],
          
    },
    role:{
        type: String
    },
    name:{
        type:String,
        trim: true,
        required:true
    },
    image:String,
    
    password: {
        type: String,
        required: true,
        trim: true
    },
    isVerified:{
        type:Boolean,
        default:false
    },
    collections:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Collection"
    },
  
    forgotPasswordOTPExpiry:Date,
    forgotPasswordOTP: Number,
    verifyOTP: Number,
    verifyOTPExpiry:Date,
    

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});


const DashboardUser = mongoose.models.DashboardUser || mongoose.model('DashboardUser', deshboardUserSchema);

export const dynamic = "force-dynamic";
export default DashboardUser;

