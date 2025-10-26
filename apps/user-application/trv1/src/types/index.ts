export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio: string;
  joinDate: string;
  postsCount: number;
  followersCount: number;
  followingCount: number;
  isVerified?: boolean;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt: string;
  likesCount: number;
}

export interface Comment {
  id: string;
  content: string;
  authorId: string;
  postId: string;
  createdAt: string;
}

export interface PostWithComments extends Post {
  comments: Comment[];
  commentsCount: number;
}
