"use client";
import { faqs, trustLogos } from "@/lib/constant";
import React, { useState } from "react";
import { Card, CardContent } from "../ui/card";
import { 
  Heart, 
  Shield, 
  Sparkles, 
  ChevronDown, 
  Star, 
  Users, 
  Award, 
  Clock,
  MessageCircle,
  HelpCircle
} from "lucide-react";

const FAQSection = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(0);
  const [hoveredFAQ, setHoveredFAQ] = useState<number | null>(null);

  const trustStats = [
    { icon: Users, value: "2M+", label: "Patients Served" },
    { icon: Award, value: "98%", label: "Satisfaction Rate" },
    { icon: Clock, value: "24/7", label: "Support Available" },
    { icon: Star, value: "4.9/5", label: "Doctor Rating" }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-orange-50 via-white to-blue-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-r from-orange-200 to-orange-100 rounded-full blur-3xl opacity-30"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-200 to-blue-100 rounded-full blur-3xl opacity-30"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Trust Section */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center space-x-3 mb-8">
            <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-3 rounded-2xl shadow-lg">
              <Heart className="h-8 w-8 text-white" fill="white" />
            </div>
            <div className="text-left">
              <h2 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                HealthHub
              </h2>
              <p className="text-sm text-gray-600 font-medium">Trusted by Millions</p>
            </div>
          </div>

          {/* Trust Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
            {trustStats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div 
                  key={index}
                  className="text-center group"
                >
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-500/10 to-blue-500/10 border border-orange-200 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-to-br group-hover:from-orange-500/20 group-hover:to-blue-500/20 group-hover:scale-110 transition-all duration-300">
                    <Icon className="w-8 h-8 text-orange-500 group-hover:text-orange-600 transition-colors duration-300" />
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-2 group-hover:scale-110 transition-transform duration-300">
                    {stat.value}
                  </div>
                  <div className="text-gray-600 font-medium group-hover:text-gray-700 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust Logos */}
          <div className="mb-8">
            <p className="text-gray-600 text-lg mb-8 font-medium">
              Trusted by leading healthcare organizations worldwide
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center">
              {trustLogos.map((logo, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center h-20 text-gray-400 font-medium text-lg opacity-70 hover:opacity-100 hover:scale-110 transition-all duration-300 grayscale hover:grayscale-0"
                >
                  {logo}
                </div>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div className="inline-flex items-center space-x-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-200 shadow-sm">
            <Shield className="w-5 h-5 text-green-500" />
            <span className="text-gray-700 font-medium">
              HIPAA Compliant • End-to-End Encrypted • 100% Secure
            </span>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <HelpCircle className="w-8 h-8 text-orange-500" />
              <h2 className="text-4xl font-bold text-gray-900">
                Frequently Asked Questions
              </h2>
            </div>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Get answers to common questions about our healthcare services, 
              appointments, and how we ensure your medical privacy and security.
            </p>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card 
                key={index} 
                className={`bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl rounded-2xl overflow-hidden transition-all duration-300 ${
                  hoveredFAQ === index ? 'ring-2 ring-orange-200' : ''
                } ${openFAQ === index ? 'ring-2 ring-orange-300' : ''}`}
                onMouseEnter={() => setHoveredFAQ(index)}
                onMouseLeave={() => setHoveredFAQ(null)}
              >
                <CardContent className="p-0">
                  <button
                    className="w-full px-8 py-6 text-left flex items-center justify-between hover:bg-orange-50/50 transition-all duration-300 group"
                    onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        openFAQ === index 
                          ? 'bg-gradient-to-r from-orange-500 to-orange-600' 
                          : 'bg-gray-100 group-hover:bg-orange-100'
                      }`}>
                        <MessageCircle className={`w-4 h-4 transition-colors duration-300 ${
                          openFAQ === index ? 'text-white' : 'text-gray-600 group-hover:text-orange-600'
                        }`} />
                      </div>
                      <div className="text-left">
                        <h3 className={`text-lg font-semibold transition-colors duration-300 ${
                          openFAQ === index ? 'text-orange-600' : 'text-gray-900 group-hover:text-orange-600'
                        }`}>
                          {faq.question}
                        </h3>
                        {openFAQ !== index && (
                          <p className="text-gray-500 text-sm mt-1 line-clamp-1">
                            {typeof faq.answer === 'string' ? faq.answer.substring(0, 80) + '...' : 'Click to view answer'}
                          </p>
                        )}
                      </div>
                    </div>
                    
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openFAQ === index 
                        ? 'bg-orange-100 text-orange-600 rotate-180' 
                        : 'bg-gray-100 text-gray-600 group-hover:bg-orange-100 group-hover:text-orange-600'
                    }`}>
                      <ChevronDown className="w-5 h-5 transition-transform duration-300" />
                    </div>
                  </button>

                  {openFAQ === index && (
                    <div className="px-8 pb-6 animate-in fade-in-50 duration-300">
                      <div className="flex space-x-4">
                        <div className="w-1 bg-gradient-to-b from-orange-500 to-orange-600 rounded-full flex-shrink-0"></div>
                        <div>
                          <p className="text-gray-700 leading-relaxed text-lg">
                            {faq.answer}
                          </p>
                          {index === 0 && (
                            <div className="mt-4 flex items-center space-x-2 text-sm text-orange-600 font-medium">
                              <Sparkles className="w-4 h-4" />
                              <span>Most frequently asked question</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Support CTA */}
          <div className="text-center mt-12">
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 border-0 rounded-2xl overflow-hidden">
              <CardContent className="p-8">
                <div className="flex items-center justify-center space-x-3 mb-4">
                  <MessageCircle className="w-8 h-8 text-white" />
                  <h3 className="text-2xl font-bold text-white">
                    Still have questions?
                  </h3>
                </div>
                <p className="text-orange-100 text-lg mb-6 max-w-2xl mx-auto">
                  Our medical support team is available 24/7 to help you with any questions 
                  about our services, appointments, or your healthcare journey.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button className="bg-white text-orange-600 hover:bg-orange-50 font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-lg hover:shadow-xl">
                    Contact Support
                  </button>
                  <button className="border-2 border-white text-white hover:bg-white hover:text-orange-600 font-semibold px-8 py-3 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5">
                    Live Chat
                  </button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FAQSection;