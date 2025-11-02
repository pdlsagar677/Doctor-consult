// src/components/auth/AuthForm.tsx
'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent } from '@/components/ui/card';
import { Eye, EyeOff, Stethoscope, Shield, Heart } from 'lucide-react';
import { userAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AuthFormProps {
  type: 'login' | 'signup';
  userRole: 'doctor' | 'patient';
}

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ;

const AuthForm = ({ type, userRole }: AuthFormProps) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isFocused, setIsFocused] = useState({
    name: false,
    email: false,
    password: false
  });
  
  const { 
    registerPatient, 
    registerDoctor, 
    loginPatient, 
    loginDoctor, 
    loading, 
    error ,
  } = userAuthStore();

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (type === 'signup' && !agreeToTerms) return;

    try {
      if (type === 'signup') {
        if (userRole === 'doctor') {
          await registerDoctor({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
        } else {
          await registerPatient({
            name: formData.name,
            email: formData.email,
            password: formData.password,
          });
        }
        router.push(`/onboarding/${userRole}`);
      } else {
        if (userRole === 'doctor') {
          await loginDoctor(formData.email, formData.password);
          router.push('/doctor/dashboard');
        } else {
          await loginPatient(formData.email, formData.password);
          router.push('/patient/dashboard');
        }
      }
    } catch (err) {
      console.log(err)
      console.error(`${type} failed:`, err);
    }
  };

  const handleGoogleAuth = () => {
    window.location.href = `${BASE_URL}/auth/google?type=${userRole}`;
  };

  const handleFocus = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: true }));
  };

  const handleBlur = (field: string) => {
    setIsFocused(prev => ({ ...prev, [field]: false }));
  };

  const isSignup = type === 'signup';
  const title = isSignup ? 'Create Your Medical Account' : 'Welcome Back to HealthHub';
  const subtitle = isSignup 
    ? 'Join our trusted healthcare community' 
    : 'Access your personalized health dashboard';
  const buttonText = isSignup ? 'Create Secure Account' : 'Sign In to Dashboard';
  const altLinkText = isSignup ? 'Already have an account?' : "New to HealthHub?";
  const altLinkAction = isSignup ? 'Sign In' : 'Create Account';
  const altLinkPath = isSignup ? `/login/${userRole}` : `/signup/${userRole}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-3 rounded-2xl shadow-lg">
              <Heart className="h-8 w-8 text-white" fill="white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                HealthHub
              </h1>
              <p className="text-sm text-gray-600 font-medium">Medical Excellence</p>
            </div>
          </div>
          
          {/* Role Badge */}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-orange-100 border border-orange-200 mb-4">
            <Stethoscope className="h-4 w-4 text-orange-600 mr-2" />
            <span className="text-sm font-semibold text-orange-800 capitalize">
              {userRole} Portal
            </span>
          </div>
        </div>

        {/* Auth Card */}
        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500"></div>
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
              <p className="text-gray-600">{subtitle}</p>
            </div>
          
            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center">
                <Shield className="h-4 w-4 mr-2" />
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name field for signup */}
              {isSignup && (
                <div className="space-y-3">
                  <Label htmlFor="name" className="text-sm font-semibold text-gray-700">
                    Full Name
                  </Label>
                  <div className="relative">
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      onFocus={() => handleFocus('name')}
                      onBlur={() => handleBlur('name')}
                      className={`h-12 px-4 border-2 rounded-xl transition-all duration-200 ${
                        isFocused.name 
                          ? 'border-orange-500 ring-2 ring-orange-200' 
                          : 'border-gray-200 hover:border-gray-300'
                      } focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                      placeholder="Hary"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    onFocus={() => handleFocus('email')}
                    onBlur={() => handleBlur('email')}
                    className={`h-12 px-4 border-2 rounded-xl transition-all duration-200 ${
                      isFocused.email 
                        ? 'border-orange-500 ring-2 ring-orange-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    } focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                    placeholder="your.email@example.com"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-3">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700">
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    onFocus={() => handleFocus('password')}
                    onBlur={() => handleBlur('password')}
                    className={`h-12 px-4 pr-12 border-2 rounded-xl transition-all duration-200 ${
                      isFocused.password 
                        ? 'border-orange-500 ring-2 ring-orange-200' 
                        : 'border-gray-200 hover:border-gray-300'
                    } focus:border-orange-500 focus:ring-2 focus:ring-orange-200`}
                    placeholder="••••••••"
                    required
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-orange-50 rounded-lg"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-500" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-500" />
                    )}
                  </Button>
                </div>
                {isSignup && (
                  <p className="text-xs text-gray-500">
                    Must be at least 8 characters with numbers and symbols
                  </p>
                )}
              </div>

              {/* Terms checkbox for signup */}
              {isSignup && (
                <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <Checkbox
                    id="terms"
                    checked={agreeToTerms}
                    onCheckedChange={(checked) => setAgreeToTerms(checked as boolean)}
                    className="data-[state=checked]:bg-orange-600 data-[state=checked]:border-orange-600 mt-0.5"
                  />
                  <label htmlFor="terms" className="text-sm text-gray-600 leading-5 cursor-pointer">
                    I confirm that I am over 18 years old and agree to HealthHub's{' '}
                    <Link href="#" className="text-orange-600 hover:text-orange-700 font-semibold hover:underline">Terms</Link> and{' '}
                    <Link href="#" className="text-blue-600 hover:text-blue-700 font-semibold hover:underline">Privacy Policy</Link>.
                  </label>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                disabled={loading || (isSignup && !agreeToTerms)}
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{type === 'signup' ? 'Creating Account...' : 'Signing In...'}</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Shield className="h-4 w-4" />
                    <span>{buttonText}</span>
                  </div>
                )}
              </Button>
            </form>

            {/* Separator */}
            <div className="mt-8 mb-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-white text-gray-500 font-medium">Secure Authentication</span>
                </div>
              </div>
            </div>


            {/* Alternative Link */}
            <div className="mt-8 text-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-600">{altLinkText} </span>
              <Link 
                href={altLinkPath}
                className="text-orange-600 hover:text-orange-700 font-semibold hover:underline transition-colors duration-200"
              >
                {altLinkAction}
              </Link>
            </div>

            {/* Security Badge */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-3 py-2 rounded-full">
                <Shield className="h-3 w-3 text-green-500" />
                <span>HIPAA Compliant • End-to-End Encrypted</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AuthForm;