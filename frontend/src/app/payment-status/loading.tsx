export default function PaymentStatusLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md mx-4">
        <div className="bg-white rounded-lg shadow-xl p-8 text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Processing Payment</h1>
          <p className="text-gray-600">Please wait while we verify your payment...</p>
        </div>
      </div>
    </div>
  );
}