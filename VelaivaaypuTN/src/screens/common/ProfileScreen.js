import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, KeyboardAvoidingView, Platform, TouchableOpacity } from 'react-native';
import { TextInput, Button, Title, Avatar, Appbar, Text, useTheme, Card, List, Switch, Divider } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../api/authApi';
import { loadUser, logoutUser } from '../../redux/authSlice';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ProfileScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const { user } = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [form, setForm] = useState({
        name: '',
        bio: '',
        phone: '',
        location: '',
        companyName: '',
        skills: '',
        experience: ''
    });

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
                <ScrollView contentContainerStyle={styles.scroll}>
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
                            <View style={styles.divider} />
                            <View style={styles.statItem}>
                                <Text style={styles.statNumber}>5</Text>
                                <Text style={styles.statLabel}>Saved</Text>
                            </View>
                            <View style={styles.divider} />
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
                                    description="Free Plan"
                                    left={props => <List.Icon {...props} icon="crown-outline" color="#FFD700" />}
                                    right={props => <Button mode="text" onPress={() => navigation.navigate('Subscription')}>Upgrade</Button>}
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
        backgroundColor: '#fff'
    },
    scroll: {
        paddingBottom: 40
    },
    header: {
        alignItems: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: 15,
    },
    cameraIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: '#000',
        borderRadius: 15,
        width: 30,
        height: 30,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: '#fff'
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#333'
    },
    email: {
        fontSize: 14,
        color: '#666',
        marginTop: 2
    },
    roleBagde: {
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginTop: 10,
    },
    statsCard: {
        marginHorizontal: 20,
        marginBottom: 20,
        borderRadius: 15,
        elevation: 3,
        backgroundColor: '#fff'
    },
    statsContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 10
    },
    statItem: {
        flex: 1,
        alignItems: 'center'
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333'
    },
    statLabel: {
        fontSize: 12,
        color: '#888'
    },
    divider: {
        width: 1,
        backgroundColor: '#eee',
        height: '100%'
    },
    menuContainer: {
        paddingHorizontal: 0
    },
    form: {
        paddingHorizontal: 20
    },
    sectionTitle: {
        marginBottom: 20,
        fontSize: 18,
        fontWeight: 'bold'
    },
    input: {
        marginBottom: 15,
        backgroundColor: '#fff'
    },
    saveButton: {
        marginTop: 10,
        borderRadius: 10,
        paddingVertical: 5
    }
});

export default ProfileScreen;
