import { Doctor } from "@/lib/types";
import React from "react";
import { Card, CardContent } from "../ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Award, Heart, MapPin, Star, Stethoscope, Sparkles, Clock, Shield } from "lucide-react";
import { Badge } from "../ui/badge";

interface DoctorProfileInterface {
  doctor: Doctor;
}

const DoctorProfile = ({ doctor }: DoctorProfileInterface) => {
  return (
    <Card className="sticky top-8 shadow-2xl border-0 rounded-2xl overflow-hidden bg-white/80 backdrop-blur-sm">
      {/* Gradient Header */}
      <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500"></div>
      
      <CardContent className="p-8">
        <div className="text-center mb-8">
          {/* Doctor Avatar */}
          <div className="relative inline-block mb-6">
            <Avatar className="w-32 h-32 mx-auto border-4 border-orange-200 shadow-lg">
              <AvatarImage
                src={doctor?.profileImage}
                alt={doctor?.name}
                className="object-cover"
              />
              <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-3xl font-bold">
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
            <Stethoscope className="w-4 h-4 text-orange-500" />
            <p className="text-gray-600 font-medium">{doctor.specialization}</p>
          </div>
          <p className="text-sm text-gray-500 mb-3">{doctor.qualification}</p>
          
          {/* Experience */}
          <div className="flex items-center justify-center space-x-2 mb-4 text-sm text-gray-600">
            <Award className="w-4 h-4 text-orange-500" />
            <span>{doctor.experience} years experience</span>
          </div>

          {/* Rating and Status */}
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="flex items-center space-x-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className="w-4 h-4 fill-orange-400 text-orange-400"
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
              <Badge
                variant="secondary"
                className="bg-green-100 text-green-700 border-green-200 px-3 py-1"
              >
                <Shield className="w-3 h-3 mr-1" />
                Verified Doctor
              </Badge>
            )}

            <Badge
              variant="secondary"
              className="bg-orange-100 text-orange-700 border-orange-200 px-3 py-1"
            >
              <Sparkles className="w-3 h-3 mr-1" />
              Available Today
            </Badge>

            {doctor.category.slice(0, 2).map((cat, idx) => (
              <Badge
                key={idx}
                variant="secondary"
                className="bg-blue-100 text-blue-700 border-blue-200 px-3 py-1"
              >
                {cat}
              </Badge>
            ))}
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-6">
          {/* About Section */}
          <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-6 rounded-2xl border border-orange-200">
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-white" />
              </div>
              <h3 className="font-bold text-gray-900 text-lg">About Doctor</h3>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">{doctor.about || "Experienced healthcare professional dedicated to providing quality medical care with a patient-centered approach."}</p>
          </div>

          {/* Hospital/Clinic Information */}
          {doctor.hospitalInfo && (
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
              <div className="flex items-center space-x-2 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <MapPin className="w-4 h-4 text-white" />
                </div>
                <h3 className="font-bold text-gray-900 text-lg">Hospital/Clinic</h3>
              </div>
              <div className="text-sm text-gray-700 space-y-2">
                <p className="font-semibold text-gray-900">{doctor.hospitalInfo.name}</p>
                <p className="text-gray-600">{doctor.hospitalInfo.address}</p>
                <div className="flex items-center space-x-2 text-blue-600 font-medium">
                  <MapPin className="w-4 h-4" />
                  <span>{doctor.hospitalInfo.city}</span>
                </div>
              </div>
            </div>
          )}

          {/* Consultation Fee */}
          <div className="bg-gradient-to-r from-green-50 to-green-100 p-6 rounded-2xl border border-green-200 shadow-sm hover:shadow-md transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm text-green-700 font-semibold">
                      Consultation Fee
                    </p>
                    <p className="text-xs text-green-600">
                      {doctor.slotDurationMinutes || 30} minutes session
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline space-x-2">
                  <p className="text-3xl font-bold text-green-800">
                    ₹{doctor.fees}
                  </p>
                  <span className="text-sm text-green-600 line-through opacity-70">
                    ₹{doctor.fees + 200}
                  </span>
                  <Badge className="bg-green-500 text-white text-xs">
                    Save ₹200
                  </Badge>
                </div>
              </div>
              
              <div className="text-green-600 bg-white/50 p-3 rounded-xl border border-green-200">
                <Heart className="w-8 h-8 fill-green-500 text-green-500" />
              </div>
            </div>
            
            {/* Additional Info */}
            <div className="mt-4 pt-4 border-t border-green-200">
              <div className="grid grid-cols-2 gap-4 text-xs text-green-700">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Instant Confirmation</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free Follow-up</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 text-center">
            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <p className="text-2xl font-bold text-orange-600">2K+</p>
              <p className="text-xs text-gray-600">Patients</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <p className="text-2xl font-bold text-orange-600">98%</p>
              <p className="text-xs text-gray-600">Satisfaction</p>
            </div>
            <div className="bg-white p-3 rounded-xl border border-gray-200">
              <p className="text-2xl font-bold text-orange-600">24/7</p>
              <p className="text-xs text-gray-600">Available</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DoctorProfile;