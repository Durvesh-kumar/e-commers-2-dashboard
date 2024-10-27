"use client"
import { Button } from '@/components/ui/button';
import { ImageUp, Plus, Trash2 } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image"

interface ImageUploaderPropes {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const ImageUploader: React.FC<ImageUploaderPropes> = ({ value, onChange, onRemove }) => {

  const onSuccess = async (result: any) => {
    const url = result?.info.secure_url;

    if(url !== ""){
      onChange(url)
    }
    
  }

  return (
    <>
      <div className='flex flex-wrap items-center gap-4 my-8'>
        {
          value?.map((image: string) => (
            <div key={image} className='w-[200px] h-[220px] rounded border shadow-md gap-10 relative'>
              <Image src={image} alt='Image' width={1000} height={1000} sizes='sm' className='w-[200px] h-[220px] object-scale-down rounded shadow-md' />
              <div onClick={()=> onRemove(image)} className='absolute right-1 p-1 top-1 text-white hover:bg-red-600 z-10 rounded bg-red-400 cursor-pointer'><Trash2 className=''/></div>
            </div>

          ))
        }
      </div>
      <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME} onSuccess={onSuccess}>
        {({ open }) => {
          return (
            <Button type='button' onClick={() => open()} className={`bg-orange-600 text-white px-6 flex gap-2 ${value[7] ? 'hidden':null}`}>
              {
                value[0] ? <Plus className='w-4 h-4' /> : <ImageUp className='w-4 h-4' />
              }
              <span>Upload an Image</span>
            </Button>
          );
        }}
      </CldUploadWidget>
    </>
  )
}

export const dynamic = "force-dynamic";
export default ImageUploader;