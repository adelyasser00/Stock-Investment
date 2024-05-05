"use server";

import { revalidatePath } from "next/cache";

import User from "@/lib/database/models/user.model";
import Post from "@/lib/database/models/post.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import { ObjectId, Schema } from "mongoose";
import Company from "@/lib/database/models/company.model";
import Stock from "@/lib/database/models/stock.model"
import mongoose from "mongoose";
/**
 * functionalities of user
 * 1- update/cretae/delete user
 * 
 * 2- add/remove to watchlist
 * 3- add/remove to invested
 * 4- follow/unfollow
 * 5- upvote/downvote a post
 * 6- search by category/ticker/name and enhance results by recommendation system
 * 7- talk to chatbot
 * 8- fetch user newsfeed/profile data
 * 
 **/
// CREATE
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();
    console.log("--- before creating a user")
    const newUser = await User.create(user);

    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getUserById(userId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId: userId });

    if (!user) throw new Error("User not found");

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
  try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });

    if (!updatedUser) throw new Error("User update failed");
    
    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase();

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    revalidatePath("/");

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
  } catch (error) {
    handleError(error);
  }
}

export async function addToWatchlist(clerkId: string, companyId: string) {
 try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      {clerkId:clerkId},
      {
        $push: { watchlist: companyId }
      },
      {new: true}
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return  JSON.parse(JSON.stringify(updatedUser));
 } catch (error) {
    handleError(error);
 }
}

export async function removeFromWatchlist(clerkId: string, companyId: string) {
 try {
    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate(
      {clerkId:clerkId},
      {
        $pull: { watchlist: companyId }
      },
      {new: true}
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

    return  JSON.parse(JSON.stringify(updatedUser));
 } catch (error) {
    handleError(error);
 }
}

export async function addInvestment(userClerkId: string, investment: AddInvestedStock) {
  try {
    await connectToDatabase(); 

    const user = await User.findOne({ clerkId : userClerkId });

    if (!user) {
      throw new Error('User not found');
    }

    const company_clerkId = await Company.findOne({ ticker: investment.companyTicker }).select('clerkId');

    if (!company_clerkId) {
      throw new Error('Company not found');
    }

    const newStock = new Stock({
     ...investment,
      investorClerkId: userClerkId,
      companyClerkId: company_clerkId.clerkId
    });

    await newStock.save(); 

    user.investedStocks.push(newStock._id);
    await user.save(); 

  } catch (error) {
    handleError(error); 
  }
}


export async function removeInvestment(userClerkId: string, stockId: string) {
  try {
    await connectToDatabase(); 

    const user = await User.findOne({ clerkId: userClerkId });

    const objectIdStockId = new mongoose.Types.ObjectId(stockId);

    const updatedUser = await User.findOneAndUpdate(
      { clerkId: userClerkId },
      {
        $pull: {
          investedStocks: objectIdStockId // Use the ObjectId directly
        }
      },
      {
        new: true
      }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }
    
    const deletedUser = await Stock.findByIdAndDelete(objectIdStockId);

  } catch (error) {
    handleError(error);
  }
}

export async function followCompany(clerkId: string,  companyId:string) {
  try {
    await connectToDatabase(); 

    const updatedUser = await User.findOneAndUpdate(
      {clerkId:clerkId},
      {
        $push: { followedCompanies: companyId }
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

     const updatedCompany = await Company.findOneAndUpdate(
      {clerkId:companyId},
      { 
        $push: { userFollowers: clerkId }
      },
      { new: true }
    );

    if (!updatedCompany) {
      throw new Error('Company not found');
    }

    console.log('Company followed successfully');
    return updatedUser;
 } catch (error) {
    handleError(error);
 }
}

export async function unfollowCompany(clerkId: string,  companyId:string) {
   try {
    await connectToDatabase(); 

    const updatedUser = await User.findOneAndUpdate(
      {clerkId:clerkId},
      {
        $pull: { followedCompanies: companyId }
      },
      { new: true }
    );

    if (!updatedUser) {
      throw new Error('User not found');
    }

     const updatedCompany = await Company.findOneAndUpdate(
      {clerkId:companyId},
      {
        $pull: {
          userFollowers: clerkId
        }
      },
      { new: true }
    );

    if (!updatedCompany) {
      throw new Error('Company not found');
    }

    return updatedUser;
 } catch (error) {
    handleError(error); // Implement your error handling logic here
 }
}

export async function upvotepost(clerkId: string,  postId:Schema.Types.ObjectId) {
  try {
    await connectToDatabase(); // Ensure this function connects to your MongoDB database

    // Use findByIdAndUpdate to increment the upvotes of the post
    const updatedPost = await Post.findOneAndUpdate(
      postId,
      {
        $inc: {
          upvotes: 1
        }
      },
      {
        new: true // This option returns the updated document
      }
    );

    if (!updatedPost) {
      throw new Error('Post not found');
    }

    return updatedPost;
 } catch (error) {
    handleError(error); // Implement your error handling logic here
 }
}

export async function downvotePost(clerkId: string,  postId:Schema.Types.ObjectId) {
  try {
    await connectToDatabase(); // Ensure this function connects to your MongoDB database

    // Use findByIdAndUpdate to increment the downvotes of the post
    const updatedPost = await Post.findOneAndUpdate(
      postId,
      {
        $inc: {
          downvotes: 1
        }
      },
      {
        new: true // This option returns the updated document
      }
    );

    if (!updatedPost) {
      throw new Error('Post not found');
    }

    return updatedPost;
 } catch (error) {
    handleError(error); // Implement your error handling logic here
 }
}

export async function search(clerkId: string,  postId:Schema.Types.ObjectId) {
  try {
    
  } catch (error) {
    handleError(error);
  }
}

export async function chatbot(clerkId: string,  postId:Schema.Types.ObjectId) {
  try {
    
  } catch (error) {
    handleError(error);
  }
}

// // USE CREDITS
// export async function updateCredits(userId: string, creditFee: number) {
//   try {
//     await connectToDatabase();

//     const updatedUserCredits = await User.findOneAndUpdate(
//       { _id: userId },
//       { $inc: { creditBalance: creditFee }},
//       { new: true }
//     )

//     if(!updatedUserCredits) throw new Error("User credits update failed");

//     return JSON.parse(JSON.stringify(updatedUserCredits));
//   } catch (error) {
//     handleError(error);
//   }
// }
