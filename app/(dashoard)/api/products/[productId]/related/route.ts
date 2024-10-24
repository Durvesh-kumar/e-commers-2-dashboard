import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { productId: string } }) => {
    try {

        await ConnectedToDB();
        const product = await Product.findById(params.productId);

        if (!product) {
            return new NextResponse("Ptroduct not found", { status: 400 })
        }

        const relatedProducts = await Product.find({
            $or: [
                { category: product.category },
                { brand: product.brand },
                {tags: {$in: product.tags.map((item:any)=> item)}}
            ],
            _id: { $ne: product._id }
        })

        if (!relatedProducts) {
            return new NextResponse("Product not found", { status: 400 })
        }

        return NextResponse.json(relatedProducts, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        })

    } catch (error) {
        console.log("[related_GET]", error);
        return new NextResponse("Internal Sever Error", { status: 500 })
    }
}