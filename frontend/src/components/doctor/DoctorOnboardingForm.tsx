"use client";
import { DoctorFormData, HospitalInfo } from "@/lib/types";
import { userAuthStore } from "@/store/authStore";
import React, { ChangeEvent, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { useRouter } from "next/navigation";
import { Label } from "../ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { healthcareCategoriesList, specializations } from "@/lib/constant";
import { Input } from "../ui/input";
import { Checkbox } from "../ui/checkbox";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { ArrowLeft, ArrowRight, CheckCircle2, Building, Calendar, Clock,  Award, Stethoscope } from "lucide-react";

const DoctorOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<DoctorFormData>({
    specialization: "",
    categories: [],
    qualification: "",
    experience: "",
    fees: "",
    about: "",
    hospitalInfo: {
      name: "",
      address: "",
      city: "",
    },
    availabilityRange: {
      startDate: "",
      endDate: "",
      excludedWeekdays: [],
    },
    dailyTimeRanges: [
      { start: "09:00", end: "12:00" },
      { start: "14:00", end: "17:00" },
    ],
    slotDurationMinutes: 30,
  });

  const { updateProfile,  loading } = userAuthStore();
  const router = useRouter();

  const handleCategoryToggle = (category: string): void => {
    setFormData((prev: DoctorFormData) => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter((c: string) => c !== category)
        : [...prev.categories, category],
    }));
  };

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev: DoctorFormData) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleHospitalInfoChange = (
    field: keyof HospitalInfo,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      hospitalInfo: {
        ...prev.hospitalInfo,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await updateProfile({
        specialization: formData.specialization,
        category: formData.categories,
        qualification: formData.qualification,
        experience: formData.experience,
        about: formData.about,
        fees: formData.fees,
        hospitalInfo: formData.hospitalInfo,
        availabilityRange: {
          startDate: new Date(formData.availabilityRange.startDate),
          endDate: new Date(formData.availabilityRange.endDate),
          excludedWeekdays: formData.availabilityRange.excludedWeekdays,
        },
        dailyTimeRanges: formData.dailyTimeRanges,
        slotDurationMinutes: formData.slotDurationMinutes,
      });
      router.push("/doctor/dashboard");
    } catch (error) {
      console.error("Profile update failed", error);
    }
  };

  const handleNext = (): void => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = (): void => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const stepTitles = {
    1: "Professional Information",
    2: "Hospital Information",
    3: "Availability Settings"
  };

  const stepIcons = {
    1: <Stethoscope className="w-5 h-5" />,
    2: <Building className="w-5 h-5" />,
    3: <Calendar className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Doctor Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Set up your professional information to start accepting patients
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-12">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                <div className="flex flex-col items-center">
                  <div
                    className={`flex items-center justify-center w-12 h-12 rounded-full border-2 transition-all duration-300 ${
                      currentStep >= step
                        ? "bg-gradient-to-r from-emerald-500 to-teal-500 border-emerald-600 text-white shadow-lg"
                        : "border-gray-300 text-gray-400 bg-white"
                    } ${currentStep === step ? "ring-4 ring-emerald-200 scale-110" : ""}`}
                  >
                    {currentStep > step ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      stepIcons[step as keyof typeof stepIcons]
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium mt-2 ${
                      currentStep >= step ? "text-emerald-600" : "text-gray-400"
                    }`}
                  >
                    {stepTitles[step as keyof typeof stepTitles]}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 rounded-full transition-all duration-300 ${
                      currentStep > step ? "bg-gradient-to-r from-emerald-500 to-teal-500" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/90 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
          <CardContent className="p-8">
            {/* Step Header */}
            <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-200">
              <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600">
                {stepIcons[currentStep as keyof typeof stepIcons]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {stepTitles[currentStep as keyof typeof stepTitles]}
                </h2>
                <p className="text-gray-600">
                  {currentStep === 1 && "Tell us about your professional background"}
                  {currentStep === 2 && "Provide your practice location details"}
                  {currentStep === 3 && "Set your availability for patients"}
                </p>
              </div>
            </div>

            {/* Step 1: Professional Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="specialization" className="text-sm font-semibold text-gray-700">
                      Medical Specialization
                    </Label>
                    <Select
                      value={formData.specialization}
                      onValueChange={(value: string) =>
                        setFormData((prev) => ({
                          ...prev,
                          specialization: value,
                        }))
                      }
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                        <SelectValue placeholder="Select specialization" />
                      </SelectTrigger>
                      <SelectContent>
                        {specializations.map((spec: string) => (
                          <SelectItem key={spec} value={spec}>
                            {spec}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">
                      Years of Experience
                    </Label>
                    <Input
                      id="experience"
                      name="experience"
                      type="number"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Award className="w-5 h-5 text-emerald-600" />
                    <Label className="text-sm font-semibold text-gray-700">Healthcare Categories</Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Select the healthcare areas you provide services for
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {healthcareCategoriesList.map((category: string) => (
                      <label
                        key={category}
                        className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.categories.includes(category)
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-25"
                        }`}
                      >
                        <Checkbox
                          checked={formData.categories.includes(category)}
                          onCheckedChange={() => handleCategoryToggle(category)}
                          className="text-emerald-600 border-2 data-[state=checked]:bg-emerald-600"
                        />
                        <span className="text-sm font-medium">{category}</span>
                      </label>
                    ))}
                  </div>
                  {formData.categories.length === 0 && (
                    <p className="text-red-500 text-sm">
                      Please select at least one category
                    </p>
                  )}
                </div>

                <div className="space-y-3">
                  <Label htmlFor="qualification" className="text-sm font-semibold text-gray-700">
                    Qualification
                  </Label>
                  <Input
                    id="qualification"
                    name="qualification"
                    type="text"
                    value={formData.qualification}
                    onChange={handleInputChange}
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="about" className="text-sm font-semibold text-gray-700">
                    About You
                  </Label>
                  <Textarea
                    id="about"
                    name="about"
                    value={formData.about}
                    onChange={handleInputChange}
                    rows={4}
                    className="border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="fees" className="text-sm font-semibold text-gray-700">
                    Consultation Fee (Rs.)
                  </Label>
                  <Input
                    id="fees"
                    name="fees"
                    type="number"
                    value={formData.fees}
                    onChange={handleInputChange}
                    className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                    required
                  />
                </div>
              </div>
            )}

            {/* Step 2: Hospital Information */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="hospitalName" className="text-sm font-semibold text-gray-700">
                      Hospital/Clinic Name
                    </Label>
                    <Input
                      id="hospitalName"
                      type="text"
                      value={formData.hospitalInfo.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleHospitalInfoChange("name", e.target.value)
                      }
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="address" className="text-sm font-semibold text-gray-700">
                      Address
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.hospitalInfo.address}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleHospitalInfoChange("address", e.target.value)
                      }
                      rows={3}
                      className="border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 resize-none"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="city" className="text-sm font-semibold text-gray-700">
                      City
                    </Label>
                    <Input
                      id="city"
                      type="text"
                      value={formData.hospitalInfo.city}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleHospitalInfoChange("city", e.target.value)
                      }
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Availability Settings */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700">
                      Available From
                    </Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.availabilityRange.startDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setFormData((prev) => ({
                          ...prev,
                          availabilityRange: {
                            ...prev.availabilityRange,
                            startDate: e.target.value,
                          },
                        }));
                      }}
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="endDate" className="text-sm font-semibold text-gray-700">
                      Available Until
                    </Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.availabilityRange.endDate}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => {
                        setFormData((prev) => ({
                          ...prev,
                          availabilityRange: {
                            ...prev.availabilityRange,
                            endDate: e.target.value,
                          },
                        }));
                      }}
                      className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm font-semibold text-gray-700">Appointment Slot Duration</Label>
                  <Select
                    value={formData.slotDurationMinutes?.toString() || "30"}
                    onValueChange={(value: string) =>
                      setFormData((prev) => ({
                        ...prev,
                        slotDurationMinutes: parseInt(value),
                      }))
                    }
                  >
                    <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                      <SelectValue placeholder="Select slot duration" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="5">5 minutes</SelectItem>
                      <SelectItem value="10">10 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="45">45 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-sm text-gray-600">
                    Duration for each patient consultation slot
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5 text-emerald-600" />
                    <Label className="text-sm font-semibold text-gray-700">Working Days</Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Select the days you are NOT available
                  </p>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { day: "Sunday", value: 0 },
                      { day: "Monday", value: 1 },
                      { day: "Tuesday", value: 2 },
                      { day: "Wednesday", value: 3 },
                      { day: "Thursday", value: 4 },
                      { day: "Friday", value: 5 },
                      { day: "Saturday", value: 6 },
                    ].map(({ day, value }) => (
                      <label
                        key={value}
                        className={`flex items-center space-x-3 p-3 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                          formData.availabilityRange.excludedWeekdays.includes(value)
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-gray-200 hover:border-emerald-300"
                        }`}
                      >
                        <Checkbox
                          checked={formData.availabilityRange.excludedWeekdays.includes(value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setFormData((prev) => ({
                                ...prev,
                                availabilityRange: {
                                  ...prev.availabilityRange,
                                  excludedWeekdays: [
                                    ...prev.availabilityRange.excludedWeekdays,
                                    value,
                                  ],
                                },
                              }));
                            } else {
                              setFormData((prev) => ({
                                ...prev,
                                availabilityRange: {
                                  ...prev.availabilityRange,
                                  excludedWeekdays:
                                    prev.availabilityRange.excludedWeekdays.filter(
                                      (d) => d !== value
                                    ),
                                },
                              }));
                            }
                          }}
                          className="text-emerald-600 border-2 data-[state=checked]:bg-emerald-600"
                        />
                        <span className="text-sm font-medium">{day}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-emerald-600" />
                    <Label className="text-sm font-semibold text-gray-700">Daily Working Hours</Label>
                  </div>
                  <p className="text-sm text-gray-600">
                    Set your working hours for each day
                  </p>

                  {formData.dailyTimeRanges.map((range, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 p-4 bg-gray-50 rounded-xl border-2 border-gray-200"
                    >
                      <div className="flex-1 space-y-2">
                        <Label className="text-sm text-gray-700">
                          Session {index + 1} - Start Time
                        </Label>
                        <Input
                          type="time"
                          value={range.start}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const newRange = [...formData.dailyTimeRanges];
                            newRange[index].start = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              dailyTimeRanges: newRange,
                            }));
                          }}
                          className="border-2 border-gray-200 rounded-xl focus:border-emerald-500"
                          required
                        />
                      </div>

                      <div className="flex-1 space-y-2">
                        <Label className="text-sm text-gray-700">
                          Session {index + 1} - End Time
                        </Label>
                        <Input
                          type="time"
                          value={range.end}
                          onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const newRange = [...formData.dailyTimeRanges];
                            newRange[index].end = e.target.value;
                            setFormData((prev) => ({
                              ...prev,
                              dailyTimeRanges: newRange,
                            }));
                          }}
                          className="border-2 border-gray-200 rounded-xl focus:border-emerald-500"
                          required
                        />
                      </div>

                      {formData.dailyTimeRanges.length > 1 && (
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const newRange = formData.dailyTimeRanges.filter(
                              (_, i) => i !== index
                            );
                            setFormData((prev) => ({
                              ...prev,
                              dailyTimeRanges: newRange,
                            }));
                          }}
                          className="h-10 border-2 border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  ))}

                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        dailyTimeRanges: [
                          ...prev.dailyTimeRanges,
                          { start: "18:00", end: "20:00" },
                        ],
                      }));
                    }}
                    className="w-full h-12 border-2 border-dashed border-gray-300 hover:border-emerald-500 text-gray-600 hover:text-emerald-600"
                  >
                    + Add Another Time Session
                  </Button>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center pt-8 mt-8 border-t border-gray-200">
              <Button
                type="button"
                variant="outline"
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="h-12 px-6 border-2 border-gray-300 text-gray-700 hover:border-gray-400 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={currentStep === 1 && formData.categories.length === 0}
                  className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Completing Setup...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Profile</span>
                    </div>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DoctorOnboardingForm;