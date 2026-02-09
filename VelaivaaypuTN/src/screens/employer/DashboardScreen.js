import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, Image, StatusBar, TouchableOpacity } from 'react-native';
import { Title, Text, Button, Card, Paragraph, Divider, useTheme, Avatar, IconButton, FAB } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../redux/authSlice';
import { getMyJobs } from '../../api/jobApi';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Skeleton from '../../components/common/Skeleton';
import { theme } from '../../theme';

const EmployerDashboard = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    // Stats
    const totalApplications = jobs.reduce((acc, job) => acc + (job.applicationCount || 0), 0);
    const activeJobs = jobs.filter(j => j.status === 'ACTIVE').length;

    const fetchMyJobs = async () => {
        try {
            const data = await getMyJobs();
            setJobs(data);
        } catch (error) {
            console.error('Fetch Jobs Error:', error.response?.data || error.message);
            if (error.response?.status === 403) {
                console.log('Role Mismatch or Authorization Issue. Current User:', user);
            }
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useFocusEffect(
        React.useCallback(() => {
            fetchMyJobs();
        }, [])
    );

    const onRefresh = () => {
        setRefreshing(true);
        fetchMyJobs();
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F8FAFC' }]} edges={['top']}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5F7A" />

            {/* Premium Header */}
            <View style={[styles.header, { backgroundColor: '#1A5F7A' }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Welcome, {user?.name?.split(' ')[0] || 'Employer'}</Text>
                        <Text style={styles.subtext}>{user?.companyName || 'Company Admin'}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <IconButton
                            icon="message-outline"
                            iconColor="#fff"
                            size={24}
                            style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                            onPress={() => navigation.navigate('ChatList')}
                        />
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <Avatar.Text
                                size={44}
                                label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'EM'}
                                style={{ backgroundColor: '#fff' }}
                                labelStyle={{ fontWeight: 'bold', color: '#1A5F7A' }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Dashboard Stats */}
                <View style={styles.statsContainer}>
                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: 'rgba(26, 95, 122, 0.1)' }]}>
                            <Icon name="briefcase-outline" size={24} color="#1A5F7A" />
                        </View>
                        <View>
                            <Text style={styles.statNumber}>{jobs.length}</Text>
                            <Text style={styles.statLabel}>Total Jobs</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
                            <Icon name="check-circle-outline" size={24} color="#10B981" />
                        </View>
                        <View>
                            <Text style={styles.statNumber}>{activeJobs}</Text>
                            <Text style={styles.statLabel}>Active</Text>
                        </View>
                    </View>

                    <View style={styles.statCard}>
                        <View style={[styles.statIconBox, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
                            <Icon name="account-group-outline" size={24} color="#F59E0B" />
                        </View>
                        <View>
                            <Text style={styles.statNumber}>{totalApplications}</Text>
                            <Text style={styles.statLabel}>Applicants</Text>
                        </View>
                    </View>
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A5F7A']} />}
                showsVerticalScrollIndicator={false}
            >
                {/* Subscription Status */}
                <Card style={[styles.planCard, { borderLeftWidth: 6, borderLeftColor: user?.subscription?.tier !== 'FREE' ? '#FBC02D' : '#CBD5E1' }]}>
                    <Card.Content style={styles.planContent}>
                        <View style={{ flex: 1 }}>
                            <View style={styles.planHeaderRow}>
                                <Text style={styles.planLabel}>CURRENT PLAN</Text>
                                {user?.subscription?.tier !== 'FREE' && <Icon name="crown" size={16} color="#FBC02D" style={{ marginLeft: 6 }} />}
                            </View>
                            <Title style={styles.planName}>{user?.subscription?.tier || 'FREE'}</Title>

                            {/* Progress Bar */}
                            <View style={styles.progressContainer}>
                                <View style={[styles.progressBar, { width: `${Math.min(100, (user?.subscription?.jobPostsUsed / user?.subscription?.jobPostsLimit) * 100)}%`, backgroundColor: '#1A5F7A' }]} />
                            </View>
                            <Text style={styles.planUsage}>
                                {user?.subscription?.jobPostsUsed || 0} / {user?.subscription?.jobPostsLimit || 15} Posts Used
                            </Text>
                        </View>
                        <Button
                            mode="contained"
                            onPress={() => navigation.navigate('Subscription')}
                            style={{ borderRadius: 12, marginLeft: 16, backgroundColor: '#1A5F7A' }}
                            labelStyle={{ fontWeight: 'bold' }}
                        >
                            Upgrade
                        </Button>
                    </Card.Content>
                </Card>

                {/* Job Posts Section */}
                <View style={styles.sectionHeader}>
                    <Title style={styles.sectionTitle}>Recent Job Posts</Title>
                    <Button mode="text" labelStyle={{ color: '#1A5F7A', fontWeight: '800' }} onPress={() => { }}>View All</Button>
                </View>

                {loading ? (
                    <View>
                        {[1, 2].map(i => (
                            <View key={i} style={{ marginBottom: 20, borderRadius: 24, backgroundColor: '#fff', padding: 20, ...theme.shadows.small }}>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 }}>
                                    <View>
                                        <Skeleton width={180} height={24} style={{ marginBottom: 8 }} />
                                        <Skeleton width={120} height={16} />
                                    </View>
                                    <Skeleton width={70} height={28} borderRadius={12} />
                                </View>
                                <Divider style={{ marginVertical: 16 }} />
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <Skeleton width={130} height={20} />
                                    <Skeleton width={24} height={24} />
                                </View>
                            </View>
                        ))}
                    </View>
                ) : jobs.length === 0 ? (
                    <View style={styles.emptyState}>
                        <Icon name="briefcase-plus-outline" size={72} color="#CBD5E1" />
                        <Title style={{ marginTop: 20, color: '#1E293B', fontWeight: '800' }}>No Jobs Posted Yet</Title>
                        <Paragraph style={{ color: '#64748B', textAlign: 'center', marginBottom: 24, fontSize: 15 }}>
                            Ready to grow your team? Create your first job post now.
                        </Paragraph>
                        <Button mode="contained" onPress={() => navigation.navigate('PostJob')} style={{ borderRadius: 16, paddingHorizontal: 20, backgroundColor: '#1A5F7A' }}>
                            Post Your First Job
                        </Button>
                    </View>
                ) : (
                    jobs.map((job) => (
                        <Card key={job.id} style={styles.jobCard} onPress={() => navigation.navigate('JobApplications', { jobId: job.id, jobTitle: job.title })}>
                            <Card.Content style={{ padding: 20 }}>
                                <View style={styles.jobHeader}>
                                    <View style={{ flex: 1 }}>
                                        <Title style={styles.jobTitle}>{job.title}</Title>
                                        <Text style={styles.jobDate}>Posted on {new Date(job.createdAt || Date.now()).toLocaleDateString()}</Text>
                                    </View>
                                    <View style={[styles.statusBadge, { backgroundColor: job.status === 'ACTIVE' ? '#ECFDF5' : '#FEF2F2' }]}>
                                        <Text style={{ color: job.status === 'ACTIVE' ? '#059669' : '#DC2626', fontSize: 12, fontWeight: 'bold' }}>
                                            {job.status}
                                        </Text>
                                    </View>
                                </View>

                                <Divider style={{ marginVertical: 16, backgroundColor: '#F1F5F9' }} />

                                <View style={styles.jobFooter}>
                                    <View style={styles.footerItem}>
                                        <Icon name="account-group" size={20} color="#1A5F7A" />
                                        <Text style={[styles.footerText, { color: '#1A5F7A', fontWeight: 'bold' }]}>
                                            {job.applicationCount || 0} Applicants
                                        </Text>
                                    </View>
                                    <View style={styles.actionRow}>
                                        <Text style={{ color: '#64748B', fontSize: 13, fontWeight: '600', marginRight: 6 }}>Manage</Text>
                                        <Icon name="chevron-right" size={20} color="#64748B" />
                                    </View>
                                </View>
                            </Card.Content>
                        </Card>
                    ))
                )}
            </ScrollView>

            <FAB
                style={[styles.fab, { backgroundColor: '#159895' }]}
                icon="plus"
                color="#fff"
                label="Post Job"
                onPress={() => navigation.navigate('PostJob')}
                elevation={6}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 20,
        paddingTop: 10,
        paddingBottom: 60, // Space for overlapping stats
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        zIndex: 1,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    subtext: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 2,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: -30,
        left: 20,
        right: 20,
    },
    statCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 12,
        width: '31%',
        alignItems: 'center',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        justifyContent: 'center',
    },
    statIconBox: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        textAlign: 'center',
    },
    statLabel: {
        fontSize: 11,
        color: '#888',
        textAlign: 'center',
    },
    scrollContent: {
        paddingTop: 50, // Space for stats
        paddingHorizontal: 20,
        paddingBottom: 80,
    },
    planCard: {
        borderRadius: 16,
        elevation: 2,
        backgroundColor: '#fff',
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#EEE',
    },
    planContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
    },
    planHeaderRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    planLabel: {
        fontSize: 11,
        color: '#888',
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    planName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#333',
        marginVertical: 2,
    },
    progressContainer: {
        height: 6,
        backgroundColor: '#F0F0F0',
        borderRadius: 3,
        marginVertical: 8,
        width: '100%',
    },
    progressBar: {
        height: '100%',
        borderRadius: 3,
    },
    planUsage: {
        fontSize: 13,
        color: '#666',
        fontWeight: '500',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    jobCard: {
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        elevation: 3,
        borderWidth: 1,
        borderColor: '#F0F0F0',
    },
    jobHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    jobDate: {
        fontSize: 12,
        color: '#999',
    },
    statusBadge: {
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 20,
    },
    jobFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    footerItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    footerText: {
        marginLeft: 8,
        fontSize: 14,
    },
    actionRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: 40,
        padding: 30,
        backgroundColor: '#fff',
        borderRadius: 20,
        elevation: 2,
    },
    fab: {
        position: 'absolute',
        margin: 20,
        right: 0,
        bottom: 0,
    },
});

export default EmployerDashboard;
