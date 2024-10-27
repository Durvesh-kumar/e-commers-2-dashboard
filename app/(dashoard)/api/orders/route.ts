import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Orders";
import { NextResponse } from "next/server";
import { format } from 'date-fns';


export const GET = async () => {
    try {
        await ConnectedToDB()
        const orders = await Order.find().sort({ createdAt: "desc" });

        const orderDetails = await Promise.all(orders.map(
            async (order) => {
                const customer = await Customer.findOne({ clerkId: order.customerClerkId });
                return {
                    orderId: order._id,
                    customerEmail: customer.email,
                    totalAmount: order.totalAmount,
                    shippingRate: order.shippingAddress,
                    products: order.products.length,
                    createdAt: format(order.createdAt, "MMM do, yyyy")
                }
            }));

        return NextResponse.json(orderDetails, { status: 200 });
    } catch (error) {
        console.log("[orders_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}