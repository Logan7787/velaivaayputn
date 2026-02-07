import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Title, Text, Button, Searchbar, Card, Chip, useTheme, Avatar, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../redux/authSlice';
import Skeleton from '../../components/common/Skeleton';
import { getAllJobs } from '../../api/jobApi';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const JobSeekerHomeScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = useState('');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchJobs = async () => {
        try {
            const data = await getAllJobs({ search: searchQuery });
            setJobs(data);
        } catch (error) {
            console.error('Failed to fetch jobs', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, [searchQuery]);

    const onRefresh = () => {
        setRefreshing(true);
        fetchJobs();
    };

    const CATEGORIES = [
        { id: 1, name: 'All', icon: 'apps' },
        { id: 2, name: 'IT & Software', icon: 'laptop' },
        { id: 3, name: 'Engineering', icon: 'hard-hat' },
        { id: 4, name: 'Medical', icon: 'doctor' },
        { id: 5, name: 'Education', icon: 'school' },
        { id: 6, name: 'Banking', icon: 'bank' },
    ];

    const renderJobCard = (job, isFeatured = false) => (
        <Card
            key={job.id}
            style={[styles.jobCard, isFeatured && styles.featuredJobCard]}
            onPress={() => navigation.navigate('JobDetails', { jobId: job.id })}
            mode={isFeatured ? 'elevated' : 'outlined'}
        >
            <Card.Content style={{ padding: 16 }}>
                <View style={styles.jobHeader}>
                    <View style={[styles.companyLogo, { backgroundColor: isFeatured ? '#FFF' : '#F5F7FA' }]}>
                        {job.companyLogo ? (
                            <Image source={{ uri: job.companyLogo }} style={styles.logoImage} />
                        ) : (
                            <Text style={{ fontSize: 20, fontWeight: 'bold', color: isFeatured ? colors.primary : '#1A5F7A' }}>
                                {job.companyName?.substring(0, 1) || 'C'}
                            </Text>
                        )}
                    </View>
                    <View style={styles.jobInfo}>
                        <Title style={[styles.jobTitle, isFeatured && { color: '#fff' }]} numberOfLines={1}>{job.title}</Title>
                        <Text style={[styles.companyName, isFeatured && { color: 'rgba(255,255,255,0.9)' }]}>{job.companyName}</Text>
                    </View>
                    {isFeatured && <Icon name="star" size={20} color="#FFD700" />}
                </View>

                <View style={[styles.divider, isFeatured && { backgroundColor: 'rgba(255,255,255,0.2)' }]} />

                <View style={styles.metaContainer}>
                    <View style={[styles.metaItem, isFeatured && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Icon name="map-marker" size={14} color={isFeatured ? '#fff' : '#7f8c8d'} />
                        <Text style={[styles.metaText, isFeatured && { color: '#fff' }]}>{job.location}</Text>
                    </View>
                    <View style={[styles.metaItem, isFeatured && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Icon name="clock-outline" size={14} color={isFeatured ? '#fff' : '#7f8c8d'} />
                        <Text style={[styles.metaText, isFeatured && { color: '#fff' }]}>{job.employmentType}</Text>
                    </View>
                    <View style={[styles.metaItem, isFeatured && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Icon name="currency-inr" size={14} color={isFeatured ? '#fff' : '#7f8c8d'} />
                        <Text style={[styles.metaText, isFeatured && { color: '#fff' }]}>{job.salary || 'Disclosed'}</Text>
                    </View>
                </View>

                {!isFeatured && (
                    <View style={styles.footerRow}>
                        <Text style={styles.postedDate}>Posted 2d ago</Text>
                        <Button mode="text" compact textColor={colors.primary} labelStyle={{ fontWeight: 'bold' }}>View Details</Button>
                    </View>
                )}
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F5F7FA' }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor="#1A5F7A" />

            {/* Premium Header */}
            <View style={[styles.header, { backgroundColor: '#1A5F7A' }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'Applicant'} 👋</Text>
                        <Text style={styles.headerSubtitle}>Find your dream job today</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Avatar.Text
                            size={44}
                            label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                            style={{ backgroundColor: '#fff' }}
                            labelStyle={{ color: '#1A5F7A', fontWeight: 'bold' }}
                        />
                    </TouchableOpacity>
                </View>

                <Searchbar
                    placeholder="Search jobs, skills..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor="#1A5F7A"
                    placeholderTextColor="#999"
                    elevation={2}
                />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1A5F7A']} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Title style={styles.sectionTitle}>Categories</Title>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {CATEGORIES.map((cat, index) => (
                        <TouchableOpacity
                            key={cat.id}
                            style={[
                                styles.categoryChip,
                                index === 0 ? styles.activeCategoryChip : styles.inactiveCategoryChip
                            ]}
                        >
                            <Icon name={cat.icon} size={20} color={index === 0 ? '#fff' : '#1A5F7A'} />
                            <Text style={[styles.categoryText, index === 0 && { color: '#fff' }]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Featured Jobs */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Title style={styles.sectionTitle}>Featured Jobs</Title>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                    {jobs.slice(0, 3).map(job => (
                        <View key={'feat-' + job.id} style={{ width: 290, paddingRight: 15 }}>
                            {renderJobCard(job, true)}
                        </View>
                    ))}
                    {jobs.length === 0 && !loading && (
                        <Text style={styles.emptyText}>No featured jobs available</Text>
                    )}
                </ScrollView>

                {/* Recent Jobs List */}
                <View style={[styles.sectionHeader, { marginTop: 16 }]}>
                    <Title style={styles.sectionTitle}>Recent Jobs</Title>
                </View>

                {loading ? (
                    <View style={{ padding: 20 }}>
                        <ActivityIndicator size="large" color="#1A5F7A" />
                    </View>
                ) : jobs.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="briefcase-search-outline" size={64} color="#ccc" />
                        <Text style={{ marginTop: 12, color: '#888', fontSize: 16 }}>No jobs found</Text>
                    </View>
                ) : (
                    jobs.map((job) => renderJobCard(job, false))
                )}

                {/* Upgrade Banner */}
                <Card style={styles.bannerCard} onPress={() => navigation.navigate('Subscription')}>
                    <View style={styles.bannerContent}>
                        <View style={styles.bannerIcon}>
                            <Icon name="rocket-launch" size={24} color="#FFF" />
                        </View>
                        <View style={{ flex: 1, marginLeft: 16 }}>
                            <Title style={styles.bannerTitle}>Boost Your Profile</Title>
                            <Text style={styles.bannerText}>Get 3x more views from recruiters.</Text>
                        </View>
                        <Icon name="chevron-right" size={24} color="#fff" />
                    </View>
                </Card>

            </ScrollView>
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
        paddingBottom: 25,
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        elevation: 4,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.9)',
        marginTop: 4,
    },
    searchBar: {
        borderRadius: 12,
        backgroundColor: '#fff',
        height: 48,
    },
    searchInput: {
        fontSize: 14,
        top: -4,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 40,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 12,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
    },
    categoryScroll: {
        paddingLeft: 20,
        marginBottom: 5,
    },
    categoryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 12,
        marginRight: 10,
        borderWidth: 1,
        elevation: 0,
    },
    activeCategoryChip: {
        backgroundColor: '#1A5F7A',
        borderColor: '#1A5F7A',
    },
    inactiveCategoryChip: {
        backgroundColor: '#fff',
        borderColor: '#E1E8ED',
    },
    categoryText: {
        marginLeft: 8,
        fontWeight: '600',
        color: '#1A5F7A',
    },
    featuredScroll: {
        paddingLeft: 20,
        marginBottom: 10,
    },
    jobCard: {
        marginTop: 6,
        marginBottom: 12,
        marginHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EEE',
        elevation: 1,
    },
    featuredJobCard: {
        backgroundColor: '#1A5F7A',
        marginHorizontal: 0,
        marginBottom: 5,
        borderWidth: 0,
        elevation: 4,
    },
    jobHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    companyLogo: {
        width: 50,
        height: 50,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 14,
    },
    logoImage: {
        width: '100%',
        height: '100%',
        borderRadius: 12,
    },
    jobInfo: {
        flex: 1,
        justifyContent: 'center',
    },
    jobTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 4,
    },
    companyName: {
        fontSize: 13,
        color: '#666',
    },
    divider: {
        height: 1,
        backgroundColor: '#F0F0F0',
        marginVertical: 12,
    },
    metaContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    metaText: {
        fontSize: 11,
        color: '#555',
        marginLeft: 4,
        fontWeight: '500',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12,
        paddingTop: 12,
        borderTopWidth: 1,
        borderTopColor: '#F5F7FA',
    },
    postedDate: {
        fontSize: 12,
        color: '#999',
    },
    bannerCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 20,
        backgroundColor: '#1A5F7A', // Match dashboard logic or use primary
        marginBottom: 20,
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
    },
    bannerIcon: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        padding: 10,
        borderRadius: 12,
    },
    bannerTitle: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    bannerText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        marginTop: 2,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    emptyText: {
        color: '#999',
        fontStyle: 'italic',
        marginLeft: 20,
    }
});

export default JobSeekerHomeScreen;
