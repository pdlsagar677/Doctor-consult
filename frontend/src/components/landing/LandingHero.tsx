"use client";
import React from "react";
import { Button } from "../ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { userAuthStore } from "@/store/authStore";
import {
  Stethoscope,
  Shield,
  Clock,
  Sparkles,
  Award,
  CheckCircle,
  Zap,
} from "lucide-react";

const LandingHero = () => {
  const { isAuthenticated } = userAuthStore();
  const router = useRouter();

  const handleBookConsultation = () => {
    if (isAuthenticated) {
      router.push("/doctor-list");
    } else {
      router.push("/signup/patient");
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 bg-gradient-to-br from-emerald-50 via-white to-emerald-100 overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 -left-10 w-80 h-80 bg-gradient-to-r from-emerald-200 to-teal-200 rounded-full blur-3xl opacity-40 animate-float-slow"></div>
        <div className="absolute bottom-1/4 -right-10 w-96 h-96 bg-gradient-to-r from-teal-200 to-emerald-200 rounded-full blur-3xl opacity-30 animate-float-medium"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-emerald-100 to-teal-100 rounded-full blur-3xl opacity-20 animate-float-fast"></div>

        {/* Subtle Geometric Accents */}
        <div className="absolute top-20 right-32 w-6 h-6 border-2 border-emerald-400/30 rotate-45 animate-pulse"></div>
        <div className="absolute bottom-32 left-24 w-4 h-4 border-2 border-emerald-300/40 rotate-12 animate-pulse delay-75"></div>
        <div className="absolute top-40 left-32 w-8 h-8 border-2 border-emerald-500/20 -rotate-45 animate-pulse delay-150"></div>
      </div>

      <div className="container mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="text-left space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
              <Award className="w-4 h-4" />
              <span className="text-sm font-semibold">
                Trusted by 50K+ Patients Worldwide
              </span>
            </div>

            {/* Headline */}
            <div className="space-y-6">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-gray-900 leading-tight">
                Your Health,
                <span className="block bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">
                  Our Priority
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 leading-relaxed max-w-2xl">
                Experience healthcare reimagined with instant access to top
                medical specialists.
                <span className="font-semibold text-emerald-700">
                  {" "}
                  Quality care
                </span>{" "}
                that fits your life.
              </p>
            </div>

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4 max-w-md">
              {[
                { text: "Instant Appointments", icon: Zap },
                { text: "24/7 Availability", icon: Clock },
                { text: "Certified Doctors", icon: Shield },
                { text: "Secure & Private", icon: CheckCircle },
              ].map((feature, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <div className="w-6 h-6 bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full flex items-center justify-center">
                    <feature.icon className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                onClick={handleBookConsultation}
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold rounded-2xl px-8 py-6 text-lg shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 group"
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Stethoscope className="w-6 h-6" />
                    <Sparkles className="w-4 h-4 absolute -top-1 -right-1 text-emerald-200 group-hover:scale-110 transition-transform" />
                  </div>
                  <span>Start Your Consultation</span>
                </div>
              </Button>

              <Link href="/login/doctor" className="flex-1 sm:flex-none">
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full border-2 border-gray-300 hover:border-emerald-600 hover:bg-emerald-50 text-gray-700 hover:text-emerald-700 rounded-2xl px-8 py-6 text-lg font-bold transition-all duration-300 group"
                >
                  <div className="flex items-center space-x-2">
                    <Shield className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span>For Doctors</span>
                  </div>
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-emerald-500 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-emerald-500 rounded-full mt-2"></div>
          </div>
        </div>
      </div>

      {/* Animations */}
      <style jsx>{`
        @keyframes float-slow {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(180deg);
          }
        }
        @keyframes float-medium {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-30px) rotate(90deg);
          }
        }
        @keyframes float-fast {
          0%,
          100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-40px) scale(1.1);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 6s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 10s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
};

export default LandingHero;
