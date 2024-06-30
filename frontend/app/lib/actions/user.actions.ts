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
import {extractTickersFromFile} from "@/lib/recommsys/helper";
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
    // handleError(error);
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
        { $addToSet: { watchlist: companyId } }, // Using $addToSet to avoid duplicates
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
export async function getWatchlist(clerkId){
    try{
       await connectToDatabase()
       const user = await User.findOne({clerkId:clerkId})
        if (!user) {
            throw new Error('User not found');
        }
        return await Company.find({
            '_id': { $in: user.watchlist }  // assuming savedlist is an array of ObjectIds
        }).lean();
    }  catch (error) {
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
            companyClerkId: company_clerkId.clerkId,
            date: investment.date,
            isSell: investment.isSell
        });

        await newStock.save();

        user.investedStocks.push(newStock._id);
        await user.save();

    } catch (error) {
        handleError(error);
    }
}
export async function getInvestments(userClerkId: string) {
    try {
        await connectToDatabase();
        const user = await User.findOne({ clerkId: userClerkId });

        if (!user) {
            throw new Error('User not found');
        }

        // Fetching stocks first
        const stocks = await Stock.find({
            '_id': { $in: user.investedStocks }
        }).lean().exec(); // Ensuring to resolve the promise

        // Assuming each stock has a companyClerkId field and you need to fetch related company details
        const companyIds = stocks.map(stock => stock.companyClerkId);
        const companies = await Company.find({
            'clerkId': { $in: companyIds }
        }).lean().exec(); // Fetching all companies at once

        // Enhancing stocks with company details
        const enhancedStocks = stocks.map(stock => {
            const companyDetails = companies.find(company => company.clerkId === stock.companyClerkId);
            return { ...stock, companyDetails };
        });

        return enhancedStocks;

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
export async function getWatchlistPosts(companyIds: string[]) {
    try {
        await connectToDatabase();
        const watchlistPosts = await Post.find({
            companyClerkId: { $in: companyIds }  // Use $in to match any of the company IDs
        });

        if (!watchlistPosts.length) {  // Checking if the array is empty
            throw new Error('No posts found for the given company IDs.');
        }

        return watchlistPosts;
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

export async function search(queryObj:SearchParamProps) {
    try {
        // Connect to the database if not already connected
        await mongoose.connect(process.env.MONGODB_URI);

        // Build a query based on the input object
        const query:CompanyQuery = {};
        if (queryObj.companyName) query.companyName = new RegExp(queryObj.companyName, 'i');
        if (queryObj.clerkId) query.clerkId = queryObj.clerkId;
        if (queryObj.email) query.email = queryObj.email;
        if (queryObj.ticker) query.ticker = queryObj.ticker;

        // Full-text search handling
        if (queryObj.searchText) {
            query.$text = { $search: queryObj.searchText };
        }

        const page = parseInt(queryObj.page ? queryObj.page.toString() : '1');
        const limit = parseInt(queryObj.limit ? queryObj.limit.toString() : '10');

        // Define the sort order based on the tickers array
        // const tickers = [
        //     'SWDY', 'EAST', 'POUL',
        //     'EMFD', 'ISPH', 'SKPC',
        //     'ALCN', 'ETEL', 'ESRS',
        //     'AMOC', 'PHDC', 'ACGC',
        //     'ATQA', 'HRHO', 'KABO',
        //     'ABUK', 'TMGH', 'FWRY',
        //     'EKHO'
        // ];
        const tickers = await extractTickersFromFile();

        // Create a lookup object to quickly find the index of each ticker
        const tickerOrder = tickers.reduce((acc, ticker, index) => {
            acc[ticker] = index;
            return acc;
        }, {});

        // Use aggregation to sort based on the custom order
        const results = await Company.aggregate([
            { $match: query },
            { $addFields: { sortOrder: { $indexOfArray: [tickers, "$ticker"] } } },
            { $sort: { sortOrder: 1 } },
            { $skip: limit * (page - 1) },
            { $limit: limit },
            { $project: { sortOrder: 0 } } // Exclude the sortOrder field from the final output
        ]).exec();

        // Count total documents to calculate total pages
        const totalCount = await Company.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        return {
            data: results,
            currentPage: page,
            totalPages,
            totalCount
        };
    } catch (error) {
        console.error('Error searching companies:', error);
        throw error;
    }
}

export async function chatbot(clerkId: string,  postId:Schema.Types.ObjectId) {
  try {
    
  } catch (error) {
    handleError(error);
  }
}

export async function saveWatchlistPostToUser(postId, userId) {
    console.log("moved to actions")
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId : userId });
        if (!user) {
            throw new Error('User not found');
        }
        console.log("saving post of watchlist")
        const objPostId = new mongoose.Types.ObjectId(postId)
        console.log(objPostId)
        user.savedlist.push(objPostId)
        await user.save();

        // return savedPost;
    } catch (error) {
        console.error('Failed to save post or update user:', error);
        throw error;
    }
}
export async function savePostToUser(postData: PostParams, userId) {
  console.log("moved to actions")
  try {
    await connectToDatabase(); 

    const user = await User.findOne({ clerkId : userId });
    if (!user) {
      throw new Error('User not found');
    }
        const newPost = new Post({
            title: postData.title,
            content: postData.content,
            contentSnippet: postData.contentSnippet,
            image: postData.image,
            link: postData.link
        });

        // Save the new post to the database.
        const savedPost = await newPost.save();

        // await savedPost.save();
        console.log(savedPost._id);
        user.savedlist.push(savedPost._id);

    await user.save(); 

    // return savedPost;
  } catch (error) {
    console.error('Failed to save post or update user:', error);
    throw error;
  }
}

export async function getSavedPosts(userId) {
    console.log("moved to actions")
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId : userId });
        if (!user) {
            throw new Error('User not found');
        }
        return await Post.find({
            '_id': { $in: user.savedlist }  // assuming savedlist is an array of ObjectIds
        }).lean();  // Using lean to get plain JavaScript objects



    } catch (error) {
        console.error('Failed to save post or update user:', error);
        throw error;
    }
}
export async function removeSavedPost(postId: string, userId: string) {
    console.log("Starting to remove post from saved list");
    try {
        await connectToDatabase();

        const user = await User.findOne({ clerkId: userId });
        if (!user) {
            throw new Error('User not found');
        }

        // Remove the post ID from the user's savedlist
        const index = user.savedlist.indexOf(postId);
        if (index > -1) {
            user.savedlist.splice(index, 1);  // Remove the post ID if it exists
            await user.save();  // Save the updated user document
            console.log("Post removed from saved list");
        } else {
            console.log("Post not found in user's saved list");
            throw new Error('Post not found in saved list');
        }

        // Optionally, you could also delete the post from the database if needed
        // const deletedPost = await Post.findByIdAndRemove(postId);

        return { success: true, message: "Post removed successfully from saved list" };
    } catch (error) {
        console.error('Failed to remove post or update user:', error);
        throw error;
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
