import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "./db/client";
import { users, posts, comments } from "./db/schema";

async function seed() {
  try {
    console.log("Starting seed...");

    // Create a test user
    const [user] = await db
      .insert(users)
      .values({
        username: "johndoe",
        email: "john.doe@example.com",
        password: "hashed_password_123",
        bio: "I'm a test user who loves sharing thoughts!",
      })
      .returning();

    console.log("Created user:", user);

    // Create some posts
    const [post1] = await db
      .insert(posts)
      .values({
        content: "Just had an amazing coffee! ☕",
        authorId: user.id,
      })
      .returning();

    const [post2] = await db
      .insert(posts)
      .values({
        content: "Learning TypeScript and Drizzle ORM. This is pretty cool!",
        authorId: user.id,
      })
      .returning();

    const [post3] = await db
      .insert(posts)
      .values({
        content: "Anyone else excited about the new features in Express 5?",
        authorId: user.id,
      })
      .returning();

    console.log("Created posts:", [post1, post2, post3]);

    // Create some comments
    const [comment1] = await db
      .insert(comments)
      .values({
        text: "That sounds delicious! Where did you get it?",
        authorId: user.id,
        postId: post1.id,
      })
      .returning();

    const [comment2] = await db
      .insert(comments)
      .values({
        text: "Drizzle is amazing! The type safety is unbeatable.",
        authorId: user.id,
        postId: post2.id,
      })
      .returning();

    const [comment3] = await db
      .insert(comments)
      .values({
        text: "Yes! The async local storage support is a game changer.",
        authorId: user.id,
        postId: post3.id,
      })
      .returning();

    console.log("Created comments:", [comment1, comment2, comment3]);

    console.log("✓ Seed completed successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error);
    process.exit(1);
  }
}

seed();
