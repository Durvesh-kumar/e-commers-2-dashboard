import { getcollectionDetails } from '@/lib/actions/actions'
import Image from 'next/image';
import Link from 'next/link';
import React from 'react'

const CollectionDetails = async ({ params }: { params: { collectionId: string } }) => {
  const collecrion = await getcollectionDetails(params.collectionId);

  return (
    <div className='flex flex-col gap-5'>
      <div className='flex items-center justify-center'>
        <Image src={collecrion.image} alt='collection_Image' width={1000} height={1000} className='w-96 h-96 object-scale-down rounded-lg shadow-lg border mix-blend-multiply' />
      </div>
      <div className='flex items-center gap-3'>
        <h1 className='text-xl font-bold text-orange-500 '>Title :</h1>
        <h2 className='text-lg font-bold'>{collecrion.title}</h2>
      </div>

      <div className='flex flex-col gap-3'>
        <h1 className='text-xl font-bold text-orange-500'>Discription :</h1>
        <p className='text-sm'>{collecrion.discription}</p>
      </div>

      <section className='grid max-md:grid-cols-2 lg:grid-cols-4 items-center justify-between gap-4'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-lg font-bold text-orange-500'>State :</h1>
          <p className='text-sm font-bold'>{collecrion.state}</p>
        </div>
        <div className='flex flex-col gap-2'>
          <h1 className='text-lg font-bold text-orange-500'>City :</h1>
          <p className='text-sm font-bold'>{collecrion.city}</p>
        </div>
        <div className='flex flex-col gap-2'>
          <h1 className='text-lg font-bold text-orange-500'>Pin Code :</h1>
          <p className='text-sm font-bold'>{collecrion.pinCode}</p>
        </div>
        <div className='flex flex-col gap-2'>
          <h1 className='text-lg font-bold text-orange-500'>Phone No :</h1>
          <p className='text-sm font-bold'>{collecrion.phoneNo}</p>
        </div>
      </section>

      <div className='flex gap-2 items-center'>
        <h1 className='text-lg font-bold text-orange-500'>Address :</h1>
        <p className='text-sm font-medium'>{collecrion.address}</p>
      </div>

      <div className='flex items-center gap-10'>
        <Link href={{
          pathname: "/collections/collectionProducts",
          query: { collectionId: collecrion._id }
        }}
          className='px-3 py-1 border-black border-2 hover:bg-white hover:text-black shadow-md
         bg-blue-400 flex items-center justify-center text-lg font-bold rounded-md text-white'
        >
          Show products
        </Link>
        <Link
          href={`/collections/orders/${collecrion._id}`}
          className='px-3 py-1 border-black border-2 hover:bg-white hover:text-black shadow-md
         bg-blue-400 flex items-center justify-center text-lg font-bold rounded-md text-white'
        >
          Show Orders
        </Link>
      </div>

      <Link
        href={`/collections`}
        className='px-3 py-1 w-fit border-black border-2 hover:bg-white hover:text-black shadow-md
       bg-red-400 flex items-center justify-center text-lg font-bold rounded-md text-white'
      >
        Back
      </Link>
    </div>
  )
}

export const dynamic = "force-dynamic"
export default CollectionDetails
