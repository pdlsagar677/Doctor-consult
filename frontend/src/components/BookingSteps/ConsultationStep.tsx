import { consultationTypes } from "@/lib/constant";
import React from "react";
import { Label } from "../ui/label";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Sparkles, ArrowLeft, ArrowRight } from "lucide-react";

interface ConsultationStepInterface {
  consultationType: string;
  setConsultationType: (type: string) => void;
  symptoms: string;
  setSymptoms: (symptoms: string) => void;
  doctorFees: number;
  onBack: () => void;
  onContinue: () => void;
}

const ConsultationStep = ({
  consultationType,
  setConsultationType,
  symptoms,
  setSymptoms,
  doctorFees,
  onBack,
  onContinue,
}: ConsultationStepInterface) => {
  const getConsultationPrice = (selectedType = consultationType) => {
    const typePrice =
      consultationTypes.find((ct) => ct.type === selectedType)?.price || 0;
    return Math.max(0, doctorFees + typePrice);
  };

  const handleTypeChange = (newType: string) => setConsultationType(newType);

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl shadow-md">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Consultation Details</h3>
          <p className="text-gray-600 mt-1">
            Choose how you'd like to consult with your doctor
          </p>
        </div>
      </div>

      {/* Consultation Type Selection */}
      <div className="space-y-4">
        {consultationTypes.map(({ type, icon: Icon, description, price, recommended }) => {
          const currentPrice = getConsultationPrice(type);
          const isSelected = consultationType === type;

          return (
            <div
              key={type}
              className={`relative border-2 rounded-2xl p-6 cursor-pointer transition-all duration-300 shadow-sm ${
                isSelected
                  ? "border-purple-500 bg-gradient-to-r from-purple-50 to-indigo-50 shadow-lg"
                  : "border-gray-200 bg-white hover:border-indigo-400 hover:bg-indigo-50"
              }`}
              onClick={() => handleTypeChange(type)}
            >
              {recommended && (
                <Badge className="absolute -top-3 left-6 bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 shadow">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Recommended
                </Badge>
              )}

              <div className="flex items-center space-x-6">
                <div
                  className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? "bg-gradient-to-r from-purple-500 to-indigo-600 shadow-lg"
                      : "bg-gray-100 group-hover:bg-indigo-100"
                  }`}
                >
                  <Icon
                    className={`w-7 h-7 transition-colors duration-300 ${
                      isSelected ? "text-white" : "text-gray-600 group-hover:text-indigo-600"
                    }`}
                  />
                </div>

                <div className="flex-1">
                  <h4
                    className={`font-bold text-lg transition-colors duration-300 ${
                      isSelected ? "text-purple-700" : "text-gray-900 group-hover:text-indigo-700"
                    }`}
                  >
                    {type}
                  </h4>
                  <p className="text-gray-600 mt-1">{description}</p>
                </div>

                <div className="text-right">
                  <p
                    className={`font-bold text-xl transition-colors duration-300 ${
                      isSelected ? "text-indigo-600" : "text-gray-900"
                    }`}
                  >
                    ₹{currentPrice}
                  </p>
                  {price !== 0 && (
                    <p className="text-sm text-green-600 font-semibold mt-1">Save ₹{Math.abs(price)}</p>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Selected Consultation Summary */}
      <div className="p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold text-indigo-900 text-lg">Selected Consultation:</span>
            <p className="text-indigo-700 text-sm mt-1">
              {consultationTypes.find((ct) => ct.type === consultationType)?.description}
            </p>
          </div>
          <div className="text-right">
            <span className="text-2xl font-bold text-indigo-600">₹{getConsultationPrice()}</span>
            <p className="text-indigo-700 text-sm mt-1">Including doctor fees</p>
          </div>
        </div>
      </div>

      {/* Symptoms Input */}
      <div>
        <Label
          htmlFor="symptoms"
          className="text-lg font-semibold text-gray-900 mb-2 block"
        >
          Describe your symptoms or concerns *
        </Label>
        <Textarea
          id="symptoms"
          placeholder="Provide details about your symptoms, duration, and severity..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          rows={5}
          className="resize-none border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all duration-200 text-lg placeholder:text-gray-400"
        />
        <p className="text-sm text-gray-500 mt-2">
          {symptoms.length}/500 characters • Detailed descriptions help doctors provide better care
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between gap-4 pt-6 border-t border-gray-200">
        <Button
          variant="outline"
          onClick={onBack}
          className="px-8 py-3 border-2 border-gray-200 rounded-xl hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Back
        </Button>

        <Button
          onClick={onContinue}
          disabled={!symptoms.trim()}
          className={`px-8 py-3 rounded-xl font-semibold shadow-lg transition-all duration-200 ${
            !symptoms.trim()
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 hover:shadow-xl transform hover:-translate-y-0.5"
          }`}
        >
          Continue to Payment <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>

      {/* Help Text */}
      <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 mt-6">
        <div className="flex items-start space-x-3">
          <div className="w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <span className="text-white text-sm font-bold">i</span>
          </div>
          <div>
            <p className="text-indigo-800 font-medium">Important Note</p>
            <p className="text-indigo-700 text-sm mt-1">
              Your consultation details help the doctor prepare for your appointment. For emergencies, please visit the nearest hospital immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationStep;
