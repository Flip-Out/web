import { OrderOut } from '@arcpay/react-sdk/dist/types/order';
import { useState } from 'react';
 import { useArcPayApi } from '../../hooks/useArcPayApi';
import SimplePay from './SimplePay';
import IntegratedPay from './IntegratedPay';

enum PaymentMode {
    simple = 'simple',
    integrated = 'integrated',
}

export function Pay() {
    const [paymentMode, setPaymentMode] = useState<PaymentMode | undefined>();
    const [order, setOrder] = useState<OrderOut | undefined>();
    const { createOrder } = useArcPayApi();

    if (!order) {
        return (
            <>
                <button
                    onClick={() => {
                        console.log("test arcpay")
                        setOrder({} as OrderOut)
                        createOrder()
                            .then((data) => setOrder(data));
                    }}>
                    Create Order
                </button>
            </>
        );
    }

    return (
        <>
            {!paymentMode && (
                <>
                    <button onClick={() => setPaymentMode(PaymentMode.simple)}>
                        Simple payment
                    </button>{' '}
                    <button onClick={() => setPaymentMode(PaymentMode.integrated)}>
                        Integrated payment
                    </button>
                </>
            )}
            {paymentMode == PaymentMode.simple && <SimplePay orderId={order.uuid} />}

            {paymentMode == PaymentMode.integrated && (
                <IntegratedPay orderId={order.uuid} />
            )}
        </>
    );
}
