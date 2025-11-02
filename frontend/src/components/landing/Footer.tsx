"use client";
import { contactInfo, footerSections, socials } from "@/lib/constant";
import {  Heart, Shield, Sparkles, Mail, MapPin, Phone, ArrowRight } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle subscription logic here
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-gradient-to-r from-orange-500/10 to-orange-600/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-gradient-to-r from-blue-500/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Brand Section */}
            <div className="lg:col-span-4">
              <div className="flex items-center space-x-3 mb-6">
                <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                  <Heart className="w-8 h-8 text-white" fill="white" />
                </div>
                <div className="text-left">
                  <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-blue-400 bg-clip-text text-transparent">
                    HealthHub
                  </h1>
                  <p className="text-sm text-gray-300 font-medium">Medical Excellence</p>
                </div>
              </div>

              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Your trusted healthcare partner providing premium medical consultations 
                with certified doctors online, anytime, anywhere. Experience healthcare 
                that truly cares.
              </p>

              <div className="space-y-4 mb-8">
                {contactInfo.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center space-x-4 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-200"
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.icon === Mail && <Mail className="w-5 h-5 text-white" />}
                      {item.icon === Phone && <Phone className="w-5 h-5 text-white" />}
                      {item.icon === MapPin && <MapPin className="w-5 h-5 text-white" />}
                    </div>
                    <span className="text-gray-200 font-medium">{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-full">
                  <Shield className="w-4 h-4 text-green-400" />
                  <span className="text-xs text-gray-300 font-medium">HIPAA Compliant</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/5 px-3 py-2 rounded-full">
                  <Sparkles className="w-4 h-4 text-orange-400" />
                  <span className="text-xs text-gray-300 font-medium">24/7 Available</span>
                </div>
              </div>
            </div>

            {/* Links Section */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                {footerSections.map((section, index) => (
                  <div key={index} className="space-y-4">
                    <h3 className="font-bold text-white text-lg mb-4 flex items-center">
                      <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full mr-3"></div>
                      {section.title}
                    </h3>
                    <ul className="space-y-3">
                      {section.links.map((link, linkIndex) => (
                        <li key={linkIndex}>
                          <a
                            href={link.href}
                            className="text-gray-300 hover:text-white transition-all duration-200 text-sm font-medium group flex items-center"
                          >
                            <div className="w-1 h-1 bg-gray-500 rounded-full mr-3 group-hover:bg-orange-500 group-hover:scale-150 transition-all duration-200"></div>
                            {link.text}
                            <ArrowRight className="w-3 h-3 ml-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-200" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="py-12 border-t border-gray-700/50">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-8 bg-gradient-to-r from-gray-800/50 to-gray-700/30 rounded-2xl border border-gray-600/30 backdrop-blur-sm">
            <div className="text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start space-x-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <h4 className="font-bold text-white text-xl">Stay Updated with HealthHub</h4>
              </div>
              <p className="text-gray-300 text-lg max-w-md">
                Get exclusive health tips, medical insights, and product updates delivered to your inbox.
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-white/10 border border-gray-600 text-white placeholder:text-gray-400 focus:bg-white/15 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 rounded-xl min-w-[300px] transition-all duration-200"
                  required
                />
                <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              <Button 
                type="submit"
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5 whitespace-nowrap"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="py-8 border-t border-gray-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
              <div className="text-gray-300 text-sm font-medium">
                <p>&copy; 2025 HealthHub Medical Technologies. All rights reserved.</p>
              </div>
              
              {/* Legal Links */}
              <div className="flex items-center space-x-6 text-sm">
                <a href="/privacy" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">
                  Privacy Policy
                </a>
                <a href="/terms" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">
                  Terms of Service
                </a>
                <a href="/cookies" className="text-gray-400 hover:text-white transition-colors duration-200 font-medium">
                  Cookie Policy
                </a>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <span className="text-gray-300 text-sm font-medium">Follow us:</span>
              <div className="flex space-x-3">
                {socials.map(({ name, icon: Icon, url }) => (
                  <a
                    key={name}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group w-10 h-10 bg-white/10 hover:bg-gradient-to-r hover:from-orange-500 hover:to-orange-600 rounded-xl flex items-center justify-center transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg"
                    aria-label={`Follow us on ${name}`}
                  >
                    <Icon className="w-5 h-5 text-gray-300 group-hover:text-white transition-colors duration-200" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Security Badge */}
          <div className="mt-6 pt-6 border-t border-gray-700/30 text-center">
            <div className="inline-flex items-center space-x-4 bg-white/5 px-6 py-3 rounded-full">
              <Shield className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300 font-medium">
                HIPAA Compliant • End-to-End Encrypted • 100% Secure Medical Platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;