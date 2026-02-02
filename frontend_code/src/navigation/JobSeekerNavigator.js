import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JobSeekerHomeScreen from '../screens/jobseeker/HomeScreen';

const Stack = createStackNavigator();

const JobSeekerNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="JobSeekerHome" component={JobSeekerHomeScreen} options={{ headerShown: false }} />
            {/* Add JobDetails and Search screens here */}
        </Stack.Navigator>
    );
};

export default JobSeekerNavigator;
