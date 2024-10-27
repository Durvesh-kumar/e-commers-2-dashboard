import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Order from "@/lib/models/Orders";
import Product from "@/lib/models/Product";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (req: NextRequest) => {
    try {
        await ConnectedToDB();

        const { orderId, collectionId } = await req.json()

        const order = await Order.findById(orderId).populate({ path: "products.product", model: Product });

        if (!order) {
            return new NextResponse("Order not found", { status: 400 });
        }
        const oederDetails = order.products.filter((order:any) => order?.collectionId === collectionId);
        

        return NextResponse.json({ oederDetails, order }, { status: 200 });
    } catch (error) {
        console.log("[orderId_GET]", error);
        return new NextResponse("Internal server error", { status: 500 })
    }
}