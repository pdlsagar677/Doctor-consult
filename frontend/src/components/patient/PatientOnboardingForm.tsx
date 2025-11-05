"use client";
import { userAuthStore } from "@/store/authStore";
import { Phone, User, Heart, Shield, ArrowLeft, ArrowRight, CheckCircle2, Lock } from "lucide-react";
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

interface EmergencyContact {
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
  emergencyContact: EmergencyContact;
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
    field: keyof EmergencyContact,
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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-teal-50 py-8 px-4">
      <div className="w-full max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-3 rounded-2xl shadow-lg">
              <Heart className="h-8 w-8 text-white" fill="white" />
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                HealthHub
              </h1>
              <p className="text-sm text-gray-600 font-medium">Medical Excellence</p>
            </div>
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Profile
          </h1>
          <p className="text-gray-600 text-lg">
            Help us provide you with the best possible care
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

        <Card className="border-0 shadow-2xl rounded-3xl overflow-hidden bg-white/80 backdrop-blur-sm">
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
                  {currentStep === 1 && "Basic information for your medical profile"}
                  {currentStep === 2 && "Emergency contact details for your safety"}
                  {currentStep === 3 && "Medical background for better care"}
                </p>
              </div>
            </div>

            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="dob" className="text-sm font-semibold text-gray-700">
                      Date of Birth
                    </Label>
                    <Input
                      id="dob"
                      name="dob"
                      type="date"
                      value={formData.dob}
                      onChange={handleInputChange}
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="gender" className="text-sm font-semibold text-gray-700">
                      Gender
                    </Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                        <SelectValue />
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
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                        <SelectValue />
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
                <Alert className="bg-emerald-50 border-emerald-200 rounded-xl">
                  <AlertDescription className="text-emerald-800 flex items-start space-x-2">
                    <Shield className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Emergency contact information ensures your safety during medical consultations</span>
                  </AlertDescription>
                </Alert>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="emergencyName" className="text-sm font-semibold text-gray-700">
                      Contact Name
                    </Label>
                    <Input
                      id="emergencyName"
                      value={formData.emergencyContact.name}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEmergencyContactChange('name', e.target.value)
                      }
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3 md:col-span-2">
                    <Label htmlFor="emergencyPhone" className="text-sm font-semibold text-gray-700">
                      Contact Phone
                    </Label>
                    <Input
                      id="emergencyPhone"
                      value={formData.emergencyContact.phone}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleEmergencyContactChange('phone', e.target.value)
                      }
                      className="h-12 px-4 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200"
                      required
                    />
                  </div>

                  <div className="space-y-3">
                    <Label htmlFor="relationship" className="text-sm font-semibold text-gray-700">
                      Relationship
                    </Label>
                    <Select
                      value={formData.emergencyContact.relationship}
                      onValueChange={(value) =>
                        handleEmergencyContactChange("relationship", value)
                      }
                    >
                      <SelectTrigger className="h-12 border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200">
                        <SelectValue />
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
                <Alert className="bg-emerald-50 border-emerald-200 rounded-xl">
                  <AlertDescription className="text-emerald-800 flex items-start space-x-2">
                    <Heart className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>Your medical history helps us provide personalized and effective care</span>
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
                      rows={3}
                      className="border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 resize-none"
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
                      rows={3}
                      className="border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 resize-none"
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
                      rows={3}
                      className="border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 resize-none"
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
                className="h-12 px-6 rounded-xl border-2 border-gray-300 hover:border-emerald-500 hover:bg-emerald-50 text-gray-700 transition-all duration-200"
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
                  className="h-12 px-8 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  Continue
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="h-12 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Saving...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Complete Setup</span>
                    </div>
                  )}
                </Button>
              )}
            </div>

            {/* Security Footer */}
            <div className="mt-6 text-center">
              <div className="inline-flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
                <Lock className="h-3 w-3 text-emerald-500" />
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