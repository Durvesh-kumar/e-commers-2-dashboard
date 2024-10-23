"use client"
import DashboardUser from "@/app/components/dashboardUser/DashboardUser"
import navLink from "@/lib/constant"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

const SideNevBar = () => {
  const usePathName = usePathname()

  return (
    <div className="h-screen mb-5 sticky top-0 left-0 flex flex-col bg-blue-2 shadow-lg max-lg:hidden p-10 gap-6">
      <Image src={'/logo.png'} alt="logo" width={200} height={200} className="w-24 h-24 obj mix-blend-multiply" />
      {
        navLink?.map((link) => (
          <Link href={link.url} key={link.name}
            className={` flex items-center gap-2 ${usePathName === link.url ? 'text-blue-600' : 'text-gray-900'}`}>
                   {link.Icon}{link.name}
          </Link>
        ))
      }
      <DashboardUser/>
    </div>
  )
}

export const dynamic = "force-dynamic"
export default SideNevBar