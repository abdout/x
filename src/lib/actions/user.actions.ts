"use server";

import { FilterQuery, SortOrder } from "mongoose";
import User from "../models/user.model";
import Thread from "../models/thread.model";
import Community from "../models/community.model";
import { connectDB } from "../mongodb";
import { revalidatePath } from "next/cache";

/**
 * Fetch a single user by ID
 */
export async function fetchUser(userId: string) {
  try {
    await connectDB();
    const user = await User.findOne({ id: userId }).populate("communities");
    return user;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
}

/**
 * Update user profile
 */
export async function updateUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: {
  userId: string;
  bio: string;
  name: string;
  username: string;
  image: string;
  path: string;
}) {
  try {
    await connectDB();
    await User.findOneAndUpdate(
      { id: userId },
      { username: username.toLowerCase(), name, bio, image, onboarded: true },
      { upsert: true }
    );
    if (path === "/profile/edit") revalidatePath(path);
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
}

/**
 * Fetch user posts
 */
export async function fetchUserPosts(userId: string) {
  try {
    await connectDB();
    const userThreads = await User.findOne({ id: userId }).populate("threads");
    return userThreads;
  } catch (error) {
    console.error("Error fetching user threads:", error);
    throw error;
  }
}

/**
 * Fetch users with pagination
 */
export async function fetchUsers({
  userId,
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  userId: string;
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    await connectDB();
    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof User> = { id: { $ne: userId } };
    if (searchString.trim() !== "") {
      query.$or = [{ username: { $regex: regex } }, { name: { $regex: regex } }];
    }

    const users = await User.find(query).sort({ createdAt: sortBy }).skip(skipAmount).limit(pageSize);
    const totalUsersCount = await User.countDocuments(query);
    const isNext = totalUsersCount > skipAmount + users.length;

    return { users, isNext };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

/**
 * Fetch activity (replies) for a user
 */
export async function getActivity(userId: string) {
  try {
    await connectDB();
    const userThreads = await Thread.find({ author: userId });
    const childThreadIds = userThreads.flatMap(thread => thread.children);

    const replies = await Thread.find({ _id: { $in: childThreadIds }, author: { $ne: userId } }).populate("author");
    return replies;
  } catch (error) {
    console.error("Error fetching replies:", error);
    throw error;
  }
}
