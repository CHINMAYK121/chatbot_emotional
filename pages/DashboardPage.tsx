
import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserCircleIcon } from '../components/Icons';

const DashboardPage: React.FC = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    return (
        <div className="space-y-8">
            <div className="animate-fade-in-up-scale">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
                    Hello, <span className="text-sky-500">{user?.name}!</span>
                </h1>
                <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                    Welcome to your EmotionAI dashboard.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg animate-slide-in-left">
                    <h2 className="text-xl font-semibold mb-4">Your Profile</h2>
                    <div className="flex items-center space-x-4">
                        {user?.profilePicture ? (
                            <img src={user.profilePicture} alt="Profile" className="w-20 h-20 rounded-full border-4 border-sky-500 object-cover" />
                        ) : (
                             <div className="w-20 h-20 rounded-full border-4 border-sky-500 flex items-center justify-center bg-gray-700">
                                <UserCircleIcon className="w-16 h-16 text-gray-500" />
                            </div>
                        )}
                        <div>
                            <p className="font-bold">{user?.name}</p>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{user?.email}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/profile')} className="mt-6 w-full text-white bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-sky-500/30">
                        View Profile
                    </button>
                </div>

                <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md p-6 rounded-xl shadow-lg animate-slide-in-right" style={{ animationDelay: '200ms' }}>
                    <h2 className="text-xl font-semibold mb-4">Start a Conversation</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">Engage with our AI, which understands and responds to your emotional state.</p>
                    <button onClick={() => navigate('/chat')} className="w-full text-white bg-gradient-to-r from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600 font-medium rounded-lg text-sm px-5 py-2.5 text-center transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30">
                        Open Chatbot
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;
