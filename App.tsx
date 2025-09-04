
import React, { useState, useMemo, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, User } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import ProfilePage from './pages/ProfilePage';
import MainLayout from './layouts/MainLayout';

const App: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);

    const updateUser = (details: Partial<Pick<User, 'name' | 'profilePicture'>>) => {
        setUser(currentUser => currentUser ? { ...currentUser, ...details } : null);
    };

    const authContextValue = useMemo(() => ({
        user,
        login: (email: string) => setUser({ email, name: 'Alex Doe', profilePicture: null }),
        logout: () => setUser(null),
        updateUser,
    }), [user]);

    return (
        <ThemeProvider>
            <AuthContext.Provider value={authContextValue}>
                <HashRouter>
                    <Routes>
                        <Route path="/login" element={user ? <Navigate to="/" /> : <LoginPage />} />
                        <Route
                            path="/*"
                            element={
                                user ? (
                                    <MainLayout>
                                        <Routes>
                                            <Route path="/" element={<DashboardPage />} />
                                            <Route path="/chat" element={<ChatbotPage />} />
                                            <Route path="/profile" element={<ProfilePage />} />
                                            <Route path="*" element={<Navigate to="/" />} />
                                        </Routes>
                                    </MainLayout>
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                    </Routes>
                </HashRouter>
            </AuthContext.Provider>
        </ThemeProvider>
    );
};

export default App;
