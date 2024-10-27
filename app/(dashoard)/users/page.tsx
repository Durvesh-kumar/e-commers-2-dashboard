"use client"
import { Role } from "@/app/components/dashboardUser/Role";
import Pagination from "@/app/components/Pagination";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from 'react'

function Users() {

    const [pages, setPages] = useState(1);
    const [usersData, setUsersData] = useState([]);
    const [isOpen, setIsOpen] = useState(false);
    const [userdData, setUserData] = useState<DashboardUserType | null>(null);
    const [isEffect, setIsEffect] = useState(false);
    const [queary, setQueary] = useState("");
    const [allData, setAllData] = useState([]);



    const session = useSession()
    const data: any = session?.data;

    useEffect(() => {
        searchQuery(queary)
    }, [queary]);

    const searchQuery = (queary: string) => {

        let filterData = allData;

        if (queary) {
            filterData = allData.filter((user: DashboardUserType) => (
                user.email.toLowerCase().includes(queary.toLowerCase()) ||
                user?.collections?.title.toLowerCase().includes(queary.toLowerCase()) ||
                user.role.toLowerCase().includes(queary.toLowerCase())
            ))
            setUsersData(filterData)
        } else {
            setUsersData(allData)
        }
    }

    const getUser = async () => {
        const res = await fetch("/api/users", {
            method: "GET"
        });

        if (res.ok) {
            const data = await res.json()
            setUsersData(data);
            setAllData(data);
        }
    }



    const page = Number(pages) || 1;

    const limit = 15;

    const skip = (page - 1) * limit;
    const currentPage = page * limit;

    const users = usersData?.slice(skip, currentPage);

    useEffect(() => {
        getUser()
    }, [isEffect])

    return (
        <div className="relative">
            <h1 className="text-2xl text-gray-950 font-bold my-5">Dashboard Users</h1>
            <hr className="py-0.5 bg-gray-900 shadow-md my-10" />
            {
                allData.length === 0 ? (
                    <div className="font-bold text-xl">User not found</div>
                ) : (
                    <div>
                        <div className="border p-5 rounded-lg shadow-lg">
                            <Input type="text" placeholder="Search user ....." value={queary} onChange={(e) => setQueary(e.target.value)} className="my-5 w-1/2" />
                            <Table className="w-full">
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[50px]">S.No</TableHead>
                                        <TableHead>Email</TableHead>
                                        <TableHead>Collection title</TableHead>
                                        <TableHead className="text-center">Role</TableHead>
                                        <TableHead className="text-center">Totle products</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {
                                        users?.map((user: DashboardUserType, index: number) => (
                                            <TableRow key={user?._id}>
                                                <TableCell className="font-medium">{index + 1}.</TableCell>
                                                <TableCell>{user?.email}</TableCell>
                                                <TableCell>{user?.collections?.title}</TableCell>
                                                <TableCell className={` text-center ${data?.role === "Owner" && ("hover:text-blue-500 cursor-pointer")} `}
                                                    onClick={() => {
                                                        if (data?.role === "Owner") {
                                                            setUserData(user)
                                                            setIsOpen(!isOpen)
                                                        }
                                                    }}>{user?.role}</TableCell>
                                                <TableCell className="text-center font-medium">{user?.collections?.products?.length}</TableCell>
                                            </TableRow>
                                        ))
                                    }
                                </TableBody>
                            </Table>
                        </div>
                        <Pagination page={pages} setPage={setPages} totalData={usersData.length} limit={limit} />
                        {
                            isOpen && (
                                <div className=" absolute top-0 left-0 flex items-center justify-center w-full">
                                    <Role isOpen={isOpen} setIsOpen={setIsOpen} userdData={userdData} isEffect={isEffect} setIsEffect={setIsEffect} />
                                </div>
                            )
                        }
                    </div>
                )
            }

        </div>
    )
}

export default Users;