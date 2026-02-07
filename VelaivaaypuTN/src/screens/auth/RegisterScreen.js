import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, HelperText, useTheme } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { loginUser } from '../../redux/authSlice';
import { register } from '../../api/authApi';

const RegisterScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('JOBSEEKER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();

    const handleRegister = async () => {
        setLoading(true);
        setError('');
        try {
            const data = await register({ email, password, name, role });
            // Auto login after register
            dispatch(loginUser({ email, password }));
        } catch (err) {
            setError(err.response?.data?.error || 'Registration failed');
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.titleContainer}>
                    <Title style={[styles.title, { color: colors.primary }]}>Create Account</Title>
                    <Text style={styles.subtitle}>Join us to find your dream job or ideal candidate</Text>
                </View>

                <View style={styles.form}>
                    <TextInput
                        label="Full Name"
                        value={name}
                        onChangeText={setName}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={colors.secondary}
                        activeOutlineColor={colors.primary}
                        left={<TextInput.Icon icon="account" color={colors.secondary} />}
                    />

                    <TextInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        autoCapitalize="none"
                        keyboardType="email-address"
                        outlineColor={colors.secondary}
                        activeOutlineColor={colors.primary}
                        left={<TextInput.Icon icon="email" color={colors.secondary} />}
                    />

                    <TextInput
                        label="Password"
                        value={password}
                        onChangeText={setPassword}
                        mode="outlined"
                        secureTextEntry={!showPassword}
                        style={styles.input}
                        outlineColor={colors.secondary}
                        activeOutlineColor={colors.primary}
                        left={<TextInput.Icon icon="lock" color={colors.secondary} />}
                        right={
                            <TextInput.Icon
                                icon={showPassword ? "eye-off" : "eye"}
                                onPress={() => setShowPassword(!showPassword)}
                            />
                        }
                    />

                    <Text style={[styles.label, { color: colors.text }]}>I want to:</Text>

                    <View style={styles.roleContainer}>
                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                role === 'JOBSEEKER' && { borderColor: colors.primary, backgroundColor: colors.surface },
                                role !== 'JOBSEEKER' && { borderColor: '#E0E0E0' }
                            ]}
                            onPress={() => setRole('JOBSEEKER')}
                        >
                            <Icon
                                name="briefcase-search"
                                size={32}
                                color={role === 'JOBSEEKER' ? colors.primary : '#999'}
                            />
                            <Text style={[
                                styles.roleText,
                                { color: role === 'JOBSEEKER' ? colors.primary : '#666' }
                            ]}>Find a Job</Text>
                            {role === 'JOBSEEKER' && (
                                <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                                    <Icon name="check" size={12} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.roleCard,
                                role === 'EMPLOYER' && { borderColor: colors.primary, backgroundColor: colors.surface },
                                role !== 'EMPLOYER' && { borderColor: '#E0E0E0' }
                            ]}
                            onPress={() => setRole('EMPLOYER')}
                        >
                            <Icon
                                name="domain"
                                size={32}
                                color={role === 'EMPLOYER' ? colors.primary : '#999'}
                            />
                            <Text style={[
                                styles.roleText,
                                { color: role === 'EMPLOYER' ? colors.primary : '#666' }
                            ]}>Hire Talent</Text>
                            {role === 'EMPLOYER' && (
                                <View style={[styles.checkIcon, { backgroundColor: colors.primary }]}>
                                    <Icon name="check" size={12} color="#fff" />
                                </View>
                            )}
                        </TouchableOpacity>
                    </View>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Icon name="alert-circle" size={20} color={colors.error} />
                            <HelperText type="error" style={styles.errorText}>{error}</HelperText>
                        </View>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                    >
                        Register
                    </Button>

                    <View style={styles.footer}>
                        <Text>Already have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                            <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Login</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        padding: 16,
    },
    content: {
        flexGrow: 1,
        padding: 24,
        paddingTop: 0,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 32,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: 16,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginTop: 8,
        marginBottom: 16,
    },
    roleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 24,
    },
    roleCard: {
        width: '48%',
        borderWidth: 2,
        borderRadius: 12,
        padding: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        position: 'relative',
    },
    roleText: {
        marginTop: 8,
        fontWeight: 'bold',
        fontSize: 14,
    },
    checkIcon: {
        position: 'absolute',
        top: 8,
        right: 8,
        width: 20,
        height: 20,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFEBEE',
        padding: 10,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        marginLeft: 8,
        fontSize: 14,
    },
    button: {
        borderRadius: 12,
        elevation: 4,
        marginBottom: 24,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: 20,
    },
});

export default RegisterScreen;
