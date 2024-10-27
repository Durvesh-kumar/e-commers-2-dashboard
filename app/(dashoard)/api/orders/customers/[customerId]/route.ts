import Order from "@/lib/models/Orders";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (req: NextRequest, { params }: { params: { customerId: string } }) => {
    try {
        const orders = await Order.find({ customerClerkId: params.customerId }).populate({ path: "products.product", model: Product });

        if (!orders) {
            return new NextResponse("Orders not found", { status: 400 })
        }

        return NextResponse.json(orders, {
            status: 200, headers: {
                "Access-Control-Allow-Origin": `${process.env.ECOMMECRE_STORE_URL}`,
                "Access-Control-Allow-Methods": "GET",
                "Access-Control-Allow-Headers": "Contect-Type"
            }
        })
    } catch (error) {
        console.log("[orders-Customer_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}