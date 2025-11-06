import { httpService } from "@/service/httpService";
import { userAuthStore } from "@/store/authStore";
import React, { useEffect, useRef, useState } from "react";
import { Separator } from "../ui/separator";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle, CreditCard, Loader2, Shield, XCircle } from "lucide-react";
import { Progress } from "../ui/progress";
import { Button } from "../ui/button";

interface PaymentStepInterface {
  selectedDate: Date | undefined;
  selectedSlot: string;
  consultationType: string;
  doctorName: string;
  slotDuration: number;
  consultationFee: number;
  isProcessing: boolean;
  onBack: () => void;
  onConfirm: () => void;
  onPaymentSuccess?: (appointment: any) => void;
  loading: boolean;
  appointmentId?: string;
  patientName?: string;
}

const PaymentStep = ({
  selectedDate,
  selectedSlot,
  consultationType,
  doctorName,
  slotDuration,
  consultationFee,
  isProcessing,
  onBack,
  onConfirm,
  onPaymentSuccess,
  loading,
  appointmentId,
  patientName,
}: PaymentStepInterface) => {
  const [paymentStatus, setPaymentStatus] = useState<
    "idle" | "processing" | "success" | "failed"
  >("idle");
  const { user } = userAuthStore();
  const [error, setError] = useState<string>("");
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const platformFees = Math.round(consultationFee * 0.1);
  const totalAmount = consultationFee + platformFees;

  const [showManualForm, setShowManualForm] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  const modelCloseCountRef = useRef<number>(0);

  useEffect(() => {
    if (appointmentId && patientName && paymentStatus === "idle" && !isPaymentLoading) {
      const timer = setTimeout(() => {
        handlePayment();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [appointmentId, patientName, paymentStatus, isPaymentLoading]);

  const submitEsewaForm = (paymentData: any, paymentUrl: string) => {
    try {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = paymentUrl;
      form.style.display = "none";
      Object.keys(paymentData).forEach((key) => {
        const input = document.createElement("input");
        input.type = "hidden";
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
      });
      document.body.appendChild(form);
      setTimeout(() => form.submit(), 100);
    } catch {
      setFormData({ paymentData, paymentUrl });
      setShowManualForm(true);
    }
  };

  const handlePayment = async () => {
    if (!appointmentId || !patientName) {
      onConfirm();
      return;
    }

    try {
      setIsPaymentLoading(true);
      setError("");
      setPaymentStatus("processing");

      const orderResponse = await httpService.postWithAuth(
        "/payment/create-order",
        { appointmentId }
      );

      if (!orderResponse.success) throw new Error(orderResponse.message || "Payment failed");

      const { paymentData, paymentUrl, transactionId } = orderResponse.data;

      submitEsewaForm(paymentData, paymentUrl);
      startPaymentPolling(appointmentId, transactionId);
    } catch (error: any) {
      setError(error.message || "Payment failed");
      setPaymentStatus("failed");
      setIsPaymentLoading(false);
    }
  };

  const startPaymentPolling = (appointmentId: string, transactionId: string) => {
    let pollCount = 0;
    const maxPolls = 100;
    const pollInterval = setInterval(async () => {
      pollCount++;
      try {
        const statusResponse = await httpService.getWithAuth(`/appointment/${appointmentId}`);
        if (statusResponse.success && statusResponse.data.paymentStatus === "Paid") {
          clearInterval(pollInterval);
          setPaymentStatus("success");
          if (onPaymentSuccess) onPaymentSuccess(statusResponse.data);
          else onConfirm();
          setIsPaymentLoading(false);
        } else if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          setPaymentStatus("failed");
          setError("Payment timeout. Please check your eSewa account or contact support.");
          setIsPaymentLoading(false);
        }
      } catch {
        if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          setPaymentStatus("failed");
          setError("Unable to verify payment status. Please check manually.");
          setIsPaymentLoading(false);
        }
      }
    }, 3000);
  };

  const handleManualVerification = async () => {
    if (!appointmentId) return;
    try {
      setIsPaymentLoading(true);
      setError("");

      const verifyResponse = await httpService.postWithAuth("/payment/verify-payment", {
        appointmentId,
        transaction_code: "MANUAL_CHECK",
        status: "COMPLETE",
      });

      if (verifyResponse.success) {
        setPaymentStatus("success");
        if (onPaymentSuccess) onPaymentSuccess(verifyResponse.data);
        else onConfirm();
      } else throw new Error(verifyResponse.message || "Payment verification failed");
    } catch (error: any) {
      setError(error.message || "Payment verification failed");
      setPaymentStatus("failed");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  const handlePaynow = () => {
    if (appointmentId && patientName) {
      modelCloseCountRef.current = 0;
      handlePayment();
    } else onConfirm();
  };

  return (
    <div className="space-y-8">
      {/* Manual Form */}
      {showManualForm && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-2xl max-w-md w-full shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Complete Payment</h3>
            <p className="text-gray-600 mb-4">
              Use the button below to proceed to eSewa payment gateway.
            </p>
            <form method="POST" action={formData.paymentUrl}>
              {Object.keys(formData.paymentData).map((key) => (
                <input key={key} type="hidden" name={key} value={formData.paymentData[key]} />
              ))}
              <div className="flex gap-2">
                <Button type="submit" className="bg-purple-500 hover:bg-purple-600 flex-1">
                  Proceed to eSewa
                </Button>
                <Button type="button" variant="outline" onClick={() => setShowManualForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center space-x-4">
        <div className="bg-gradient-to-r from-purple-500 to-indigo-600 p-3 rounded-xl shadow-md">
          <CreditCard className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-gray-900">Payment & Confirmation</h3>
          <p className="text-gray-600 mt-1">Securely complete your booking</p>
        </div>
      </div>

      {/* Booking Summary */}
      <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4">
        <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
        <div className="space-y-2">
          <div className="flex justify-between"><span className="text-gray-600">Date & Time</span><span className="font-medium">{selectedDate?.toLocaleDateString()} at {selectedSlot}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Consultation Type</span><span className="font-medium">{consultationType}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Doctor</span><span className="font-medium">{doctorName}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Duration</span><span className="font-medium">{slotDuration} mins</span></div>
          <Separator />
          <div className="flex justify-between"><span className="text-gray-600">Consultation Fee</span><span className="font-medium">{consultationFee}</span></div>
          <div className="flex justify-between"><span className="text-gray-600">Platform Fee</span><span className="font-medium">{platformFees}</span></div>
          <Separator />
          <div className="flex justify-between text-lg font-semibold text-indigo-700">
            <span>Total Amount</span>
            <span>Rs.{totalAmount}</span>
          </div>
        </div>
      </div>

      {/* Payment Status */}
      <AnimatePresence mode="wait">
        {paymentStatus === "processing" && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <Loader2 className="w-12 h-12 mx-auto mb-4 text-indigo-600 animate-spin" />
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Redirecting to eSewa...</h4>
            <p className="text-gray-600 mb-4">Please wait while your payment is being processed.</p>
            <Progress value={50} className="w-full" />
            <Button variant="outline" size="sm" onClick={() => setShowManualForm(true)} className="mt-4">
              Use Manual Payment
            </Button>
          </motion.div>
        )}

        {paymentStatus === "success" && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <CheckCircle className="w-16 h-16 mx-auto mb-4 text-green-600" />
            <h4 className="text-lg font-semibold text-green-800 mb-2">Payment Successful!</h4>
            <p className="text-gray-600 mb-4">Your appointment has been confirmed.</p>
          </motion.div>
        )}

        {paymentStatus === "failed" && (
          <motion.div
            key="failed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="text-center py-12"
          >
            <XCircle className="w-16 h-16 mx-auto mb-4 text-red-600" />
            <h4 className="text-lg font-semibold text-red-800 mb-2">Payment Failed!</h4>
            <p className="text-gray-600 mb-4">{error}</p>
            <div className="flex justify-center gap-2">
              <Button onClick={handlePaynow} className="bg-indigo-600 hover:bg-indigo-700">Try Again</Button>
              <Button onClick={handleManualVerification} variant="outline">Check Status</Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secure Payment Info */}
      <div className="flex items-center space-x-3 p-4 bg-indigo-50 rounded-xl">
        <Shield className="w-6 h-6 text-indigo-600" />
        <div>
          <p className="font-medium text-indigo-800">Secure Payment</p>
          <p className="text-gray-600 text-sm">Your payment is protected by eSewa's secure gateway.</p>
        </div>
      </div>

      {/* Bottom Actions */}
      {paymentStatus === "idle" && (
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onBack} className="px-8 py-3">Back</Button>
          <Button
            onClick={handlePaynow}
            disabled={loading || isPaymentLoading}
            className="px-8 py-3 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white font-semibold"
          >
            {loading || isPaymentLoading ? (
              <Loader2 className="w-5 h-5 mr-2 animate-spin inline-block" />
            ) : (
              <CreditCard className="w-5 h-5 mr-2 inline-block" />
            )}
            <span>{appointmentId && patientName ? "Pay with eSewa" : `Pay Rs.${totalAmount} & Book`}</span>
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;
