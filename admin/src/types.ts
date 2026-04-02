export interface Event {
  _id: string;
  title: string;
  description: string;
  content: string;
  image: string;
  status: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CommitteeMember {
  _id: string;
  name: string;
  image: string;
  status: boolean;
  designation: string;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FAQ {
  _id: string;
  question: string;
  answer: string;
  status: boolean;
  slug?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  status: boolean;
  statusCode: number;
  msg: string;
  data: T;
}

export interface FAQData {
  faqs: FAQ[];
  pagination: any;
}

export interface EventData {
  events: Event[];
  pagination: any;
}

export interface CommitteeData {
  committee: CommitteeMember[];
  pagination: any;
}

export type Section = 'events' | 'committee' | 'faq';

