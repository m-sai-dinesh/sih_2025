export enum AppView {
  DASHBOARD = 'Dashboard',
  EDUCATION = 'Education Modules',
  VIRTUAL_DRILL = 'Virtual Drill',
  DISASTER_PLANS = 'Disaster Plans',
  REGIONAL_HAZARDS = 'Regional Hazards',
  RESOURCE_VIDEOS = 'Resource Videos',
}

export enum DisasterType {
  EARTHQUAKE = 'Earthquake',
  FLOOD = 'Flood',
  CYCLONE = 'Cyclone',
  TSUNAMI = 'Tsunami',
}

export interface DrillQuestion {
  questionText: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DrillScenario {
  scenario: string;
  questions: DrillQuestion[];
}

export enum UserRole {
  STUDENT_PRIMARY = 'Primary Student (Classes 1-5)',
  STUDENT_SECONDARY = 'Secondary Student (Classes 6-12)',
  STUDENT_COLLEGE = 'College Student',
  PARENT = 'Parent',
  ADMIN_TEACHER = 'Administrator/Teacher',
  GUEST = 'Guest',
}

export interface User {
  id: string;
  username: string;
  role: UserRole;
}

export enum VideoCategory {
    NATURAL_DISASTER = 'Natural Disaster',
    FIRST_AID = 'First Aid',
    PREPAREDNESS = 'Preparedness',
    SPECIFIC_SKILL = 'Specific Skill',
}

export interface VideoData {
    title: string;
    description: string;
    thumbnail: string;
    url: string;
    category: VideoCategory;
}

export interface DisasterPlan {
  id: string;
  title: string;
  category: 'Family' | 'School' | 'Individual';
  content: string;
  annotations: { user: string; text: string }[];
}