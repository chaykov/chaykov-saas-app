export const VITE_API_URL = import.meta.env.VITE_API_URL;

export const apiClient = {
  getPosts: async () => {
    const response = await fetch(`${VITE_API_URL}/posts`);
    if (!response.ok) throw new Error("Failed to fetch posts");

    return response.json();
  },

  getPost: async (postId: string) => {
    const response = await fetch(`${VITE_API_URL}/posts/${postId}`);
    if (!response.ok) throw new Error("Failed to fetch post");

    return response.json();
  },

  createPost: async (content: string, authorId: number) => {
    const response = await fetch(`${VITE_API_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content, authorId }),
    });

    if (!response.ok) {
      throw new Error("Failed to create post");
    }

    return response.json();
  },

  deletePost: async (postId: string) => {
    const response = await fetch(`${VITE_API_URL}/posts/${postId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete post");
    }

    return response.json();
  },

  getUserPosts: async (userId: string) => {
    const response = await fetch(`${VITE_API_URL}/posts`);
    if (!response.ok) throw new Error("Failed to fetch posts");

    const posts = await response.json();
    // Filter posts by authorId on the client side
    return posts.filter((post: any) => String(post.authorId) === userId);
  },

  updatePost: async (postId: string, content: string) => {
    const response = await fetch(`${VITE_API_URL}/posts/${postId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error("Failed to update post");
    }

    return response.json();
  },

  register: async (
    username: string,
    email: string,
    password: string,
    bio?: string
  ) => {
    const response = await fetch(`${VITE_API_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, email, password, bio }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to register");
    }

    return response.json();
  },

  login: async (email: string, password: string) => {
    const response = await fetch(`${VITE_API_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Failed to login");
    }

    return response.json();
  },

  updateProfile: async (
    userId: string,
    data: { username?: string; email?: string; bio?: string }
  ) => {
    const response = await fetch(`${VITE_API_URL}/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error("Failed to update profile");
    }

    return response.json();
  },

  getUsers: async () => {
    const response = await fetch(`${VITE_API_URL}/users`);
    if (!response.ok) throw new Error("Failed to fetch users");

    return response.json();
  },

  getUser: async (userId: string) => {
    const response = await fetch(`${VITE_API_URL}/users/${userId}`);
    if (!response.ok) throw new Error("Failed to fetch user");

    return response.json();
  },

  createComment: async (text: string, authorId: number, postId: number) => {
    const response = await fetch(`${VITE_API_URL}/comments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text, authorId, postId }),
    });

    if (!response.ok) {
      throw new Error("Failed to create comment");
    }

    return response.json();
  },

  deleteComment: async (commentId: string) => {
    const response = await fetch(`${VITE_API_URL}/comments/${commentId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Failed to delete comment");
    }

    return response.json();
  },
};
