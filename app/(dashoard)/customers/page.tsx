"use client"

import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Loader from "@/app/components/custom/Loader";

import { useEffect, useState } from "react";
import Pagination from "@/app/components/Pagination";
import toast from "react-hot-toast";

export default function Products() {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [allCustomers, setAllCustomers] = useState([]);
    const [queary, setQueary] = useState("");
    const [pages, setPages] = useState(1);

    const getProducts = async () => {
        try {
            const res = await fetch("/api/customers", {
                method: "GET"
            })
            if (res.ok) {

                const data = await res.json();
                setCustomers(data);
                setAllCustomers(data)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false)
            console.log("[customers_GET]", error);
            toast.error("Somthing went wrong! Please try agian")
        }
    }

    const page = Number(pages);
    const limit = 10;

    const skip = (page - 1) * limit;

    const currentPage = page * limit;

    const currentPageCustomers = customers.slice(skip, currentPage);

    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        searchQuery(queary)
    }, [queary]);

    const searchQuery = (queary: string) => {

        let filterData = allCustomers;

        if (queary) {
            filterData = allCustomers.filter((customer: CustomersType) => (
                customer.email.toLowerCase().includes(queary.toLowerCase()) ||
                customer.name.toLowerCase().includes(queary.toLowerCase())
            ));
            setCustomers(filterData);
        } else {
            setCustomers(allCustomers);
        }
    }

    return loading ? <Loader /> : (
        <div>
            <div className="font-bold text-[30px]">Customer list</div>

            <hr className="py-0.5 bg-gray-900 my-8" />

            {
                allCustomers.length === 0 ? (
                    <div className="text-xl font-bold">Customer not found</div>
                ) : (
                    <div>
                        <div className="flex flex-col gap-5 border p-5 rounded-lg shadow-md">
                            <Input placeholder="Search product........" className="w-1/2" value={queary} onChange={(e) => setQueary(e.target.value)} />
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">SNo.</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Name</TableHead>
                                        <TableHead>Orders</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        currentPageCustomers?.map((customer: CustomersType, index: number) => (
                                            <TableRow key={customer._id}>
                                                <TableCell className="font-medium">{index + 1}</TableCell>

                                                <TableCell>{customer?.email}</TableCell>
                                                <TableCell>{customer?.name}</TableCell>
                                                <TableCell>{customer?.orders?.length}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination totalData={customers.length} page={page} setPage={setPages} limit={limit} />
                    </div>
                )
            }

        </div>
    )
}

export const dynamic = "force-dynamic";