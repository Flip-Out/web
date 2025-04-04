// src/components/ArcPay/IntegratedPay.tsx
import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import OrderView from './OrderView';
import { useEffect, useState, useRef } from 'react';
import { useArcPay } from '@arcpay/react-sdk';
import ArcpayStatus from '@arcpay/react-sdk/dist/types/arcpay';

type Props = {
    orderId: string;
    onSuccess: () => void; // Added prop
    onCancel: () => void;  // Added prop
};

function IntegratedPay({ orderId, onSuccess, onCancel }: Props) {
    const arcPay = useArcPay();
    const [order, setOrder] = useState<OrderOut | undefined>();
    const [isPaying, setIsPaying] = useState(false); // Track payment process
    const orderStatusRef = useRef<OrderStatus>(); // Ref to track status

    useEffect(() => {
        // Store initial status in ref
        if (order) {
            orderStatusRef.current = order.status;
        }
    }, [order]);

    useEffect(() => {
        console.log(`IntegratedPay: Subscribing to order ${orderId}`);
        const unsubscribe = arcPay.onOrderChange(orderId, (o) => {
            console.log('IntegratedPay: order changed:', o);
            setOrder(o); // Update order details shown by OrderView

            // Check if status changed *to* PAID
            if (o.status === OrderStatus.PAID && orderStatusRef.current !== OrderStatus.PAID) {
                console.log("IntegratedPay: Detected PAID status via listener, calling onSuccess");
                onSuccess(); // Trigger success callback
                setIsPaying(false); // Ensure paying state is reset
            }
            // Update ref *after* checking
            orderStatusRef.current = o.status;

            // Optional: Handle expired/failed status
            if (o.status === OrderStatus.EXPIRED || o.status === OrderStatus.FAILED) {
                if (orderStatusRef.current !== o.status) {
                    console.log(`IntegratedPay: Detected ${OrderStatus[o.status]} status, calling onCancel`);
                    onCancel();
                    setIsPaying(false);
                }
            }
        });

        // Cleanup
        return () => {
            console.log(`IntegratedPay: Unsubscribing from order ${orderId}`);
            unsubscribe();
        };
    }, [orderId, arcPay, onSuccess, onCancel]); // Add callbacks

    const handlePayClick = async () => {
        if (!order || isPaying) return;
        setIsPaying(true);
        try {
            console.log(`IntegratedPay: Calling arcPay.pay for order ${orderId}`);
            const order_info = await arcPay.pay(orderId);
            console.log('IntegratedPay: arcPay.pay response:', order_info);
            // IMPORTANT: arcPay.pay might return *before* the transaction is fully confirmed
            // and the status updates via onOrderChange. Rely on the listener for onSuccess.
            // We *don't* call onSuccess immediately here.
            // If pay *itself* indicates success reliably, you could call it here, but the listener is safer.
            // If order_info *already* has status PAID, we can potentially call onSuccess early.
            if (order_info?.status === OrderStatus.PAID && orderStatusRef.current !== OrderStatus.PAID) {
                console.log("IntegratedPay: Detected PAID status immediately after pay call, calling onSuccess");
                onSuccess();
            }
            // setIsPaying(false); // Listener will handle this when status changes

        } catch (error) {
            console.error('IntegratedPay: arcPay.pay error:', error);
            // Assume any error during pay means cancellation or failure
            setIsPaying(false);
            onCancel(); // Trigger cancel callback on error
        }
        // Do not set isPaying false here necessarily, wait for listener confirmation or error
    };


    if (!order) {
        return <>Loading Payment Details...</>;
    }

    // Don't show Pay button if already paid/failed/expired/paying
    const canPay = !isPaying && (order.status === OrderStatus.PENDING || order.status === OrderStatus.NEW);

    return (
        <>
            <OrderView order={order} />

            {arcPay.arcPayStatus === ArcpayStatus.disconnected && (
                <button onClick={() => arcPay.connect()}>Connect Wallet</button>
            )}

            {arcPay.arcPayStatus === ArcpayStatus.connected && (
                <>
                    <button onClick={handlePayClick} disabled={!canPay || isPaying}>
                        {isPaying ? 'Processing...' : `Pay (${order.amount} ${order.currency})`}
                    </button>
                    <button onClick={() => arcPay.disconnect()} style={{marginLeft: '10px'}}>Disconnect Wallet</button>
                </>
            )}
            {/* Add a manual cancel button */}
            <button onClick={onCancel} style={{marginLeft: '10px'}} disabled={isPaying}>Cancel</button>
        </>
    );
}

export default IntegratedPay;
