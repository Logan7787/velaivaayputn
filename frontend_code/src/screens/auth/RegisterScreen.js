import React, { useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { TextInput, Button, RadioButton, Text, Title, HelperText } from 'react-native-paper';
import { useDispatch } from 'react-redux';
import { loginUser } from '../../redux/authSlice'; // We might need a separate register thunk or just use axios directly
import { register } from '../../api/authApi';

const RegisterScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [role, setRole] = useState('JOBSEEKER');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
        <ScrollView contentContainerStyle={styles.container}>
            <Title style={styles.title}>Create Account</Title>

            <TextInput
                label="Full Name"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
            />

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

            <Text style={styles.label}>I am a:</Text>
            <RadioButton.Group onValueChange={newValue => setRole(newValue)} value={role}>
                <View style={styles.row}>
                    <Text>Job Seeker</Text>
                    <RadioButton value="JOBSEEKER" />
                </View>
                <View style={styles.row}>
                    <Text>Employer</Text>
                    <RadioButton value="EMPLOYER" />
                </View>
            </RadioButton.Group>

            {error && <HelperText type="error">{error}</HelperText>}

            <Button
                mode="contained"
                onPress={handleRegister}
                loading={loading}
                style={styles.button}
            >
                Register
            </Button>

            <Button
                mode="text"
                onPress={() => navigation.navigate('Login')}
                style={styles.link}
            >
                Already have an account? Login
            </Button>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#fff',
        flexGrow: 1,
        justifyContent: 'center'
    },
    title: {
        textAlign: 'center',
        marginBottom: 20
    },
    input: {
        marginBottom: 10
    },
    label: {
        marginTop: 10,
        marginBottom: 5
    },
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        marginBottom: 5
    },
    button: {
        marginTop: 20,
        padding: 5
    },
    link: {
        marginTop: 10
    }
});

export default RegisterScreen;
