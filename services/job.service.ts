/**
 * Job Service
 * Handles job-related API calls
 */

import api from './api.service';
import { ENDPOINTS } from '../config/api.config';

// Job type
export interface Job {
  id: string;
  title: string;
  description: string;
  startTime?: string;
  payment: string;
  locationText: string;
  locationGeo?: {
    lat: number | null;
    lng: number | null;
  };
  totalTime?: string;
  status: 'Open' | 'Closed' | 'Cancelled' | 'InProgress' | 'Completed';
  createdBy: {
    id: string;
    name: string;
    phone: string;
    rating?: { average: number; count: number };
  };
  applicantCount?: number;
  hasApplied?: boolean;
  applicationStatus?: string;
  createdAt: string;
}

// Job Application type
export interface JobApplication {
  id: string;
  jobId: Job;
  applicantId: {
    id: string;
    name: string;
    phone: string;
    skills: string[];
    rating?: { average: number; count: number };
    profileImage?: string;
  };
  status: 'Applied' | 'Accepted' | 'Rejected' | 'Withdrawn';
  message?: string;
  appliedAt: string;
}

// Accepted Job type
export interface AcceptedJob {
  id: string;
  jobId: Job;
  workerId: {
    id: string;
    name: string;
    phone: string;
    rating?: { average: number; count: number };
  };
  employerId: {
    id: string;
    name: string;
    phone: string;
    rating?: { average: number; count: number };
  };
  status: 'Active' | 'Completed' | 'Cancelled';
  chatRoomId: string;
  acceptedAt: string;
}

/**
 * Create a new job
 */
export const createJob = async (data: {
  title: string;
  description: string;
  startTime?: string;
  payment: string;
  locationText: string;
  locationGeo?: { lat: number; lng: number };
  totalTime?: string;
  requiredSkills?: string[];
}) => {
  return api.post<{ job: Job }>(ENDPOINTS.JOBS.CREATE, data);
};

/**
 * Get jobs created by current user (employer)
 */
export const getMyJobs = async (params?: { status?: string; page?: number; limit?: number }) => {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  
  const endpoint = `${ENDPOINTS.JOBS.MY_JOBS}${query.toString() ? `?${query}` : ''}`;
  return api.get<{ jobs: Job[]; total: number; pages: number }>(endpoint);
};

/**
 * Get available jobs for workers
 */
export const getAvailableJobs = async (params?: {
  latitude?: number;
  longitude?: number;
  maxDistance?: number;
  skills?: string[];
  page?: number;
  limit?: number;
}) => {
  const query = new URLSearchParams();
  if (params?.latitude) query.append('latitude', params.latitude.toString());
  if (params?.longitude) query.append('longitude', params.longitude.toString());
  if (params?.maxDistance) query.append('maxDistance', params.maxDistance.toString());
  if (params?.skills?.length) query.append('skills', params.skills.join(','));
  if (params?.page) query.append('page', params.page.toString());
  if (params?.limit) query.append('limit', params.limit.toString());
  
  const endpoint = `${ENDPOINTS.JOBS.AVAILABLE}${query.toString() ? `?${query}` : ''}`;
  return api.get<{ jobs: Job[] }>(endpoint);
};

/**
 * Get job by ID
 */
export const getJobById = async (jobId: string) => {
  return api.get<{ job: Job }>(ENDPOINTS.JOBS.GET_BY_ID(jobId));
};

/**
 * Update job
 */
export const updateJob = async (jobId: string, data: Partial<Job>) => {
  return api.put<{ job: Job }>(ENDPOINTS.JOBS.UPDATE(jobId), data);
};

/**
 * Cancel job
 */
export const cancelJob = async (jobId: string) => {
  return api.put<{ job: Job }>(ENDPOINTS.JOBS.CANCEL(jobId));
};

/**
 * Close job
 */
export const closeJob = async (jobId: string) => {
  return api.put<{ job: Job }>(ENDPOINTS.JOBS.CLOSE(jobId));
};

/**
 * Get job applicants
 */
export const getJobApplicants = async (jobId: string) => {
  return api.get<{ applications: JobApplication[] }>(ENDPOINTS.JOBS.APPLICANTS(jobId));
};

/**
 * Apply for a job
 */
export const applyForJob = async (jobId: string, message?: string) => {
  return api.post<{ application: JobApplication }>(ENDPOINTS.APPLICATIONS.APPLY, {
    jobId,
    message,
  });
};

/**
 * Get my applications
 */
export const getMyApplications = async (params?: { status?: string; page?: number }) => {
  const query = new URLSearchParams();
  if (params?.status) query.append('status', params.status);
  if (params?.page) query.append('page', params.page.toString());
  
  const endpoint = `${ENDPOINTS.APPLICATIONS.MY_APPLICATIONS}${query.toString() ? `?${query}` : ''}`;
  return api.get<{ applications: JobApplication[] }>(endpoint);
};

/**
 * Get accepted jobs
 */
export const getAcceptedJobs = async (status?: string) => {
  const query = status ? `?status=${status}` : '';
  return api.get<{ acceptedJobs: AcceptedJob[] }>(`${ENDPOINTS.APPLICATIONS.ACCEPTED_JOBS}${query}`);
};

/**
 * Get incoming job requests
 */
export const getIncomingRequests = async () => {
  return api.get<{ applications: JobApplication[] }>(ENDPOINTS.APPLICATIONS.INCOMING_REQUESTS);
};

/**
 * Accept or reject application
 */
export const handleApplication = async (applicationId: string, action: 'accept' | 'reject') => {
  return api.put<{ application: JobApplication; acceptedJob?: AcceptedJob; chatRoomId?: string }>(
    ENDPOINTS.APPLICATIONS.HANDLE(applicationId),
    { action }
  );
};

/**
 * Withdraw application
 */
export const withdrawApplication = async (applicationId: string) => {
  return api.delete(ENDPOINTS.APPLICATIONS.WITHDRAW(applicationId));
};

/**
 * Complete job
 */
export const completeJob = async (acceptedJobId: string) => {
  return api.put<{ acceptedJob: AcceptedJob }>(ENDPOINTS.APPLICATIONS.COMPLETE(acceptedJobId));
};

/**
 * Rate job
 */
export const rateJob = async (acceptedJobId: string, rating: number, review?: string) => {
  return api.post(ENDPOINTS.APPLICATIONS.RATE(acceptedJobId), { rating, review });
};
