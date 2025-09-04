
import React, { useState, useContext, useEffect, ChangeEvent } from 'react';
import { AuthContext, User } from '../contexts/AuthContext';
import type { PastChat, EmotionData, PersonalInfoItem, UploadedFile } from '../types';
import { UserCircleIcon, CameraIcon, EditIcon, TrashIcon, PlusIcon, UploadIcon, FileIcon } from '../components/Icons';

// Mock Data
const mockPastChats: PastChat[] = [
    { id: 1, title: "Discussing project ideas", lastMessage: "That sounds like a great plan...", date: "2 days ago" },
    { id: 2, title: "Weekend plans", lastMessage: "Let's definitely go hiking!", date: "5 days ago" },
    { id: 3, title: "Book recommendations", lastMessage: "I just finished 'The Midnight Library'.", date: "1 week ago" },
];

const mockEmotionData: EmotionData[] = [
    { emotion: 'Joy', percentage: 45, color: 'bg-green-500' },
    { emotion: 'Neutral', percentage: 25, color: 'bg-gray-500' },
    { emotion: 'Surprise', percentage: 15, color: 'bg-yellow-500' },
    { emotion: 'Sadness', percentage: 10, color: 'bg-blue-500' },
    { emotion: 'Anger', percentage: 5, color: 'bg-red-500' },
];

// Profile Card Component
const ProfileCard: React.FC<{ user: User; onEdit: () => void; }> = ({ user, onEdit }) => (
    <div className="relative w-full max-w-sm">
        <div className="bg-white/20 dark:bg-gray-800/60 backdrop-blur-lg rounded-xl flex flex-col items-center justify-center p-6 shadow-xl">
             {user.profilePicture ? (
                <img src={user.profilePicture} alt="Profile" className="w-32 h-32 rounded-full border-4 border-sky-400 shadow-lg object-cover" />
            ) : (
                <div className="w-32 h-32 rounded-full border-4 border-sky-400 flex items-center justify-center bg-gray-700">
                    <UserCircleIcon className="w-28 h-28 text-gray-500" />
                </div>
            )}
            <h2 className="mt-4 text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
        </div>
        <button onClick={onEdit} className="absolute top-4 right-4 p-2 bg-gray-700/50 hover:bg-sky-500 rounded-full text-white transition-all duration-300">
            <EditIcon className="h-5 w-5"/>
        </button>
    </div>
);

