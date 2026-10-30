import { useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { router } from "@inertiajs/react";
import { toast } from "@/components/custom-toast";
import { formatCurrencyForCompany } from "@/utils/helpers";
import axios from "axios";

interface PayPalPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: any;
  amount: number;
  paypalClientId?: string;
}

export function PayPalPaymentModal({
  isOpen,
  onClose,
  invoice,
  amount,
  paypalClientId,
}: PayPalPaymentModalProps) {
  const { t } = useTranslation();
  const [processing, setProcessing] = useState(false);
  const paypalRef = useRef<HTMLDivElement>(null);
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const currency = invoice?.currency?.code || "USD";

  useEffect(() => {
    if (!isOpen || !paypalClientId) return;

    // Clear any existing PayPal buttons
    if (paypalRef.current) {
      paypalRef.current.innerHTML = "";
    }

    // Check if PayPal SDK is already loaded
    if (window.paypal) {
      renderPayPalButtons();
      return;
    }

    // Load PayPal SDK
    const existingScript = document.querySelector(
      `script[src*="paypal.com/sdk/js"]`,
    );
    if (existingScript) {
      existingScript.addEventListener("load", renderPayPalButtons);
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&currency=${encodeURIComponent(currency)}&disable-funding=credit,card`;
    script.async = true;

    script.onload = renderPayPalButtons;
    script.onerror = () => {
      toast.error(t("Failed to load PayPal. Please try again."));
    };

    document.head.appendChild(script);
  }, [isOpen, paypalClientId, currency]);

  const renderPayPalButtons = () => {
    if (!window.paypal || !paypalRef.current) return;

    setPaypalLoaded(true);

    window.paypal
      .Buttons({
        createOrder: async () => {
          const response = await axios.post(
            route("paypal.create-invoice-order"),
            {
              invoice_token: invoice.payment_token,
              amount: amount.toFixed(2),
            },
          );
          return response.data.order_id;
        },
        onApprove: (data: any, actions: any) => {
          setProcessing(true);
          return actions.order
            .capture()
            .then((details: any) => {
              const captureId =
                details?.purchase_units?.[0]?.payments?.captures?.[0]?.id;
              if (!details?.id || details.id !== data.orderID || !captureId) {
                throw new Error(
                  t("PayPal did not return a completed capture."),
                );
              }

              router.post(
                route("invoice.payment.process", invoice.payment_token),
                {
                  payment_method: "paypal",
                  invoice_token: invoice.payment_token,
                  amount: amount.toFixed(2),
                  order_id: details.id,
                  payment_id: captureId,
                },
                {
                  onSuccess: () => window.location.reload(),
                  onError: (errors) => {
                    toast.error(Object.values(errors).join(", "));
                    setProcessing(false);
                  },
                },
              );
            })
            .catch(() => {
              toast.error(
                t(
                  "PayPal payment could not be verified. Please contact support if you were charged.",
                ),
              );
              setProcessing(false);
            });
        },
        onError: (err: any) => {
          toast.error(t("PayPal error occurred. Please try again."));
          setProcessing(false);
        },
        onCancel: () => {
          toast.info(t("Payment cancelled"));
          onClose();
        },
      })
      .render(paypalRef.current)
      .catch((error: any) => {
        toast.error(
          t("Failed to load PayPal buttons. Please refresh and try again."),
        );
      });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{t("PayPal Payment")}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="text-center p-4">
            <div className="text-4xl mb-2">🅿️</div>
            <h3 className="text-lg font-semibold mb-2">
              {t("Pay with PayPal")}
            </h3>
            <p className="text-xl font-bold text-blue-600">
              {" "}
              {formatCurrencyForCompany(amount.toFixed(2))}
            </p>
          </div>

          {paypalClientId ? (
            <div>
              <div ref={paypalRef} className="min-h-[50px] w-full"></div>
              {!paypalLoaded && (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">
                    {t("Loading PayPal...")}
                  </p>
                </div>
              )}
              {paypalLoaded && (
                <p className="text-xs text-gray-500 text-center mt-2">
                  {t("Click the PayPal button above to complete payment")}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-4 text-center">
              <p className="text-sm text-gray-600">
                {t("PayPal is not configured for this invoice.")}
              </p>
              <Button type="button" variant="outline" onClick={onClose}>
                {t("Close")}
              </Button>
            </div>
          )}

          {paypalClientId && paypalLoaded && (
            <div className="flex justify-center">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={processing}
              >
                {t("Cancel")}
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Extend window object for PayPal
declare global {
  interface Window {
    paypal?: any;
  }
}
