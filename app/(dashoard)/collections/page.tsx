'use client'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import Link from "next/link";
import Delete from "@/app/components/custom/Delete";
import { Edit2, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import Loader from "@/app/components/custom/Loader";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Pagination from "@/app/components/Pagination";

const Collections = () => {
  const router = useRouter();
  const { data }: { data: any } = useSession();

  const [collections, setCollections] = useState([]);
  const [loading, setLoading] = useState(true);
  const [allCollections, setAllCollections] = useState([]);
  const [pages, setPages] = useState(1)

  const [query, setQuery] = useState("")
  const getCollections = async () => {
    const res = await fetch('/api/collections', {
      method: "GET"
    })
    if (res.ok) {
      const data = await res.json();
      setLoading(false)
      setCollections(data)
      setAllCollections(data)
    }
  }

  const searchQuery = (query: string) => {
    let filterData = allCollections;

    if (query) {
      filterData = allCollections.filter((collection: CollectionType) =>
        collection.title.toLowerCase().includes(query.toLowerCase()) ||
        collection.userId.email.toLowerCase().includes(query.toLowerCase())
      )
      setCollections(filterData)
    } else {
      setCollections(allCollections)
    }
  }
  const page = Number(pages) || 1;
  const limit = 15;

  const currentPage = page * limit;

  const skip = (page - 1) * limit;

  const pageCollections = collections?.slice(skip, currentPage)

  useEffect(() => {
    searchQuery(query)
  }, [query]);

  useEffect(() => {
    getCollections()
  }, [])

  return loading ? <Loader /> : (
    <div className="flex flex-col">
      <div className="font-bold text-[30px]">Collection list</div>
      <div className="flex item-center justify-end">
        {
          data ? (
            data?.role !== "Gernal" && (<Button onClick={() => router.push('/collections/new')} className="bg-blue-500 text-white hover:bg-white hover:text-black w-fit px-4 border hover:border-2 flex gap-2"><Plus /> Collection</Button>)
          ) : null
        }

      </div>

      <hr className="py-0.5 bg-gray-900 my-10" />

      {
        allCollections.length === 0 ? (
          <div>Collectoin not found</div>
        ) : (
          <div>
            <div className="flex flex-col gap-5 border p-5 rounded-lg shadow-md">
              <Input placeholder="Search collection......" className="w-1/3" value={query} onChange={(e) => setQuery(e.target.value)} />
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">SNo.</TableHead>
                    <TableHead>Title</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Products</TableHead>
                    {
                      data && (
                        data?.role === "Gerenal" ? null : (
                          <TableHead className="flex item-center justify-center">Action</TableHead>
                        )
                      )
                    }

                  </TableRow>
                </TableHeader>
                <TableBody>
                  {
                    pageCollections?.map((collection: CollectionType, index: number) => (
                      <TableRow key={collection._id}>
                        <TableCell className="font-medium">{index + 1}</TableCell>
                        <TableCell>
                          <Link href={`/collections/${collection._id}`} className="hover:text-blue-600">
                            {collection?.title}
                          </Link>
                        </TableCell>
                        <TableCell>{collection?.userId?.email}</TableCell>
                        <TableCell>{collection?.products.length}</TableCell>
                        <TableCell className="flex items-center justify-center gap-7">
                          {
                            data?.role === "Owner" && (
                              <Delete id={collection._id} item="Collection" />
                            )
                          }
                          {
                            data && (
                              data?.role !== "Gerenal" && (
                                <Link
                                  className="flex items-center justify-center shadow-lg bg-blue-600 hover:bg-white text-white hover:text-black rounded border"
                                  // href={{
                                  //   pathname: "collections/edit",
                                  //   query: { id: collection._id },
                                  // }}
                                  href={`/collections/edit?id=${collection._id}`}
                                >
                                  <Edit2 className="h-5 w-5 m-1.5" />
                                </Link>
                              )
                            )

                          }

                        </TableCell>
                      </TableRow>
                    ))
                  }
                </TableBody>
              </Table>
            </div>
            <Pagination page={pages} setPage={setPages} totalData={collections.length} limit={limit} />
          </div>
        )
      }

    </div>
  )
};
export const dynamic = "force-dynamic";
export default Collections;