import { UserButton } from '@/component/auth/user-button'
import React from 'react'

const Protected = () => {
    return (
        <div className="flex flex-col justify-center items-center h-screen text-2xl font-bold">
            <div className="absolute top-5 right-10">
                <UserButton />
            </div>
            This is a protected page
        </div>
    )
}

export default Protected