import express from "express";
import { db } from "../db/client";
import { comments } from "../db/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// POST - /api/comments - Add a new comment
router.post("/", async (req, res) => {
  try {
    const { text, authorId, postId } = req.body;

    if (!text || !authorId || !postId) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newComment = await db
      .insert(comments)
      .values({ text, authorId, postId })
      .returning();

    res.status(201).json(newComment[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to create comment" });
  }
});

// DELETE - /api/comments/:id - Delete comment
router.delete("/:id", async (req, res) => {
  try {
    const commentId = parseInt(req.params.id);
    await db.delete(comments).where(eq(comments.id, commentId));

    res.json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to delete comment" });
  }
});

export default router;
