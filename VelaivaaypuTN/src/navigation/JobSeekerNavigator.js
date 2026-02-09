import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import JobSeekerHomeScreen from '../screens/jobseeker/HomeScreen';

import JobDetailsScreen from '../screens/jobseeker/JobDetailsScreen';

import ProfileScreen from '../screens/common/ProfileScreen';
import SubscriptionScreen from '../screens/common/SubscriptionScreen';

const Stack = createStackNavigator();
import ChatScreen from '../screens/common/ChatScreen';

const JobSeekerNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="JobSeekerHome" component={JobSeekerHomeScreen} options={{ headerShown: false }} />
            <Stack.Screen name="JobDetails" component={JobDetailsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={({ route }) => ({ title: route.params.otherUser.name })} />
        </Stack.Navigator>
    );
};

export default JobSeekerNavigator;
