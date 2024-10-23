"use client"
import Loader from "@/app/components/custom/Loader";
import ProductDetails from "@/app/components/products/productDetails/ProductDetails"
import { useEffect, useState } from "react"

const ProductDetail = ({ params }: { params: { productId: string } }) => {
  const [product, setProduct] = useState<ProductType | null>(null);

  const [loading, setLoading] = useState(true)
  const getProduct = async () => {
    const res = await fetch(`/api/products/${params.productId}`, {
      method: "GET"
    })

    if (res.ok) {
      const data = await res.json();
      setProduct(data);
      setLoading(false);
    }
  }

  useEffect(() => {
    getProduct()
  }, [])
  return loading ? <Loader /> : (
    <div>
      <ProductDetails productData={product} />
    </div>
  )
}

export const dynamic = "force-dynamic"
export default ProductDetail;