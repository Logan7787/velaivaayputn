import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, RefreshControl, StatusBar, TouchableOpacity, Image } from 'react-native';
import { Title, Text, Button, Searchbar, Card, Chip, useTheme, Avatar, IconButton } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { logoutUser } from '../../redux/authSlice';
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
            <Card.Content>
                <View style={styles.jobHeader}>
                    <View style={[styles.companyLogo, { backgroundColor: isFeatured ? '#FFF' : '#F5F5F5' }]}>
                        {job.companyLogo ? (
                            <Image source={{ uri: job.companyLogo }} style={styles.logoImage} />
                        ) : (
                            <Text style={{ fontSize: 18, fontWeight: 'bold', color: isFeatured ? colors.primary : '#555' }}>
                                {job.companyName?.substring(0, 1) || 'C'}
                            </Text>
                        )}
                    </View>
                    <View style={styles.jobInfo}>
                        <Title style={[styles.jobTitle, isFeatured && { color: '#fff' }]} numberOfLines={1}>{job.title}</Title>
                        <Text style={[styles.companyName, isFeatured && { color: 'rgba(255,255,255,0.8)' }]}>{job.companyName}</Text>
                    </View>
                    {isFeatured && <Icon name="star" size={20} color="#FFD700" />}
                </View>

                <View style={styles.metaContainer}>
                    <View style={[styles.metaItem, isFeatured && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Icon name="map-marker" size={14} color={isFeatured ? '#fff' : '#666'} />
                        <Text style={[styles.metaText, isFeatured && { color: '#fff' }]}>{job.location}</Text>
                    </View>
                    <View style={[styles.metaItem, isFeatured && { backgroundColor: 'rgba(255,255,255,0.2)' }]}>
                        <Icon name="briefcase-outline" size={14} color={isFeatured ? '#fff' : '#666'} />
                        <Text style={[styles.metaText, isFeatured && { color: '#fff' }]}>{job.employmentType}</Text>
                    </View>
                </View>

                <View style={styles.footerRow}>
                    <Text style={[styles.salaryText, isFeatured && { color: '#fff' }]}>₹ {job.salary}</Text>
                    <Text style={[styles.postedDate, isFeatured && { color: 'rgba(255,255,255,0.6)' }]}>2d ago</Text>
                </View>
            </Card.Content>
        </Card>
    );

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F8F9FA' }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Premium Header */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.greeting}>Hello, {user?.name?.split(' ')[0] || 'User'} 👋</Text>
                        <Text style={styles.headerSubtitle}>Find your dream job today</Text>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Avatar.Text
                            size={42}
                            label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'US'}
                            style={{ backgroundColor: colors.secondary, elevation: 5 }}
                            labelStyle={{ fontWeight: 'bold' }}
                        />
                    </TouchableOpacity>
                </View>

                <Searchbar
                    placeholder="Search jobs, skills, companies..."
                    onChangeText={setSearchQuery}
                    value={searchQuery}
                    style={styles.searchBar}
                    inputStyle={styles.searchInput}
                    iconColor={colors.primary}
                    elevation={4}
                />
            </View>

            <ScrollView
                style={styles.content}
                contentContainerStyle={styles.scrollContent}
                refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                }
                showsVerticalScrollIndicator={false}
            >
                {/* Categories */}
                <View style={styles.sectionHeader}>
                    <Title style={styles.sectionTitle}>Categories</Title>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
                    {CATEGORIES.map((cat, index) => (
                        <TouchableOpacity key={cat.id} style={[styles.categoryChip, index === 0 && { backgroundColor: colors.primary }]}>
                            <Icon name={cat.icon} size={20} color={index === 0 ? '#fff' : '#666'} />
                            <Text style={[styles.categoryText, index === 0 && { color: '#fff' }]}>{cat.name}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Premium/Featured Jobs (Mock for now, or filter real jobs) */}
                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                    <Title style={styles.sectionTitle}>Featured Jobs</Title>
                    <TouchableOpacity><Text style={{ color: colors.primary, fontWeight: '600' }}>See All</Text></TouchableOpacity>
                </View>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.featuredScroll}>
                    {jobs.slice(0, 3).map(job => (
                        <View key={'feat-' + job.id} style={{ width: 280, paddingRight: 15 }}>
                            {renderJobCard(job, true)}
                        </View>
                    ))}
                    {jobs.length === 0 && !loading && (
                        <Text style={{ color: '#999', fontStyle: 'italic', marginLeft: 20 }}>No featured jobs available</Text>
                    )}
                </ScrollView>


                {/* Recent Jobs List */}
                <View style={[styles.sectionHeader, { marginTop: 10 }]}>
                    <Title style={styles.sectionTitle}>Recent Jobs</Title>
                </View>

                {loading ? (
                    <View style={styles.loadingContainer}>
                        <Text>Finding opportunities...</Text>
                    </View>
                ) : jobs.length === 0 ? (
                    <View style={styles.emptyContainer}>
                        <Icon name="briefcase-off" size={60} color="#ccc" />
                        <Text style={{ marginTop: 10, color: '#888' }}>No jobs found matching your criteria.</Text>
                    </View>
                ) : (
                    jobs.map((job) => renderJobCard(job, false))
                )}

                {/* Upgrade Banner */}
                <Card style={[styles.bannerCard, { backgroundColor: '#E0F7FA', borderColor: colors.secondary }]} onPress={() => navigation.navigate('Subscription')}>
                    <Card.Content style={styles.bannerContent}>
                        <View style={{ flex: 1 }}>
                            <Title style={{ color: '#006064', fontSize: 16, fontWeight: 'bold' }}>Boost Your Profile</Title>
                            <Text style={{ color: '#00838F', fontSize: 12 }}>Get 3x more views from recruiters.</Text>
                        </View>
                        <Button mode="contained" compact color={colors.secondary} style={{ borderRadius: 20 }} labelStyle={{ fontSize: 11 }}>
                            Upgrade
                        </Button>
                    </Card.Content>
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
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        elevation: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    greeting: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#fff',
        letterSpacing: 0.5,
    },
    headerSubtitle: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.85)',
        marginTop: 2,
    },
    searchBar: {
        borderRadius: 14,
        backgroundColor: '#fff',
        height: 48,
        elevation: 0,
    },
    searchInput: {
        fontSize: 14,
        top: -4, // Adjust for paper searchbar height quirk
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
        backgroundColor: '#fff',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 25,
        marginRight: 10,
        borderWidth: 1,
        borderColor: '#EEE',
        elevation: 2,
    },
    categoryText: {
        marginLeft: 8,
        fontWeight: '600',
        color: '#555',
    },
    featuredScroll: {
        paddingLeft: 20,
        marginBottom: 20,
    },
    jobCard: {
        marginTop: 4,
        marginBottom: 12,
        marginHorizontal: 20,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    featuredJobCard: {
        backgroundColor: '#1A5F7A', // Primary color
        marginHorizontal: 0, // Reset for horizontal scroll
        marginBottom: 5,
        borderWidth: 0,
    },
    jobHeader: {
        flexDirection: 'row',
        alignItems: 'flex-start',
    },
    companyLogo: {
        width: 48,
        height: 48,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
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
        lineHeight: 20,
    },
    companyName: {
        fontSize: 13,
        color: '#777',
        marginTop: 2,
    },
    metaContainer: {
        flexDirection: 'row',
        marginTop: 14,
        marginBottom: 14,
    },
    metaItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: '#F5F5F5',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    metaText: {
        fontSize: 11,
        color: '#666',
        marginLeft: 4,
        fontWeight: '500',
    },
    footerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
    },
    salaryText: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#2E7D32', // Green
    },
    postedDate: {
        fontSize: 11,
        color: '#999',
    },
    bannerCard: {
        marginHorizontal: 20,
        marginTop: 20,
        borderRadius: 16,
        borderWidth: 1,
    },
    bannerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 8,
    },
    loadingContainer: {
        alignItems: 'center',
        marginTop: 40,
    },
    emptyContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
});

export default JobSeekerHomeScreen;
