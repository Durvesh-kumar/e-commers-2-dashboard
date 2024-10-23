"use client"
import Loader from '@/app/components/custom/Loader';
import OrderProductDetails from '@/app/components/orders/OrderProduct';
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const OrderDetails = () => {
    const searchParams = useSearchParams();
    const orderId = searchParams.get('orderId');
    const collectionId = searchParams.get('collectionId');
    const [productDetails, setProductDetails] = useState([]);
    const [shippingAddress, SetShippingAddress] = useState<ShippingAddressType | null>(null);
    const [loading, setLoading] = useState(true)

    const getOrderDetails = async () => {
        const res = await fetch("/api/orders/orderDetails", {
            method: "POST",
            body: JSON.stringify({ orderId, collectionId })
        });

        if (res.ok) {
            const data = await res.json()
            setProductDetails(data.oederDetails);
            SetShippingAddress(data.order.shippingAddress);
            setLoading(false)
        }
    }

    useEffect(() => {
        getOrderDetails()
    }, []);

    return loading ? <Loader /> : (
        <div className='flex flex-col gap-9'>
            <div>
                {
                    productDetails.map((item: OrderDetailsType, index:number) => (
                        <div key={index+1}>
                            <OrderProductDetails productData={item.product} />
                            <section className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-4'>
                                <div className='flex gap-2 items-center'>
                                    <h1 className='text-orange-400 font-bold text-xl'>Size :</h1>
                                    <p className='font-medium'>{item?.size}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <h1 className='text-orange-400 font-bold text-xl'>Color :</h1>
                                    <p className='font-medium'>{item?.color}</p>
                                </div>
                                <div className='flex gap-2 items-center'>
                                    <h1 className='text-orange-400 font-bold text-xl'>Quantity :</h1>
                                    <p className='font-medium'>{item?.quantity}</p>
                                </div>
                            </section>
                        </div>

                    ))
                }
            </div>
            <hr/>

            <div className='flex flex-col gap-3'>
                <h1 className='text-xl font-bold'>Shipping Addres :</h1>

                <section className='grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-3 gap-5'>
                    <div className='flex gap-2'>
                        <h4 className='text-gray-950 font-bold'>State :</h4>
                        <p className="font-medium">{shippingAddress?.state}</p>
                    </div>
                    <div className='flex gap-2'>
                        <h4 className='text-gray-950 font-bold'>City :</h4>
                        <p className="font-medium">{shippingAddress?.city}</p>
                    </div>
                    <div className='flex gap-2'>
                        <h4 className='text-gray-950 font-bold'>PostalCode:</h4>
                        <p className="font-medium">{shippingAddress?.postalCode}</p>
                    </div>
                </section>

                <div className='flex gap-2'>
                    <h4 className='text-gray-950 font-bold'>Address :</h4>
                    <p className="font-medium">{shippingAddress?.street}</p>
                </div>
            </div>
        </div>
    )
}

export const dynamic = "force-dynamic";
export default OrderDetails;