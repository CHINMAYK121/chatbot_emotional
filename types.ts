
export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  emotion?: Emotion;
}

export interface Emotion {
  label: string;
  emoji: string;
}

export interface PastChat {
    id: number;
    title: string;
    lastMessage: string;
    date: string;
}

export interface EmotionData {
    emotion: string;
    percentage: number;
    color: string;
}

export interface PersonalInfoItem {
  id: string;
  key: string;
  value: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  type: string;
  content: string; // File content as a string (e.g., text or base64)
}
