import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { category: string } }) => {
    try {
        await ConnectedToDB();

        const product = await Product.find({ category: params.category });

        if (!product) {
            return new NextResponse(JSON.stringify({ message: 'Product not found' }), { status: 400 })
        }

        return NextResponse.json(product, {
            status: 200,
            headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        })
    } catch (error) {
        console.log('[productId_GET]', error);
        return new NextResponse('Internal Server Error', { status: 500 })
    }
}