import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmployerDashboard from '../screens/employer/DashboardScreen';
import SubscriptionScreen from '../screens/common/SubscriptionScreen';

import PostJobScreen from '../screens/employer/PostJobScreen';

import ProfileScreen from '../screens/common/ProfileScreen';

import JobApplicationsScreen from '../screens/employer/JobApplicationsScreen';
import ApplicantDetailsScreen from '../screens/employer/ApplicantDetailsScreen';

const Stack = createStackNavigator();

const EmployerNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} options={{ headerShown: false }} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ headerShown: false }} />
            <Stack.Screen name="PostJob" component={PostJobScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
            <Stack.Screen name="JobApplications" component={JobApplicationsScreen} options={{ headerShown: false }} />
            <Stack.Screen name="ApplicantDetails" component={ApplicantDetailsScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
    );
};

export default EmployerNavigator;
