import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Orders";
import { NextRequest, NextResponse } from "next/server";
import { format } from "date-fns";

export const GET = async (req: NextRequest, { params }: { params: { collectionId: string } }) => {
    try {

        const id = params.collectionId;
        const orders = await Order.find({ "products.collectionId": id }).sort({ createAt: "desc"});

        const filterOrders = await Promise.all(orders.map(async (order) => {
            const customer = await Customer.findOne({ clerkId: order.customerClerkId });
            
            const orders = order.products.filter((item:any)=> item.collectionId === id);
            
            return {
                customerName: customer.name,
                customerEmail: customer.email,
                orderId: order._id,
                orders,
                totalAmount: order.totalAmount,
                orderLength: orders.length,
                shippingAddress: order.shippingAddress,
                createdAt: format(order.createdAt, "MMM do, yyy")
            }


        }));
        console.log(filterOrders);
        return NextResponse.json(filterOrders, { status: 200 })
    } catch (error) {
        console.log("[orders_collection_collectionId_GET]", error);
        return new NextResponse("Internal Server Error", { status: 500 })
    }
}