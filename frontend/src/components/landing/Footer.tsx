"use client";
import { contactInfo, footerSections, socials } from "@/lib/constant";
import { Heart, Mail, MapPin, Phone } from "lucide-react";
import React, { useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const Footer = () => {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Subscribed with:", email);
    setEmail("");
  };

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Brand Section */}
            <div className="lg:col-span-1">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-emerald-500 to-amber-500 p-2 rounded-xl">
                  <Heart className="w-6 h-6 text-white" fill="white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-white">HealthHub</h2>
                  <p className="text-gray-400 text-sm">Medical Excellence</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm mb-6">
                Your trusted healthcare partner for online medical consultations.
              </p>
              
              {/* Social Links */}
              <div className="flex space-x-3">
                {socials.map(({ name, icon: Icon, url }) => (
                  <a
                    key={name}
                    href={url}
                    className="w-8 h-8 bg-gray-800 hover:bg-emerald-500 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <Icon className="w-4 h-4 text-gray-300" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            {footerSections.slice(0, 3).map((section, index) => (
              <div key={index} className="space-y-3">
                <h3 className="font-semibold text-white text-sm uppercase tracking-wider">
                  {section.title}
                </h3>
                <ul className="space-y-2">
                  {section.links.slice(0, 4).map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        className="text-gray-400 hover:text-white text-sm transition-colors"
                      >
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Newsletter */}
        <div className="py-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h4 className="font-semibold text-white mb-1">Stay Updated</h4>
              <p className="text-gray-400 text-sm">Get health tips and updates</p>
            </div>
            
            <form onSubmit={handleSubscribe} className="flex gap-2 w-full md:w-auto">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 w-full md:w-64"
                required
              />
              <Button 
                type="submit"
                className="bg-gradient-to-r from-emerald-500 to-amber-500 text-white whitespace-nowrap"
              >
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-6 border-t border-gray-800">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-gray-400">
              © 2025 HealthHub. All rights reserved.
            </div>
            
            <div className="flex items-center gap-6 text-gray-400">
              <a href="/privacy" className="hover:text-white transition-colors">
                Privacy
              </a>
              <a href="/terms" className="hover:text-white transition-colors">
                Terms
              </a>
              <a href="/cookies" className="hover:text-white transition-colors">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;