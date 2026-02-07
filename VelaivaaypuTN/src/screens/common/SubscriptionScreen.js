import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Title, Text, Card, Button, Paragraph, Portal, Modal, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api/axios.config';

const PLANS = [
    {
        id: 'BASIC',
        name: 'Basic',
        price: '49',
        features: ['15 Job Posts per month', '15 Direct Contact Unlocks', 'Basic Support', 'Standard Listing visibility'],
        color: '#7f8c8d'
    },
    {
        id: 'STANDARD',
        name: 'Standard',
        price: '99',
        features: ['25 Job Posts per month', '25 Direct Contact Unlocks', 'Priority Support', 'Highlighted Listings', 'Profile Badge'],
        color: '#f1c40f',
        bestValue: true
    },
    {
        id: 'PREMIUM',
        name: 'Platinum',
        price: '199',
        features: ['Unlimited Job Posts', 'Unlimited Contacts', '24/7 Dedicated Support', 'Top of Search Results', 'Verified Employer Badge'],
        color: '#e74c3c'
    }
];

import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../redux/authSlice';
import { RAZORPAY_KEY_ID, APP_NAME, APP_COLOR } from '../../config';

const SubscriptionScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' | 'yearly'

    const handleSelectPlan = (plan) => {
        setSelectedPlan(plan);
        setVisible(true);
    };

    const handlePayment = async () => {
        setLoading(true);
        try {
            // 1. Initiate Upgrade to get Order ID from backend
            const { data: orderData } = await api.post('/subscriptions/upgrade', {
                tier: selectedPlan.id,
                cycle: billingCycle
            });

            console.log('Order Created:', orderData);

            // 2. Configure Razorpay Options
            const options = {
                description: `Upgrade to ${selectedPlan.name} Plan`,
                image: 'https://velaivaayputn.onrender.com/logo.png', // Replace with actual logo URL
                currency: 'INR',
                key: RAZORPAY_KEY_ID,
                amount: orderData.amount, // Amount is in currency subunits. Default: Paisa. e.g. 100 paise = INR 1.
                name: APP_NAME,
                order_id: orderData.orderId, // Replace with actual order_id from backend
                prefill: {
                    email: user?.email || '',
                    contact: user?.phone || '',
                    name: user?.name || ''
                },
                theme: { color: APP_COLOR }
            }

            // 3. Open Razorpay Checkout
            RazorpayCheckout.open(options).then(async (data) => {
                // handle success
                try {
                    await api.post('/subscriptions/verify', {
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_signature: data.razorpay_signature,
                        tier: selectedPlan.id
                    });

                    alert(`🎉 Successfully upgraded to ${selectedPlan.name} Plan!`);
                    dispatch(loadUser()); // Refresh user data to reflect new plan
                    setVisible(false);
                    navigation.goBack();
                } catch (verifyError) {
                    console.error('Verification Error:', verifyError);
                    alert('Payment Verification Failed. Please contact support.');
                }
            }).catch((error) => {
                // handle failure
                console.log('Payment Error:', error);

                // Razorpay returns detailed error objects
                if (error.code && error.description) {
                    alert(`Payment Failed: ${error.description}`);
                } else {
                    // Sometimes it's just "Payment Cancelled"
                    alert('Payment Cancelled');
                }
            });

        } catch (error) {
            console.error('Initiation Error:', error);
            alert('Failed to initiate payment. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#f8f9fa' }]} edges={['top']}>
            <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Icon name="close" size={24} color="#333" />
                    </TouchableOpacity>
                    <Title style={styles.title}>Choose Your Plan</Title>
                    <Text style={styles.subtitle}>Unlock full potential with our premium tiers</Text>
                </View>

                {/* Billing Toggle */}
                <View style={styles.toggleContainer}>
                    <View style={styles.toggleWrapper}>
                        <TouchableOpacity
                            style={[styles.toggleButton, billingCycle === 'monthly' && styles.activeToggle]}
                            onPress={() => setBillingCycle('monthly')}
                        >
                            <Text style={[styles.toggleText, billingCycle === 'monthly' && styles.activeText]}>Monthly</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.toggleButton, billingCycle === 'yearly' && styles.activeToggle]}
                            onPress={() => setBillingCycle('yearly')}
                        >
                            <Text style={[styles.toggleText, billingCycle === 'yearly' && styles.activeText]}>Yearly (-20%)</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Plans List */}
                <View style={styles.plansContainer}>
                    {PLANS.map(plan => (
                        <Card key={plan.id} style={[styles.card, plan.bestValue && styles.bestValueCard]}>
                            {plan.bestValue && (
                                <View style={styles.popularBadge}>
                                    <Text style={styles.popularText}>BEST VALUE</Text>
                                </View>
                            )}
                            <Card.Content>
                                <View style={styles.planHeader}>
                                    <View>
                                        <Title style={styles.planName}>{plan.name}</Title>
                                        <Text style={[styles.planPrice, { color: colors.primary }]}>
                                            ₹{billingCycle === 'yearly' ? (parseInt(plan.price) * 10) : plan.price}
                                            <Text style={styles.period}>/{billingCycle === 'yearly' ? 'yr' : 'mo'}</Text>
                                        </Text>
                                    </View>
                                    <Icon name={getPlanIcon(plan.id)} size={40} color={plan.color} />
                                </View>

                                <View style={styles.divider} />

                                <View style={styles.featuresList}>
                                    {plan.features.map((feature, idx) => (
                                        <View key={idx} style={styles.featureItem}>
                                            <Icon name="check-circle" size={18} color="#4CAF50" />
                                            <Text style={styles.featureText}>{feature}</Text>
                                        </View>
                                    ))}
                                </View>

                                <Button
                                    mode={plan.bestValue ? "contained" : "outlined"}
                                    onPress={() => handleSelectPlan(plan)}
                                    style={[styles.chooseButton, plan.bestValue && { backgroundColor: colors.primary }]}
                                    labelStyle={plan.bestValue ? { color: '#fff' } : { color: colors.primary }}
                                >
                                    Choose {plan.name}
                                </Button>
                            </Card.Content>
                        </Card>
                    ))}
                </View>

                {/* Payment Modal */}
                <Portal>
                    <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
                        <View style={styles.modalHeader}>
                            <Icon name="shield-check" size={40} color={colors.primary} />
                            <Title style={{ marginTop: 10 }}>Confirm Upgrade</Title>
                        </View>

                        <View style={styles.modalContent}>
                            <Text style={styles.summaryLabel}>Plan Selected:</Text>
                            <Text style={styles.summaryValue}>{selectedPlan?.name} Plan ({billingCycle})</Text>

                            <Text style={styles.summaryLabel}>Total Amount:</Text>
                            <Text style={[styles.summaryValue, { fontSize: 24, color: colors.primary }]}>
                                ₹{selectedPlan ? (billingCycle === 'yearly' ? (parseInt(selectedPlan.price) * 10) : selectedPlan.price) : 0}
                            </Text>

                            <Paragraph style={styles.disclaimer}>
                                Secure payment powered by Razorpay. You can cancel anytime.
                            </Paragraph>
                        </View>

                        <Button
                            mode="contained"
                            onPress={handlePayment}
                            loading={loading}
                            style={styles.payButton}
                            labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                        >
                            Pay Securely
                        </Button>
                        <Button onPress={() => setVisible(false)} style={{ marginTop: 10 }}>Cancel</Button>
                    </Modal>
                </Portal>

            </ScrollView>
        </SafeAreaView>
    );
};

