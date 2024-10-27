"use client"
import DashboardUserTop from "@/app/components/dashboardUser/TopNavBarButtom/DashboardUserTop"
import navLink from "@/lib/constant"
import { Menu } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"

const TopNevBar = () => {
  const usePath = usePathname()

  const [menuDown, setMenuDown] = useState(false)
  return (
    <div className="min-lg:hidden sticky top-0 left-0 border-b-2 z-50 bg-gray-300 flex items-center lg:hidden md:px-2 justify-between w-full px-3 gap-x-5 border shadow-md font-medium lg:px-10 py-1">
      <Image src={'/logo.png'} alt="logo" width={200} height={200} className="w-12 h-12 obj mix-blend-multiply" />
      <div className="max-md:hidden flex items-center justify-between gap-4">
        {
          navLink.map((item) => (
            <Link href={item.url} key={item.name}
              className={` items-start flex gap-1 ${usePath == item.url ? 'text-blue-600 outline-1' : 'text-gray-950'}`}
            >
              {item.Icon}
              <p>{item.name}</p>
            </Link>
          ))
        }
      <DashboardUserTop />

      </div>
      <div className="relative flex items-center justify-between gap-4 md:hidden">
        <Menu
          className=" cursor-pointer md:hidden"
          onClick={() => setMenuDown(!menuDown)} />
        <div className=" text-lg space-y-5 bg-white rounded border py-5 shadow-lg absolute top-10 left-0">
          {
            menuDown && (
              navLink.map((item) => (
                <Link href={item.url} key={item.name}
                  onClick={() => setMenuDown(!menuDown)}
                  className={` items-start px-10 flex gap-3 ${usePath == item.url ? 'text-blue-600 outline-1' : 'text-gray-950'}`}
                >
                  {item.Icon}
                  <p>{item.name}</p>
                </Link>
              ))
            )

          }
        </div>
        <DashboardUserTop />
      </div>
    </div>
  )
}

export const dynamic = "force-dynamic";
export default TopNevBar;