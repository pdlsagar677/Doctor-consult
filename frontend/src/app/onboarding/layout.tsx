'use client'
import { userAuthStore } from '@/store/authStore'
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'
import { Heart, Shield } from 'lucide-react';

const Layout = ({children}:{children:React.ReactNode}) => {
    const {isAuthenticated} = userAuthStore();

    useEffect(() => {
        if(!isAuthenticated){
            redirect('/login/patient')
        }
    },[isAuthenticated])

    if(!isAuthenticated) return null;
    
  return (
    <div className='min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 flex flex-col'>
        {/* Header */}
        <header className='bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 shadow-sm'>
            <div className='max-w-4xl mx-auto'>
                <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-3'>
                        <div className='bg-gradient-to-r from-emerald-500 to-teal-500 p-2 rounded-xl shadow-sm'>
                            <Heart className="w-6 h-6 text-white" fill="white" />
                        </div>
                        <div>
                            <h1 className='text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent'>
                                HealthHub
                            </h1>
                            <p className='text-xs text-gray-600 font-medium -mt-1'>Medical Excellence</p>
                        </div>
                    </div>
                    
                    {/* Security Badge */}
                    <div className='hidden sm:flex items-center space-x-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200'>
                        <Shield className='w-3 h-3 text-emerald-600' />
                        <span className='text-xs text-emerald-700 font-medium'>Secure Portal</span>
                    </div>
                </div>
            </div>
        </header>

        {/* Main Content */}
        <main className='flex-1 flex items-center justify-center p-6'>
            <div className='w-full max-w-4xl mx-auto'>
                {children}
            </div>
        </main>

        {/* Footer */}
        <footer className='bg-white/60 backdrop-blur-sm border-t border-gray-200 py-4 px-6'>
            <div className='max-w-4xl mx-auto text-center'>
                <div className='flex items-center justify-center space-x-6 text-xs text-gray-500'>
                    <div className='flex items-center space-x-1'>
                        <Shield className='w-3 h-3 text-emerald-500' />
                        <span>HIPAA Compliant</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                        <div className='w-1 h-1 bg-emerald-400 rounded-full'></div>
                        <span>End-to-End Encrypted</span>
                    </div>
                    <div className='flex items-center space-x-1'>
                        <div className='w-1 h-1 bg-emerald-400 rounded-full'></div>
                        <span>© 2024 HealthHub</span>
                    </div>
                </div>
            </div>
        </footer>
    </div>
  )
}

export default Layout