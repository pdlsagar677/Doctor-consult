"use client";
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { FileText, Save, X, AlertCircle, Pill, Stethoscope } from "lucide-react";
import { Button } from "../ui/button";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";

interface PrescriptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (prescription: string, notes: string) => Promise<void>;
  patientName: string;
  loading?: boolean;
}

const PrescriptionModal = ({
  isOpen,
  onClose,
  onSave,
  patientName,
  loading,
}: PrescriptionModalProps) => {
  const [prescription, setPrescription] = useState("");
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSave = async () => {
    try {
      await onSave(prescription, notes);
      setPrescription("");
      setNotes("");
    } catch (error) {
      console.error("Failed to save prescription");
    }
  };

  const handleClose = () => {
    setPrescription("");
    setNotes("");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden border-0 shadow-2xl rounded-3xl">
        {/* Gradient Header */}
        <div className="h-2 bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500"></div>
        
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4 pt-6 px-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-white" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-gray-900">
                Complete Consultation
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Finalize prescription and notes
              </p>
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={handleClose}
            className="w-8 h-8 p-0 hover:bg-gray-100 rounded-xl"
          >
            <X className="w-4 h-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 px-6 pb-6">
          {/* Alert Banner */}
          <div className="flex items-start space-x-4 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl border border-emerald-200">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertCircle className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 text-sm">
                Confirm Consultation Completion
              </h3>
              <p className="text-sm text-emerald-700 mt-1">
                Ready to complete consultation with{" "}
                <strong className="text-emerald-900">{patientName}</strong>?
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
                <Label htmlFor="prescription" className="text-sm font-semibold text-gray-900">
                  Prescription Details
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Required for consultation completion
                </p>
              </div>
            </div>
            
            <Textarea
              id="prescription"
              value={prescription}
              onChange={(e) => setPrescription(e.target.value)}
              placeholder="Enter detailed prescription including medications, dosages, frequency, and specific instructions..."
              rows={6}
              className="min-h-[140px] border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 resize-none"
              required
            />
            
            <div className="flex items-start space-x-2 text-xs text-gray-500 bg-gray-50 p-3 rounded-lg">
              <div className="w-4 h-4 bg-emerald-100 rounded flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-emerald-600 text-xs">💡</span>
              </div>
              <p>
                Include medication names, dosages, frequency, duration, and any special instructions for optimal patient care.
              </p>
            </div>
          </div>

          {/* Additional Notes Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
                <Stethoscope className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <Label htmlFor="notes" className="text-sm font-semibold text-gray-900">
                  Additional Notes
                </Label>
                <p className="text-xs text-gray-500 mt-1">
                  Optional follow-up instructions and recommendations
                </p>
              </div>
            </div>
            
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add follow-up instructions, lifestyle recommendations, diet advice, or any other relevant notes..."
              rows={4}
              className="min-h-[100px] border-2 border-gray-200 rounded-xl focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition-all duration-200 resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button 
              variant="outline" 
              onClick={handleClose} 
              disabled={loading}
              className="h-11 px-6 border-2 border-gray-300 text-gray-700 hover:border-gray-400 rounded-xl transition-all duration-200"
            >
              Cancel
            </Button>

            <Button
              onClick={handleSave}
              disabled={!prescription.trim() || loading}
              className="h-11 px-8 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Complete Consultation</span>
                </div>
              )}
            </Button>
          </div>

          {/* Security Note */}
          <div className="text-center pt-4">
            <div className="inline-flex items-center space-x-2 text-xs text-gray-500 bg-gray-100 px-4 py-2 rounded-full">
              <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
              <span>All information is securely stored and HIPAA compliant</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PrescriptionModal;