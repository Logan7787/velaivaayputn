import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, StatusBar } from 'react-native';
import { Title, Text, Card, Button, Paragraph, Portal, Modal, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../api/axios.config';
import RazorpayCheckout from 'react-native-razorpay';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../../redux/authSlice';
import { showToast } from '../../redux/uiSlice';
import { RAZORPAY_KEY_ID, APP_NAME, APP_COLOR } from '../../config';

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
        features: ['25 Job Posts per month', '25 Direct Contact Unlocks', 'Priority Support', 'Highlighted Listings'],
        color: '#FFD700', // Gold for trophy
        bestValue: true
    }
];

const SubscriptionScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [loading, setLoading] = useState(false);
    const [verifying, setVerifying] = useState(false);
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

            // 2. Configure Razorpay Options
            const options = {
                description: `Upgrade to ${selectedPlan.name} Plan`,
                image: 'https://velaivaayputn.onrender.com/logo.png',
                currency: 'INR',
                key: RAZORPAY_KEY_ID,
                amount: orderData.amount,
                name: APP_NAME,
                order_id: orderData.orderId,
                prefill: {
                    email: user?.email || '',
                    contact: user?.phone || '',
                    name: user?.name || ''
                },
                theme: { color: APP_COLOR }
            }

            // 3. Open Razorpay Checkout
            RazorpayCheckout.open(options).then(async (data) => {
                setVerifying(true);
                try {
                    await api.post('/subscriptions/verify', {
                        razorpay_order_id: data.razorpay_order_id,
                        razorpay_payment_id: data.razorpay_payment_id,
                        razorpay_signature: data.razorpay_signature,
                        tier: selectedPlan.id,
                        cycle: billingCycle
                    });

                    dispatch(showToast({ message: `🎉 Successfully upgraded to ${selectedPlan.name} Plan!`, type: 'success' }));
                    dispatch(loadUser());
                    setVisible(false);
                    navigation.goBack();
                } catch (verifyError) {
                    console.error('Verification Error:', verifyError);
                    dispatch(showToast({ message: 'Payment Verification Failed. Please contact support.', type: 'error' }));
                } finally {
                    setVerifying(false);
                }
            }).catch((error) => {
                console.log('Payment Error:', error);
                if (error.code && error.description) {
                    dispatch(showToast({ message: `Payment Failed: ${error.description}`, type: 'error' }));
                } else {
                    dispatch(showToast({ message: 'Payment Cancelled', type: 'info' }));
                }
            });

        } catch (error) {
            console.error('Initiation Error:', error);
            // Axios interceptor will handle the toast for server errors, 
            // but we can add specific ones here if needed.
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F5F7FA' }]} edges={['top']}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F7FA" />
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color="#333" />
                </TouchableOpacity>
                <Title style={styles.headerTitle}>Upgrade Plan</Title>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 20 }}>
                {/* Hero Text */}
                <View style={styles.heroContainer}>
                    <Icon name="close" size={24} color="#333" style={{ position: 'absolute', left: 0, top: 0, display: 'none' }} />
                    <Title style={styles.heroTitle}>Choose Your Plan</Title>
                    <Text style={styles.heroSubtitle}>Unlock full potential with our premium tiers</Text>
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
                {PLANS.map(plan => (
                    <Card key={plan.id} style={[styles.card, plan.bestValue && styles.bestValueCard]}>
                        {plan.bestValue && (
                            <View style={styles.bestValueBadge}>
                                <Text style={styles.bestValueText}>BEST VALUE</Text>
                            </View>
                        )}
                        <Card.Content style={{ paddingTop: plan.bestValue ? 25 : 16 }}>
                            <View style={styles.planHeader}>
                                <Title style={styles.planName}>{plan.name}</Title>
                                <Icon name={getPlanIcon(plan.id)} size={32} color={plan.id === 'BASIC' ? '#7f8c8d' : '#FBC02D'} />
                            </View>

                            <View style={styles.priceContainer}>
                                <Text style={styles.currencySymbol}>₹</Text>
                                <Text style={[styles.planPrice, { color: colors.primary }]}>
                                    {billingCycle === 'yearly' ? (parseInt(plan.price) * 10) : plan.price}
                                </Text>
                                <Text style={styles.period}>/{billingCycle === 'yearly' ? 'yr' : 'mo'}</Text>
                            </View>

                            <View style={styles.divider} />

                            <View style={styles.featuresList}>
                                {plan.features.map((feature, idx) => (
                                    <View key={idx} style={styles.featureItem}>
                                        <Icon name="check-circle" size={20} color="#4CAF50" />
                                        <Text style={styles.featureText}>{feature}</Text>
                                    </View>
                                ))}
                            </View>

                            <Button
                                mode={plan.bestValue ? "outlined" : "outlined"}
                                onPress={() => handleSelectPlan(plan)}
                                style={[styles.chooseButton, plan.bestValue && { borderColor: '#FBC02D' }]}
                                labelStyle={{ color: colors.primary, fontWeight: 'bold' }}
                                contentStyle={{ height: 48 }}
                            >
                                Choose {plan.name}
                            </Button>
                        </Card.Content>
                    </Card>
                ))}
            </ScrollView>

            {/* Payment Modal */}
            <Portal>
                <Modal visible={visible} onDismiss={() => setVisible(false)} contentContainerStyle={styles.modal}>
                    <View style={styles.modalHeader}>
                        <Icon name="shield-check" size={48} color={colors.primary} />
                        <Title style={{ marginTop: 12, fontSize: 20 }}>Confirm Upgrade</Title>
                    </View>

                    <View style={styles.modalContent}>
                        <Text style={styles.summaryLabel}>Selected Plan</Text>
                        <Text style={styles.summaryValue}>{selectedPlan?.name} ({billingCycle})</Text>

                        <Text style={[styles.summaryLabel, { marginTop: 15 }]}>Amount to Pay</Text>
                        <Text style={[styles.summaryMoney, { color: colors.primary }]}>
                            ₹{selectedPlan ? (billingCycle === 'yearly' ? (parseInt(selectedPlan.price) * 10) : selectedPlan.price) : 0}
                        </Text>
                    </View>

                    <Button
                        mode="contained"
                        onPress={handlePayment}
                        loading={loading || verifying}
                        disabled={loading || verifying}
                        style={styles.payButton}
                        contentStyle={{ height: 50 }}
                        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                    >
                        {verifying ? 'Verifying Payment...' : 'Proceed to Pay'}
                    </Button>
                    <Button onPress={() => setVisible(false)} style={{ marginTop: 10 }} textColor="#777">Cancel</Button>
                </Modal>
            </Portal>
        </SafeAreaView>
    );
};

