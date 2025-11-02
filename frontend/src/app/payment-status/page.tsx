'use client';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export default function PaymentStatusContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  // Get both individual parameters and encoded data
  const status = searchParams.get('status'); // 'success' or 'failed'
  const transactionId = searchParams.get('transactionId');
  const appointmentId = searchParams.get('appointmentId');
  const amount = searchParams.get('amount');
  const encodedData = searchParams.get('data'); // eSewa encoded data
  
  const [loading, setLoading] = useState(true);
  const [countdown, setCountdown] = useState(3);
  const [paymentData, setPaymentData] = useState<any>(null);

  useEffect(() => {
    // Check if we have encoded data from eSewa
    if (encodedData) {
      try {
        console.log('📦 Encoded data received:', encodedData);
        const decodedData = JSON.parse(atob(encodedData));
        console.log('🔓 Decoded payment data:', decodedData);
        setPaymentData(decodedData);
        
        // If we have COMPLETE status from eSewa, treat as success
        if (decodedData.status === 'COMPLETE') {
          // You can call your backend to verify payment here
          verifyPaymentWithBackend(decodedData);
        }
      } catch (error) {
        console.error('❌ Error decoding payment data:', error);
      }
    }

    // Simulate loading for 2 seconds
    const loadingTimer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(loadingTimer);
  }, [encodedData]);

  useEffect(() => {
    if (!loading) {
      // Start countdown after loading completes
      const countdownTimer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownTimer);
            // Navigate to dashboard after 3 seconds
            router.push('/patient/dashboard');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownTimer);
    }
  }, [loading, router]);

  const verifyPaymentWithBackend = async (data: any) => {
    try {
      // Call your backend to verify the payment
      console.log('🔍 Verifying payment with backend:', data);
      // You can implement the actual API call here
    } catch (error) {
      console.error('❌ Payment verification failed:', error);
    }
  };

  // Determine the actual status
  const actualStatus = paymentData?.status === 'COMPLETE' ? 'success' : 
                      status || (paymentData ? 'failed' : 'success');

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="p-8 text-center">
            <Clock className="w-16 h-16 text-blue-600 mx-auto mb-4 animate-pulse" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
            <p className="text-gray-600">Please wait while we verify your payment...</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (actualStatus === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
        <div className="w-full max-w-2xl mx-4">
          <Card className="border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              {/* Success Icon */}
              <div className="flex justify-center mb-6">
                <div className="rounded-full bg-green-100 p-4">
                  <CheckCircle className="w-16 h-16 text-green-600" />
                </div>
              </div>

              {/* Success Message */}
              <h1 className="text-3xl font-bold text-gray-900 mb-4">
                Payment Successful! 🎉
              </h1>
              <p className="text-lg text-gray-600 mb-2">
                Your appointment has been confirmed successfully
              </p>
              
              {/* Auto-navigation countdown */}
              <div className="bg-blue-50 rounded-lg p-4 mb-6">
                <p className="text-blue-700 font-medium">
                  Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
                </p>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
                <h3 className="font-semibold text-gray-900 mb-4">Transaction Details</h3>
                <div className="space-y-3">
                  {paymentData?.transaction_code && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction Code:</span>
                      <span className="font-medium">{paymentData.transaction_code}</span>
                    </div>
                  )}
                  {transactionId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Transaction ID:</span>
                      <span className="font-medium">{transactionId}</span>
                    </div>
                  )}
                  {appointmentId && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Appointment ID:</span>
                      <span className="font-medium">{appointmentId}</span>
                    </div>
                  )}
                  {(amount || paymentData?.total_amount) && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount Paid:</span>
                      <span className="font-medium text-green-600">
                        ₹{amount || paymentData.total_amount}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium text-green-600">Completed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{new Date().toLocaleDateString()}</span>
                  </div>
                </div>
              </div>

              {/* Quick Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button 
                  onClick={() => router.push('/patient/dashboard')}
                  className="bg-green-600 hover:bg-green-700 px-6 py-2"
                >
                  Go to Dashboard Now
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Failure Page
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8">
      <div className="w-full max-w-2xl mx-4">
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8 text-center">
            {/* Failure Icon */}
            <div className="flex justify-center mb-6">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="w-16 h-16 text-red-600" />
              </div>
            </div>

            {/* Failure Message */}
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Payment Failed ❌
            </h1>
            <p className="text-lg text-gray-600 mb-2">
              We couldn't process your payment
            </p>
            
            {/* Auto-navigation countdown */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <p className="text-blue-700 font-medium">
                Redirecting to dashboard in {countdown} second{countdown !== 1 ? 's' : ''}...
              </p>
            </div>

            {/* Error Details */}
            <div className="bg-red-50 rounded-lg p-6 mb-6 text-left">
              <h3 className="font-semibold text-red-900 mb-4">What went wrong?</h3>
              <ul className="text-red-800 space-y-2">
                <li>• Insufficient funds in your account</li>
                <li>• Network connectivity issues</li>
                <li>• Payment gateway timeout</li>
                <li>• Incorrect payment details</li>
              </ul>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                onClick={() => router.push('/patient/dashboard')}
                className="bg-blue-600 hover:bg-blue-700 px-6 py-2"
              >
                Go to Dashboard Now
              </Button>
              <Button 
                onClick={() => window.history.back()}
                variant="outline" 
                className="px-6 py-2"
              >
                Try Payment Again
              </Button>
            </div>

            {/* Support Info */}
            <div className="mt-6 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600">
                Need help? Contact support at{" "}
                <a href="mailto:support@doctorconsult.com" className="text-blue-600 hover:underline">
                  support@doctorconsult.com
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}