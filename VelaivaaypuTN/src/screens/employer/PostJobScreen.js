import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { TextInput, Button, Title, HelperText, Appbar, Text, useTheme, Surface } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createJob } from '../../api/jobApi';

const PostJobScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Basics, 2: Details, 3: Contact

    const [form, setForm] = useState({
        title: '',
        description: '',
        companyName: '',
        location: '',
        district: '',
        category: '',
        employmentType: 'FULL_TIME',
        experience: '',
        salary: '',
        skills: '',
        contactEmail: '',
        contactPhone: ''
    });

    const handleChange = (name, value) => {
        setForm({ ...form, [name]: value });
    };

    const validateStep = () => {
        if (step === 1) {
            if (!form.title || !form.companyName || !form.location) {
                Alert.alert('Missing Fields', 'Please fill in Title, Company, and Location.');
                return false;
            }
        }
        if (step === 2) {
            if (!form.description || !form.category) {
                Alert.alert('Missing Fields', 'Please fill in Description and Category.');
                return false;
            }
        }
        return true;
    };

    const nextStep = () => {
        if (validateStep()) setStep(step + 1);
    };

    const prevStep = () => setStep(step - 1);

    const handleSubmit = async () => {
        if (!form.contactEmail || !form.contactPhone) {
            Alert.alert('Missing Fields', 'Please provide contact information.');
            return;
        }

        setLoading(true);
        try {
            await createJob(form);
            Alert.alert('Success', '🎉 Job Posted Successfully!', [
                { text: 'View Dashboard', onPress: () => navigation.goBack() }
            ]);
        } catch (error) {
            console.error(error);
            const errorMessage = error.response?.data?.error || 'Failed to post job';
            if (errorMessage.includes('limit reached')) {
                Alert.alert('Limit Reached', 'You have hit your job posting limit. Upgrade to Platinum?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Upgrade Now', onPress: () => navigation.navigate('Subscription') }
                ]);
            } else {
                Alert.alert('Error', errorMessage);
            }
        } finally {
            setLoading(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1:
                return (
                    <View>
                        <Title style={styles.stepTitle}>Job Basics</Title>
                        <TextInput
                            label="Job Title *"
                            value={form.title}
                            onChangeText={(text) => handleChange('title', text)}
                            mode="outlined"
                            style={styles.input}
                            outlineColor={colors.secondary}
                        />
                        <TextInput
                            label="Company Name"
                            value={form.companyName}
                            onChangeText={(text) => handleChange('companyName', text)}
                            mode="outlined"
                            style={styles.input}
                            placeholder="e.g. Acme Corp"
                        />
                        <TextInput
                            label="Location (City)"
                            value={form.location}
                            onChangeText={(text) => handleChange('location', text)}
                            mode="outlined"
                            style={styles.input}
                            left={<TextInput.Icon icon="map-marker" />}
                        />
                        <TextInput
                            label="District"
                            value={form.district}
                            onChangeText={(text) => handleChange('district', text)}
                            mode="outlined"
                            style={styles.input}
                        />
                        <View style={styles.row}>
                            <View style={{ flex: 1, marginRight: 8 }}>
                                <TextInput
                                    label="Salary (Month)"
                                    value={form.salary}
                                    onChangeText={(text) => handleChange('salary', text)}
                                    mode="outlined"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    left={<TextInput.Icon icon="cash" />}
                                />
                            </View>
                            <View style={{ flex: 1, marginLeft: 8 }}>
                                <TextInput
                                    label="Type"
                                    value={form.employmentType}
                                    onChangeText={(text) => handleChange('employmentType', text)}
                                    mode="outlined"
                                    placeholder="FULL_TIME"
                                    style={styles.input}
                                />
                            </View>
                        </View>
                    </View>
                );
            case 2:
                return (
                    <View>
                        <Title style={styles.stepTitle}>Details & Requirements</Title>
                        <TextInput
                            label="Job Description *"
                            value={form.description}
                            onChangeText={(text) => handleChange('description', text)}
                            mode="outlined"
                            multiline
                            numberOfLines={6}
                            style={styles.input}
                        />
                        <TextInput
                            label="Category / Industry *"
                            value={form.category}
                            onChangeText={(text) => handleChange('category', text)}
                            mode="outlined"
                            style={styles.input}
                        />
                        <TextInput
                            label="Required Skills (Comma separated)"
                            value={form.skills}
                            onChangeText={(text) => handleChange('skills', text)}
                            mode="outlined"
                            style={styles.input}
                            placeholder="e.g. React, Node, SQL"
                        />
                        <TextInput
                            label="Experience Required"
                            value={form.experience}
                            onChangeText={(text) => handleChange('experience', text)}
                            mode="outlined"
                            style={styles.input}
                            placeholder="e.g. 2-4 Years"
                        />
                    </View>
                );
            case 3:
                return (
                    <View>
                        <Title style={styles.stepTitle}>Contact Information</Title>
                        <Text style={styles.stepSubtitle}>How should candidates reach you?</Text>

                        <TextInput
                            label="Email Address *"
                            value={form.contactEmail}
                            onChangeText={(text) => handleChange('contactEmail', text)}
                            mode="outlined"
                            style={styles.input}
                            keyboardType="email-address"
                            left={<TextInput.Icon icon="email" />}
                        />
                        <TextInput
                            label="Phone Number *"
                            value={form.contactPhone}
                            onChangeText={(text) => handleChange('contactPhone', text)}
                            mode="outlined"
                            style={styles.input}
                            keyboardType="phone-pad"
                            left={<TextInput.Icon icon="phone" />}
                        />
                    </View>
                );
            default:
                return null;
        }
    };

    const insets = useSafeAreaInsets();

    return (
        <View style={[styles.container, { backgroundColor: '#F8F9FA', paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="close" size={24} color="#333" />
                </TouchableOpacity>
                <Title>New Job Post</Title>
                <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Step {step} of 3</Text>
            </View>

            {/* Progress Bar */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${(step / 3) * 100}%`, backgroundColor: colors.primary }]} />
            </View>

            <ScrollView contentContainerStyle={[styles.scroll, { paddingBottom: 100 + insets.bottom }]}>
                <Surface style={styles.card}>
                    {renderStepContent()}
                </Surface>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(16, insets.bottom) }]}>
                {step > 1 && (
                    <Button mode="outlined" onPress={prevStep} style={styles.navButton}>
                        Back
                    </Button>
                )}

                {step < 3 ? (
                    <Button
                        mode="contained"
                        onPress={nextStep}
                        style={[styles.navButton, { flex: 1, marginLeft: 10 }]}
                    >
                        Next Step
                    </Button>
                ) : (
                    <Button
                        mode="contained"
                        onPress={handleSubmit}
                        loading={loading}
                        style={[styles.navButton, { flex: 1, marginLeft: 10, backgroundColor: colors.primary }]}
                        labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                    >
                        Post Job
                    </Button>
                )}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 16,
        backgroundColor: '#fff',
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#eee',
        width: '100%',
    },
    progressBar: {
        height: '100%',
    },
    scroll: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        padding: 20,
        borderRadius: 12,
        backgroundColor: '#fff',
        elevation: 2,
    },
    stepTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
        marginTop: -10,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    bottomBar: {
        padding: 16,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
    },
    navButton: {
        borderRadius: 10,
        paddingVertical: 4,
    }
});

export default PostJobScreen;
