import express, { Router } from "express";
import { db } from "../db/client";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router: Router = express.Router();

// GET /api/users - Get all registered users
router.get("/", async (_req, res) => {
  try {
    const allUsers = await db.query.users.findMany({
      orderBy: (users, { desc }) => [desc(users.createdAt)],
    });

    // Remove passwords from all users
    const usersWithoutPasswords = allUsers.map(
      ({ password: _, ...user }) => user
    );

    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch users" });
  }
});

// GET - /api/users/:id - Fetch user with posts
router.get("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = await db.query.users.findFirst({
      where: eq(users.id, userId),
      with: {
        posts: {
          with: {
            comments: true,
          },
        },
        comments: true,
      },
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't send password to client
    const { password: _, ...userWithoutPassword } = user;

    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch user with posts" });
  }
});

// PUT /api/users/:id - Update user profile
router.put("/:id", async (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const { username, email, bio } = req.body;

    const updateData: any = {};
    if (username) updateData.username = username;
    if (email) updateData.email = email;
    if (bio !== undefined) updateData.bio = bio;

    const updatedUser = await db
      .update(users)
      .set(updateData)
      .where(eq(users.id, userId))
      .returning();

    if (updatedUser.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    // Don't send password to client
    const { password: _, ...userWithoutPassword } = updatedUser[0];

    res.json(userWithoutPassword);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to update user profile" });
  }
});

export default router;
