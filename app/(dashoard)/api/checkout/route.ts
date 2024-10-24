import stripe from "@/lib/checkout/striprKey";
import { NextRequest, NextResponse } from "next/server"


const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Method": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Contect-type, Authorization"
}

export function OPTIONS() {
    return NextResponse.json({}, { headers: corsHeaders })
}

export async function POST(req: NextRequest) {
    try {
        const { cartItems, customer } = await req.json();

        if (!cartItems || !customer) {
            return new NextResponse("Not enough data to checkout", { status: 400 })
        }
        
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            mode: "payment",
            shipping_address_collection: {
                allowed_countries: ["IN"],
            },
            shipping_options: [
                { shipping_rate: "shr_1Q8D6VSJZBIurQqJK0Invw8d" }, // EXPRESS
                { shipping_rate: "shr_1Q8D85SJZBIurQqJ2JKtTuwz" } // FREE
            ],

            line_items: cartItems.map((cartItem: CartItem) => ({
                price_data: {
                    currency: "INR",
                    product_data: {
                        name: cartItem?.item?.title,
                        metadata: {
                            collectionId: cartItem?.item?.collections,
                            productId: cartItem?.item?._id,
                            ...(cartItem?.size && { size: cartItem?.size }),
                            ...(cartItem?.color && { color: cartItem?.color })
                        }
                    },
                    unit_amount: cartItem?.item?.pay * 100
                },
                quantity: cartItem?.quantity
            })),
            client_reference_id: customer.clerkId,
            success_url: `${process.env.ECOMMECRE_STORE_URL}/payment_success`,
            cancel_url: `${process.env.ECOMMECRE_STORE_URL}/cart`
        })
        
        return NextResponse.json(session, {headers: corsHeaders})
    } catch (error) {
      console.log("[checkout_POST]", error);
      return new NextResponse("Internal Server Errror", {status: 200})
    }
}