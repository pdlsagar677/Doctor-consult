"use client";
import { userAuthStore } from "@/store/authStore";
import { Phone, User, Heart, Shield, ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { ChangeEvent, useState } from "react";
import { Card, CardContent } from "../ui/card";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { Alert, AlertDescription } from "../ui/alert";
import { Textarea } from "../ui/textarea";

interface EmerfencyContact {
  name: string;
  phone: string;
  relationship: string;
}
interface MedicalHistory {
  allergies: string;
  currentMedications: string;
  chronicConditions: string;
}

interface PatientOnboardingData {
  phone: string;
  dob: string;
  gender: string;
  bloodGroup?: string;
  emergencyContact: EmerfencyContact;
  medicalHistory: MedicalHistory;
}

const PatientOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<PatientOnboardingData>({
    phone: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    emergencyContact: {
      name: "",
      phone: "",
      relationship: "",
    },
    medicalHistory: {
      allergies: "",
      currentMedications: "",
      chronicConditions: "",
    },
  });

  const { updateProfile, user, loading } = userAuthStore();
  const router = useRouter();

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string): void => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmergencyContactChange = (
    field: keyof EmerfencyContact,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value,
      },
    }));
  };

  const handleMedicalHistoryChange = (
    field: keyof MedicalHistory,
    value: string
  ): void => {
    setFormData((prev) => ({
      ...prev,
      medicalHistory: {
        ...prev.medicalHistory,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (): Promise<void> => {
    try {
      await updateProfile({
        Phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup,
        emergencyContact: formData.emergencyContact,
        medicalHistory: formData.medicalHistory,
      });
      router.push("/");
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
    1: "Personal Information",
    2: "Emergency Contact",
    3: "Medical History"
  };

  const stepIcons = {
    1: <User className="w-5 h-5" />,
    2: <Phone className="w-5 h-5" />,
    3: <Heart className="w-5 h-5" />
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-orange-500 to-blue-600 p-3 rounded-2xl shadow-lg">
              <Heart className="h-8 w-8 text-white" fill="white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-blue-600 bg-clip-text text-transparent">
                HealthHub
              </h1>
              <p className="text-sm text-gray-600 font-medium">Medical Excellence</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome, <span className="text-orange-600">{user?.name}</span>!
          </h1>
          <p className="text-gray-600 text-lg">
            Complete your profile to start your healthcare journey
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
                        ? "bg-gradient-to-r from-orange-500 to-orange-600 border-orange-600 text-white shadow-lg"
                        : "border-gray-300 text-gray-400 bg-white"
                    } ${currentStep === step ? "ring-4 ring-orange-200 scale-110" : ""}`}
                  >
                    {currentStep > step ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      stepIcons[step as keyof typeof stepIcons]
                    )}
                  </div>
                  <span
                    className={`text-sm font-medium mt-2 ${
                      currentStep >= step ? "text-orange-600" : "text-gray-400"
                    }`}
                  >
                    {stepTitles[step as keyof typeof stepTitles]}
                  </span>
                </div>
                {step < 3 && (
                  <div
                    className={`w-16 h-1 rounded-full transition-all duration-300 ${
                      currentStep > step ? "bg-gradient-to-r from-orange-500 to-orange-600" : "bg-gray-300"
                    }`}
                  ></div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
          <div className="h-2 bg-gradient-to-r from-orange-500 via-orange-400 to-blue-500"></div>
          <CardContent className="p-8">
            {/* Step Header */}
            <div className="flex items-center space-x-3 mb-8 pb-4 border-b border-gray-200">
              <div className="bg-orange-100 p-2 rounded-lg">
                {stepIcons[currentStep as keyof typeof stepIcons]}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  {stepTitles[currentStep as keyof typeof stepTitles]}
                </h2>
                <p className="text-gray-600">
                  {currentStep === 1 && "Tell us about yourself"}
                  {currentStep === 2 && "Who should we contact in case of emergency?"}
                  {currentStep === 3 && "Help us understand your medical background"}
                </p>
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Phone Number <span className="text-orange-500">*</span>
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      placeholder="+91 985467238"
                      onChange={handleInputChange}
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="dob" className="text-sm font-semibold text-gray-700">
                      Date of Birth <span className="text-orange-500">*</span>
                    </Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                      Gender <span className="text-orange-500">*</span>
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="bloodGroup" className="text-sm font-semibold text-gray-700">
                      Blood Group
                    </Label>
                    <Select
                      value={formData.bloodGroup}
                      onValueChange={(value) => handleSelectChange("bloodGroup", value)}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                        <SelectValue placeholder="Select blood group" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A+">A+</SelectItem>
                        <SelectItem value="A-">A-</SelectItem>
                        <SelectItem value="B+">B+</SelectItem>
                        <SelectItem value="B-">B-</SelectItem>
                        <SelectItem value="AB+">AB+</SelectItem>
                        <SelectItem value="AB-">AB-</SelectItem>
                        <SelectItem value="O+">O+</SelectItem>
                        <SelectItem value="O-">O-</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Emergency Contact */}
            {currentStep === 2 && (
              <div className="space-y-8">
                <Alert className="bg-blue-50 border-blue-200 rounded-xl">
                  <AlertDescription className="text-blue-800 flex items-start space-x-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>This information will be used to contact someone on your behalf in case of emergency during consultations.</span>
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="emergencyName" className="text-sm font-semibold text-gray-700">
                      Contact Name <span className="text-orange-500">*</span>
                    </Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEmergencyContactChange('name', e.target.value)
                      }
                      placeholder="Full name"
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="emergencyPhone" className="text-sm font-semibold text-gray-700">
                      Contact Phone <span className="text-orange-500">*</span>
                    </Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEmergencyContactChange('phone', e.target.value)
                      }
                      placeholder="+91 9919326233"
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="relationship" className="text-sm font-semibold text-gray-700">
                      Relationship <span className="text-orange-500">*</span>
                    </Label>
                    <Select
                      value={formData.emergencyContact.relationship}
                      onValueChange={(value) =>
                        handleEmergencyContactChange("relationship", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200">
                        <SelectValue placeholder="Select relationship" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="spouse">Spouse</SelectItem>
                        <SelectItem value="parent">Parent</SelectItem>
                        <SelectItem value="child">Child</SelectItem>
                        <SelectItem value="sibling">Sibling</SelectItem>
                        <SelectItem value="friend">Friend</SelectItem>
                        <SelectItem value="relative">Relative</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Medical Information */}
            {currentStep === 3 && (
              <div className="space-y-8">
                <Alert className="bg-green-50 border-green-200 rounded-xl">
                  <AlertDescription className="text-green-800 flex items-start space-x-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>This information helps doctors provide better care. All information is kept confidential and secure.</span>
                  </AlertDescription>
                </Alert>

                <div className="space-y-6">
                  <div className="space-y-3">
                    <Label htmlFor="allergies" className="text-sm font-semibold text-gray-700">
                      Known Allergies
                    </Label>
                    <Textarea
                      id="allergies"
                      value={formData.medicalHistory.allergies}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleMedicalHistoryChange("allergies", e.target.value)
                      }
                      placeholder="e.g., Penicillin, Peanuts, Dust (or write 'None' if no known allergies)"
                      rows={3}
                      className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="currentMedications" className="text-sm font-semibold text-gray-700">
                      Current Medications
                    </Label>
                    <Textarea
                      id="currentMedications"
                      value={formData.medicalHistory.currentMedications}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleMedicalHistoryChange("currentMedications", e.target.value)
                      }
                      placeholder="List any medications you're currently taking (or write 'None' if not taking any)"
                      rows={3}
                      className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none"
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="chronicConditions" className="text-sm font-semibold text-gray-700">
                      Chronic Conditions
                    </Label>
                    <Textarea
                      id="chronicConditions"
                      value={formData.medicalHistory.chronicConditions}
                      onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                        handleMedicalHistoryChange("chronicConditions", e.target.value)
                      }
                      placeholder="e.g., Diabetes, Hypertension, Asthma (or write 'None' if no chronic conditions)"
                      rows={3}
                      className="border-2 border-gray-200 rounded-xl focus:border-orange-500 focus:ring-2 focus:ring-orange-200 transition-all duration-200 resize-none"
                    />
                  </div>
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
                className="h-12 px-6 rounded-xl border-2 border-gray-300 hover:border-orange-500 hover:bg-orange-50 transition-all duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={
                    (currentStep === 1 &&
                      (!formData.phone || !formData.dob || !formData.gender)) ||
                    (currentStep === 2 &&
                      (!formData.emergencyContact.name ||
                        !formData.emergencyContact.phone ||
                        !formData.emergencyContact.relationship))
                  }
                  className="h-12 px-8 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="h-12 px-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
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

            {/* Security Footer */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <Shield className="h-3 w-3 text-green-500" />
                <span>HIPAA Compliant • End-to-End Encrypted</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PatientOnboardingForm;