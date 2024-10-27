"use client"
import { Button } from '@/components/ui/button';
import { ImageUp, Plus, Trash2, User2Icon } from 'lucide-react';
import { CldUploadWidget } from 'next-cloudinary';
import Image from "next/image"

interface ImageUploaderPropes {
  value: string[];
  onChange: (value: string) => void;
  onRemove: (value: string) => void;
}

const RegisterImageUploader: React.FC<ImageUploaderPropes> = ({ value, onChange, onRemove }) => {

  const onSuccess = async (result: any) => {
    const url = result?.info.secure_url;

    if (url !== "") {
      onChange(url)
    }

  }

  return (
    <div className=' relative'>
      <div className='flex flex-wrap items-center gap-2 justify-center'>
        {
          value[0] ?
            value?.map((image: string) => (
              <div key={image} className='w-[100px] h-[100px] rounded-full border-2 shadow-md gap-10 relative border-black'>
                <Image src={image} alt='Image' width={500} height={500} sizes='sm' className='w-[100px] h-[100px] object-center mix-blend-multiply rounded-full shadow-md' />
                <div onClick={() => onRemove(image)} className='absolute right-7 p-0.5 rounded-full bottom-1 text-white hover:bg-red-600 z-10 rounded-f bg-red-400 cursor-pointer'><Trash2 className='w-4 h-4' /></div>
              </div>

            )) :
            <User2Icon className='w-[100px] h-[100px] rounded-full border border-black bottom-2 ' />
        }
      </div>
      <div className=' absolute top-0 left-[111px] opacity-0'>
        <CldUploadWidget uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME} onSuccess={onSuccess}>
          {({ open }) => {
            return (
              <Button type='button' onClick={() => open()} className={`bg-orange-600 text-white px-6 h-[100px] w-[100px] rounded-full flex gap-2 ${value[0] ? 'hidden' : null}`}>
                {
                  value[0] ? <Plus className='w-4 h-4' /> : <ImageUp className='w-4 h-4' />
                }
                <span>Upload an Image</span>
              </Button>

            );
          }}
        </CldUploadWidget>
      </div>

    </div>
  )
}

export const dynamic = "force-dynamic";
export default RegisterImageUploader;