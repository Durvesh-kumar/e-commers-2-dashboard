"use client"

import Delete from "@/app/components/custom/Delete";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Edit2 } from "lucide-react";
import Link from "next/link";

import Loader from "@/app/components/custom/Loader";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useSession } from "next-auth/react";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Pagination from "@/app/components/Pagination";
import toast from "react-hot-toast";

export default function Products() {
    const router = useRouter()
    const { data }: { data: any } = useSession();

    const [products, setProducts] = useState<ProductType[]>([]);
    const [loading, setLoading] = useState(true);
    const [allProducts, setAllProducts] = useState([]);
    const [queary, setQueary] = useState("");
    const [pages, setPages] = useState(1);

    const getProducts = async () => {
        try {
            const res = await fetch('/api/products', {
                method: "GET"
            })
            if (res.ok) {
    
                const data = await res.json();
                setProducts(data);
                setAllProducts(data)
                setLoading(false)
            }
        } catch (error) {
            setLoading(false);
            console.log("[products-new_GET]", error);
            toast.error("Somthing went wrong! Please try agian")
        }
    }

    const page = Number(pages);
    const limit = 10;

    const skip = (page - 1) * limit;

    const currentPage = page * limit;

    const currentPageProducts = products.slice(skip, currentPage)

    useEffect(() => {
        getProducts()
    }, [])

    useEffect(() => {
        searchQuery(queary)
    }, [queary]);

    const searchQuery = (queary: string) => {

        let filterData = allProducts;

        if (queary) {
            filterData = allProducts.filter((product: ProductType) => (
                product.title.toLowerCase().includes(queary.toLowerCase()) ||
                product?.collections?.title.toLowerCase().includes(queary.toLowerCase()) ||
                product.brand.toLowerCase().includes(queary.toLowerCase()) ||
                product.category.toLowerCase().includes(queary.toLowerCase())
            ))
            setProducts(filterData)
        } else {
            setProducts(allProducts)
        }
    }

    return loading ? <Loader /> : (
        <div>
            <div className="font-bold text-[30px]">Products List</div>
            {
                data && (
                    <div className="flex item-center justify-end">
                        {
                            data?.role !== "Gerenal" && (
                                <Button onClick={() => router.push('/products/new')}
                                    className="bg-blue-500 text-white hover:bg-white hover:text-black w-fit px-4 border hover:border-2 flex gap-2">
                                    <Plus /> Product
                                </Button>
                            )
                        }

                    </div>
                )
            }

            <hr className="py-0.5 bg-gray-900 my-8" />
            {
                allProducts.length === 0 ? (
                    <div className="text-xl font-bold">Product not found</div>
                ) :
                    (
                        <div>
                            <div className="flex flex-col gap-5 border p-5 rounded-lg shadow-md">
                                <Input placeholder="Search product........" className="w-1/2" value={queary} onChange={(e) => setQueary(e.target.value)} />
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[50px]">SNo.</TableHead>
                                            <TableHead>Title</TableHead>
                                            <TableHead>Collection</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Price &#x20B9;</TableHead>
                                            <TableHead>Pay &#x20B9;</TableHead>
                                            {
                                                data && (
                                                    data?.role !== "Gerenal" && (
                                                        <TableHead className="flex items-center justify-around">Action</TableHead>
                                                    )
                                                )
                                            }

                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {
                                            currentPageProducts?.map((product:ProductType, index: number) => (
                                                <TableRow key={product._id}>
                                                    <TableCell className="font-medium">{index + 1}</TableCell>
                                                    <TableCell>
                                                        <Link href={`/products/${product._id}`} className="hover:text-blue-600">
                                                            {product?.title}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Link href={`/collections/${product.collections._id}`} className="hover:text-blue-600">
                                                            {product?.collections?.title}
                                                        </Link>
                                                    </TableCell>
                                                    <TableCell>{product.category}</TableCell>
                                                    <TableCell>{product.price}</TableCell>
                                                    <TableCell>{product.pay}</TableCell>
                                                    {
                                                        data && (
                                                            <TableCell className="text-right flex items-center justify-center gap-5">
                                                                {
                                                                    data?.role === "Owner" && (
                                                                        <Delete id={product._id} item="Product" />
                                                                    )
                                                                }{
                                                                    data?.role !== "Gerenal" && (
                                                                        <Link
                                                                            className="flex items-center justify-center shadow-lg bg-blue-600 hover:bg-white text-white hover:text-black rounded border"
                                                                            href={{
                                                                                pathname: "products/edit",
                                                                                query: { productId: product._id, collectionId: product.collections._id },
                                                                            }}
                                                                        >
                                                                            <Edit2 className="h-5 w-5 m-1.5" />
                                                                        </Link>
                                                                    )
                                                                }

                                                            </TableCell>
                                                        )
                                                    }

                                                </TableRow>
                                            ))
                                        }
                                    </TableBody>
                                </Table>
                            </div>
                            <Pagination totalData={products.length} page={page} setPage={setPages} limit={limit} />
                        </div>
                    )
            }

        </div>
    )
}

export const dynamic = "force-dynamic";
