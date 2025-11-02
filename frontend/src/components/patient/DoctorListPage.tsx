"use client";
import { DoctorFilters } from "@/lib/types";
import { useDoctorStore } from "@/store/doctorStore";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import { FilterIcon, MapPin, Search, Star, X, Stethoscope, Clock, Award, Heart, Sparkles, Calendar } from "lucide-react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { cities, healthcareCategories, specializations } from "@/lib/constant";
import { Card, CardContent } from "../ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import Link from "next/link";

const DoctorListPage = () => {
  const searchParams = useSearchParams();
  const categoryParams = searchParams.get("category");

  const { doctors, loading, fetchDoctors } = useDoctorStore();

  const [filters, setFilters] = useState<DoctorFilters>({
    search: "",
    specialization: "",
    category: categoryParams || "",
    city: "",
    sortBy: "experience",
    sortOrder: "desc",
  });

  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetchDoctors(filters);
  }, [fetchDoctors, filters]);

  const handleFilterChange = (key: keyof DoctorFilters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      specialization: "",
      category: categoryParams || "",
      city: "",
      sortBy: "experience",
      sortOrder: "desc",
    });
  };

  const activeFilterCount = Object.values(filters).filter(
    (value) => value && value !== "experience" && value !== "desc"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 pt-16">
      <Header />

      {/* Hero Section */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
            <div className="mb-6 lg:mb-0">
              <div className="flex items-center space-x-3 mb-4">
                <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-3 rounded-2xl shadow-lg">
                  <Stethoscope className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl lg:text-4xl font-bold text-gray-900">
                    Find Your Perfect Doctor
                  </h1>
                  <p className="text-gray-600 text-lg mt-2">
                    Connect with trusted healthcare providers for personalized care
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200 px-4 py-2">
                <Sparkles className="w-4 h-4 mr-1" />
                {doctors.length} Verified Doctors
              </Badge>
            </div>
          </div>

          {/* Search and Filter Bar */}
          <div className="flex flex-col lg:flex-row gap-4 mb-8">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search doctors by name, specialization, or condition..."
                className="pl-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>

            <Button
              variant="outline"
              className="h-14 px-6 border-2 border-gray-200 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className="w-5 h-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 bg-orange-500 text-white min-w-6 h-6 flex items-center justify-center"
                >
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Category Scroll */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Browse by Category
              </h3>
              <span className="text-sm text-gray-500">
                {filters.category ? `Selected: ${filters.category}` : "All categories"}
              </span>
            </div>

            <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide">
              <Button
                variant={!filters.category ? "default" : "outline"}
                className={`flex-shrink-0 rounded-xl h-12 px-4 ${
                  !filters.category 
                    ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg" 
                    : "border-2 border-gray-200 hover:border-orange-500"
                } transition-all duration-200`}
                onClick={() => handleFilterChange("category", "")}
              >
                <Heart className="w-4 h-4 mr-2" />
                All Categories
              </Button>

              {healthcareCategories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={filters.category === cat.title ? "default" : "outline"}
                  className={`flex-shrink-0 rounded-xl h-12 px-4 whitespace-nowrap transition-all duration-200 ${
                    filters.category === cat.title
                      ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg"
                      : "border-2 border-gray-200 hover:border-orange-500 hover:bg-orange-50"
                  }`}
                  onClick={() => handleFilterChange("category", cat.title)}
                >
                  <div
                    className={`w-8 h-8 ${cat.color} rounded-xl flex items-center justify-center mr-2 transition-all duration-200`}
                  >
                    <svg
                      className="w-5 h-5 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d={cat.icon} />
                    </svg>
                  </div>
                  {cat.title}
                </Button>
              ))}
            </div>
          </div>

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-6 mb-4 bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-2xl">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <FilterIcon className="w-5 h-5 text-orange-500" />
                  <h3 className="text-xl font-bold text-gray-900">Advanced Filters</h3>
                </div>

                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-orange-200 text-orange-700 hover:bg-orange-50 rounded-xl"
                  >
                    Clear All
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowFilters(false)}
                    className="rounded-xl"
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Specialization
                  </label>
                  <Select
                    value={filters.specialization || ""}
                    onValueChange={(value) =>
                      handleFilterChange("specialization", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                      <SelectValue placeholder="All specializations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Specializations</SelectItem>
                      {specializations.map((spec) => (
                        <SelectItem key={spec} value={spec}>
                          {spec}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Location
                  </label>
                  <Select
                    value={filters.city || ""}
                    onValueChange={(value) => handleFilterChange("city", value)}
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                      <SelectValue placeholder="All locations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All locations</SelectItem>
                      {cities.map((city) => (
                        <SelectItem key={city} value={city}>
                          {city}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-semibold text-gray-700 block">
                    Sort by
                  </label>
                  <Select
                    value={filters.sortBy || "experience"}
                    onValueChange={(value) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="experience">
                        <div className="flex items-center space-x-2">
                          <Award className="w-4 h-4" />
                          <span>Experience</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="fees">
                        <div className="flex items-center space-x-2">
                          <span>₹</span>
                          <span>Consultation Fee</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                      <SelectItem value="createdAt">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="w-full h-12 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>

      {/* Results Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Results Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <div className="mb-4 lg:mb-0">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {loading ? "Searching for doctors..." : `Found ${doctors.length} Doctor${doctors.length !== 1 ? 's' : ''}`}
            </h2>
            <p className="text-gray-600">
              {filters.search && `Search results for "${filters.search}"`}
              {filters.specialization && filters.specialization !== 'all' && ` • Specialization: ${filters.specialization}`}
              {filters.city && filters.city !== 'all' && ` • Location: ${filters.city}`}
            </p>
          </div>

          {doctors.length > 0 && (
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                <Clock className="w-4 h-4 mr-1" />
                Available Today
              </Badge>
            </div>
          )}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <Card key={i} className="animate-pulse border-0 rounded-2xl shadow-lg">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto"></div>
                    <div className="space-y-3">
                      <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                      <div className="h-4 bg-gray-200 rounded w-2/3 mx-auto"></div>
                      <div className="h-10 bg-gray-200 rounded-xl mt-4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="group hover:shadow-2xl transition-all duration-300 bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl overflow-hidden hover:-translate-y-2"
              >
                <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500"></div>
                <CardContent className="p-6 flex flex-col h-full">
                  {/* Doctor Header */}
                  <div className="text-center mb-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-orange-100 group-hover:border-orange-200 transition-colors duration-300">
                      <AvatarImage
                        src={doctor.profileImage}
                        alt={doctor.name}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-gradient-to-br from-orange-500 to-orange-600 text-white text-xl font-bold">
                        {doctor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-orange-600 transition-colors duration-300 mb-1">
                      {doctor.name}
                    </h3>
                    <div className="flex items-center justify-center space-x-2 mb-2">
                      <Stethoscope className="w-4 h-4 text-orange-500" />
                      <p className="text-gray-600 font-medium">
                        {doctor.specialization}
                      </p>
                    </div>

                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-500 mb-3">
                      <Award className="w-4 h-4 text-blue-500" />
                      <span>{doctor.experience} years experience</span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center justify-center space-x-2 mb-4">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className="w-4 h-4 fill-orange-400 text-orange-400"
                          />
                        ))}
                      </div>
                      <span className="font-bold text-gray-900">5.0</span>
                      <span className="text-gray-500 text-sm">(620)</span>
                    </div>
                  </div>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2 justify-center mb-4">
                    {doctor.category?.slice(0, 2).map((category, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-blue-50 text-blue-700 border-blue-200 text-xs px-3 py-1 rounded-full"
                      >
                        {category}
                      </Badge>
                    ))}

                    <Badge
                      variant="secondary"
                      className="bg-orange-50 text-orange-700 border-orange-200 text-xs px-3 py-1 rounded-full"
                    >
                      <Sparkles className="w-3 h-3 mr-1" />
                      Verified
                    </Badge>
                  </div>

                  {/* Location & Fees */}
                  <div className="space-y-3 mb-6 text-center">
                    <div className="flex items-center justify-center text-gray-600 bg-gray-50 rounded-xl py-2">
                      <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                      <span className="text-sm font-medium">{doctor.hospitalInfo?.city}</span>
                    </div>

                    <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-xl p-3">
                      <p className="text-gray-600 text-sm font-semibold mb-1">
                        Consultation Fee
                      </p>
                      <p className="font-bold text-orange-600 text-xl">₹{doctor.fees}</p>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto">
                    <Link href={`/patient/booking/${doctor._id}`} className="block">
                      <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl py-3 shadow-lg hover:shadow-xl transition-all duration-200 transform group-hover:-translate-y-0.5">
                        <Calendar className="w-5 h-5 mr-2" />
                        Book Appointment
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center border-0 shadow-xl rounded-2xl bg-white/80 backdrop-blur-sm">
            <div className="text-gray-300 mb-6">
              <Search className="w-20 h-20 mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-gray-600 mb-3">No doctors found</h3>
            <p className="text-gray-500 mb-6 text-lg">
              We couldn't find any doctors matching your criteria. Try adjusting your filters or search terms.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={clearFilters}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl px-8 py-3"
              >
                Clear All Filters
              </Button>
              <Button 
                variant="outline"
                onClick={() => setShowFilters(true)}
                className="border-2 border-gray-200 hover:border-orange-500 rounded-xl px-8 py-3"
              >
                <FilterIcon className="w-4 h-4 mr-2" />
                Show Filters
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default DoctorListPage;