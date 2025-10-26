import express from "express";
import { db } from "../db/client";
import { posts } from "../db/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// GET /api/posts - Fetch all posts
router.get("/", async (req, res) => {
  try {
    const allPosts = await db.query.posts.findMany({
      with: {
        author: true,
        comments: {
          with: {
            author: true,
          },
        },
      },
      orderBy: (posts, { desc }) => [desc(posts.createdAt)],
    });

    res.json(allPosts);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch posts" });
  }
});

// GET /api/posts/:id - Fetch one post by ID
router.get("/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const post = await db.query.posts.findFirst({
      where: eq(posts.id, postId),
      with: {
        author: true,
        comments: {
          with: {
            author: true,
          },
        },
      },
    });

    res.json(post);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch post by ID" });
  }
});

// POST /api/posts - Create a new post
router.post("/", async (req, res) => {
  try {
    const { content, authorId } = req.body;

    if (!content || !authorId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newPost = await db
      .insert(posts)
      .values({ content, authorId })
      .returning();

    res.status(201).json(newPost[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create a new post" });
  }
});

// PUT /api/posts/:id - Update post
router.put("/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    const { content } = req.body;

    if (!content) {
      return res.status(400).json({ error: "Content is required" });
    }

    const updatedPost = await db
      .update(posts)
      .set({
        content,
        updatedAt: new Date()
      })
      .where(eq(posts.id, postId))
      .returning();

    if (updatedPost.length === 0) {
      return res.status(404).json({ error: "Post not found" });
    }

    res.json(updatedPost[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update post" });
  }
});

// DELETE /api/posts/:id - Delete post by ID
router.delete("/:id", async (req, res) => {
  try {
    const postId = parseInt(req.params.id);
    await db.delete(posts).where(eq(posts.id, postId));

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete post by ID" });
  }
});

export default router;
