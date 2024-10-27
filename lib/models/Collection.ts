import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema({
    title: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },

    

    image: {
        type: String,
        required: true
    },

    discription: {
        type: String,
        required: true
    },

   

    address:{type:String},
    state:{type:String},
    phoneNo:{type:String},
    pinCode: {type: String},
    city: {type: String},

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DashboardUser"
    },

    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],

    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },

})

const Collection = mongoose.models.Collection || mongoose.model("Collection", collectionSchema);

export const dynamic = "force-dynamic";

export default Collection;