const getPlanIcon = (id) => {
    switch (id) {
        case 'BASIC': return 'leaf';
        case 'STANDARD': return 'trophy';
        case 'PREMIUM': return 'diamond-stone';
        default: return 'star';
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#fff',
        elevation: 1,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    backButton: {
        padding: 4,
    },
    heroContainer: {
        alignItems: 'center',
        marginVertical: 25,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#333',
    },
    heroSubtitle: {
        color: '#777',
        fontSize: 14,
        marginTop: 4,
    },
    toggleContainer: {
        alignItems: 'center',
        marginBottom: 25,
    },
    toggleWrapper: {
        flexDirection: 'row',
        backgroundColor: '#E0E0E0',
        borderRadius: 30,
        padding: 4,
        width: '80%',
        justifyContent: 'space-between'
    },
    toggleButton: {
        flex: 1,
        paddingVertical: 8,
        borderRadius: 25,
        alignItems: 'center',
    },
    activeToggle: {
        backgroundColor: '#fff',
        elevation: 2,
    },
    toggleText: {
        fontWeight: '600',
        color: '#666',
        fontSize: 13,
    },
    activeText: {
        color: '#333',
    },
    card: {
        marginBottom: 24,
        borderRadius: 20,
        elevation: 2,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EEE',
        position: 'relative',
        marginHorizontal: 4,
    },
    bestValueCard: {
        borderColor: '#FBC02D',
        borderWidth: 2,
    },
    bestValueBadge: {
        position: 'absolute',
        top: -12,
        alignSelf: 'center',
        backgroundColor: '#FBC02D',
        paddingHorizontal: 16,
        paddingVertical: 4,
        borderRadius: 12,
        zIndex: 10,
    },
    bestValueText: {
        fontSize: 10,
        fontWeight: 'bold',
        color: '#fff',
    },
    planHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
    },
    planName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333',
    },
    priceContainer: {
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    currencySymbol: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginRight: 2,
    },
    planPrice: {
        fontSize: 32,
        fontWeight: 'bold',
    },
    period: {
        fontSize: 14,
        color: '#888',
        marginLeft: 2,
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 16,
    },
    featuresList: {
        marginBottom: 24,
    },
    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    featureText: {
        marginLeft: 12,
        fontSize: 14,
        color: '#555',
        flex: 1,
    },
    chooseButton: {
        borderRadius: 12,
        borderWidth: 1.5,
    },
    modal: {
        backgroundColor: 'white',
        padding: 24,
        margin: 20,
        borderRadius: 24,
        alignItems: 'center',
        elevation: 5,
    },
    modalHeader: {
        alignItems: 'center',
        marginBottom: 20,
    },
    modalContent: {
        width: '100%',
        alignItems: 'center',
        marginBottom: 24,
        backgroundColor: '#FAFAFA',
        padding: 16,
        borderRadius: 12,
    },
    summaryLabel: {
        fontSize: 13,
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    summaryValue: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        marginTop: 4,
    },
    summaryMoney: {
        fontSize: 28,
        fontWeight: 'bold',
    },
    payButton: {
        width: '100%',
        borderRadius: 12,
    }
});

export default SubscriptionScreen;
