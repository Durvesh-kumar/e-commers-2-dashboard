import { ConnectedToDB } from "../db/ConnectToDB";
import Customer from "../models/Customer";
import Order from "../models/Orders";

export const getDbUsers = async () => {
    try {
        const res = await fetch(`${process.env.DASHBOARD_PUBLIC_URL}/api/users`, {
            method: "GET"
        });

        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.log("[getUsers_GET]", error);
    }
};

export const getcollectionDetails = async (cillectionId: string) => {
    try {
        const res = await fetch(`${process.env.DASHBOARD_PUBLIC_URL}/api/collections/${cillectionId}`, {
            method: "GET"
        });

        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.log("[getcollectionDetails_GET]", error);
    }
};

export const getcollectionOrders = async (collectionId: string) => {
    try {
        const res = await fetch(`${process.env.DASHBOARD_PUBLIC_URL}/api/orders/collection/${collectionId}`, {
            method: "GET"
        });

        if (res.ok) {
            return await res.json()
        }
    } catch (error) {
        console.log("[getcollectionOrders_GET]", error);
    }
};

export const getCustomers = async () => {
    await ConnectedToDB();
    const customers = await Customer.find()
    return customers?.length
};

export const getTotalSales = async () => {
    try {
        await ConnectedToDB();
        const orders = await Order.find();
        const totalOrders = orders.length;
        const totleRevenus = orders.reduce((acc, order) => acc + order.totalAmount, 0)
        return { totalOrders, totleRevenus }
    } catch (error) {
        console.log("[getTotaleSales_GET]", error);
    }
};

export const getSalesPerMonth = async () => {
    try {
        await ConnectedToDB();
        const orders = await Order.find();

        const salesPerMonth = orders.reduce((acc, order) => {
            const monthIndex = new Date(order?.createdAt).getMonth();
            acc[monthIndex] = (acc[monthIndex] || 0) + order.totalAmount;
            return acc
        }, {})

        const grapData = Array.from({ length: 12 }, (_, i) => {
            const month = new Intl.DateTimeFormat('en-IN', { month: 'short' }).format(new Date(0, i, 1));
            return { name: month, sales: salesPerMonth[i] || 0 }
        })
        return grapData

    } catch (error) {
        console.log("[getTotaleSales_GET]", error);
    }
};