// Edit Profile Modal Component
const EditProfileModal: React.FC<{ user: User; onClose: () => void; }> = ({ user, onClose }) => {
    const { updateUser } = useContext(AuthContext);
    const [name, setName] = useState(user.name);
    const [photo, setPhoto] = useState<string | null>(user.profilePicture);

    const handlePhotoChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                setPhoto(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = () => {
        updateUser({ name, profilePicture: photo });
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center animate-fade-in">
            <div className="bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-md space-y-4">
                <h2 className="text-2xl font-bold text-white">Edit Profile</h2>
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        {photo ? (
                            <img src={photo} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover" />
                        ) : (
                             <UserCircleIcon className="w-32 h-32 text-gray-600" />
                        )}
                        <label htmlFor="photo-upload" className="absolute -bottom-2 -right-2 p-2 bg-sky-500 rounded-full cursor-pointer hover:bg-sky-600 transition">
                            <CameraIcon className="w-6 h-6 text-white"/>
                        </label>
                        <input id="photo-upload" type="file" accept="image/*" className="hidden" onChange={handlePhotoChange}/>
                    </div>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-3 py-2 bg-gray-700 text-white rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                <div className="flex justify-end space-x-4">
                    <button onClick={onClose} className="px-4 py-2 rounded-md text-gray-300 hover:bg-gray-700 transition">Cancel</button>
                    <button onClick={handleSave} className="px-4 py-2 rounded-md bg-sky-600 text-white hover:bg-sky-700 transition">Save Changes</button>
                </div>
            </div>
        </div>
    );
};


const ProfilePage: React.FC = () => {
    const [activeTab, setActiveTab] = useState('knowYourself');
    const { user } = useContext(AuthContext);
    const [isEditModalOpen, setEditModalOpen] = useState(false);
    const [personalInfo, setPersonalInfo] = useState<PersonalInfoItem[]>([]);
    const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);


    useEffect(() => {
        const storedInfo = localStorage.getItem('personalInfo');
        if (storedInfo) setPersonalInfo(JSON.parse(storedInfo));
        
        const storedFiles = localStorage.getItem('uploadedFiles');
        if (storedFiles) setUploadedFiles(JSON.parse(storedFiles));
    }, []);

    const updateStoredInfo = (info: PersonalInfoItem[]) => {
        setPersonalInfo(info);
        localStorage.setItem('personalInfo', JSON.stringify(info));
    }
    
    const updateStoredFiles = (files: UploadedFile[]) => {
        setUploadedFiles(files);
        localStorage.setItem('uploadedFiles', JSON.stringify(files));
    }

    const handleAddItem = () => {
        const newItem: PersonalInfoItem = { id: Date.now().toString(), key: 'New Fact', value: 'Your info' };
        updateStoredInfo([...personalInfo, newItem]);
    };
    
    const handleUpdateItem = (id: string, newKey: string, newValue: string) => {
        const updatedInfo = personalInfo.map(item => item.id === id ? { ...item, key: newKey, value: newValue } : item);
        updateStoredInfo(updatedInfo);
    };

    const handleDeleteItem = (id: string) => {
        const filteredInfo = personalInfo.filter(item => item.id !== id);
        updateStoredInfo(filteredInfo);
    };

    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (!files) return;

        for (const file of Array.from(files)) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const newFile: UploadedFile = {
                    id: `${file.name}-${Date.now()}`,
                    name: file.name,
                    type: file.type,
                    content: e.target?.result as string,
                };
                // For non-text files, content will be a data URL. We can truncate for display if needed.
                // For simplicity here, we store the whole thing.
                setUploadedFiles(prev => [...prev, newFile]);
            };
            // Read text files as text, others as Data URL
            if (file.type.startsWith('text/')) {
                reader.readAsText(file);
            } else {
                reader.readAsDataURL(file);
            }
        }
    };

    const handleDeleteFile = (id: string) => {
        updateStoredFiles(uploadedFiles.filter(file => file.id !== id));
    };
    
    // Effect to persist file changes to localStorage
    useEffect(() => {
        localStorage.setItem('uploadedFiles', JSON.stringify(uploadedFiles));
    }, [uploadedFiles]);

    if (!user) return null;

    return (
        <div className="space-y-8">
            <div className="flex justify-center animate-fade-in">
                <ProfileCard user={user} onEdit={() => setEditModalOpen(true)} />
            </div>

            {isEditModalOpen && <EditProfileModal user={user} onClose={() => setEditModalOpen(false)} />}

            <div className="bg-white/10 dark:bg-gray-800/50 backdrop-blur-md rounded-xl shadow-lg p-6 animate-fade-in-up-scale" style={{animationDelay: '200ms'}}>
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                         <button onClick={() => setActiveTab('knowYourself')} className={`${activeTab === 'knowYourself' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Know Yourself
                        </button>
                        <button onClick={() => setActiveTab('trends')} className={`${activeTab === 'trends' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Emotion Trends
                        </button>
                        <button onClick={() => setActiveTab('chats')} className={`${activeTab === 'chats' ? 'border-sky-500 text-sky-600 dark:text-sky-400' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}>
                            Past Chats
                        </button>
                    </nav>
                </div>
                
                <div className="mt-6">
                    {activeTab === 'knowYourself' && (
                        <div key="knowYourself" className="animate-fade-in space-y-8">
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6">Personal Information</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">The AI uses this to personalize conversations.</p>
                                    </div>
                                    <button onClick={handleAddItem} className="flex items-center space-x-2 px-3 py-2 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-transform hover:scale-105">
                                        <PlusIcon />
                                        <span>Add Info</span>
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {personalInfo.map(item => (
                                        <div key={item.id} className="flex items-center gap-2 p-3 bg-gray-700/50 rounded-lg">
                                            <input type="text" value={item.key} onChange={(e) => handleUpdateItem(item.id, e.target.value, item.value)} className="font-bold w-1/3 px-2 py-1 bg-transparent rounded focus:outline-none focus:bg-gray-600 transition" />
                                            <input type="text" value={item.value} onChange={(e) => handleUpdateItem(item.id, item.key, e.target.value)} className="w-2/3 px-2 py-1 bg-transparent rounded focus:outline-none focus:bg-gray-600 transition" />
                                            <button onClick={() => handleDeleteItem(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    ))}
                                    {personalInfo.length === 0 && <p className="text-center text-gray-500 py-4">No personal info added yet.</p>}
                                </div>
                            </div>

                            <hr className="border-gray-700" />

                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <div>
                                        <h3 className="text-lg font-medium leading-6">Your Documents (RAG)</h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400">Upload files for the AI to use as a knowledge base.</p>
                                    </div>
                                    <label htmlFor="file-upload" className="flex items-center space-x-2 px-3 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-transform hover:scale-105 cursor-pointer">
                                        <UploadIcon />
                                        <span>Upload Files</span>
                                    </label>
                                    <input id="file-upload" type="file" multiple className="hidden" onChange={handleFileChange} />
                                </div>
                                <div className="space-y-3">
                                    {uploadedFiles.map(file => (
                                        <div key={file.id} className="flex items-center gap-3 p-3 bg-gray-700/50 rounded-lg">
                                            <FileIcon className="h-6 w-6 text-sky-400 flex-shrink-0" />
                                            <span className="flex-grow truncate" title={file.name}>{file.name}</span>
                                            <button onClick={() => handleDeleteFile(file.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-full transition">
                                                <TrashIcon />
                                            </button>
                                        </div>
                                    ))}
                                    {uploadedFiles.length === 0 && <p className="text-center text-gray-500 py-4">No documents uploaded yet.</p>}
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'trends' && (
                        <div key="trends" className="animate-fade-in">
                            <h3 className="text-lg font-medium leading-6">Your Emotion Analysis (Last 30 Days)</h3>
                            <div className="mt-4 space-y-4">
                                {mockEmotionData.map((data, index) => (
                                    <div key={data.emotion}>
                                        <div className="flex justify-between mb-1">
                                            <span className="text-base font-medium">{data.emotion}</span>
                                            <span className="text-sm font-medium">{data.percentage}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                            <div className={`${data.color} h-2.5 rounded-full transition-all duration-1000 ease-out`} style={{ width: `${data.percentage}%`, transitionDelay: `${index * 100}ms` }}></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    {activeTab === 'chats' && (
                        <div key="chats" className="animate-fade-in">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {mockPastChats.map(chat => (
                                    <li key={chat.id} className="py-4 flex hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-lg p-2 transition-colors">
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900 dark:text-white">{chat.title}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">"{chat.lastMessage}" - <span className="italic">{chat.date}</span></p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
