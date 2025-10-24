import type { Comment } from "./types";

export const mockComments: Comment[] = [
  {
    id: "comment_1",
    content: "Super artykuł! Właśnie się uczyłem hooks'ów i to bardzo pomogło",
    authorId: "user_2",
    postId: "post_1",
    createdAt: "2025-10-22T11:00:00Z",
  },
  {
    id: "comment_2",
    content:
      "Zgadzam się w 100%. Hooks to game changer dla React development'u",
    authorId: "user_4",
    postId: "post_1",
    createdAt: "2025-10-22T11:30:00Z",
  },
  {
    id: "comment_3",
    content:
      "Czy masz jakieś rekomendacje na custom hooks? Chciałbym nauczyć się ich pisać",
    authorId: "user_3",
    postId: "post_1",
    createdAt: "2025-10-22T12:00:00Z",
  },
  {
    id: "comment_4",
    content:
      "Świetny guide! Design system to najlepsze co mogliśmy zrobić dla naszego zespołu",
    authorId: "user_1",
    postId: "post_2",
    createdAt: "2025-10-21T15:00:00Z",
  },
  {
    id: "comment_5",
    content: "Jak radzisz sobie z versioning'iem design systemu?",
    authorId: "user_5",
    postId: "post_2",
    createdAt: "2025-10-21T15:30:00Z",
  },
  {
    id: "comment_6",
    content:
      "Post o TypeScript generics mi się bardzo spodobał! Czekam na więcej zaawansowanych tematów",
    authorId: "user_6",
    postId: "post_3",
    createdAt: "2025-10-20T10:15:00Z",
  },
];
