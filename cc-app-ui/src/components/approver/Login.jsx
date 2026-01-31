import React from 'react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
})

function Login() {

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),

    })

    const onSubmit = (data) => {
        console.log("FORM DATA:", data) // <-- you will get email here
    }

    return (
        <div className='min-h-screen bg-blue-600 flex items-center justify-center'>
            <form
                onSubmit={handleSubmit(onSubmit)}
                className='p-4 bg-white rounded-lg w-full max-w-sm'
            >
                <h2 className='text-2xl font-bold mb-4'>Approver Login</h2>

                <input
                    {...register("email")}
                    placeholder='email'
                    className='border p-2 w-full mb-1 rounded'
                />
                {errors.email && (
                    <p className="text-red-500 text-sm">{errors.email.message}</p>
                )}

                <input
                    type='password'
                    {...register("password")}
                    placeholder='password'
                    className='border p-2 w-full mb-1 rounded'
                />
                {errors.password && (
                    <p className="text-red-500 text-sm">{errors.password.message}</p>
                )}

                <button
                    type="submit"
                    className='bg-blue-600 text-white p-2 rounded w-full mt-2'
                >
                    Login
                </button>
            </form>
        </div>
    )
}

export default Login
