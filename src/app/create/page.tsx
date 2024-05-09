"use client"
import React, { useEffect, useState } from 'react'
import Image from "next/image"
import add from "@/asset/add.png"
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import Loading from '@/components/Loading';

export default function Page() {

    const router = useRouter();
    const [creator, setCreator] = useState("");
    const [caption, setCaption] = useState("");
    const [image, setImage] = useState<File>();
    const [previewImage, setPreviewImage] = useState("");
    const [isloading, setIsloading] = useState(false)

    useEffect(() => {
        setCreator(localStorage.getItem("token") || "")
    }, [])

    function handleFileInputChange(event: React.ChangeEvent<HTMLInputElement>) {
        const files = event.target.files;
        if (files && files.length > 0) {
            setImage(files[0]);
            const fileReader = new FileReader();
            fileReader.readAsDataURL(files[0]);
            fileReader.onload = () => {
                const result = fileReader.result;
                if (typeof result === 'string') {
                    setPreviewImage(result);
                } else {
                    console.error('Failed to read file as data URL');
                }
            }
            fileReader.onerror = () => {
                console.error('File reading error occurred');
            }
        }
    }


    async function handlePost(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsloading(true)

        if (caption.length < 3) {
            toast.error("Caption must be atleast 3 characters")
            return;
        }
        const formData = new FormData();
        formData.append("caption", caption)
        formData.append("creator", creator)
        if (image) {
            formData.append("postImage", image)
        }

        const response = await axios.post("/api/post/new", formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
        if (response.status) {
            router.push("/profile/me")
        }
        else {
            setIsloading(false)
            toast.error(response.data.message)
        }
    }
    if (isloading) {
        return (
            <Loading />
        )
    }

    return (
        <main className=" w-full h-full flex items-center py-10 md:p-10">
            <div className=" h-full w-full flex flex-col items-center gap-4 md:gap-10 md:p-8 overflow-y-scroll no-scrollbar">
                <div className="flex flex-col ">
                    <h1 className=" text-white text-3xl font-bold">Create Post</h1>
                </div>
                <form className=' flex flex-col gap-6 w-[90%] md:w-auto' onSubmit={handlePost}>
                    <label htmlFor="image" className=' flex flex-col items-center md:items-start cursor-pointer gap-5 w-full'>
                        <p className=' font-semibold text-lg text-white'>Upload a Photo</p>
                        <div className=' w-[300px]'>
                            <Image src={previewImage || add} alt='' height={5000} width={5000} className=' w-full' />
                        </div>
                    </label>
                    <input className=' hidden' type="file" id='image' onChange={e => { handleFileInputChange(e) }} required />
                    <label className=' text-white text-lg font-semibold' htmlFor="caption">Caption</label>
                    <textarea className=' md:w-[500px] h-[100px] bg-black p-3 rounded-lg text-white focus:outline-none' name="caption" id="caption" placeholder='Whats on your mind' onChange={e => { setCaption(e.target.value) }} required ></textarea>
                    <button type="submit" className=' text-white w-full bg-[#7C55E7] p-2 rounded-lg text-lg font-semibold'>Publish</button>
                </form>
            </div >
            <ToastContainer />
        </main >
    )
}
