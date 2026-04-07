'use client';

import { Check, Home } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SuccessDisplay () {
    const router = useRouter();

    // useEffect(() => {
    //     const timer = setTimeout(() => {
    //     router.push("/dashboard"); // change route
    //     }, 2500);

    //     return () => clearTimeout(timer); // cleanup
    // }, [router]);
    
    return (
        <div className=" bg-darkest min-h-[50dvh] h-[70dvh] relative w-1/2 mx-auto p-6 centered">
            <Image
                src={'/success.png'}
                alt="success-banner-image"
                fill
                className="z-0"
            />
            <article className=" w-72 h-72 p-6 flex flex-col space-y-4 items-center  bg-darkest/10 backdrop-blur-md z-10">
                <div className="p-6 rounded-full centered border-2 border-success-dark text-success-dark bg-darkest ">
                    <Check size={75} />
                </div>
                <p className="capitalize text-whitesmoke">
                    Booking successfully submitted
                </p>
                <Link href="/dashboard" className=" btn flex items-center space-x-2">
                    <Home size={20} strokeWidth={1} />
                    <p className="text-lg">Home</p>
                </Link>
            </article>
        </div>
    );
}