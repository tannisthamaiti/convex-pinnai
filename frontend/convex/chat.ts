import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const listMessages = query(async ({ db }) => {
  return await db.query("messages").order("desc").take(100);
});
export const sendMessage = mutation({
  args: {
    user: v.string(),
    body: v.string(),
  },
  handler: async (ctx, args) => {
    console.log("This TypeScript function is running on the server.");
    await ctx.db.insert("messages", {
      user: args.user,
      body: args.body,
    });
  },
});