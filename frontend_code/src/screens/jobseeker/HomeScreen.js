import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Title, Text, Button, Searchbar, Card } from 'react-native-paper';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../../redux/authSlice';

const JobSeekerHomeScreen = () => {
    const dispatch = useDispatch();
    const { user } = useSelector(state => state.auth);
    const [searchQuery, setSearchQuery] = React.useState('');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Title>Find Your Dream Job</Title>
                <Text>Hello, {user?.name}</Text>
            </View>

            <Searchbar
                placeholder="Search jobs..."
                onChangeText={setSearchQuery}
                value={searchQuery}
                style={styles.search}
            />

            <ScrollView style={styles.content}>
                <Card style={styles.card}>
                    <Card.Content>
                        <Title>Software Engineer</Title>
                        <Text>Tech Corp - Chennai</Text>
                        <Text>₹ 5L - 8L / year</Text>
                    </Card.Content>
                    <Card.Actions>
                        <Button>View Details</Button>
                    </Card.Actions>
                </Card>

                {/* More job cards would go here */}
            </ScrollView>

            <Button mode="outlined" onPress={() => dispatch(logoutUser())} style={styles.logout}>
                Logout
            </Button>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    header: {
        padding: 20,
        backgroundColor: '#e3f2fd'
    },
    search: {
        margin: 15
    },
    content: {
        paddingHorizontal: 15
    },
    card: {
        marginBottom: 10
    },
    logout: {
        margin: 20
    }
});

export default JobSeekerHomeScreen;
