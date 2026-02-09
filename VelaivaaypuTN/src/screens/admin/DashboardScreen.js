import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Dimensions } from 'react-native';
import { Title, Text, Card, ActivityIndicator, Button, useTheme, Avatar, Surface, IconButton, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { logoutUser } from '../../redux/authSlice';
import { getAdminStats } from '../../api/adminApi';
import { theme } from '../../theme';

const { width } = Dimensions.get('window');

const AdminDashboard = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const insets = useSafeAreaInsets();
    const { user } = useSelector(state => state.auth);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const data = await getAdminStats();
            setStats(data);
        } catch (error) {
            console.error('Admin Stats Error:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        fetchStats();
    };

    const renderGrowthChart = () => {
        if (!stats?.dailyGrowth) return null;
        const maxUsers = Math.max(...stats.dailyGrowth.map(d => d.users), 1);
        const maxJobs = Math.max(...stats.dailyGrowth.map(d => d.jobs), 1);

        return (
            <View style={styles.chartContainer}>
                {stats.dailyGrowth.map((day, idx) => (
                    <View key={idx} style={styles.chartBarWrapper}>
                        <View style={styles.barStack}>
                            <View style={[styles.chartBar, { height: (day.jobs / maxJobs) * 60 + 2, backgroundColor: '#0EA5E9' }]} />
                            <View style={[styles.chartBar, { height: (day.users / maxUsers) * 40 + 2, backgroundColor: '#8B5CF6', marginTop: 2 }]} />
                        </View>
                        <Text style={styles.chartLabel}>{new Date(day.date).toLocaleDateString(undefined, { weekday: 'narrow' })}</Text>
                    </View>
                ))}
            </View>
        );
    };

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#1A5F7A" />
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F8FAFC' }]} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#1E293B" />

            {/* Premium Admin Header */}
            <View style={[styles.header, { backgroundColor: '#1E293B' }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerSubtitle}>SYSTEM ADMINISTRATOR</Text>
                        <Title style={styles.headerTitle}>Hello, {user?.name?.split(' ')[0] || 'Admin'}</Title>
                    </View>
                    <TouchableOpacity onPress={() => dispatch(logoutUser())}>
                        <Surface style={styles.logoutBtn} elevation={2}>
                            <Icon name="logout" size={20} color="#FCA5A5" />
                        </Surface>
                    </TouchableOpacity>
                </View>

                {/* Core Stats Overview */}
                <View style={styles.statsContainer}>
                    <View style={styles.statMiniCard}>
                        <Text style={styles.miniLabel}>REVENUE</Text>
                        <Text style={styles.miniValue}>₹{stats?.revenue || 0}</Text>
                        <View style={styles.growthBadge}>
                            <Icon name="trending-up" size={12} color="#10B981" />
                            <Text style={styles.growthText}>+8%</Text>
                        </View>
                    </View>
                    <View style={styles.statMiniCard}>
                        <Text style={styles.miniLabel}>PENDING VERIF.</Text>
                        <Text style={[styles.miniValue, { color: stats?.pendingVerifications > 0 ? '#F59E0B' : '#64748B' }]}>
                            {stats?.pendingVerifications || 0}
                        </Text>
                        <Text style={styles.growthText}>Awaiting Review</Text>
                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={[styles.content, { paddingTop: 60 }]}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A5F7A']} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Growth Trends */}
                <View style={styles.sectionHeader}>
                    <Title style={styles.sectionTitle}>Platform Growth (7d)</Title>
                    <View style={styles.legend}>
                        <View style={[styles.dot, { backgroundColor: '#0EA5E9' }]} /><Text style={styles.legendText}>Jobs</Text>
                        <View style={[styles.dot, { backgroundColor: '#8B5CF6', marginLeft: 10 }]} /><Text style={styles.legendText}>Users</Text>
                    </View>
                </View>
                <Surface style={styles.chartSurface} elevation={1}>
                    {renderGrowthChart()}
                </Surface>

                {/* Quick Action Grid */}
                <Title style={styles.sectionTitle}>Management Console</Title>
                <View style={styles.actionGrid}>
                    <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => navigation.navigate('UserManagement')}
                    >
                        <Surface style={styles.actionCard} elevation={2}>
                            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
                                <Icon name="account-group" size={28} color="#3B82F6" />
                            </View>
                            <Text style={styles.actionLabel}>User Base</Text>
                            <Text style={styles.actionSub}>{stats?.users?.total || 0} Accounts</Text>
                        </Surface>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionItem}
                        onPress={() => navigation.navigate('VerificationCenter')}
                    >
                        <Surface style={styles.actionCard} elevation={2}>
                            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                                <Icon name="shield-check" size={28} color="#F59E0B" />
                                {stats?.pendingVerifications > 0 && <View style={styles.badgeDot} />}
                            </View>
                            <Text style={styles.actionLabel}>Verifications</Text>
                            <Text style={styles.actionSub}>{stats?.pendingVerifications || 0} Pending</Text>
                        </Surface>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem}>
                        <Surface style={styles.actionCard} elevation={2}>
                            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                                <Icon name="briefcase-check" size={28} color="#10B981" />
                            </View>
                            <Text style={styles.actionLabel}>Active Jobs</Text>
                            <Text style={styles.actionSub}>{stats?.jobs?.active || 0} Live</Text>
                        </Surface>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.actionItem}>
                        <Surface style={styles.actionCard} elevation={2}>
                            <View style={[styles.actionIconBox, { backgroundColor: 'rgba(139, 92, 246, 0.1)' }]}>
                                <Icon name="file-document-edit" size={28} color="#8B5CF6" />
                            </View>
                            <Text style={styles.actionLabel}>Reports</Text>
                            <Text style={styles.actionSub}>Content Moderation</Text>
                        </Surface>
                    </TouchableOpacity>
                </View>

                {/* Recent Activity Placeholder */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Title style={styles.sectionTitle}>System Logs</Title>
                    <Button mode="text" labelStyle={{ color: '#1A5F7A' }}>View All</Button>
                </View>
                <Surface style={styles.activitySurface} elevation={1}>
                    <Icon name="clipboard-text-outline" size={40} color="#CBD5E1" />
                    <Text style={styles.activityText}>Recent system activities will be logged here.</Text>
                </Surface>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    header: {
        padding: 20,
        paddingBottom: 60,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    headerTitle: {
        color: '#fff',
        fontSize: 26,
        fontWeight: 'bold',
        marginTop: 4,
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 12,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    logoutBtn: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    statsContainer: {
        flexDirection: 'row',
        position: 'absolute',
        bottom: -40,
        left: 20,
        right: 20,
        justifyContent: 'space-between',
    },
    statMiniCard: {
        backgroundColor: '#fff',
        width: '48%',
        borderRadius: 20,
        padding: 16,
        elevation: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    miniLabel: {
        color: '#94A3B8',
        fontSize: 10,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    miniValue: {
        color: '#1E293B',
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 4,
    },
    growthBadge: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    growthText: {
        color: '#10B981',
        fontSize: 10,
        fontWeight: 'bold',
        marginLeft: 4,
    },
    content: {
        padding: 20,
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    chartSurface: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        marginBottom: 24,
    },
    chartContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        height: 120,
    },
    chartBarWrapper: {
        alignItems: 'center',
        flex: 1,
    },
    barStack: {
        alignItems: 'center',
        width: '100%',
        justifyContent: 'flex-end',
    },
    chartBar: {
        width: 14,
        borderRadius: 4,
    },
    chartLabel: {
        fontSize: 10,
        color: '#94A3B8',
        marginTop: 10,
        fontWeight: '600',
    },
    legend: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
    },
    legendText: {
        fontSize: 11,
        color: '#64748B',
        marginLeft: 4,
        fontWeight: '600',
    },
    actionGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    actionItem: {
        width: '48%',
        marginBottom: 16,
    },
    actionCard: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 20,
        alignItems: 'center',
    },
    actionIconBox: {
        width: 56,
        height: 56,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 12,
    },
    actionLabel: {
        fontSize: 14,
        fontWeight: 'bold',
        color: '#1E293B',
    },
    actionSub: {
        fontSize: 11,
        color: '#64748B',
        marginTop: 4,
    },
    badgeDot: {
        position: 'absolute',
        top: 12,
        right: 12,
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#EF4444',
        borderWidth: 2,
        borderColor: '#fff',
    },
    activitySurface: {
        backgroundColor: '#fff',
        borderRadius: 24,
        padding: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#CBD5E1',
    },
    activityText: {
        color: '#64748B',
        textAlign: 'center',
        marginTop: 12,
        fontSize: 14,
    }
});

export default AdminDashboard;
