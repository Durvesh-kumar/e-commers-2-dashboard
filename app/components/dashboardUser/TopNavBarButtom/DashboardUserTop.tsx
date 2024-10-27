"use client";
import { Button } from "@/components/ui/button";
import { CircleUserRound, LogIn, LogOut } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

function DashboardUserTop() {
    const { status, data } = useSession();

    const router = useRouter();

    const handleLogOut = async () => {
        const res = await fetch("/api/logOut", {
            method: "GET"
        })
        const data = await res.json();
        if (data.success) {
            toast.success(data.message);
            router.replace("/")
        }
    }

    const ShowSession = () => {
        if (status === "authenticated") {
            return (
                <div className="flex flex-col gap-4">
                    <Button
                        size={"sm"}
                        className="flex items-center gap-1 bg-red-500 font-bold text-white border border-black hover:bg-white hover:text-black"
                        onClick={() => {
                            handleLogOut(),
                                signOut({ redirect: false }).then(() => {
                                    router.push("/");
                                });

                        }}
                    >
                        LogOut <LogOut className="w-4 h-4" />
                    </Button>
                </div>
            )
        } else if (status === "loading") {
            return (
                <span className="text-[#888] text-sm mt-7 animate-pulse">Loading...</span>
            )
        } else {
            return (
                <div className="flex gap-3">
                    <Link
                        className="flex items-center justify-center gap-1 py-0.5 rounded-lg border border-black px-3 hover:bg-white font-medium hover:text-black text-white bg-green-500"
                        href="/login"
                    >
                        Login <LogIn />
                    </Link>

                </div>

            )
        }
    }
    return (
        <main className="flex gap-4 items-center">
            <div>
                {ShowSession()}
            </div>
            <div className="flex items-center justify-center">
                {
                    data?.user.image ? <Image src={data.user.image} alt="image" width={500} height={500} className="w-11 h-11 object-scale-down rounded-full border border-black shadow-lg" /> : <CircleUserRound className="w-11 h-11 font-normal" />
                }
            </div>


        </main>
    );
}

export const dynamic = "force-dynamic";
export default DashboardUserTop;