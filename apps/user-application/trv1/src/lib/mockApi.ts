import { mockUsers, mockPosts, mockComments } from "@/mocks";
import type { User, Post, Comment } from "@/mocks/types";

const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// Fetch all posts
export const fetchMockPosts = async (): Promise<Post[]> => {
  await delay();
  return mockPosts;
};

// Fetch selected post (postId)
export const fetchMockPost = async (postId: string): Promise<Post | null> => {
  await delay();
  return mockPosts.find((post) => post.id === postId) || null;
};

// Fetch all posts by a user (userId)
export const fetchMockUserPosts = async (userId: string): Promise<Post[]> => {
  await delay();
  return mockPosts.filter((post) => post.authorId === userId);
};

// Fetch comments for a post (postId)
export const fetchMockComments = async (postId: string): Promise<Comment[]> => {
  await delay();
  return mockComments.filter((comment) => comment.postId === postId);
};

// Fetch all users
export const fetchMockUsers = async (): Promise<User[]> => {
  await delay();
  return mockUsers;
};

// Fetch selected user (userId)
export const fetchMockUser = async (userId: string): Promise<User | null> => {
  await delay();
  return mockUsers.find((user) => user.id === userId) || null;
};

// Fetch user by username (username)
export const fetchMockUserByUsername = async (
  username: string
): Promise<User | null> => {
  await delay();
  return mockUsers.find((user) => user.username === username) || null;
};

// Search users

// Update mock post
export const updateMockPost = async (
  postId: string,
  data: Partial<Post>
): Promise<Post | null> => {
  await delay();
  const post = mockPosts.find((p) => p.id === postId);

  if (!post) return null;

  return { ...post, ...data, updatedAt: new Date().toISOString() };
};

// Delete mock post
export const deleteMockPost = async (postId: string): Promise<boolean> => {
  await delay();
  const index = mockPosts.findIndex((p) => p.id === postId);

  if (index === -1) return false;

  mockPosts.slice(index, 1);

  return true;
};

/**
 * Create mock post
 */
export const createMockPost = async (
  title: string,
  content: string,
  authorId: string
): Promise<Post> => {
  await delay();
  const newPost: Post = {
    id: `post_${Date.now()}`,
    title,
    content,
    authorId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    likesCount: 0,
    commentsCount: 0,
  };
  mockPosts.push(newPost);
  return newPost;
};

/**
 * Create mock comment
 */
export const createMockComment = async (
  content: string,
  authorId: string,
  postId: string
): Promise<Comment> => {
  await delay();
  const newComment: Comment = {
    id: `comment_${Date.now()}`,
    content,
    authorId,
    postId,
    createdAt: new Date().toISOString(),
  };
  mockComments.push(newComment);
  return newComment;
};

/**
 * Update mock user
 */
export const updateMockUser = async (
  userId: string,
  data: Partial<User>
): Promise<User | null> => {
  await delay();
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) return null;
  return { ...user, ...data };
};

/**
 * Delete mock user
 */
export const deleteMockUser = async (userId: string): Promise<boolean> => {
  await delay();
  const index = mockUsers.findIndex((u) => u.id === userId);
  if (index === -1) return false;
  mockUsers.splice(index, 1);
  return true;
};
