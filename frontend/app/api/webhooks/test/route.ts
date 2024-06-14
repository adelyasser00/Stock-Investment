import { NextResponse } from "next/server";
import { getUserById, addToWatchlist,removeFromWatchlist ,addInvestment, removeInvestment } from "@/lib/actions/user.actions"; // Adjust the path according to your project structure
import mongoose, { Mongoose, Schema } from "mongoose";
import {savePostToUser} from "@/lib/actions/user.actions"

export async function POST(request,res) {
  console.log(request);

  try {

  // insert code here
    const postData: PostParams = {
    title: "Sample News Article",
    content: "This is a sample news article content.",
    image: "url-to-image.jpg",
    link: "http://example.com/article"
  };

  const userId = "user_2g68Nh5cYus1MDTKiDb6gNxxas8"

   const savedPost = await savePostToUser(postData, userId);

console.log("all wenr wel *******")
console.log(savedPost)
    // Respond with the result
    return NextResponse.json("", { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}
