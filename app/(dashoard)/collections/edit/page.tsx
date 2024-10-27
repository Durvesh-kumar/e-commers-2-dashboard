"use client"
import CollectionForm from '@/app/components/collections/form/CollectionForm'
import Loader from '@/app/components/custom/Loader';
import {  useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { date } from 'zod';

const Edit = () => {
  const usePrams = useSearchParams();
  const Id = usePrams.get('id')

  const [collection, setCollection] = useState<CollectionType |null>(null);
  const [loading, setLoading] = useState(true);

const getCollection = async ()=>{
  try {
    const res = await fetch(`/api/collections/${Id}`,{
      method: "GET"
    })
    
    if(res.ok){
      const data = await res.json()
      setLoading(false)
       setCollection(data)
    }
  } catch (error) {
    setLoading(false)
    console.log(error);
  }
}
  useEffect(()=>{
    getCollection()
  }, [Id]);

  return loading ? <Loader/> : (
    <CollectionForm initialData={collection}/>
  );
};

export const dynamic = "force-dynamic";
export default Edit;