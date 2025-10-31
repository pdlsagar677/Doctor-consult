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
  const [isPaymentLoading, setIsPaymentLoading] = useState<boolean>(false);
  const platformFees = Math.round(consultationFee * 0.1);
  const totalAmount = consultationFee + platformFees;
  const [shouldAutoOpen, setShouldAutoOpen] = useState(true);
  const modelCloseCountRef = useRef<number>(0);
  const [showManualForm, setShowManualForm] = useState(false);
  const [formData, setFormData] = useState<any>(null);

  // Auto-trigger payment
  useEffect(() => {
    if (appointmentId && patientName && paymentStatus === 'idle' && !isPaymentLoading && shouldAutoOpen) {
      const timer = setTimeout(() => {
        handlePayment();
      }, 1000); // Increased delay to ensure everything is loaded
      return () => clearTimeout(timer);
    }
  }, [appointmentId, patientName, paymentStatus, isPaymentLoading, shouldAutoOpen]);

  const submitEsewaForm = (paymentData: any, paymentUrl: string) => {
    console.log('🔄 Starting eSewa form submission...');
    console.log('🌐 Payment URL:', paymentUrl);
    console.log('📦 Payment Data:', paymentData);
    
    try {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paymentUrl;
      form.style.display = 'none';
      
      // Add all payment data as hidden inputs
      Object.keys(paymentData).forEach(key => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = paymentData[key];
        form.appendChild(input);
        console.log(`✅ Added field: ${key} = ${paymentData[key]}`);
      });
      
      document.body.appendChild(form);
      console.log('✅ Form created and appended to body');
      
      // Small delay to ensure form is properly mounted
      setTimeout(() => {
        console.log('🚀 Submitting form to eSewa...');
        form.submit();
      }, 100);
      
    } catch (formError) {
      console.error('❌ Form submission error:', formError);
      // Fallback: show manual form
      setFormData({ paymentData, paymentUrl });
      setShowManualForm(true);
    }
  };

  const handlePayment = async () => {
    if (!appointmentId || !patientName) {
      console.log('ℹ️ No appointment ID or patient name, proceeding without payment');
      onConfirm();
      return;
    }

    try {
      setIsPaymentLoading(true);
      setError("");
      setPaymentStatus("processing");

      console.log('📞 Creating payment order for appointment:', appointmentId);

      const orderResponse = await httpService.postWithAuth(
        "/payment/create-order",
        { appointmentId }
      );

      console.log('📨 Payment order response:', orderResponse);

      if (!orderResponse.success) {
        throw new Error(
          orderResponse.message || "Failed to create payment order"
        );
      }

      const { paymentData, paymentUrl, transactionId } = orderResponse.data;

      // Validate required fields
      const requiredFields = ['amount', 'total_amount', 'transaction_uuid', 'product_code', 'signature', 'merchant_id'];
      const missingFields = requiredFields.filter(field => !paymentData[field]);
      
      if (missingFields.length > 0) {
        throw new Error(`Missing required fields: ${missingFields.join(', ')}`);
      }

      console.log('💰 Validated payment data, proceeding with eSewa...');

      // Submit form to eSewa
      submitEsewaForm(paymentData, paymentUrl);

      // Start polling for payment status
      startPaymentPolling(appointmentId, transactionId);

    } catch (error: any) {
      console.error("💥 Payment error", error);
      setError(error.message || "Payment failed");
      setPaymentStatus("failed");
      setIsPaymentLoading(false);
    }
  };

  const startPaymentPolling = (appointmentId: string, transactionId: string) => {
    console.log('🔄 Starting payment polling for:', appointmentId);
    let pollCount = 0;
    const maxPolls = 100; // 5 minutes at 3-second intervals

    const pollInterval = setInterval(async () => {
      pollCount++;
      try {
        console.log(`📡 Polling attempt ${pollCount} for appointment:`, appointmentId);

        // Check if payment was completed
        const statusResponse = await httpService.getWithAuth(
          `/appointment/${appointmentId}`
        );

        console.log('📊 Polling response:', statusResponse);

        if (statusResponse.success && statusResponse.data.paymentStatus === "Paid") {
          console.log('✅ Payment confirmed via polling');
          clearInterval(pollInterval);
          setPaymentStatus("success");
          if (onPaymentSuccess) {
            onPaymentSuccess(statusResponse.data);
          } else {
            onConfirm();
          }
          setIsPaymentLoading(false);
        } else if (pollCount >= maxPolls) {
          console.log('⏰ Polling timeout reached');
          clearInterval(pollInterval);
          setPaymentStatus("failed");
          setError("Payment timeout. Please check your eSewa account or contact support.");
          setIsPaymentLoading(false);
        }
      } catch (error) {
        console.error("❌ Polling error:", error);
        if (pollCount >= maxPolls) {
          clearInterval(pollInterval);
          setPaymentStatus("failed");
          setError("Unable to verify payment status. Please check manually.");
          setIsPaymentLoading(false);
        }
      }
    }, 3000); // Check every 3 seconds
  };

  const handleManualVerification = async () => {
    if (!appointmentId) return;

    try {
      setIsPaymentLoading(true);
      setError("");

      console.log('🔍 Manual verification for appointment:', appointmentId);

      const verifyResponse = await httpService.postWithAuth(
        "/payment/verify-payment",
        {
          appointmentId,
          transaction_code: "MANUAL_CHECK",
          status: "COMPLETE"
        }
      );

      console.log('📨 Manual verification response:', verifyResponse);

      if (verifyResponse.success) {
        setPaymentStatus("success");
        if (onPaymentSuccess) {
          onPaymentSuccess(verifyResponse.data);
        } else {
          onConfirm();
        }
      } else {
        throw new Error(verifyResponse.message || "Payment verification failed");
      }
    } catch (error: any) {
      console.error("❌ Manual verification failed", error);
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
    } else {
      onConfirm();
    }
  };

  return (
    <div className="space-y-8">
      {/* Manual Form Fallback */}
      {showManualForm && formData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold mb-4">Complete Payment with eSewa</h3>
            <p className="text-gray-600 mb-4">
              Click the button below to proceed to eSewa payment gateway.
            </p>
            <form method="POST" action={formData.paymentUrl}>
              {Object.keys(formData.paymentData).map(key => (
                <input
                  key={key}
                  type="hidden"
                  name={key}
                  value={formData.paymentData[key]}
                />
              ))}
              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 flex-1">
                  Proceed to eSewa
                </Button>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowManualForm(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
            <div className="mt-4 text-sm text-gray-500">
              <p>If the payment doesn't start automatically, use this manual option.</p>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Payment & Confirmation
        </h3>
        
        {/* Debug Info - Remove in production */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-yellow-800">
            <strong>Debug Info:</strong> Appointment: {appointmentId || 'None'}, 
            Patient: {patientName || 'None'}, 
            Status: {paymentStatus}
          </p>
        </div>

        <div className="bg-gray-50 rounded-lg p-6 mb-8">
          <h4 className="font-semibold text-gray-900 mb-4">Booking Summary</h4>
          <div className="space-y-3">
            {/* ... your existing booking summary JSX ... */}
            <div className="flex justify-between">
              <span className="text-gray-600">Date & Time</span>
              <span className="font-medium">
                {selectedDate?.toLocaleDateString()} at {selectedSlot}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Consultation Type</span>
              <span className="font-medium">{consultationType}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Doctor</span>
              <span className="font-medium">{doctorName}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Duration</span>
              <span className="font-medium">{slotDuration} minutes</span>
            </div>

            <Separator />

            <div className="flex justify-between">
              <span className="text-gray-600">Consultation Fee</span>
              <span className="font-medium">₹{consultationFee}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Platform Fee</span>
              <span className="font-medium">₹{platformFees}</span>
            </div>

            <Separator />

            <div className="flex justify-between text-lg">
              <span className="font-semibold">Total Amount</span>
              <span className="font-bold text-green-600">₹{totalAmount}</span>
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {paymentStatus === "processing" && (
            <motion.div
              key="processing"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="text-center py-12"
            >
              <Loader2 className="w-12 h-12 mx-auto mb-4 text-blue-600 animate-spin" />
              <h4 className="text-lg font-semibold text-gray-900 mb-2">
                Redirecting to eSewa...
              </h4>
              <p className="text-gray-600 mb-4">
                You will be redirected to eSewa payment gateway to complete your payment
              </p>
              <Progress value={50} className="w-full" />
              <div className="mt-4 text-sm text-gray-500">
                <p>If you are not redirected automatically, check your browser pop-up blocker.</p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setShowManualForm(true)}
                  className="mt-2"
                >
                  Use Manual Payment
                </Button>
              </div>
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
              <h4 className="text-lg font-semibold text-green-800 mb-2">
                Payment Successful!
              </h4>
              <p className="text-gray-600 mb-4">
                Your appointment has been confirmed
              </p>
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
              <h4 className="text-lg font-semibold text-red-800 mb-2">
                Payment Failed!
              </h4>
              <p className="text-gray-600 mb-4">{error}</p>
              <div className="space-y-2">
                <Button
                  onClick={() => {
                    setPaymentStatus("idle");
                    setError("");
                    handlePayment();
                  }}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Try Again
                </Button>
                <Button
                  onClick={handleManualVerification}
                  variant="outline"
                  className="ml-2"
                >
                  Check Payment Status
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg mb-8">
          <Shield className="w-6 h-6 text-green-600" />
          <div>
            <p className="font-medium text-green-800">Secure Payment</p>
            <p>Your payment is protected by eSewa's secure payment gateway</p>
          </div>
        </div>
      </div>

      {paymentStatus === "idle" && (
        <div className="flex justify-between gap-2">
          <Button variant="outline" onClick={onBack} className="px-8 py-3">
            Back
          </Button>
          <Button
            onClick={handlePaynow}
            disabled={loading || isPaymentLoading}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-lg font-semibold"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span className="text-sm md:text-lg">
                  Creating Appointment...
                </span>
              </>
            ) : isPaymentLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                <span className="text-sm md:text-lg">Processing...</span>
              </>
            ) : appointmentId && patientName ? (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                <span className="text-sm md:text-lg">
                  Pay with eSewa
                </span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5 mr-2" />
                <span className="text-sm md:text-lg">
                  Pay Rs {totalAmount} & Book
                </span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
};

export default PaymentStep;