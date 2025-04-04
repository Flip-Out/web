import { OrderOut } from '@arcpay/react-sdk/dist/types/order';
import { useState, useEffect, useCallback } from 'react';
import { useArcPayApi } from '../../hooks/useArcPayApi';
import SimplePay from './SimplePay';
import IntegratedPay from './IntegratedPay';

enum PaymentMode {
    simple = 'simple',
    integrated = 'integrated',
}

interface PayProps {
    amount: string;
    currency: string;
    purchaseId: number | string;
    description?: string;
    onSuccess: () => void;
    onCancel: () => void;
}

export function Pay({
                        amount,
                        currency,
                        purchaseId,
                        description,
                        onSuccess,
                        onCancel,
                    }: PayProps) {
    const [paymentMode, setPaymentMode] = useState<PaymentMode | undefined>();
    const [order, setOrder] = useState<OrderOut | undefined>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { createOrder } = useArcPayApi();

    const handlePaymentSuccess = useCallback(() => {
        onSuccess();
    }, [onSuccess]);

    const handlePaymentCancel = useCallback(() => {
        if (!paymentMode) {
            onCancel();
        }
    }, [onCancel, paymentMode]);

    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setError(null);
        setPaymentMode(undefined);
        setOrder(undefined);

        createOrder({ amount, currency, purchaseId, description })
            .then((createdOrder) => {
                if (isMounted) {
                    if (createdOrder) {
                        setOrder(createdOrder);
                    } else {
                        setError('Failed to retrieve payment order details.');
                        setTimeout(onCancel, 0);
                    }
                    setIsLoading(false);
                }
            })
            .catch((err) => {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'An unexpected error occurred during order creation.');
                    setIsLoading(false);
                    setTimeout(onCancel, 0);
                }
            });

        return () => { isMounted = false; };
    }, [amount, currency, purchaseId, description, createOrder, onCancel]);

    if (isLoading) {
        return <div className="arcpay-modal-container">Initiating ArcPay payment...</div>;
    }

    if (error) {
        return <div className="arcpay-modal-container">Error: {error} <button onClick={onCancel}>Close</button></div>;
    }

    if (!order) {
        return <div className="arcpay-modal-container">Waiting for order details... <button onClick={onCancel}>Close</button></div>;
    }

    if (!paymentMode) {
        return (
            <div className="arcpay-modal-container">
                <h3>Choose ArcPay Method</h3>
                <p>Order for {order.amount} {order.currency} created.</p>
                <div className="arcpay-button-group">
                    <button onClick={() => setPaymentMode(PaymentMode.simple)}>
                        Simple Payment (Pay via Link)
                    </button>
                    <button onClick={() => setPaymentMode(PaymentMode.integrated)}>
                        Integrated Payment (Pay with Wallet)
                    </button>
                    <button onClick={onCancel} className="arcpay-cancel-button">
                        Cancel Payment
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="arcpay-modal-container">
            {paymentMode === PaymentMode.simple && (
                <SimplePay
                    orderId={order.uuid}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                />
            )}

            {paymentMode === PaymentMode.integrated && (
                <IntegratedPay
                    orderId={order.uuid}
                    onSuccess={handlePaymentSuccess}
                    onCancel={handlePaymentCancel}
                />
            )}
        </div>
    );
}
