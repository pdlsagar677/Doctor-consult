'use client'
import { userAuthStore } from '@/store/authStore';
import { redirect } from 'next/navigation';
import React, { useEffect } from 'react'
import { Heart, Shield, Stethoscope, Users, Sparkles } from 'lucide-react';

const Layout = ({children}:{children:React.ReactNode}) => {

 const {isAuthenticated,user} = userAuthStore();
  useEffect(() => {
    if(isAuthenticated &&  user) {
      if(!user.isVerified){
        redirect(`/onboarding/${user.type}`)
      }else{
        if(user.type === 'doctor'){
          redirect('/doctor/dashboard')
        }else{
          redirect('/patient/dashboard')
        }
      }
    }
  },[isAuthenticated,user])
  
  return (
    <div className='min-h-screen flex'>
     
     <div className='w-full lg:w-1/2 flex items-center justify-center p-6 bg-white'>
      {children}
     </div>

     <div className='hidden lg:block w-1/2 relative overflow-hidden'>
         {/* Background with animated gradient */}
         <div className='absolute inset-0 bg-gradient-to-br from-emerald-400/20 via-teal-300/15 to-emerald-600/25 z-10'>
           <div className='absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-200/10 via-transparent to-transparent'></div>
         </div>
         
         {/* Floating Elements */}
         <div className='absolute top-20 left-20 w-8 h-8 bg-emerald-300/30 rounded-full blur-sm animate-float-slow'></div>
         <div className='absolute top-40 right-32 w-12 h-12 bg-teal-400/20 rounded-full blur-sm animate-float-medium'></div>
         <div className='absolute bottom-32 left-32 w-6 h-6 bg-emerald-500/25 rounded-full blur-sm animate-float-fast'></div>
         <div className='absolute bottom-20 right-20 w-10 h-10 bg-teal-300/30 rounded-full blur-sm animate-float-slow'></div>

         <div className='w-full h-full bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 flex items-center justify-center relative'>
            <div className='text-center text-white p-8 max-w-lg z-20'>
              {/* Brand Logo */}
              <div className='flex items-center justify-center space-x-3 mb-8'>
                <div className='w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center border border-white/30'>
                  <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
                <div className='text-left'>
                  <h1 className='text-3xl font-bold text-white'>HealthHub</h1>
                  <p className='text-white/80 text-sm'>Medical Excellence</p>
                </div>
              </div>

              {/* Main Content */}
              <div className='space-y-6'>
                <h2 className='text-5xl font-black leading-tight'>
                  Healthcare
                  <span className='block text-white/90'>Reimagined</span>
                </h2>
                
                <p className='text-xl text-white/90 leading-relaxed'>
                  Experience premium healthcare with certified doctors who truly care about your well-being.
                </p>

                {/* Features Grid */}
                <div className='grid grid-cols-2 gap-6 mt-8'>
                  <div className='text-center space-y-2'>
                    <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30'>
                      <Stethoscope className='w-6 h-6 text-white' />
                    </div>
                    <p className='text-sm font-semibold'>Expert Doctors</p>
                    <p className='text-xs text-white/80'>Certified Specialists</p>
                  </div>
                  
                  <div className='text-center space-y-2'>
                    <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30'>
                      <Shield className='w-6 h-6 text-white' />
                    </div>
                    <p className='text-sm font-semibold'>Secure & Private</p>
                    <p className='text-xs text-white/80'>HIPAA Compliant</p>
                  </div>
                  
                  <div className='text-center space-y-2'>
                    <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30'>
                      <Sparkles className='w-6 h-6 text-white' />
                    </div>
                    <p className='text-sm font-semibold'>Instant Access</p>
                    <p className='text-xs text-white/80'>24/7 Available</p>
                  </div>
                  
                  <div className='text-center space-y-2'>
                    <div className='w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/30'>
                      <Users className='w-6 h-6 text-white' />
                    </div>
                    <p className='text-sm font-semibold'>50K+ Patients</p>
                    <p className='text-xs text-white/80'>Trusted Platform</p>
                  </div>
                </div>

                {/* Stats */}
                <div className='flex justify-center space-x-8 pt-6 border-t border-white/20'>
                  <div className='text-center'>
                    <div className='text-2xl font-bold'>500+</div>
                    <div className='text-xs text-white/80'>Doctors</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold'>50K+</div>
                    <div className='text-xs text-white/80'>Patients</div>
                  </div>
                  <div className='text-center'>
                    <div className='text-2xl font-bold'>98%</div>
                    <div className='text-xs text-white/80'>Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>
         </div>

         {/* Bottom Security Badge */}
         <div className='absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20'>
           <div className='flex items-center space-x-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20'>
             <Shield className='w-4 h-4 text-white' />
             <span className='text-sm text-white/90 font-medium'>HIPAA Compliant Platform</span>
           </div>
         </div>
     </div>

     <style jsx>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(90deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-10px) scale(1.1); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 6s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
      `}</style>
    </div>
  )
}

export default Layout