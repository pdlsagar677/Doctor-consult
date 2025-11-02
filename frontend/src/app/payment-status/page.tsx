import { Suspense } from 'react';
import PaymentStatusContent from './PaymentStatusContent';
import PaymentStatusLoading from './loading';

export default function PaymentStatusPage() {
  return (
    <Suspense fallback={<PaymentStatusLoading />}>
      <PaymentStatusContent />
    </Suspense>
  );
}