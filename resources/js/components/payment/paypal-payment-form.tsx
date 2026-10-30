import { useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "@/components/custom-toast";
import { usePaymentProcessor } from "@/hooks/usePaymentProcessor";
import axios from "axios";

interface PayPalPaymentFormProps {
  planId: number;
  planPrice: number;
  couponCode: string;
  billingCycle: string;
  paypalClientId: string;
  currency: string;
  onSuccess: () => void;
  onCancel: () => void;
}

export function PayPalPaymentForm({
  planId,
  couponCode,
  billingCycle,
  paypalClientId,
  currency,
  onSuccess,
  onCancel,
}: PayPalPaymentFormProps) {
  const { t } = useTranslation();
  const paypalRef = useRef<HTMLDivElement>(null);

  const { processPayment } = usePaymentProcessor({
    onSuccess,
    onError: (error) => toast.error(error),
  });

  useEffect(() => {
    if (!paypalClientId || !paypalRef.current) return;

    // Load PayPal SDK
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${paypalClientId}&currency=${currency.toUpperCase()}&disable-funding=credit,card`;
    script.async = true;

    script.onload = () => {
      if (window.paypal && paypalRef.current) {
        window.paypal
          .Buttons({
            createOrder: async () => {
              const response = await axios.post(
                route("paypal.create-plan-order"),
                {
                  plan_id: planId,
                  billing_cycle: billingCycle,
                  coupon_code: couponCode || "",
                },
              );
              return response.data.order_id;
            },
            onApprove: (data: any, actions: any) => {
              return actions.order.capture().then((details: any) => {
                const captureId =
                  details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
                if (!details?.id || details.id !== data.orderID || !captureId) {
                  throw new Error("PayPal capture was not completed.");
                }

                processPayment("paypal", {
                  planId,
                  billingCycle,
                  couponCode,
                  order_id: details.id,
                  payment_id: captureId,
                });
              });
            },
            onError: (err: any) => {
              if (err.message && err.message.includes("declined")) {
                toast.error(
                  t(
                    "Card was declined. Please try a different payment method.",
                  ),
                );
              } else {
                toast.error(t("Payment failed. Please try again."));
              }
            },
            onCancel: () => {
              onCancel();
            },
          })
          .render(paypalRef.current);
      }
    };

    document.head.appendChild(script);

    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, [paypalClientId, planId, billingCycle, couponCode, currency]);

  if (!paypalClientId) {
    return (
      <div className="p-4 text-center text-red-500">
        {t("PayPal not configured")}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div ref={paypalRef}></div>
    </div>
  );
}

// Extend window object for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}
