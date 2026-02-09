import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity, RefreshControl } from 'react-native';
import { TextInput, Button, Title, Avatar, Appbar, Text, useTheme, Card, List, Switch, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../api/authApi';
import { loadUser, logoutUser } from '../../redux/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { theme } from '../../theme';

const ProfileScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const [form, setForm] = useState({
        name: '',
        bio: '',
        phone: '',
        location: '',
        companyName: '',
        skills: '',
        experience: ''
    });

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await dispatch(loadUser()).unwrap();
        } catch (error) {
            console.error('Refresh Error:', error);
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                bio: user.bio || '',
                phone: user.phone || '',
                location: user.location || '',
                companyName: user.companyName || '',
                skills: user.skills ? user.skills.join(', ') : '',
                experience: user.experience ? String(user.experience) : ''
            });
        }
    }, [user]);

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const handleUpdate = async () => {
        setLoading(true);
        try {
            await updateProfile(form);
            Alert.alert('Success', 'Profile Updated Successfully');
            dispatch(loadUser()); // Reload user data in Redux
            setIsEditing(false);
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to update profile');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            <Appbar.Header style={{ backgroundColor: '#fff', elevation: 0 }}>
                <Appbar.BackAction onPress={() => navigation.goBack()} />
                <Appbar.Content title="My Profile" titleStyle={{ fontWeight: 'bold' }} />
                <Appbar.Action
                    icon={isEditing ? "check" : "pencil"}
                    onPress={() => isEditing ? handleUpdate() : setIsEditing(true)}
                    color={colors.primary}
                />
            </Appbar.Header>

            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView
                    contentContainerStyle={styles.scroll}
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[colors.primary]} />
                    }
                >
                    {/* Header Section */}
                    <View style={styles.header}>
                        <View style={styles.avatarContainer}>
                            <Avatar.Text
                                size={100}
                                label={user?.name ? user.name.substring(0, 2).toUpperCase() : 'U'}
                                style={{ backgroundColor: colors.primary }}
                            />
                            {isEditing && (
                                <View style={styles.cameraIcon}>
                                    <Icon name="camera" size={20} color="#fff" />
                                </View>
                            )}
                        </View>
                        <Title style={styles.name}>{user?.name || 'User Name'}</Title>
                        <Text style={styles.email}>{user?.email}</Text>
                        <View style={[styles.roleBagde, { backgroundColor: colors.secondary + '20' }]}>
                            <Text style={{ color: colors.secondary, fontWeight: 'bold', fontSize: 12 }}>
                                {user?.role}
                            </Text>
                        </View>
                    </View>

                    {/* Stats Card */}
                    <Card style={styles.statsCard}>
                        <Card.Content style={styles.statsContent}>
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>12</Text>
                                <Text style={styles.statLabel}>Applied</Text>
                            </View>
                            <View style={styles.dividerVertical} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>5</Text>
                                <Text style={styles.statLabel}>Saved</Text>
                            </View>
                            <View style={styles.dividerVertical} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>2</Text>
                                <Text style={styles.statLabel}>Interviews</Text>
                            </View>
                        </Card.Content>
                    </Card>

                    {/* Edit Form */}
                    {isEditing ? (
                        <View style={styles.form}>
                            <Title style={styles.sectionTitle}>Edit Info</Title>

                            <TextInput
                                label="Full Name"
                                value={form.name}
                                onChangeText={(text) => handleChange('name', text)}
                                mode="outlined"
                                style={styles.input}
                                outlineColor={colors.secondary}
                            />

                            <TextInput
                                label="Bio / Headline"
                                value={form.bio}
                                onChangeText={(text) => handleChange('bio', text)}
                                mode="outlined"
                                style={styles.input}
                                placeholder="E.g. Experienced React Developer"
                            />

                            <TextInput
                                label="Phone Number"
                                value={form.phone}
                                onChangeText={(text) => handleChange('phone', text)}
                                mode="outlined"
                                style={styles.input}
                                keyboardType="phone-pad"
                            />

                            <TextInput
                                label="Location"
                                value={form.location}
                                onChangeText={(text) => handleChange('location', text)}
                                mode="outlined"
                                style={styles.input}
                            />

                            {user?.role === 'EMPLOYER' && (
                                <TextInput
                                    label="Company Name"
                                    value={form.companyName}
                                    onChangeText={(text) => handleChange('companyName', text)}
                                    mode="outlined"
                                    style={styles.input}
                                />
                            )}

                            {user?.role === 'JOBSEEKER' && (
                                <>
                                    <TextInput
                                        label="Skills (comma separated)"
                                        value={form.skills}
                                        onChangeText={(text) => handleChange('skills', text)}
                                        mode="outlined"
                                        style={styles.input}
                                        placeholder="Java, Python, React"
                                    />

                                    <TextInput
                                        label="Years of Experience"
                                        value={form.experience}
                                        onChangeText={(text) => handleChange('experience', text)}
                                        mode="outlined"
                                        style={styles.input}
                                        keyboardType="numeric"
                                    />
                                </>
                            )}

                            <Button
                                mode="contained"
                                onPress={handleUpdate}
                                loading={loading}
                                style={styles.saveButton}
                            >
                                Save Changes
                            </Button>
                        </View>
                    ) : (
                        // View Mode
                        <View style={styles.menuContainer}>
                            <List.Section>
                                <List.Subheader>Personal Information</List.Subheader>
                                <List.Item
                                    title="Experience"
                                    description={user?.experience ? `${user.experience} Years` : 'Not specified'}
                                    left={props => <List.Icon {...props} icon="briefcase-outline" color={colors.primary} />}
                                />
                                <List.Item
                                    title="Skills"
                                    description={user?.skills ? user.skills.join(', ') : 'No skills added'}
                                    left={props => <List.Icon {...props} icon="code-tags" color={colors.primary} />}
                                />
                                <List.Item
                                    title="Location"
                                    description={user?.location || 'Not specified'}
                                    left={props => <List.Icon {...props} icon="map-marker-outline" color={colors.primary} />}
                                />
                                <List.Item
                                    title="Phone"
                                    description={user?.phone || 'Not specified'}
                                    left={props => <List.Icon {...props} icon="phone-outline" color={colors.primary} />}
                                />
                            </List.Section>

                            <Divider />

                            <List.Section>
                                <List.Subheader>Account</List.Subheader>
                                <List.Item
                                    title="Subscription Plan"
                                    description={user?.subscription?.tier ? `${user.subscription.tier.charAt(0) + user.subscription.tier.slice(1).toLowerCase()} Plan` : 'Free Plan'}
                                    left={props => (
                                        <List.Icon
                                            {...props}
                                            icon={user?.subscription?.tier && user?.subscription?.tier !== 'FREE' ? "crown" : "crown-outline"}
                                            color={user?.subscription?.tier && user?.subscription?.tier !== 'FREE' ? '#FFD700' : '#888'}
                                        />
                                    )}
                                    right={props => (
                                        <Button
                                            mode="text"
                                            onPress={() => navigation.navigate('Subscription')}
                                            textColor={colors.primary}
                                        >
                                            {user?.subscription?.tier && user?.subscription?.tier !== 'FREE' ? 'Upgrade' : 'Upgrade'}
                                        </Button>
                                    )}
                                />
                                <List.Item
                                    title="Logout"
                                    description="Sign out of your account"
                                    left={props => <List.Icon {...props} icon="logout" color={colors.error} />}
                                    onPress={() => dispatch(logoutUser())}
                                />
                            </List.Section>
                        </View>
                    )}
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC'
    },
    scroll: {
        paddingBottom: 60
    },
    header: {
        alignItems: 'center',
        padding: 30,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        ...theme.shadows.medium,
        marginBottom: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 20,
        ...theme.shadows.medium,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#1E293B',
        borderRadius: 18,
        width: 36,
        height: 36,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#fff'
    },
    name: {
        fontSize: 26,
        fontWeight: '800',
        color: '#1E293B'
    },
    email: {
        fontSize: 15,
        color: '#64748B',
        marginTop: 4
    },
    roleBagde: {
        paddingHorizontal: 16,
        paddingVertical: 6,
        borderRadius: 12,
        marginTop: 16,
        ...theme.shadows.small,
    },
    statsCard: {
        marginHorizontal: 20,
        marginBottom: 32,
        borderRadius: 24,
        ...theme.shadows.medium,
        backgroundColor: '#fff',
        borderWidth: 0,
    },
    statsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 12
    },
    statItem: {
        flex: 1,
        alignItems: 'center'
    },
    statNumber: {
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B'
    },
    statLabel: {
        fontSize: 13,
        color: '#64748B',
        fontWeight: '600',
        marginTop: 2,
    },
    dividerVertical: {
        width: 1,
        backgroundColor: '#F1F5F9',
        height: '100%'
    },
    menuContainer: {
        paddingHorizontal: 0
    },
    form: {
        paddingHorizontal: 20,
        paddingBottom: 30,
    },
    sectionTitle: {
        marginBottom: 20,
        fontSize: 20,
        fontWeight: '800',
        color: '#1E293B'
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    saveButton: {
        marginTop: 16,
        borderRadius: 16,
        paddingVertical: 8,
        backgroundColor: '#1A5F7A',
        ...theme.shadows.medium,
    }
});

export default ProfileScreen;
