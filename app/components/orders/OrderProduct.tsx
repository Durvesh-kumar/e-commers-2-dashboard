import IndianCurrency from "@/helpers/IndianCurrency";
import Gallery from "../products/productDetails/Gallery";

interface ProductDetailsPropes {
    productData: ProductType | null;
}
const OrderProductDetails: React.FC<ProductDetailsPropes> = ({ productData }) => {
    return (
        <>
            <h1 className="flex items-center justify-center my-6 text-3xl font-bold">
                {productData?.title}
            </h1>
            <hr className="bg-gray-900 py-0.5 my-10 shadow-lg rounded-xl" />
            <section className="flex items-center justify-center my-7">
                <Gallery media={productData?.media} />
            </section>
            <section>
                <h2 className="text-gray-950 font-bold my-3 text-lg">Discription</h2>
                <p
                    className="mt-3 scrollbar-hide px-3 text-sm"
                >
                    {productData?.discription}
                </p>
            </section>
            <section className="flex gap-x-10 items-center my-5">
                <div className="flex items-center gap-4">
                    <h1 className="text-gray-950 font-bold my-3 text-lg">
                        Price &nbsp;:
                    </h1>
                    <p className="text-gray-500 line-through">{IndianCurrency(productData?.price)}</p>
                </div>
                <div className="flex items-center gap-4">
                    <h1 className="text-gray-950 font-bold my-3 text-lg">Pay &nbsp;:</h1>
                    <p className="text-gray-500">{IndianCurrency(productData?.pay)}</p>
                </div>
            </section>
        </>
    );
};

export const dynamic = "force-dynamic";
export default OrderProductDetails;