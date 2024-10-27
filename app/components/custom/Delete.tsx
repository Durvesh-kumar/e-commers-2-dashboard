'use client'
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import toast from "react-hot-toast";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DeleteProps {
    id: string,
    item: string;
}

const Delete: React.FC<DeleteProps> = ({ id, item }) => {

    const handleDelete = async (id: string) => {
        const typeItem = item === "Product" ? "products" : "collections"
        try {
            const res = await fetch(`/api/${typeItem}/${id}`, {
                method: "DELETE"
            });
            
            const data = await res.json()
            if (data.success) {
                toast.success(`${item} delete successfully`);
                window.location.href = `/${typeItem}`
            }
            if(data.error){
                toast.error(data.message)
            }
        } catch (error) {
            console.log("[Delete_DELETE]", error);
            window.location.href = `/${typeItem}`
            toast.error("Somthing went wrong! Please try again")
        }

    }
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button
                    type="button"
                    size="sm"
                    className="bg-red-600 shadow-lg text-white rounded hover:bg-white hover:text-black border"
                >
                    <Trash2 className=" w-5 h-5" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white">
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete your &nbsp;
                        {item} and remove your data from our servers.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel className="bg-red-500 text-white border hover:border-black hover:text-black hover:bg-white">Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDelete(id)} className="bg-blue-500 text-white border hover:border-black hover:text-black hover:bg-white">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export const dynamic = "force-dynamic";
export default Delete;