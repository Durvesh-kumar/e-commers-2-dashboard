"use client"
import Loader from "@/app/components/custom/Loader";
import ProductForm from "@/app/components/products/form/ProductForm";
import { useSearchParams } from "next/navigation"

import React, { useEffect, useState } from 'react'

function Edit() {
  const usePrams = useSearchParams()
  const productId = usePrams.get("productId");
  const collectionId = usePrams.get("collectionId")
  
  const [products, setProducts] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true)

  const getProducts = async () => {
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "GET"
      })
      if (res.ok) {
        
        const data = await res.json();
        setProducts(data);
        setLoading(false)
      }
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  useEffect(() => {
    getProducts()
  }, [productId])
  console.log(products);
  
  return loading ? <Loader /> : (
    <ProductForm initialData={products} collectionId={collectionId}/>
  )
}

export const dynamic = "force-dynamic"
export default Edit;