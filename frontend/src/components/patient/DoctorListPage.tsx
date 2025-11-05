"use client";
import { DoctorFilters } from "@/lib/types";
import { useDoctorStore } from "@/store/doctorStore";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import Header from "../landing/Header";
import {
  FilterIcon,
  MapPin,
  Search,
  Star,
  X,
  Stethoscope,
  Clock,
  Award,
  Heart,
  Sparkles,
  Calendar,
} from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-gray-50 pt-16">
      <Header />

      {/* Hero Section */}
      <section className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="text-center mb-10">
            <div className="flex items-center justify-center space-x-3 mb-3">
              <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 p-3 rounded-2xl shadow-md">
                <Stethoscope className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-4xl font-bold text-gray-900">
                Find Your Perfect Doctor
              </h1>
            </div>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Connect with trusted healthcare professionals for personalized care and expert advice.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-center mb-10">
            <div className="flex-1 relative max-w-2xl w-full">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                placeholder="Search doctors by name, specialization, or condition..."
                className="pl-12 h-14 text-base border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 transition-all"
                value={filters.search || ""}
                onChange={(e) => handleFilterChange("search", e.target.value)}
              />
            </div>
            <Button
              variant="outline"
              className="h-14 px-6 border-2 border-gray-200 rounded-xl hover:border-emerald-500 hover:bg-emerald-50 transition-all"
              onClick={() => setShowFilters(!showFilters)}
            >
              <FilterIcon className="w-5 h-5 mr-2" />
              Filters
              {activeFilterCount > 0 && (
                <Badge className="ml-2 bg-emerald-500 text-white">
                  {activeFilterCount}
                </Badge>
              )}
            </Button>
          </div>

          {/* Categories */}
          <div className="flex overflow-x-auto gap-3 pb-4 scrollbar-hide justify-center">
            <Button
              variant={!filters.category ? "default" : "outline"}
              className={`flex-shrink-0 rounded-xl h-12 px-4 ${
                !filters.category
                  ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                  : "border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
              }`}
              onClick={() => handleFilterChange("category", "")}
            >
              <Heart className="w-4 h-4 mr-2" />
              All Categories
            </Button>

            {healthcareCategories.map((cat) => (
              <Button
                key={cat.id}
                variant={filters.category === cat.title ? "default" : "outline"}
                className={`flex-shrink-0 rounded-xl h-12 px-4 whitespace-nowrap ${
                  filters.category === cat.title
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white shadow-lg"
                    : "border-2 border-gray-200 hover:border-emerald-500 hover:bg-emerald-50"
                }`}
                onClick={() => handleFilterChange("category", cat.title)}
              >
                <div
                  className={`w-8 h-8 ${cat.color} rounded-xl flex items-center justify-center mr-2`}
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

          {/* Advanced Filters */}
          {showFilters && (
            <Card className="p-6 mt-6 border-0 shadow-lg rounded-2xl bg-white/80 backdrop-blur">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <FilterIcon className="w-5 h-5 text-emerald-500" />
                  <h3 className="text-xl font-bold text-gray-900">Advanced Filters</h3>
                </div>
                <div className="flex items-center space-x-3">
                  <Button
                    variant="outline"
                    onClick={clearFilters}
                    className="border-emerald-200 text-emerald-700 hover:bg-emerald-50 rounded-xl"
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
                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Specialization
                  </label>
                  <Select
                    value={filters.specialization || ""}
                    onValueChange={(value) =>
                      handleFilterChange("specialization", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
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

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Location
                  </label>
                  <Select
                    value={filters.city || ""}
                    onValueChange={(value) => handleFilterChange("city", value)}
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
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

                <div>
                  <label className="text-sm font-semibold text-gray-700 block mb-2">
                    Sort by
                  </label>
                  <Select
                    value={filters.sortBy || "experience"}
                    onValueChange={(value) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="experience">Experience</SelectItem>
                      <SelectItem value="fees">Consultation Fee</SelectItem>
                      <SelectItem value="name">Name (A–Z)</SelectItem>
                      <SelectItem value="createdAt">Newest First</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="w-full h-12 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl shadow-md"
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </section>

      {/* Results Section */}
      <section className="max-w-7xl mx-auto px-4 py-10">
        {loading ? (
          <p className="text-center text-gray-500 text-lg">Loading doctors...</p>
        ) : doctors.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map((doctor) => (
              <Card
                key={doctor._id}
                className="group border border-gray-100 hover:border-emerald-400 shadow-md hover:shadow-lg transition-all duration-200 rounded-2xl bg-white"
              >
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="text-center mb-4">
                    <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-emerald-100">
                      <AvatarImage src={doctor.profileImage} alt={doctor.name} />
                      <AvatarFallback className="bg-emerald-500 text-white text-xl font-bold">
                        {doctor.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {doctor.name}
                    </h3>
                    <p className="text-sm text-emerald-600 font-medium mb-2">
                      {doctor.specialization}
                    </p>
                    <p className="text-sm text-gray-500 flex justify-center items-center">
                      <Award className="w-4 h-4 mr-1 text-emerald-500" />
                      {doctor.experience} years experience
                    </p>
                  </div>

                  <div className="flex justify-center mb-3">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                    ))}
                  </div>

                  <div className="flex justify-center flex-wrap gap-2 mb-4">
                    {doctor.category?.slice(0, 2).map((c, i) => (
                      <Badge key={i} className="bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {c}
                      </Badge>
                    ))}
                  </div>

                  <div className="text-center text-gray-600 mb-4">
                    <MapPin className="inline w-4 h-4 mr-1 text-emerald-500" />
                    {doctor.hospitalInfo?.city}
                  </div>

                  <div className="text-center font-semibold text-emerald-600 mb-6">
                    ₹{doctor.fees} / Consultation
                  </div>

                  <Link href={`/patient/booking/${doctor._id}`} className="mt-auto">
                    <Button className="w-full bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl py-3 shadow-md">
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Appointment
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center bg-white border border-gray-100 shadow-md rounded-2xl">
            <Search className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-2">
              No doctors found
            </h3>
            <p className="text-gray-500 mb-6">
              Try adjusting your filters or search terms.
            </p>
            <Button
              onClick={clearFilters}
              className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 text-white font-semibold rounded-xl px-8 py-3"
            >
              Clear All Filters
            </Button>
          </Card>
        )}
      </section>
    </div>
  );
};

export default DoctorListPage;
