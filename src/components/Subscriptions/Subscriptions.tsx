// src/components/Subscriptions/Subscriptions.tsx
import React, { useEffect, useState } from 'react'; // Added React for fragment <>
import Cash from '../../assets/Cash';
import Crystals from '../../assets/Crystals';
import InternalCurrency from '../../assets/InternalCurrency';
import Power from '../../assets/Power';
import TonCurrency from '../../assets/TonCurrency';
import { GenericProps, PurchaseType, Subscription } from '../../types';
import { Button } from '../Button/Button';
import { Card } from '../Card/Card';
import styles from './Subscriptions.module.css';
import { loadFromLocalStorage, LOCAL_STORAGE } from '../../utils/localStorage';
import { useStoreApi } from '../../hooks/useStoreApi';
import { useDispatch } from '../../store/dispatch';
import { addNotification, updateLoadingState } from '../../store/actions';
// Import the modified Pay component
import { Pay } from '../ArcPay/Pay'; // Adjusted path if necessary
import { PaymentMethodModal } from '../PaymentMethodModal/PaymentMethodModal';

interface SubscriptionProps extends GenericProps {
    subscriptions: Array<Subscription>;
    activeSubscriptions: Array<number>;
    handleBuyInit: (url: string, title: string) => void; // Kept for Aeon
}

export function Subscriptions({
                                  subscriptions,
                                  handleBuyInit,
                                  activeSubscriptions,
                              }: SubscriptionProps) {
    const { createOrder: createAeonOrder } = useStoreApi(); // Rename for clarity
    const { dispatch } = useDispatch();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [showArcPay, setShowArcPay] = useState(false); // State to show ArcPay UI

    useEffect(() => {
        const user = loadFromLocalStorage(LOCAL_STORAGE.TELEGRAM_AUTH_DATA);
        setIsLoggedIn(!!user); // Corrected: true if user exists
    }, []);

    // --- Aeon Payment Logic ---
    const handleAeonPayment = (subscription: Subscription) => {
        if (!subscription) return;
        const amount = subscription.currency + '00';
        dispatch(updateLoadingState(true));
        setIsModalOpen(false);

        createAeonOrder({ // Use renamed function
            purchase_type: PurchaseType.SUBSCRIPTION,
            amount,
            purchaseId: subscription.id,
            // payment_system: 'aeon' // If backend needs it
        }).then(
            (data) => {
                handleBuyInit(data?.data.paymentLink || '', subscription.details);
                dispatch(updateLoadingState(false));
                setSelectedSubscription(null);
            },
            (e) => {
                dispatch(addNotification({ message: e?.message || 'Aeon payment failed.', type: 'error' }));
                dispatch(updateLoadingState(false));
                setSelectedSubscription(null);
            }
        );
    };

    // --- ArcPay Trigger Logic ---
    const handleArcPayPayment = (subscription: Subscription) => {
        if (!subscription) return;
        console.log('Selected ArcPay for:', subscription.details);
        setIsModalOpen(false); // Close selection modal
        // selectedSubscription is already set
        setShowArcPay(true); // Set state to render the ArcPay component
    };

    // --- Open Modal ---
    const handleSubscribeClick = (subscription: Subscription) => {
        setSelectedSubscription(subscription);
        setIsModalOpen(true);
    };

    // --- ArcPay Component Callbacks ---
    const handleArcPaySuccess = () => {
        console.log('Subscriptions: ArcPay Payment Successful');
        dispatch(addNotification({ message: 'ArcPay payment successful!', type: 'success'}));
        setShowArcPay(false); // Hide ArcPay component
        setSelectedSubscription(null); // Clear selection
        // TODO: Add logic to refresh user's active subscriptions list here
        // Example: fetchActiveSubscriptions();
    };

    const handleArcPayCancel = () => {
        console.log('Subscriptions: ArcPay Payment Cancelled or Failed');
        dispatch(addNotification({ message: 'ArcPay payment cancelled or failed.', type: 'info'}));
        setShowArcPay(false); // Hide ArcPay component
        setSelectedSubscription(null); // Clear selection
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setSelectedSubscription(null);
    }

    // --- Render Logic ---
    return (
        <React.Fragment> {/* Use Fragment shorthand */}
            {subscriptions.map((subscription, index) => (
                <Card className={styles.subscription} key={index}>
                    <div className={styles.subscriptionWrapper}>
                        <div className={styles.details}>
                            {/* ... details content ... */}
                            <div className={styles.detailsTitle}>{subscription.details}</div>
                            <div className={styles.additionalInfo}>
                                <div>{subscription.additionalInfo}</div>
                                <div className={styles.list}>
                                    <div className={styles.ability}>
                                        <Power className={styles.icon} />
                                        <div className={styles.pink}>+{subscription.xploit}</div>
                                    </div>
                                    <div className={styles.ability}>
                                        <Crystals className={styles.icon} />
                                        <div className={styles.orange}>+{subscription.chip}</div>
                                    </div>
                                    <div className={styles.ability}>
                                        <Cash className={styles.icon} />
                                        <div className={styles.turqouise}>+{subscription.items}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={styles.currencyWrapper}>
                            {/* ... currency display ... */}
                            <div className={styles.currency}>
                                <div>{subscription.currency}</div>
                                <InternalCurrency className={styles.payIcon} />
                                <>/</>
                                <div>{subscription.tonCurrency}</div>
                                <TonCurrency className={styles.payIcon} />
                            </div>
                            <Button
                                handleClick={() => handleSubscribeClick(subscription)}
                                disabled={
                                    !isLoggedIn ||
                                    activeSubscriptions.includes(subscription.id) ||
                                    showArcPay // Disable while ArcPay component is shown
                                }
                            >
                                {activeSubscriptions.includes(subscription.id) ? 'Subscribed' : 'Subscribe'}
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}

            {/* Payment Method Selection Modal */}
            <PaymentMethodModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                subscription={selectedSubscription}
                onSelectAeon={handleAeonPayment}
                onSelectArcPay={handleArcPayPayment} // This just triggers showing the ArcPay component
            />

            {/* Render ArcPay Component Conditionally */}
            {showArcPay && selectedSubscription && (
                <Pay
                    // --- Pass required props ---
                    amount={selectedSubscription.tonCurrency.toString()} // Ensure amount is string
                    currency="TON" // Assuming ArcPay uses TON - adjust if needed
                    purchaseId={selectedSubscription.id}
                    description={selectedSubscription.details} // Pass description
                    // --- Pass callback functions ---
                    onSuccess={handleArcPaySuccess}
                    onCancel={handleArcPayCancel}
                />
            )}
        </React.Fragment>
    );
}