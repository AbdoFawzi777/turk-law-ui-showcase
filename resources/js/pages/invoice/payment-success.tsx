import { usePage } from '@inertiajs/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { t } from '@/utils/i18n';

export default function PaymentSuccess() {
  const { invoice } = usePage().props as any;
  const latestPayment = invoice.payments?.[invoice.payments.length - 1];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900">{t('Payment Successful!')}</h1>
          <p className="text-gray-600 mt-2">{t('Thank you for your payment')}</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{t('Payment Details')}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">{t('Invoice Number')}</p>
                  <p className="font-medium">{invoice.invoice_number}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('Payment Amount')}</p>
                  <p className="font-medium text-green-600">
                    ${parseFloat(latestPayment?.amount || 0).toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('Payment Date')}</p>
                  <p className="font-medium">
                    {latestPayment?.payment_date ? new Date(latestPayment.payment_date).toLocaleDateString() : t('Today')}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">{t('Status')}</p>
                  <p className="font-medium text-green-600">{t('Completed')}</p>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <p className="text-sm text-gray-600 mb-2">{t('Invoice Summary')}</p>
                <div className="flex justify-between">
                  <span>{t('Total Amount:')}</span>
                  <span>${parseFloat(invoice.total_amount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>{t('Total Paid:')}</span>
                  <span>${invoice.payments?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-medium">
                  <span>{t('Remaining:')}</span>
                  <span>${(parseFloat(invoice.total_amount) - (invoice.payments?.reduce((sum: number, p: any) => sum + parseFloat(p.amount), 0) || 0)).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
