"use client";
import { testimonials } from "@/lib/constant";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

const TestimonialsSection = () => {
  return (
    <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-orange-50/40 to-blue-50/30 overflow-hidden">
      {/* Decorative blurred gradients */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-orange-500/20 blur-3xl rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-blue-500/20 blur-3xl rounded-full translate-x-1/2 translate-y-1/2"></div>

      <div className="relative max-w-7xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-2 bg-gradient-to-r from-orange-500 to-blue-600 rounded-xl shadow-md">
              <Heart className="w-6 h-6 text-white" fill="white" />
            </div>
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
              Our Patients Love Us
            </h2>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-3xl font-bold text-gray-900">4.8</span>
            <div className="flex text-yellow-400">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <span className="text-muted-foreground text-sm">72K+ Reviews</span>
          </div>
          <p className="text-gray-600 mt-2">
            Trusted by thousands of patients for quality and compassionate care.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className={`bg-white/80 backdrop-blur-md border border-orange-100 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 rounded-2xl`}
              >
                <CardContent className="p-6">
                  <div className="flex text-yellow-400 mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-sm text-gray-700 mb-6 leading-relaxed italic">
                    “{testimonial.text}”
                  </p>
                  <div className="text-sm">
                    <p className="font-semibold text-orange-600">
                      {testimonial.author}
                    </p>
                    <p className="text-gray-500">{testimonial.location}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-medium text-white bg-gradient-to-r from-orange-500 to-blue-600 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Read More Testimonials
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </motion.button>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
