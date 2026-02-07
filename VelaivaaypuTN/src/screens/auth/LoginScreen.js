import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { TextInput, Button, Text, Title, HelperText, useTheme } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser } from '../../redux/authSlice';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LoginScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const dispatch = useDispatch();
    const { error, loading } = useSelector(state => state.auth);

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.content}>
                {/* Header Section */}
                <View style={styles.header}>
                    <Icon name="briefcase-check" size={64} color={colors.primary} />
                    <Title style={[styles.title, { color: colors.primary }]}>Welcome Back</Title>
                    <Text style={styles.subtitle}>Sign in to continue your career journey</Text>
                </View>

                {/* Form Section */}
                <View style={styles.form}>
                    <TextInput
                        label="Email Address"
                        value={email}
                        onChangeText={setEmail}
                        mode="outlined"
                        style={styles.input}
                        outlineColor={colors.secondary}
                        activeOutlineColor={colors.primary}
                        left={<TextInput.Icon icon="email" color={colors.secondary} />}
                        autoCapitalize="none"
                        keyboardType="email-address"
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

                    <TouchableOpacity
                        style={styles.forgotPassword}
                        onPress={() => navigation.navigate('ForgotPassword')}
                    >
                        <Text style={{ color: colors.secondary, fontWeight: '600' }}>Forgot Password?</Text>
                    </TouchableOpacity>

                    {error && (
                        <View style={styles.errorContainer}>
                            <Icon name="alert-circle" size={20} color={colors.error} />
                            <HelperText type="error" style={styles.errorText}>{error}</HelperText>
                        </View>
                    )}

                    <Button
                        mode="contained"
                        onPress={handleLogin}
                        loading={loading}
                        style={styles.button}
                        contentStyle={styles.buttonContent}
                        labelStyle={styles.buttonLabel}
                    >
                        Log In
                    </Button>
                </View>

                {/* Footer Section */}
                <View style={styles.footer}>
                    <Text>Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                        <Text style={{ color: colors.primary, fontWeight: 'bold' }}>Register</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginTop: 16,
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
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 24,
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
        marginTop: 8,
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
        marginTop: 40,
    },
});

export default LoginScreen;
