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
        <Surface style={styles.cardContainer} elevation={2}>
            <View style={styles.cardHeader}>
                <Avatar.Text
                    size={50}
                    label={item.jobSeeker.name.substring(0, 2).toUpperCase()}
                    style={{ backgroundColor: theme.colors.primaryContainer }}
                    color={theme.colors.onPrimaryContainer}
                />
                <View style={styles.headerText}>
                    <Text variant="titleMedium" style={{ fontWeight: 'bold' }}>{item.jobSeeker.name}</Text>
                    <View style={styles.dateContainer}>
                        <MaterialIcons name="event" size={14} color="gray" />
                        <Text variant="bodySmall" style={{ color: 'gray', marginLeft: 4 }}>
                            {new Date(item.createdAt).toLocaleDateString()}
                        </Text>
                    </View>
                </View>
                <IconButton
                    icon="chevron-right"
                    size={24}
                    onPress={() => navigation.navigate('ApplicantDetails', { applicant: item.jobSeeker, message: item.message })}
                />
            </View>

            <View style={styles.cardContent}>
                <Text numberOfLines={2} variant="bodyMedium" style={{ color: theme.colors.onSurfaceVariant }}>
                    "{item.message}"
                </Text>
                {item.jobSeeker.skills && item.jobSeeker.skills.length > 0 && (
                    <View style={styles.skillsRow}>
                        {item.jobSeeker.skills.slice(0, 3).map((skill, index) => (
                            <Chip
                                key={index}
                                textStyle={{ fontSize: 10, lineHeight: 10, marginVertical: 0, paddingVertical: 0 }}
                                style={{ height: 24, backgroundColor: theme.colors.surfaceVariant }}
                            >
                                {skill}
                            </Chip>
                        ))}
                        {item.jobSeeker.skills.length > 3 && (
                            <Text variant="bodySmall" style={{ color: 'gray', alignSelf: 'center' }}>
                                +{item.jobSeeker.skills.length - 3} more
                            </Text>
                        )}
                    </View>
                )}
            </View>

            <Button
                mode="outlined"
                onPress={() => navigation.navigate('ApplicantDetails', { applicant: item.jobSeeker, message: item.message })}
                style={{ marginTop: 10, borderColor: theme.colors.primary }}
                textColor={theme.colors.primary}
            >
                View Full Profile
            </Button>
        </Surface>
    );

    if (loading) {
        return <View style={styles.center}><ActivityIndicator size="large" color={theme.colors.primary} /></View>;
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <StatusBar barStyle="light-content" backgroundColor={theme.colors.primary} />
            <Appbar.Header style={{ backgroundColor: theme.colors.primary }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} color={theme.colors.onPrimary} />
                <Appbar.Content title={`Applicants: ${jobTitle}`} titleStyle={{ color: theme.colors.onPrimary }} />
            </Appbar.Header>

            {applications.length === 0 ? (
                <View style={styles.center}>
                    <Surface style={styles.emptyState} elevation={0}>
                        <MaterialIcons name="people-outline" size={60} color={theme.colors.outline} />
                        <Text variant="titleMedium" style={{ marginTop: 16, color: theme.colors.onSurfaceVariant }}>
                            No applications yet
                        </Text>
                        <Text variant="bodyMedium" style={{ color: 'gray', marginTop: 8, textAlign: 'center' }}>
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
        borderRadius: 12,
        backgroundColor: '#fff',
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
        marginTop: 4,
    },
    cardContent: {
        backgroundColor: '#F7F9FC', // Light background for content area
        padding: 12,
        borderRadius: 8,
    },
    skillsRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginTop: 8,
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
