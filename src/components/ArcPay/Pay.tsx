// src/components/ArcPay/Pay.tsx
import { OrderOut, OrderStatus } from '@arcpay/react-sdk/dist/types/order';
import { useState, useEffect, useCallback } from 'react';
import { useArcPayApi } from '../../hooks/useArcPayApi'; // Correct path
import SimplePay from './SimplePay';
import IntegratedPay from './IntegratedPay';
import { addNotification, updateLoadingState } from '../../store/actions'; // Import store actions
import { useDispatch } from '../../store/dispatch'; // Import store dispatch

enum PaymentMode {
    simple = 'simple',
    integrated = 'integrated',
}

// --- Add Props ---
interface PayProps {
    amount: string; // e.g., "10.5" from subscription.tonCurrency
    currency: string; // e.g., "TON"
    purchaseId: number | string;
    description?: string;
    onSuccess: () => void; // Callback for successful payment
    onCancel: () => void;  // Callback for cancellation or failure
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
    const [isLoading, setIsLoading] = useState(true); // Loading state for order creation
    const [error, setError] = useState<string | null>(null);
    const { createOrder } = useArcPayApi();
    const { dispatch } = useDispatch(); // Get dispatch

    // Use useCallback for child component callbacks to prevent unnecessary re-renders
    const handlePaymentSuccess = useCallback(() => {
        console.log("Pay component received success");
        onSuccess(); // Call parent callback
    }, [onSuccess]);

    const handlePaymentCancel = useCallback(() => {
        console.log("Pay component received cancel/failure");
        // If we are cancelling *before* selecting simple/integrated, call parent onCancel
        if (!paymentMode) {
            onCancel();
        }
        // Let SimplePay/IntegratedPay handle their own cancellation logic if needed,
        // but they should ultimately call handlePaymentSuccess or this handlePaymentCancel
        // We might also call onCancel if the user closes this component prematurely.
        // For now, rely on child components triggering success/cancel.
        // Potentially add a manual "Cancel" button here too.
    }, [onCancel, paymentMode]);


    // --- Trigger createOrder automatically ---
    useEffect(() => {
        let isMounted = true;
        setIsLoading(true);
        setError(null);
        setPaymentMode(undefined); // Reset mode on new order details
        setOrder(undefined); // Reset order

        console.log(`ArcPay: Creating order - Amount: ${amount}, Currency: ${currency}, PurchaseID: ${purchaseId}`);

        createOrder({ amount, currency, purchaseId, description })
            .then((createdOrder) => {
                if (isMounted) {
                    if (createdOrder) {
                        setOrder(createdOrder);
                        setIsLoading(false);
                    } else {
                        setError('Failed to create payment order. Please try again.');
                        setIsLoading(false);
                        // Automatically trigger cancel if order creation fails
                        // Use timeout to allow state update before calling cancel
                        setTimeout(onCancel, 0);
                    }
                }
            })
            .catch((err) => { // Should be caught by hook, but as fallback
                if (isMounted) {
                    console.error("Error in Pay component useEffect:", err);
                    setError('An unexpected error occurred.');
                    setIsLoading(false);
                    // Automatically trigger cancel on unexpected error
                    setTimeout(onCancel, 0);
                }
            });

        return () => {
            isMounted = false; // Prevent state updates on unmounted component
        };
        // Dependency array: re-run effect if these core props change
    }, [amount, currency, purchaseId, description, createOrder, onCancel]);


    // --- Render Logic ---

    if (isLoading) {
        // Optionally use a spinner matching your app's style
        return <div>Initiating ArcPay payment...</div>;
    }

    if (error) {
        // Error message is shown, onCancel already called via useEffect
        return <div>Error: {error}</div>;
    }

    // Order created successfully, now show options or the selected mode
    if (!order) {
        // This case should ideally not happen if loading/error states are correct
        return <div>Waiting for order details...</div>;
    }

    // If no payment mode selected yet, show the choice buttons
    if (!paymentMode) {
        return (
            <div className="arcpay-modal-container"> {/* Add a container */}
                <h3>Choose ArcPay Method</h3>
                <p>Order for {order.amount} {order.currency} created.</p>
                <div className="arcpay-button-group">
                    <button onClick={() => setPaymentMode(PaymentMode.simple)}>
                        Simple Payment (Pay via Link)
                    </button>
                    <button onClick={() => setPaymentMode(PaymentMode.integrated)}>
                        Integrated Payment (Pay with Wallet)
                    </button>
                    <button onClick={onCancel} className="arcpay-cancel-button"> {/* Added Cancel */}
                        Cancel Payment
                    </button>
                </div>
            </div>
        );
    }

    // Render the selected payment mode component
    return (
        <div className="arcpay-modal-container"> {/* Add a container */}
            {paymentMode === PaymentMode.simple && (
                <SimplePay
                    orderId={order.uuid}
                    onSuccess={handlePaymentSuccess} // Pass callbacks down
                    onCancel={handlePaymentCancel} // Pass callbacks down
                />
            )}

            {paymentMode === PaymentMode.integrated && (
                <IntegratedPay
                    orderId={order.uuid}
                    onSuccess={handlePaymentSuccess} // Pass callbacks down
                    onCancel={handlePaymentCancel} // Pass callbacks down
                />
            )}

            {/* Optionally keep a general cancel button visible */}
            {/* <button onClick={onCancel} className="arcpay-cancel-button">Cancel</button> */}
        </div>
    );
}

// Add some basic CSS for the container (adjust as needed)
/* Example in your global CSS or a new Pay.module.css */
/*
.arcpay-modal-container {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #333; // Dark background
  color: white;
  padding: 25px;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
  z-index: 1100; // Ensure it's above modal overlay if needed
  min-width: 320px;
  text-align: center;
}

.arcpay-button-group {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.arcpay-button-group button {
  padding: 10px 15px;
  cursor: pointer;
  border: none;
  border-radius: 5px;
}

.arcpay-cancel-button {
    margin-top: 15px;
    background-color: #555;
    color: white;
}
.arcpay-cancel-button:hover {
    background-color: #777;
}

*/