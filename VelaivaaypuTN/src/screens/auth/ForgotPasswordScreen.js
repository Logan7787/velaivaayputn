import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, Title, useTheme } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const ForgotPasswordScreen = ({ navigation }) => {
    const { colors } = useTheme();
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);

    const handleReset = () => {
        // Implement Password Reset Logic here (API call)
        console.log("Resetting password for:", email);
        setSubmitted(true);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={colors.text} />
                </TouchableOpacity>
            </View>

            <View style={styles.content}>
                {!submitted ? (
                    <>
                        <View style={styles.iconContainer}>
                            <Icon name="lock-reset" size={80} color={colors.primary} />
                        </View>

                        <Title style={[styles.title, { color: colors.primary }]}>Forgot Password?</Title>
                        <Text style={styles.subtitle}>
                            Enter the email address associated with your account and we'll send you a link to reset your password.
                        </Text>

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

                            <Button
                                mode="contained"
                                onPress={handleReset}
                                style={styles.button}
                                contentStyle={styles.buttonContent}
                                labelStyle={styles.buttonLabel}
                                disabled={!email}
                            >
                                Send Reset Link
                            </Button>
                        </View>
                    </>
                ) : (
                    <View style={styles.successContainer}>
                        <Icon name="email-check" size={80} color={colors.secondary} />
                        <Title style={[styles.title, { color: colors.secondary }]}>Check Your Email</Title>
                        <Text style={styles.subtitle}>
                            We have sent a password reset link to {email}.
                        </Text>
                        <Button
                            mode="outlined"
                            onPress={() => navigation.navigate('Login')}
                            style={[styles.button, { marginTop: 24, borderColor: colors.primary }]}
                            labelStyle={{ color: colors.primary }}
                        >
                            Back to Login
                        </Button>
                    </View>
                )}
            </View>
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
        flex: 1,
        padding: 24,
        paddingTop: 0,
        alignItems: 'center',
    },
    iconContainer: {
        marginBottom: 24,
        marginTop: 40,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 32,
        lineHeight: 22,
    },
    form: {
        width: '100%',
    },
    input: {
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    button: {
        borderRadius: 12,
        elevation: 2,
    },
    buttonContent: {
        paddingVertical: 8,
    },
    buttonLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        letterSpacing: 0.5,
    },
    successContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 60,
    }
});

export default ForgotPasswordScreen;
