import React from 'react'
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
export const loginSchema = z.object({
    email: z.string().email("Invalid email"),
    password: z.string().min(6, "Minimum 6 characters"),
})

function Login() {
    const navigate = useNavigate();
    const [loginError, setLoginError] = React.useState(null)
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: zodResolver(loginSchema),

    })

    const onSubmit = (data) => {
        setLoginError(null)
        api.post("/api/v1/approver/login", data).then((response) => {
            localStorage.setItem("cc-app-token", response.data.token);
            navigate("/approver/dashboard");

        }).catch((error) => {
            setLoginError(error.response?.data?.message || "Login failed")
        });

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
                {loginError && (
                    <p className="text-red-500 text-sm">{loginError}</p>
                )}
            </form>
        </div>
    )
}

export default Login