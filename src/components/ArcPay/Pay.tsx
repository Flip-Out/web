// src/components/ArcPay/Pay.tsx
import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import { useState, useEffect, useCallback, useRef } from 'react';
import { useArcPayApi } from '../../hooks/useArcPayApi';
import SimplePay from './SimplePay'; // Make sure path is correct
import IntegratedPay from './IntegratedPay'; // Make sure path is correct
import { useArcPay } from '@arcpay/react-sdk';
import OrderView from './OrderView'; // <-- Add this import

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
    const arcPay = useArcPay();
    const orderStatusRef = useRef<OrderStatus | undefined>();

    useEffect(() => {
        if (order) {
            orderStatusRef.current = order.status;
        }
    }, [order]);

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
                        orderStatusRef.current = createdOrder.status;
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


    useEffect(() => {
        if (!order?.uuid) {
            return;
        }

        const orderId = order.uuid;
        let isListenerActive = true;

        const handleOrderChange = (o: OrderOut) => {
            if (!isListenerActive || o.uuid !== orderId) return;
            console.log("handleOrderChange: " + JSON.stringify(o))
            // Update the central order state
            setOrder(prevOrder => {
                // Prevent unnecessary re-renders if the object is identical
                if (prevOrder && o && prevOrder.status === o.status && prevOrder.txn?.hash === o.txn?.hash) {
                    return prevOrder;
                }
                return o;
            });

            // Use ref for checking previous status to avoid stale closure issues
            const previousStatus = orderStatusRef.current;

            // Call callbacks based on status change detection
            if (o.status === OrderStatus.captured && previousStatus !== OrderStatus.captured) {
                onSuccess();
            } else if ((o.status === OrderStatus.failed || o.status === OrderStatus.canceled) &&
                (previousStatus !== OrderStatus.failed && previousStatus !== OrderStatus.canceled)) {
                onCancel();
            }
            // Ref is updated via separate useEffect watching `order` state
        };

        try {
            arcPay.onOrderChange(orderId, handleOrderChange);
        } catch (err) {
            console.error("Pay: Error setting order change listener:", err);
            setError("Failed to monitor payment status.");
        }

        return () => {
            isListenerActive = false;
            // No SDK cleanup function exists or is needed here based on SDK design
        };
    }, [order?.uuid, arcPay, onSuccess, onCancel]);


    const handleIntegratedPay = useCallback(async () => {
        if (!order?.uuid) throw new Error("Order ID not available for payment.");
        try {
            const order_info = await arcPay.pay(order.uuid);
            if (order_info) {
                setOrder(order_info);
            }
        } catch (error) {
            console.error('Pay: arcPay.pay error:', error);
            throw error;
        }
    }, [arcPay, order?.uuid]);


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
                {/* Use OrderView here */}
                <OrderView order={order} />
                <div className="arcpay-button-group" style={{marginTop: "15px"}}>
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
                    order={order} // Pass the centrally managed order state
                    onCancel={onCancel}
                />
            )}

            {paymentMode === PaymentMode.integrated && (
                <IntegratedPay
                    order={order} // Pass the centrally managed order state
                    onPay={handleIntegratedPay} // Pass the payment trigger function
                    onCancel={onCancel}
                />
            )}
        </div>
    );
}
