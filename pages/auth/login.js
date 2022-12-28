import React, {useState } from "react";
import Head from "next/head";
import Link from 'next/link'

import { useForm } from 'react-hook-form';

const Login = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = data => {
        console.log(data);
    };


    return (
        <div>
            <Head>
                <title>Škola</title>
            </Head>
            <div className="container mx-auto px-5 global w-full h-screen flex justify-center items-center">
                <div className="w-[350px] h-[550px] p-5 border flex flex-col justify-evenly">
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
                        <div className="w-full py-2 mt-1 cursor-pointer  text-right">
                            <Link href="/auth/forgot-password">
                                <span className="text-blue-500 underline text-sm ">Zaboravili ste lozinku?</span>
                            </Link>
                        </div>
                        <input type="submit" value="Prijava" className="border rounded w-full py-2 px-3 mt-4 cursor-pointer" />
                    </form>
                    <div className="w-full py-2 mt-3 text-s">
                        Ako ne posjedujete korisnički račun molimo vas da se
                        <Link href="/auth/signup">
                            <span className="underline text-blue-500 cursor-pointer"> registrirate.</span>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
