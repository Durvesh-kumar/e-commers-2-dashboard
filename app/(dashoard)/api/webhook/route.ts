import stripe from "@/lib/checkout/striprKey";
import { ConnectedToDB } from "@/lib/db/ConnectToDB";
import Customer from "@/lib/models/Customer";
import Order from "@/lib/models/Orders";
import { NextRequest, NextResponse } from "next/server";

export const POST = async(req:NextRequest)=>{
    try {
        const rawBody = await req.text();
        const signature = req.headers.get("Stripe-Signature") as string;

        const event = stripe.webhooks.constructEvent(
            rawBody,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET_KEY!
        );

        if(event.type === "checkout.session.completed"){
            const session = event.data.object;
            const customerInfo = {
                clerkId: session?.client_reference_id,
                name: session?.customer_details?.name,
                email: session?.customer_details?.email
            }

            const shippingAddress = {
                street: session?.shipping_details?.address?.line1,
                // streetName: session?.shipping_details?.address?.line2,
                city: session?.shipping_details?.address?.city,
                state: session?.shipping_details?.address?.state,
                postalCode: session?.shipping_details?.address?.postal_code,
                counrty: session?.shipping_details?.address?.country,
            };

            const retrieveSession = await stripe.checkout.sessions.retrieve(
                session.id,
                { expand: ["line_items.data.price.product"]}
            );

            const lineItems = await retrieveSession?.line_items?.data;

            const orderItems = lineItems?.map(
                (item:any)=> {
                    return{
                        collectionId: item.price.product.metadata.collectionId,
                        product: item.price.product.metadata.productId,
                        color: item.price.product.metadata.color || "N/A",
                        size: item.price.product.metadata.size || "N/A",
                        quantity: item.quantity || 1
                    }
                }
            );

            await ConnectedToDB();
            
            const newOrder =  new Order({
                customerClerkId: customerInfo.clerkId,
                products: orderItems,
                totalAmount: session.amount_total ? session.amount_total / 100 : 0,
                shippingAddress,
            });

            await newOrder.save();
            let customer = await Customer.findOne({ clerkId: customerInfo.clerkId});

            if(customer){
                customer.orders.push(newOrder._id);
                
            }else{
                customer = new Customer({
                    ...customerInfo,
                    orders: [newOrder._id]
                })
            }
            await customer.save();
        }
        
        return NextResponse.json("Created Order", {status: 200})
    } catch (error) {
        console.log("[webhook_POST]", error);
        return new NextResponse("Failed to create the order", {status:500})
    }
}