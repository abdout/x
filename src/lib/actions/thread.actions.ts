"use server";

import { revalidatePath } from "next/cache";
import { connectDB } from "../mongodb";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { IThread } from "@/components/x/model/thread";

interface CreateThreadParams {
  text: string;
  author: string;
  communityId: string | null;
  path: string;
}

/**
 * Fetch a thread by its ID
 */
export async function fetchThreadById(threadId: string): Promise<IThread | null> {
  try {
    await connectDB();

    // Fetch the thread and ensure it's returned as a plain object using .lean()
    const thread = await Thread.findById(threadId)
      .populate({
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "community",
        model: Community,
        select: "_id id name image",
      })
      .populate({
        path: "children",
        populate: [
          {
            path: "author",
            model: User,
            select: "_id id name parentId image",
          },
          {
            path: "children",
            model: Thread,
            populate: {
              path: "author",
              model: User,
              select: "_id id name parentId image",
            },
          },
        ],
      })
      .lean<IThread | null>(); // Ensure lean() and correct typing

    if (!thread) {
      throw new Error("Thread not found");
    }

    return thread;
  } catch (error) {
    console.error("Error fetching thread by ID:", error);
    throw error;
  }
}

/**
 * Fetch top-level threads with pagination
 */
export async function fetchPosts(
  pageNumber = 1,
  pageSize = 20
): Promise<{ posts: IThread[]; isNext: boolean }> {
  try {
    await connectDB();

    const skipAmount = (pageNumber - 1) * pageSize;

    const posts = await Thread.find({ parentId: { $in: [null, undefined] } })
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(pageSize)
      .populate("author community children")
      .lean<IThread[]>(); // Ensure that posts are typed as an array of IThread

    const totalPostsCount = await Thread.countDocuments({
      parentId: { $in: [null, undefined] },
    });

    const isNext = totalPostsCount > skipAmount + posts.length;

    return { posts, isNext };
  } catch (error) {
    console.error("Error fetching posts:", error);
    throw error;
  }
}

/**
 * Create a new thread
 */
export async function createThread({
  text,
  author,
  communityId,
  path,
}: CreateThreadParams): Promise<void> {
  try {
    await connectDB();

    let community = null;
    if (communityId) {
      community = await Community.findOne({ id: communityId }, { _id: 1 }).lean();
    }

    const createdThread = await Thread.create({
      text,
      author,
      community: community ? community._id : null,
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { threads: createdThread._id },
    });

    if (community) {
      // Update Community model
      await Community.findByIdAndUpdate(community._id, {
        $push: { threads: createdThread._id },
      });
    }

    revalidatePath(path);
  } catch (error: any) {
    console.error("Error creating thread:", error);
    throw new Error(`Failed to create thread: ${error.message}`);
  }
}

/**
 * Add a comment to an existing thread
 */
export async function addCommentToThread(
  threadId: string,
  commentText: string,
  userId: string,
  path: string
): Promise<void> {
  await connectDB();

  try {
    const originalThread = await Thread.findById(threadId).lean<IThread | null>();
    if (!originalThread) throw new Error("Thread not found");

    const commentThread = new Thread({
      text: commentText,
      author: userId,
      parentId: threadId,
    });

    const savedCommentThread = await commentThread.save();

    // Ensure children array exists before pushing
    originalThread.children = originalThread.children || [];
    originalThread.children.push(savedCommentThread._id as any);

    // Save the updated thread with the new comment
    await Thread.findByIdAndUpdate(threadId, { children: originalThread.children });

    revalidatePath(path);
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
}

/**
 * Delete a thread and its descendants
 */
async function fetchAllChildThreads(threadId: string): Promise<IThread[]> {
  const childThreads = await Thread.find({ parentId: threadId }).lean<IThread[]>();

  const descendantThreads: IThread[] = [];
  for (const childThread of childThreads) {
    const descendants = await fetchAllChildThreads(childThread._id as string);
    descendantThreads.push(childThread, ...descendants);
  }

  return descendantThreads;
}

export async function deleteThread(id: string, path: string): Promise<void> {
  try {
    await connectDB();

    // Find the thread to be deleted (the main thread)
    const mainThread = await Thread.findById(id)
      .populate("author community")
      .lean<IThread | null>();

    if (!mainThread) {
      throw new Error("Thread not found");
    }

    // Fetch all child threads and their descendants recursively
    const descendantThreads = await fetchAllChildThreads(id);

    // Get all descendant thread IDs including the main thread ID and child thread IDs
    const descendantThreadIds = [
      id,
      ...descendantThreads.map((thread) => thread._id as string),
    ];

    // Extract the authorIds and communityIds to update User and Community models respectively
    const uniqueAuthorIds = new Set<string>(
      [
        ...descendantThreads.map((thread) => thread.author?._id?.toString() as string),
        mainThread.author?._id?.toString() as string,
      ].filter((id) => id !== undefined)
    );

    const uniqueCommunityIds = new Set<string>(
      [
        ...descendantThreads.map((thread) => thread.community?._id?.toString() as string),
        mainThread.community?._id?.toString() as string,
      ].filter((id) => id !== undefined)
    );

    // Delete threads
    await Thread.deleteMany({ _id: { $in: descendantThreadIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    // Update Community model
    await Community.updateMany(
      { _id: { $in: Array.from(uniqueCommunityIds) } },
      { $pull: { threads: { $in: descendantThreadIds } } }
    );

    revalidatePath(path);
  } catch (error: any) {
    console.error("Error deleting thread:", error);
    throw new Error(`Failed to delete thread: ${error.message}`);
  }
}
