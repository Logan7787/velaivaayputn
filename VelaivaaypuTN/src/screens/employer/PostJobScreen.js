import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert, TouchableOpacity, StatusBar } from 'react-native';
import { TextInput, Button, Title, HelperText, Appbar, Text, useTheme, Surface } from 'react-native-paper';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { createJob } from '../../api/jobApi';

const PostJobScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const insets = useSafeAreaInsets();
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

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: '#F8F9FA' }]} edges={['top', 'left', 'right']}>
            <StatusBar barStyle="light-content" backgroundColor={colors.primary} />

            {/* Premium Header - More compact for 'modal' feel */}
            <View style={[styles.header, { backgroundColor: colors.primary }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeButton}>
                    <Icon name="close" size={24} color="#fff" />
                </TouchableOpacity>
                <View style={{ alignItems: 'center' }}>
                    <Title style={styles.headerTitle}>New Job Post</Title>
                    <Text style={styles.headerSubtitle}>Step {step} of 3</Text>
                </View>
                <View style={{ width: 40 }} />
            </View>

            {/* Progress Indicator */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${(step / 3) * 100}%`, backgroundColor: colors.secondary }]} />
            </View>

            <ScrollView
                contentContainerStyle={styles.scroll}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <Surface style={styles.card} elevation={2}>
                    {renderStepContent()}
                </Surface>
            </ScrollView>

            {/* Bottom Actions */}
            <View style={[styles.bottomBar, { paddingBottom: Math.max(20, insets.bottom), backgroundColor: '#fff' }]}>
                {step > 1 ? (
                    <Button
                        mode="outlined"
                        onPress={prevStep}
                        style={styles.backBtn}
                        textColor={colors.primary}
                    >
                        Back
                    </Button>
                ) : (
                    <View style={{ flex: 0.5 }} />
                )}

                <Button
                    mode="contained"
                    onPress={step === 3 ? handleSubmit : nextStep}
                    loading={loading}
                    style={[styles.nextBtn, { backgroundColor: step === 3 ? colors.secondary : colors.primary }]}
                    contentStyle={{ height: 50 }}
                    labelStyle={{ fontSize: 16, fontWeight: 'bold' }}
                >
                    {step === 3 ? 'Post Job Now' : 'Next Step'}
                </Button>
            </View>
        </SafeAreaView>
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
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
        zIndex: 1,
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    headerSubtitle: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.8)',
    },
    progressContainer: {
        height: 4,
        backgroundColor: '#E0E0E0',
        width: '100%',
        marginTop: 10,
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    },
    scroll: {
        padding: 20,
        paddingBottom: 100,
    },
    card: {
        padding: 24,
        borderRadius: 16,
        backgroundColor: '#fff',
    },
    stepTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#333',
    },
    stepSubtitle: {
        fontSize: 14,
        color: '#777',
        marginBottom: 25,
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    row: {
        flexDirection: 'row',
    },
    bottomBar: {
        paddingHorizontal: 20,
        paddingTop: 15,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        elevation: 10,
    },
    backBtn: {
        flex: 0.4,
        borderColor: '#ccc',
        borderRadius: 25,
        marginRight: 10,
    },
    nextBtn: {
        flex: 1,
        borderRadius: 25,
        elevation: 4,
    }
});

export default PostJobScreen;
