"use client";
import React from 'react'
import { Button } from '../ui/button'
import Link from 'next/link'
import { healthcareCategories } from '@/lib/constant'
import { useRouter } from 'next/navigation';
import { userAuthStore } from '@/store/authStore';
import { Heart, Stethoscope, Shield, Clock, Users, Star, ArrowRight, Sparkles } from 'lucide-react';

const LandingHero = () => {
  const {isAuthenticated} = userAuthStore();
  const router = useRouter();

  const handleBookConsultation = () => {
    if(isAuthenticated) {
      router.push('/doctor-list');
    } else {
      router.push('/signup/patient')
    }
  }

  const handleCategoryClick = (categoryTitle: string) => {
    if(isAuthenticated){
      router.push(`/doctor-list?category=${categoryTitle}`)
    } else {
      router.push('/signup/patient')
    }
  }

  return (
    <section className='relative py-20 px-4 bg-gradient-to-br from-orange-50 via-white to-blue-50 overflow-hidden'>
      {/* Background Elements */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-r from-orange-200 to-orange-100 rounded-full blur-3xl opacity-30'></div>
        <div className='absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-blue-100 rounded-full blur-3xl opacity-30'></div>
        <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-orange-100 to-blue-100 rounded-full blur-3xl opacity-20'></div>
      </div>

      <div className='container mx-auto text-center relative z-10'>
        {/* Header Logo/Brand */}
        <div className='flex items-center justify-center space-x-3 mb-8'>
          <div className='bg-gradient-to-r from-orange-500 to-blue-600 p-3 rounded-2xl shadow-lg'>
            <Heart className='h-8 w-8 text-white' fill='white' />
          </div>
          <div className='text-left'>
            <h1 className='text-3xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent'>
              HealthHub
            </h1>
            <p className='text-sm text-gray-600 font-medium'>Medical Excellence</p>
          </div>
        </div>

        {/* Main Hero Content */}
        <div className='max-w-4xl mx-auto'>
          <h1 className='text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 leading-tight mb-6'>
            Healthcare that{' '}
            <span className='bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent'>
              truly cares
            </span>
          </h1>
          <p className='text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed'>
            Experience premium healthcare with certified doctors who listen. 
            Affordable, accessible, and available 24/7 for all your medical needs.
          </p>
          
          {/* CTA Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center mb-16'>
            <Button 
              onClick={handleBookConsultation} 
              size='lg' 
              className='bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-2xl px-8 py-4 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1'
            >
              <Stethoscope className='w-5 h-5 mr-2' />
              Book Video Consultation
              <Sparkles className='w-4 h-4 ml-2' />
            </Button>
            
            <Link href='/login/doctor' className='flex-1 sm:flex-none'>
              <Button 
                size='lg' 
                variant='outline' 
                className='w-full border-2 border-gray-300 text-gray-700 hover:border-orange-500 hover:text-orange-600 hover:bg-orange-50 rounded-2xl px-8 py-4 text-lg font-semibold transition-all duration-300 transform hover:-translate-y-0.5'
              >
                <Shield className='w-5 h-5 mr-2' />
                Doctor Login
              </Button>
            </Link>
          </div>

          {/* Healthcare Categories */}
          <section className='py-8 mb-12'>
            <div className='container mx-auto px-4'>
              <div className='text-center mb-8'>
                <h2 className='text-2xl md:text-3xl font-bold text-gray-900 mb-3'>
                  Specialized Care for Every Need
                </h2>
                <p className='text-gray-600 max-w-2xl mx-auto'>
                  Connect with top specialists across various medical fields
                </p>
              </div>
              
              <div className='flex justify-center items-center overflow-x-auto gap-4 md:gap-6 pb-4 scrollbar-hide mx-auto max-w-6xl'>
                {healthcareCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => handleCategoryClick(category.title)}
                    className='flex flex-col items-center min-w-[120px] group transition-all duration-300 hover:scale-110'
                  >
                    <div
                      className={`w-16 h-16 ${category.color} rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 border-2 border-white group-hover:border-orange-200`} 
                    >
                      <svg className='w-8 h-8 text-white' fill='currentColor' viewBox='0 0 24 24'>
                        <path d={category.icon}/>
                      </svg>
                    </div>
                    <span className='text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-orange-600 transition-colors duration-300'>
                      {category.title}
                    </span>
                  </button>
                ))}
                
                {/* View All Button */}
                <button
                  onClick={() => handleCategoryClick('')}
                  className='flex flex-col items-center min-w-[120px] group transition-all duration-300 hover:scale-110'
                >
                  <div className='w-16 h-16 bg-gradient-to-r from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-3 group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-1 border-2 border-white group-hover:border-orange-200'>
                    <ArrowRight className='w-8 h-8 text-gray-600 group-hover:text-orange-600 transition-colors duration-300' />
                  </div>
                  <span className='text-sm font-semibold text-gray-700 text-center leading-tight group-hover:text-orange-600 transition-colors duration-300'>
                    View All
                  </span>
                </button>
              </div>
            </div>
          </section>

          {/* Trust Indicators */}
          <div className='bg-white/60 backdrop-blur-sm rounded-2xl p-8 shadow-lg border border-gray-100'>
            <div className='grid grid-cols-1 md:grid-cols-3 gap-8 text-center'>
              <div className='flex flex-col items-center space-y-3'>
                <div className='w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center'>
                  <Users className='w-6 h-6 text-white' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-900'>500+</div>
                  <div className='text-gray-600 font-medium'>Certified Doctors</div>
                </div>
                <div className='flex items-center space-x-1 text-orange-500'>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className='w-4 h-4 fill-current' />
                  ))}
                </div>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <div className='w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center'>
                  <Heart className='w-6 h-6 text-white' fill='white' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-900'>50K+</div>
                  <div className='text-gray-600 font-medium'>Satisfied Patients</div>
                </div>
                <div className='text-sm text-green-600 font-semibold flex items-center'>
                  <div className='w-2 h-2 bg-green-500 rounded-full mr-2'></div>
                  98% Satisfaction Rate
                </div>
              </div>

              <div className='flex flex-col items-center space-y-3'>
                <div className='w-12 h-12 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center'>
                  <Clock className='w-6 h-6 text-white' />
                </div>
                <div>
                  <div className='text-2xl font-bold text-gray-900'>24/7</div>
                  <div className='text-gray-600 font-medium'>Available</div>
                </div>
                <div className='text-sm text-blue-600 font-semibold'>
                  Instant Appointments
                </div>
              </div>
            </div>

            {/* Security Badge */}
            <div className='mt-6 pt-6 border-t border-gray-200'>
              <div className='inline-flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-full'>
                <Shield className='w-4 h-4 text-green-500' />
                <span className='text-sm text-gray-600 font-medium'>
                  HIPAA Compliant • End-to-End Encrypted • 100% Secure
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Elements */}
      <div className='absolute bottom-10 left-10 w-4 h-4 bg-orange-400 rounded-full animate-pulse'></div>
      <div className='absolute top-20 right-20 w-3 h-3 bg-blue-400 rounded-full animate-pulse delay-75'></div>
      <div className='absolute top-40 left-20 w-2 h-2 bg-green-400 rounded-full animate-pulse delay-150'></div>
    </section>
  )
}

export default LandingHero