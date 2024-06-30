import { NextResponse } from "next/server";
import { getUserById, addToWatchlist,removeFromWatchlist ,addInvestment, removeInvestment } from "@/lib/actions/user.actions"; // Adjust the path according to your project structure
import mongoose, { Mongoose, Schema } from "mongoose";
import {savePostToUser, getWatchlistPosts} from "@/lib/actions/user.actions"
import {sendRequest} from "@/lib/chatbot/helper"
export async function POST(request,res) {
  console.log("here");
// Example usage:

// sendRequest('Financial Headline Classification', 'Apple released new iphone')
//   .then(response => console.log(response))
//   .catch(error => console.error(error));
  try {
    const companyIds= ["CL123471"]
    const result = await getWatchlistPosts(companyIds)
  // insert code here
  //   const postData: PostParams = {
  //   title: "Sample News Article",
  //   content: "This is a sample news article content.",
  //   image: "url-to-image.jpg",
  //   link: "http://example.com/article"
      console.log(result)
      return NextResponse.json("", { status: 200 });
  // };

//   const userId = "user_2g68Nh5cYus1MDTKiDb6gNxxas8"

//    const savedPost = await savePostToUser(postData, userId);

// console.log("all wenr wel *******")
// console.log(savedPost)
//     // Respond with the result

  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}
