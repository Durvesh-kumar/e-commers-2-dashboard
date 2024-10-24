import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const GET = async(req:NextRequest, {params}:{params: {collectionId: string}})=>{
    try {
        const products = await Product.find({ collections: params.collectionId});

        if(!products){
            return new NextResponse("Product not found", {status: 400})
        }
        return NextResponse.json(products, {status:200})
    } catch (error) {
        console.log("[collectionsProducts_GET]", error);
        return new NextResponse("Internal Sever Error", {status: 500});
    }
};