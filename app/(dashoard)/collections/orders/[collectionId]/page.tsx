"use client"

import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import Link from "next/link";

import Loader from "@/app/components/custom/Loader";

import { useEffect, useState } from "react";
import Pagination from "@/app/components/Pagination";

export default function CollectionOrders({ params }: { params: { collectionId: string } }) {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allOrders, setAllOrders] = useState([]);
    const [queary, setQueary] = useState("");
    const [pages, setPages] = useState(1)

    const getProducts = async () => {
        const res = await fetch(`/api/orders/collection/${params.collectionId}`, {
            method: "GET"
        })
        if (res.ok) {

            const data = await res.json();
            setOrders(data);
            setAllOrders(data)
            setLoading(false)
        }
    }

    const page = Number(pages);
    const limit = 10;

    const skip = (page - 1) * limit;

    const currentPage = page * limit;

    const currentPageOrders = orders.slice(skip, currentPage)

    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        searchQuery(queary)
    }, [queary]);

    const searchQuery = (queary: string) => {

        let filterData = allOrders;

        if (queary) {
            filterData = orders.filter((order: OrderType) => (
                order.orderId.toLowerCase().includes(queary.toLowerCase()) ||
                order.customerName.toLowerCase().includes(queary.toLowerCase()) ||
                order.customerEmail.toLowerCase().includes(queary.toLowerCase())
            ))
            setOrders(filterData)
        } else {
            setOrders(allOrders)
        }
    }

    return loading ? <Loader /> : (
        <div>
            <div className="font-bold text-[30px]">Products List</div>

            <hr className="py-0.5 bg-gray-900 my-8" />

            {
                allOrders.length === 0 ? (
                    <div className="text-xl font-bold">Order not found</div>
                ) : (
                    <div>
                        <div className="flex flex-col gap-5 border p-5 rounded-lg shadow-md">
                            <Input placeholder="Search product........" className="w-1/2" value={queary} onChange={(e) => setQueary(e.target.value)} />
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">SNo.</TableHead>
                                        <TableHead>Order Id</TableHead>
                                        <TableHead>Customer Email</TableHead>
                                        <TableHead>Customer Name</TableHead>
                                        <TableHead>Order Length</TableHead>
                                        <TableHead>Totle Amount</TableHead>
                                        <TableHead>Created</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        currentPageOrders?.map((order: OrderType, index: number) => (
                                            <TableRow key={order.orderId}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>
                                                <TableCell>
                                                    <Link href={{
                                                        pathname: "/OrderDetails",
                                                        query: { orderId: order.orderId, collectionId: params.collectionId },
                                                    }} className="hover:text-blue-600">
                                                        {order.orderId}
                                                    </Link>
                                                </TableCell>
                                                <TableCell>{order?.customerEmail}</TableCell>
                                                <TableCell>{order.customerName}</TableCell>
                                                <TableCell className="text-center">{order.orderLength}</TableCell>
                                                <TableCell>{order.totalAmount}</TableCell>
                                                <TableCell>{order.createdAt}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination totalData={orders.length} page={page} setPage={setPages} limit={limit} />
                    </div>
                )
            }

        </div>
    )
}

export const dynamic = "force-dynamic";