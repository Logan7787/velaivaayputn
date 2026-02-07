import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from '../redux/authSlice';

import AuthNavigator from './AuthNavigator';
import EmployerNavigator from './EmployerNavigator';
import JobSeekerNavigator from './JobSeekerNavigator';
import AdminNavigator from './AdminNavigator';

const Stack = createStackNavigator();

const AppNavigator = () => {
    const dispatch = useDispatch();
    const { isAuthenticated, user, loading } = useSelector(state => state.auth);

    useEffect(() => {
        dispatch(loadUser());
    }, [dispatch]);

    // if (loading) return <LoadingScreen />;

    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions={{ headerShown: false }}>
                {!isAuthenticated ? (
                    <Stack.Screen name="Auth" component={AuthNavigator} />
                ) : (
                    <Stack.Screen name="Main" component={
                        user?.role === 'EMPLOYER' ? EmployerNavigator :
                            user?.role === 'JOBSEEKER' ? JobSeekerNavigator :
                                user?.role === 'ADMIN' ? AdminNavigator :
                                    AuthNavigator
                    } />
                )}
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default AppNavigator;
