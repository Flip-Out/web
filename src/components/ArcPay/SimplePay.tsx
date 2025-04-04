// src/components/ArcPay/SimplePay.tsx
import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import OrderView from './OrderView';
import { useEffect, useState, useRef } from 'react';
import { useArcPay } from '@arcpay/react-sdk';

type Props = {
    orderId: string;
    onSuccess: () => void; // Added prop
    onCancel: () => void;  // Added prop
};

function SimplePay({ orderId, onSuccess, onCancel }: Props) {
    const arcPay = useArcPay();
    const [order, setOrder] = useState<OrderOut | undefined>();
    const orderStatusRef = useRef<OrderStatus>(); // Ref to track status

    useEffect(() => {
        // Store initial status in ref
        if (order) {
            orderStatusRef.current = order.status;
        }
    }, [order]);


    useEffect(() => {
        console.log(`SimplePay: Subscribing to order ${orderId}`);
        const unsubscribe = arcPay.onOrderChange(orderId, (o) => {
            console.log('SimplePay: order changed:', o);
            setOrder(o);

            // Check if status changed *to* PAID
            if (o.status === OrderStatus.PAID && orderStatusRef.current !== OrderStatus.PAID) {
                console.log("SimplePay: Detected PAID status, calling onSuccess");
                onSuccess();
            }
            // Update ref *after* checking
            orderStatusRef.current = o.status;

            // Optional: Handle expired/failed status if needed
            if (o.status === OrderStatus.EXPIRED || o.status === OrderStatus.FAILED) {
                console.log(`SimplePay: Detected ${OrderStatus[o.status]} status, calling onCancel`);
                // Check ref to avoid calling cancel multiple times if status flaps
                if (orderStatusRef.current !== o.status) {
                    onCancel();
                }
            }
        });

        // Cleanup subscription on unmount
        return () => {
            console.log(`SimplePay: Unsubscribing from order ${orderId}`);
            unsubscribe();
        };
    }, [orderId, arcPay, onSuccess, onCancel]); // Add callbacks to dependency array

    if (!order) {
        return <>Loading Payment Link...</>;
    }

    // Don't show Pay button if already paid/failed/expired
    const canPay = order.status === OrderStatus.PENDING || order.status === OrderStatus.NEW;

    return (
        <>
            <OrderView order={order} />

            {order.paymentUrl && canPay && (
                <button
                    onClick={() => window.open(order.paymentUrl, '_blank', 'noreferrer')}>
                    Pay ({order.amount} {order.currency}) via Link
                </button>
            )}
            {/* Add a manual cancel button */}
            <button onClick={onCancel} style={{marginLeft: '10px'}}>Cancel</button>
        </>
    );
}

export default SimplePay;