import { NextResponse } from "next/server";
import { getUserById, addToWatchlist,removeFromWatchlist ,addInvestment, removeInvestment } from "@/lib/actions/user.actions"; // Adjust the path according to your project structure
import mongoose, { Mongoose, Schema } from "mongoose";

export async function POST(request) {
  console.log('inside test file');

  // Assuming you want to use a hardcoded clerkId and companyId for testing
  const clerkId = "user_2g30qZw3lkKOlnS953WKjADYzHS"; // This should be the clerkId you intend to use
  const companyId = '663669a3ad8256c2a41d4f89'; // This should be the companyId you intend to add to the watchlist
  const invested : AddInvestedStock =  {
      price: 100, // Example price
      numOfUnits: 50, // Example number of units
      companyTicker: 'APL', // Example company ticker
    };

  try {
    // const added = await addToWatchlist(clerkId, companyId);
    //   console.log('User added:', added);

    // const removed = await removeFromWatchlist(clerkId, companyId);
    //  console.log('User added:', removed);

// console.log("before creating investment")
//      const user_nvested = await addInvestment(clerkId, invested);
//      console.log('User invested:', user_nvested);
const stockId = '6637ef8081b4f0d3b76f17dc';
  // const stockId = new mongoose.Types.ObjectId('6637a39f85532cf8d2042ea4'); // Replace 'yourExampleStockIdHere' with an actual stock ID string

const user_remove_invest = await removeInvestment(clerkId,  stockId);
    return NextResponse.json("", { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    // Handle the error appropriately, e.g., return an error response
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  }
}
