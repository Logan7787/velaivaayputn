import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, Alert, StatusBar } from 'react-native';
import { Text, Card, Avatar, Button, ActivityIndicator, Appbar, Surface, useTheme, Chip, IconButton } from 'react-native-paper';
import { getJobApplications } from '../../api/jobApi';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const JobApplicationsScreen = ({ route, navigation }) => {
    const { jobId, jobTitle } = route.params;
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const theme = useTheme();

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const data = await getJobApplications(jobId);
                setApplications(data);
            } catch (error) {
                Alert.alert('Error', 'Failed to fetch applications');
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, [jobId]);

    const renderItem = ({ item }) => (
        <Surface style={styles.cardContainer} elevation={1}>
            <View style={styles.cardHeader}>
                <Avatar.Text
                    size={50}
                    label={item.jobSeeker.name.substring(0, 2).toUpperCase()}
                    style={{ backgroundColor: '#E1E8ED' }}
                    labelStyle={{ color: '#1A5F7A', fontWeight: 'bold' }}
                />
                <View style={styles.headerText}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text variant="titleMedium" style={{ fontWeight: 'bold', color: '#333' }}>{item.jobSeeker.name}</Text>
                        <MaterialIcons name="chevron-right" size={24} color="#999" />
                    </View>
                    <View style={styles.dateContainer}>
                        <MaterialIcons name="event" size={14} color="#777" />
                        <Text variant="bodySmall" style={{ color: '#777', marginLeft: 4 }}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
            </View>

            <View style={styles.messageBox}>
                <Text numberOfLines={2} variant="bodyMedium" style={{ color: '#555', fontStyle: 'italic' }}>
                    "{item.message}"
                </Text>
                {item.jobSeeker.skills && item.jobSeeker.skills.length > 0 && (
                    <View style={styles.skillsRow}>
                        {item.jobSeeker.skills.slice(0, 3).map((skill, index) => (
                            <Chip
                                key={index}
                                textStyle={{ fontSize: 11, color: '#4A148C' }}
                                style={{ backgroundColor: '#F3E5F5', borderRadius: 8, height: 26 }}
                                compact
                            >
                                {skill}
                            </Chip>
                        ))}
                    </View>
                )}
            </View>

            <Button
                mode="outlined"
                onPress={() => navigation.navigate('ApplicantDetails', { applicant: item.jobSeeker, message: item.message })}
                style={styles.viewProfileBtn}
                labelStyle={{ fontSize: 13, fontWeight: 'bold', color: '#1A5F7A' }}
                contentStyle={{ height: 40 }}
            >
                View Full Profile
            </Button>
        </Surface>
    );

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    return (
        <View style={[styles.container, { backgroundColor: '#F8F9FA' }]}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <Appbar.Header style={{ backgroundColor: theme.colors.primary, elevation: 4 }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color="#fff" />
                <Appbar.Content title={`Applicants: ${jobTitle}`} titleStyle={{ color: '#fff', fontSize: 18, fontWeight: 'bold' }} />
            </Appbar.Header>

            {applications.length === 0 ? (
                <View style={styles.center}>
                    <Surface style={styles.emptyState} elevation={0}>
                        <MaterialIcons name="people-outline" size={60} color="#DDD" />
                        <Text variant="titleMedium" style={{ marginTop: 16, color: '#777' }}>
                            No applications yet
                        </Text>
                        <Text variant="bodyMedium" style={{ color: '#999', marginTop: 8, textAlign: 'center' }}>
                            Candidates who apply to this job will appear here.
                        </Text>
                    </Surface>
                </View>
            ) : (
                <FlatList
                    data={applications}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    list: {
        padding: 16,
        paddingBottom: 30,
    },
    cardContainer: {
        padding: 16,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#EEE',
    },
    cardHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    headerText: {
        flex: 1,
        marginLeft: 12,
    },
    dateContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    messageBox: {
        backgroundColor: '#FAFAFA',
        padding: 12,
        borderRadius: 12,
        marginBottom: 16,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 10,
    },
    viewProfileBtn: {
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#1A5F7A',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    emptyState: {
        alignItems: 'center',
        padding: 40,
        backgroundColor: 'transparent',
    }
});

export default JobApplicationsScreen;