const getPlanIcon = (id) => {
    switch (id) {
        case 'BASIC': return 'leaf';
        case 'STANDARD': return 'trophy-variant';
        case 'PREMIUM': return 'diamond-stone';
        default: return 'star';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
        marginBottom: 20,
    },
    backButton: {
        position: 'absolute',
        left: 20,
        top: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 10,
    },
    subtitle: {
        color: '#666',
        fontSize: 14,
    },
    toggleContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    toggleWrapper: {
        flexDirection: 'row',
        backgroundColor: '#e0e0e0',
        borderRadius: 25,
        padding: 4,
    },
    toggleButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
    },
    activeToggle: {
        backgroundColor: '#fff',
        elevation: 2,
    },
    toggleText: {
        fontWeight: '600',
        color: '#666',
    },
    activeText: {
        color: '#000',
    },
    plansContainer: {
        paddingHorizontal: 20,
    },
    card: {
        marginBottom: 20,
        borderRadius: 16,
        elevation: 3,
        backgroundColor: '#fff',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    bestValueCard: {
        borderColor: '#f1c40f',
        borderWidth: 2,
        elevation: 6,
    },
    popularBadge: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
        backgroundColor: '#f1c40f',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },
    popularText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    planPrice: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    period: {
        fontSize: 14,
        color: '#666',
        fontWeight: 'normal',
    },
    divider: {
        height: 1,
        backgroundColor: '#eee',
        marginVertical: 15,
    },
    featuresList: {
        marginBottom: 20,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    featureText: {
        marginLeft: 10,
        fontSize: 14,
        color: '#444',
    },
    chooseButton: {
        borderRadius: 10,
        paddingVertical: 4,
    },
    modal: {
        backgroundColor: 'white',
        padding: 24,
        margin: 20,
        borderRadius: 20,
        alignItems: 'center',
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalContent: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 20,
    },
    summaryLabel: {
        fontSize: 14,
        color: '#888',
        marginTop: 10,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    disclaimer: {
        fontSize: 12,
        color: '#999',
        textAlign: 'center',
        marginTop: 20,
    },
    payButton: {
        width: '100%',
        borderRadius: 12,
        paddingVertical: 5,
    }
});

export default SubscriptionScreen;
