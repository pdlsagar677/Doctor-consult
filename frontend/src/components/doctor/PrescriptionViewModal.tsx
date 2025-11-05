import { Appointment } from "@/store/appointmentStore";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Check, Copy, FileText, X, User, Calendar, Pill, Stethoscope, Shield } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface PrescriptionViewModalProps {
  appointment: Appointment;
  userType: "doctor" | "patient";
  trigger: React.ReactNode;
}

const PrescriptionViewModal = ({
  appointment,
  userType,
  trigger,
}: PrescriptionViewModalProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const copyToClipboard = async (text: string | undefined) => {
    try {
      if (text) {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (error) {
      console.error("Failed to copy", error);
    }
  };

  const otherUser =
    userType === "doctor" ? appointment?.patientId : appointment?.doctorId;

  return (
    <>
      <span onClick={openModal} className="cursor-pointer">
        {trigger}
      </span>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[85vh] overflow-hidden border-0 shadow-2xl rounded-3xl">
            {/* Gradient Header */}
            <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
            
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-bold text-gray-900">
                    Medical Prescription
                  </CardTitle>
                  <p className="text-sm text-gray-600 mt-1">
                    Consultation details and treatment plan
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => copyToClipboard(appointment?.prescription)}
                  className="h-9 border-2 border-gray-200 hover:border-emerald-500 text-gray-700 hover:text-emerald-600 rounded-xl transition-all duration-200"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                  <span className="ml-2 hidden sm:inline">
                    {copied ? "Copied!" : "Copy"}
                  </span>
                </Button>

                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={closeModal}
                  className="h-9 w-9 p-0 hover:bg-gray-100 rounded-xl"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6 px-6 pb-6">
              {/* Patient/Doctor Info */}
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-white rounded-xl border border-emerald-200 flex items-center justify-center">
                    <User className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">{otherUser?.name}</p>
                    <p className="text-sm text-gray-600">
                      {userType === "patient" 
                        ? otherUser?.specialization 
                        : `Patient • Age: ${otherUser?.age || 'N/A'}`}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <div className="flex items-center space-x-2 justify-end mb-1">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <p className="text-sm font-semibold text-gray-900">
                      {formatDate(appointment?.slotStartIso)}
                    </p>
                  </div>
                  <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">
                    {appointment.consultationType}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">
                    {formatTime(appointment?.slotStartIso)}
                  </p>
                </div>
              </div>

              {/* Prescription Section */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                    <Pill className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">
                      Treatment Plan
                    </h3>
                    <p className="text-sm text-gray-600">
                      Prescribed medications and instructions
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-emerald-50 to-white p-5 rounded-2xl border-2 border-emerald-200 shadow-sm">
                  <div className="bg-white p-4 rounded-xl border border-emerald-100">
                    <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans leading-relaxed">
                      {appointment?.prescription || "No prescription provided."}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              {appointment.notes && (
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                      <Stethoscope className="w-4 h-4 text-teal-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg">
                        Doctor's Notes
                      </h3>
                      <p className="text-sm text-gray-600">
                        Additional recommendations and follow-up instructions
                      </p>
                    </div>
                  </div>

                  <div className="bg-gradient-to-br from-teal-50 to-white p-5 rounded-2xl border-2 border-teal-200 shadow-sm">
                    <div className="bg-white p-4 rounded-xl border border-teal-100">
                      <div className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">
                        {appointment.notes}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Security Footer */}
              <div className="pt-4 border-t border-gray-200">
                <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Shield className="w-3 h-3 text-emerald-500" />
                    <span>HIPAA Compliant</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <FileText className="w-3 h-3 text-emerald-500" />
                    <span>Secure Medical Record</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
};

export default PrescriptionViewModal;