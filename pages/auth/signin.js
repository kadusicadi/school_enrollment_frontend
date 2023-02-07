import React, { useState } from "react";
import Head from "next/head";
import Link from 'next/link'
import { useForm } from 'react-hook-form';
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation"; 

const Signin = () => {
    const searchParams = useSearchParams();     
    const message = searchParams.get("message");

    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = async (data) => {
        try {
            const res = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: true,
                callbackUrl: "/",
            });
        } catch (e) {
            console.log(e)
        }
    };

    return (
        <div>
            <Head>
                <title>Škola</title>
            </Head>
            <div className="container mx-auto px-5 global w-full h-screen flex justify-center items-center">

                <div className="w-[350px] h-[550px] p-5 border flex flex-col justify-evenly">
                    {message && <p className="text-red-700 bg-red-100 py-2 px-5 rounded-md text-center">{message}</p>}
                    <h1 className="text-xl font-semibold text-center">Srednja Škola</h1>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <label htmlFor="email" className="block text-sm font-bold mb-2 mt-4">Email</label>
                        <input
                            className="border rounded w-full py-2 px-3"
                            type="email"
                            placeholder="Email"
                            {...register('email', { required: "Polje je obavezno!" })}
                        />
                        {errors.email && <p className="error">{errors.email?.message}</p>}
                        <label htmlFor="password" className="block text-sm font-bold mb-2 mt-4">Password</label>
                        <div className="relative">
                            <input
                                className="border rounded w-full py-2 px-3"
                                type='password'
                                placeholder="Password"
                                {...register('password', { required: "Polje je obavezno!" })}
                            />
                        </div>
                        {errors.password && <p className="error">{errors.password?.message}</p>}
                        <input type="submit" value="Prijava" className="border rounded w-full py-2 px-3 mt-4 cursor-pointer" />
                    </form>
                    <div className="w-full py-2 mt-1 cursor-pointer  text-right">
                        <Link href="/auth/forgot-password">
                            <span className="text-blue-500 underline text-sm ">Zaboravili ste lozinku?</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Signin;
