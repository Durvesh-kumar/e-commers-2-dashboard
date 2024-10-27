import {  LayoutDashboard, Shapes, ShoppingBag, Tag, User, UsersRound } from "lucide-react";

const navLink = [
    {
        url: '/',
        Icon: <LayoutDashboard/>,
        name: "Dashboard"
    },
    {
        url: "/collections",
        Icon: <Shapes/>,
        name: "Collections"
    },
    {
        url: "/products",
        Icon: <Tag />,
        name: "Products"
    },
    {
        url: "/orders",
        Icon: <ShoppingBag />,
        name: "Orders"
    },
    {
        url: "/customers",
        Icon: <User />,
        name: "Customers"
    },
    {
        url: "/users",
        Icon: <UsersRound />,
        name: "Users"
    },

]
export const dynamic = "force-dynamic"
export default navLink