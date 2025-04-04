// src/components/ArcPay/SimplePay.tsx
import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import OrderView from './OrderView';
// Removed all imports related to hooks (useEffect, useState, useRef, useArcPay)

type Props = {
    order: OrderOut; // Expect the full order object
    onCancel: () => void;
};

function SimplePay({ order, onCancel }: Props) {

    // No more useEffect for listeners here

    if (!order) {
        return <>Loading Payment Link...</>; // Should be handled by parent ideally
    }

    const canPay = order.status === OrderStatus.created || order.status === OrderStatus.pending;

    return (
        <>
            <OrderView order={order} />
            {order.paymentUrl && canPay && (
                <button
                    onClick={() => window.open(order.paymentUrl, '_blank', 'noreferrer')}>
                    Pay ({order.amount} ${order.currency}) via Link
                </button>
            )}
            {/* Display status messages based on the passed order prop */}
            {order.status === OrderStatus.captured && <p>Payment Complete.</p>}
            {(order.status === OrderStatus.failed || order.status === OrderStatus.canceled) && <p>Payment {order.status}.</p>}

            <button onClick={onCancel} style={{marginLeft: '10px'}}>Cancel</button>
        </>
    );
}
export default SimplePay;
