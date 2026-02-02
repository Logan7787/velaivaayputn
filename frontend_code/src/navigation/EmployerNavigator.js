import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import EmployerDashboard from '../screens/employer/DashboardScreen';
import SubscriptionScreen from '../screens/common/SubscriptionScreen';

const Stack = createStackNavigator();

const EmployerNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen name="EmployerDashboard" component={EmployerDashboard} options={{ title: 'Employer Dashboard' }} />
            <Stack.Screen name="Subscription" component={SubscriptionScreen} options={{ title: 'Upgrade Plan' }} />
            {/* Add PostJob and other screens here */}
        </Stack.Navigator>
    );
};

export default EmployerNavigator;
