import { getCustomers, getSalesPerMonth, getTotalSales } from "@/lib/actions/actions";
import CardPage from "../components/Dashboard/CardPage";
import SalesChart from "../components/Dashboard/SalesChart";

export default async function Home() {

  const totalRevenus = await getTotalSales().then((data)=> data?.totleRevenus);
  console.log(totalRevenus);
  
  const totalOrders = await getTotalSales().then((data)=> data?.totalOrders);
  const grapData = await getSalesPerMonth()
  const totalCustomers = await getCustomers();

  return (
    <div className="grid gap-8 mt-5">
      <h1 className="text-gray-950 text-2xl font-bold">Dashboard</h1>
      <hr className="py-0.5 bg-black shadow-md rounded-2xl" />
      <CardPage totalCustomer={totalCustomers} totalOrders={totalOrders} totalRevenue={totalRevenus} />
      <SalesChart grapData={grapData}/>
    </div>
  )
};
export const dynamic = "force-dynamic";