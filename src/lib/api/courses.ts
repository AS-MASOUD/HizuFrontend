import { apiClient } from "./client";
import { Course, CourseListDto, PagedResult } from "@/types";

export interface GetCoursesParams {
  search?: string;
  level?: number;
  page?: number;
  pageSize?: number;
}

export const coursesApi = {
  async getCourses(params?: GetCoursesParams): Promise<PagedResult<CourseListDto>> {
    const query = new URLSearchParams();
    if (params?.search) query.append("search", params.search);
    if (params?.level !== undefined && params.level !== null) query.append("level", params.level.toString());
    if (params?.page) query.append("page", params.page.toString());
    if (params?.pageSize) query.append("pageSize", params.pageSize.toString());

    const queryString = query.toString();
    const endpoint = queryString ? `/api/courses?${queryString}` : "/api/courses";
    return apiClient<PagedResult<CourseListDto>>(endpoint);
  },

  async getFeaturedCourses(count = 3): Promise<CourseListDto[]> {
    return apiClient<CourseListDto[]>(`/api/courses/featured?count=${count}`);
  },

  async getCourseBySlug(slug: string): Promise<Course> {
    return apiClient<Course>(`/api/courses/${encodeURIComponent(slug)}`);
  },

  async reserveCourse(courseId: string): Promise<{ success: boolean; message: string }> {
    return apiClient<{ success: boolean; message: string }>(`/api/courses/${courseId}/reserve`, {
      method: "POST",
    });
  },

  async getMyCourses(): Promise<CourseListDto[]> {
    return apiClient<CourseListDto[]>("/api/courses/my-courses");
  },
};

