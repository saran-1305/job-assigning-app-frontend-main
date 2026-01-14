import { apiRequest, ApiResponse } from "./api.service";

export interface SkillPost {
  id: string;
  userId: {
    _id: string;
    name: string;
    phone?: string;
    rating?: { average: number; count: number };
    profileImage?: string;
  };
  skill: string;
  description: string;
  photo?: string;
  isActive: boolean;
  stats?: {
    views: number;
    requests: number;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateSkillPostData {
  skill: string;
  description: string;
  photo?: string;
}

export interface SkillPostsData {
  skillPosts: SkillPost[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export interface SingleSkillPostData {
  skillPost: SkillPost;
}

// Get all active skill posts
export const getSkillPosts = async (
  page: number = 1,
  limit: number = 20
): Promise<ApiResponse<SkillPostsData>> => {
  return apiRequest<SkillPostsData>(`/skill-posts?page=${page}&limit=${limit}`);
};

// Get my skill posts
export const getMySkillPosts = async (): Promise<ApiResponse<SkillPostsData>> => {
  return apiRequest<SkillPostsData>("/skill-posts/my-posts");
};

// Create a skill post
export const createSkillPost = async (
  data: CreateSkillPostData
): Promise<ApiResponse<SingleSkillPostData>> => {
  return apiRequest<SingleSkillPostData>("/skill-posts", {
    method: "POST",
    body: JSON.stringify(data),
  });
};

// Update a skill post
export const updateSkillPost = async (
  id: string,
  data: Partial<CreateSkillPostData>
): Promise<ApiResponse<SingleSkillPostData>> => {
  return apiRequest<SingleSkillPostData>(`/skill-posts/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
};

// Delete a skill post
export const deleteSkillPost = async (
  id: string
): Promise<ApiResponse> => {
  return apiRequest(`/skill-posts/${id}`, {
    method: "DELETE",
  });
};

// Toggle skill post active status
export const toggleSkillPostActive = async (
  id: string
): Promise<ApiResponse<SingleSkillPostData>> => {
  return apiRequest<SingleSkillPostData>(`/skill-posts/${id}/toggle-active`, {
    method: "PATCH",
  });
};

// Request a skill (increment request count and potentially send notification)
export const requestSkill = async (
  skillPostId: string,
  message?: string
): Promise<ApiResponse> => {
  return apiRequest(`/skill-posts/${skillPostId}/request`, {
    method: "POST",
    body: JSON.stringify({ message }),
  });
};
