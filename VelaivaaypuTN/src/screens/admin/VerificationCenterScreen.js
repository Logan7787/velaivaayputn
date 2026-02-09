import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, RefreshControl, StatusBar, TouchableOpacity, Alert } from 'react-native';
import { Title, Text, Card, Avatar, Button, ActivityIndicator, Appbar, Surface, useTheme, IconButton, Divider, Chip } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { getPendingVerifications, verifyUser } from '../../api/adminApi';
import { showToast } from '../../redux/uiSlice';

const VerificationCenterScreen = ({ navigation }) => {
    const theme = useTheme();
    const dispatch = useDispatch();
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [processingId, setProcessingId] = useState(null);

    useEffect(() => {
        fetchPending();
    }, []);

    const fetchPending = async () => {
        try {
            const data = await getPendingVerifications();
            setPending(data);
        } catch (error) {
            console.error('Fetch Pending Error:', error);
            dispatch(showToast({ message: 'Failed to load verifications', type: 'error' }));
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchPending();
    };

    const handleVerify = async (userId, companyName) => {
        Alert.alert(
            'Confirm Verification',
            `Are you sure you want to verify ${companyName}? This will grant them a "Verified" badge and platform trust.`,
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Verify',
                    onPress: async () => {
                        setProcessingId(userId);
                        try {
                            await verifyUser(userId, true);
                            dispatch(showToast({ message: `${companyName} verified successfully!`, type: 'success' }));
                            setPending(prev => prev.filter(u => u.id !== userId));
                        } catch (error) {
                            dispatch(showToast({ message: 'Verification failed', type: 'error' }));
                        } finally {
                            setProcessingId(null);
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <Surface style={styles.userCard} elevation={1}>
            <View style={styles.cardHeader}>
                <Avatar.Text
                    size={50}
                    label={item.companyName ? item.companyName.substring(0, 2).toUpperCase() : 'CO'}
                    style={{ backgroundColor: '#1A5F7A20' }}
                    labelStyle={{ color: '#1A5F7A', fontWeight: 'bold' }}
                />
                <View style={styles.headerText}>
                    <Title style={styles.companyName}>{item.companyName || 'Unknown Company'}</Title>
                    <Text style={styles.adminName}>{item.name}</Text>
                </View>
                <Chip icon="clock-outline" style={styles.dateChip}>
                    {new Date(item.createdAt).toLocaleDateString()}
                </Chip>
            </View>

            <Divider style={styles.divider} />

            <View style={styles.detailsRow}>
                <View style={styles.detailItem}>
                    <Icon name="email-outline" size={16} color="#64748B" />
                    <Text style={styles.detailText}>{item.email}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="phone-outline" size={16} color="#64748B" />
                    <Text style={styles.detailText}>{item.phone || 'No phone'}</Text>
                </View>
                <View style={styles.detailItem}>
                    <Icon name="map-marker-outline" size={16} color="#64748B" />
                    <Text style={styles.detailText}>{item.location || 'No location'}</Text>
                </View>
            </View>

            <View style={styles.actionRow}>
                <Button
                    mode="outlined"
                    onPress={() => { }}
                    style={styles.detailsBtn}
                    labelStyle={{ color: '#1A5F7A' }}
                >
                    View Papers
                </Button>
                <Button
                    mode="contained"
                    onPress={() => handleVerify(item.id, item.companyName)}
                    loading={processingId === item.id}
                    disabled={!!processingId}
                    style={styles.verifyBtn}
                    labelStyle={{ fontWeight: 'bold' }}
                >
                    Approve
                </Button>
            </View>
        </Surface>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5F7A" />
            <Appbar.Header style={{ backgroundColor: '#1A5F7A', elevation: 4 }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
                <Appbar.Content title="Verification Center" titleStyle={{ color: '#fff', fontWeight: 'bold' }} />
                <Appbar.Action icon="refresh" color="#fff" onPress={onRefresh} />
            </Appbar.Header>

            {loading ? (
                <View style={styles.center}>
                    <ActivityIndicator size="large" color="#1A5F7A" />
                </View>
            ) : (
                <FlatList
                    data={pending}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A5F7A']} />}
                    ListEmptyComponent={
                        <View style={styles.emptyState}>
                            <Icon name="shield-check" size={80} color="#CBD5E1" />
                            <Title style={styles.emptyTitle}>All Clear!</Title>
                            <Text style={styles.emptyText}>There are no pending employer verifications at the moment.</Text>
                        </View>
                    }
                />
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        padding: 16,
        paddingBottom: 40,
    },
    userCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 16,
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerText: {
        flex: 1,
        marginLeft: 16,
    },
    companyName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    adminName: {
        fontSize: 14,
        color: '#64748B',
    },
    dateChip: {
        height: 28,
        backgroundColor: '#F1F5F9',
    },
    divider: {
        marginVertical: 16,
        backgroundColor: '#F1F5F9',
    },
    detailsRow: {
        gap: 8,
        marginBottom: 20,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    detailText: {
        fontSize: 14,
        color: '#475569',
    },
    actionRow: {
        flexDirection: 'row',
        gap: 12,
    },
    detailsBtn: {
        flex: 1,
        borderRadius: 12,
        borderColor: '#1A5F7A',
    },
    verifyBtn: {
        flex: 1,
        borderRadius: 12,
        backgroundColor: '#1A5F7A',
    },
    emptyState: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 100,
        paddingHorizontal: 40,
    },
    emptyTitle: {
        marginTop: 20,
        color: '#1E293B',
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        color: '#64748B',
        marginTop: 8,
    },
});

export default VerificationCenterScreen;
