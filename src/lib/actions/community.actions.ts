"use server";

import { FilterQuery, SortOrder } from "mongoose";
import Community from "../models/community.model";
import Thread from "../models/thread.model";
import User from "../models/user.model";
import { connectDB } from "../mongodb";

/**
 * Create a new community and associate it with a user
 */
export async function createCommunity(
  id: string,
  name: string,
  username: string,
  image: string,
  bio: string,
  createdById: string
) {
  try {
    await connectDB();

    // Find the user by their ID
    const user = await User.findOne({ id: createdById });
    if (!user) throw new Error("User not found");

    // Create a new community
    const newCommunity = new Community({
      id,
      name,
      username,
      image,
      bio,
      createdBy: user._id,
    });

    const createdCommunity = await newCommunity.save();

    // Update user to add the created community
    user.communities.push(createdCommunity._id);
    await user.save();

    return createdCommunity;
  } catch (error) {
    console.error("Error creating community:", error);
    throw error;
  }
}

/**
 * Fetch details of a community
 */
export async function fetchCommunityDetails(id: string) {
  try {
    await connectDB();

    const communityDetails = await Community.findOne({ id }).populate([
      "createdBy",
      {
        path: "members",
        model: User,
        select: "name username image _id id",
      },
    ]);

    return communityDetails;
  } catch (error) {
    console.error("Error fetching community details:", error);
    throw error;
  }
}

/**
 * Fetch posts from a specific community
 */
export async function fetchCommunityPosts(id: string) {
  try {
    await connectDB();

    const communityPosts = await Community.findById(id).populate({
      path: "threads",
      model: Thread,
      populate: [
        {
          path: "author",
          model: User,
          select: "name image id",
        },
        {
          path: "children",
          model: Thread,
          populate: {
            path: "author",
            model: User,
            select: "image _id",
          },
        },
      ],
    });

    return communityPosts;
  } catch (error) {
    console.error("Error fetching community posts:", error);
    throw error;
  }
}

/**
 * Fetch a list of communities based on search parameters
 */
export async function fetchCommunities({
  searchString = "",
  pageNumber = 1,
  pageSize = 20,
  sortBy = "desc",
}: {
  searchString?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: SortOrder;
}) {
  try {
    await connectDB();

    const skipAmount = (pageNumber - 1) * pageSize;
    const regex = new RegExp(searchString, "i");

    const query: FilterQuery<typeof Community> = {};

    if (searchString.trim() !== "") {
      query.$or = [
        { username: { $regex: regex } },
        { name: { $regex: regex } },
      ];
    }

    const sortOptions = { createdAt: sortBy };

    const communitiesQuery = Community.find(query)
      .sort(sortOptions)
      .skip(skipAmount)
      .limit(pageSize)
      .populate("members");

    const totalCommunitiesCount = await Community.countDocuments(query);
    const communities = await communitiesQuery.exec();
    const isNext = totalCommunitiesCount > skipAmount + communities.length;

    return { communities, isNext };
  } catch (error) {
    console.error("Error fetching communities:", error);
    throw error;
  }
}

/**
 * Add a member to a community
 */
export async function addMemberToCommunity(communityId: string, memberId: string) {
  try {
    await connectDB();

    const community = await Community.findOne({ id: communityId });
    if (!community) throw new Error("Community not found");

    const user = await User.findOne({ id: memberId });
    if (!user) throw new Error("User not found");

    if (community.members.includes(user._id)) {
      throw new Error("User is already a member of the community");
    }

    // Add the user to the community and update user
    community.members.push(user._id);
    await community.save();

    user.communities.push(community._id);
    await user.save();

    return community;
  } catch (error) {
    console.error("Error adding member to community:", error);
    throw error;
  }
}

/**
 * Remove a user from a community
 */
export async function removeUserFromCommunity(userId: string, communityId: string) {
  try {
    await connectDB();

    const userIdObject = await User.findOne({ id: userId }, { _id: 1 });
    const communityIdObject = await Community.findOne({ id: communityId }, { _id: 1 });

    if (!userIdObject) throw new Error("User not found");
    if (!communityIdObject) throw new Error("Community not found");

    await Community.updateOne({ _id: communityIdObject._id }, { $pull: { members: userIdObject._id } });
    await User.updateOne({ _id: userIdObject._id }, { $pull: { communities: communityIdObject._id } });

    return { success: true };
  } catch (error) {
    console.error("Error removing user from community:", error);
    throw error;
  }
}

/**
 * Update community information
 */
export async function updateCommunityInfo(communityId: string, name: string, username: string, image: string) {
  try {
    await connectDB();

    const updatedCommunity = await Community.findOneAndUpdate({ id: communityId }, { name, username, image }, { new: true });
    if (!updatedCommunity) throw new Error("Community not found");

    return updatedCommunity;
  } catch (error) {
    console.error("Error updating community information:", error);
    throw error;
  }
}

/**
 * Delete a community and all its associated threads
 */
export async function deleteCommunity(communityId: string) {
  try {
    await connectDB();

    const deletedCommunity = await Community.findOneAndDelete({ id: communityId });
    if (!deletedCommunity) throw new Error("Community not found");

    await Thread.deleteMany({ community: communityId });

    const communityUsers = await User.find({ communities: communityId });
    const updateUserPromises = communityUsers.map(user => {
      user.communities.pull(communityId);
      return user.save();
    });

    await Promise.all(updateUserPromises);

    return deletedCommunity;
  } catch (error) {
    console.error("Error deleting community: ", error);
    throw error;
  }
}
