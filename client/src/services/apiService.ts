import { API_BASE_URL } from '../constants';

export interface Event {
  _id: string;
  title: string;
  content: string;
  description: string;
  image: string;
  status: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export interface CommitteeMember {
  _id: string;
  name: string;
  designation: string;
  image: string;
  status: boolean;
  slug: string;
  createdAt: string;
  updatedAt: string;
}

export const fetchEvents = async (): Promise<Event[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/event`);
    const result = await response.json();
    if (result.status && result.data?.events) {
      return result.data.events;
    }
    return [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const fetchCommitteeMembers = async (): Promise<CommitteeMember[]> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/committee`);
    const result = await response.json();
    if (result.status && result.data?.committees) {
      return result.data.committees;
    }
    return [];
  } catch (error) {
    console.error('Error fetching committee members:', error);
    return [];
  }
};
