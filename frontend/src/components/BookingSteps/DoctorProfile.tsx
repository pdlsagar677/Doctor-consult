import { Doctor } from "@/lib/types";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Award, Heart, MapPin, Star, Stethoscope, Sparkles, Clock, Shield, Users, ThumbsUp, Zap } from "lucide-react";
import { Badge } from "../ui/badge";

interface DoctorProfileInterface {
  doctor: Doctor;
}

const DoctorProfile = ({ doctor }: DoctorProfileInterface) => {
  return (
    <Card className="sticky top-8 shadow-2xl border-0 rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm">
      {/* Gradient Header */}
      <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          {/* Doctor Avatar */}
          <div className="relative inline-block mb-6">
            <Avatar className="w-32 h-32 mx-auto border-4 border-emerald-200 shadow-xl">
              <AvatarImage
                src={doctor?.profileImage}
                alt={doctor?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-teal-500 text-white text-3xl font-bold">
                {doctor?.name?.charAt(0)?.toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            {/* Online Status Badge */}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 border-4 border-white rounded-full flex items-center justify-center shadow-lg">
              <div className="w-3 h-3 bg-white rounded-full"></div>
            </div>
          </div>

          {/* Doctor Name and Specialization */}
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {doctor.name}
          </h2>
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Stethoscope className="w-4 h-4 text-emerald-500" />
            <p className="text-gray-600 font-medium">{doctor.specialization}</p>
          </div>
          <p className="text-sm text-gray-500 mb-3">{doctor.qualification}</p>
          
          {/* Experience */}
          <div className="flex items-center justify-center space-x-2 mb-4 text-sm text-gray-600">
            <Award className="w-4 h-4 text-emerald-500" />
            <span>{doctor.experience} years experience</span>
          </div>

          {/* Rating and Status */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-emerald-400 text-emerald-400"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-gray-700">5.0</span>
              <span className="text-xs text-gray-500">(620 reviews)</span>
            </div>
          </div>

          {/* Badges */}
          <div className="flex justify-center flex-wrap gap-2 mb-8">
            {doctor.isVerified && (
              <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200 px-3 py-1">
                <Shield className="w-3 h-3 mr-1" />
                Verified Doctor
              </Badge>
            )}

            <Badge className="bg-teal-100 text-teal-700 border-teal-200 px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              Available Today
            </Badge>

            {doctor.category.slice(0, 2).map((cat, idx) => (
              <Badge
                key={idx}
                className="bg-emerald-50 text-emerald-600 border-emerald-100 px-3 py-1"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-6">
          {/* About Section */}
          <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-2xl border border-emerald-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <Stethoscope className="w-5 h-5 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">About Doctor</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              {doctor.about || "Experienced healthcare professional dedicated to providing quality medical care with a patient-centered approach."}
            </p>
          </div>

          {/* Hospital/Clinic Information */}
          {doctor.hospitalInfo && (
            <div className="bg-gradient-to-r from-teal-50 to-emerald-50 p-6 rounded-2xl border border-teal-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Hospital/Clinic</h3>
              </div>
              <div className="text-sm text-gray-700 space-y-3">
                <p className="font-semibold text-gray-900">{doctor.hospitalInfo.name}</p>
                <p className="text-gray-600">{doctor.hospitalInfo.address}</p>
                <div className="flex items-center space-x-2 text-emerald-600 font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.hospitalInfo.city}</span>
                </div>
              </div>
            </div>
          )}

          {/* Consultation Fee */}
          <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-6 rounded-2xl text-white shadow-lg hover:shadow-xl transition-all duration-300">
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-semibold text-emerald-100">
                      Consultation Fee
                    </p>
                    <p className="text-sm text-emerald-100/80">
                      {doctor.slotDurationMinutes || 15} minutes session
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline space-x-3">
                  <p className="text-3xl font-bold text-white">
                    Rs.{doctor.fees}
                  </p>
                  <span className="text-sm text-emerald-100/70 line-through">
                    Rs.{doctor.fees + 200}
                  </span>
                  <Badge className="bg-white text-emerald-600 text-xs font-bold">
                    Save Rs.100
                  </Badge>
                </div>
              </div>
              
              <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm border border-white/30">
                <Heart className="w-8 h-8 fill-white text-white" />
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-emerald-400/30">
              <div className="grid grid-cols-2 gap-4 text-sm text-emerald-100">
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4" />
                  <span>Free Follow-up</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-center group hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-200 transition-colors">
                <Users className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">2K+</p>
              <p className="text-xs text-gray-600 font-medium">Patients</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-center group hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-200 transition-colors">
                <ThumbsUp className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">98%</p>
              <p className="text-xs text-gray-600 font-medium">Satisfaction</p>
            </div>
            <div className="bg-white p-4 rounded-2xl border border-emerald-100 shadow-sm text-center group hover:shadow-md transition-all duration-300">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-200 transition-colors">
                <Clock className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="text-2xl font-bold text-emerald-600">24/7</p>
              <p className="text-xs text-gray-600 font-medium">Available</p>
            </div>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Shield className="w-3 h-3 text-emerald-500" />
              <span>HIPAA Compliant</span>
            </div>
            <div className="flex items-center space-x-1">
              <Sparkles className="w-3 h-3 text-emerald-500" />
              <span>Secure Consultation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfile;