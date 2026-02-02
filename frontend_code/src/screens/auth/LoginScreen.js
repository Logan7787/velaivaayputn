import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, Title, HelperText } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/authSlice';

const LoginScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const { error, loading } = useSelector(state => state.auth);

    const handleLogin = () => {
        dispatch(loginUser({ email, password }));
    };

    return (
        <View style={styles.container}>
            <Title style={styles.title}>VelaivaaypuTN Login</Title>

            <TextInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                mode="outlined"
                style={styles.input}
                autoCapitalize="none"
            />

            <TextInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                mode="outlined"
                secureTextEntry
                style={styles.input}
            />

            {error && <HelperText type="error">{error}</HelperText>}

            <Button
                mode="contained"
                onPress={handleLogin}
                loading={loading}
                style={styles.button}
            >
                Login
            </Button>

            <Button
                mode="text"
                onPress={() => navigation.navigate('Register')}
                style={styles.link}
            >
                Don't have an account? Register
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fff'
    },
    title: {
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        marginBottom: 10
    },
    button: {
        marginTop: 10,
        padding: 5
    },
    link: {
        marginTop: 10
    }
});

export default LoginScreen;
