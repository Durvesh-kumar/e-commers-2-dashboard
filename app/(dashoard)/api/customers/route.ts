import Customer from "@/lib/models/Customer"
import { NextResponse } from "next/server";

export const GET = async()=>{
    try {
        const customers = await Customer.find();
        return NextResponse.json(customers, {status: 200})
    } catch (error) {
        console.log("[customer_ GET]", error);
        return new NextResponse("Internal Server Error", {status: 500})
    }
}