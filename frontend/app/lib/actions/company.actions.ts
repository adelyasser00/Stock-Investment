"use server";

import { revalidatePath } from "next/cache";

import Company from "../database/models/company.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";
import Stock from "@/lib/database/models/stock.model";
import User from "@/lib/database/models/user.model"

/**
 * functionalities of company
 * 1- update/cretae/delete company
 * 
 * 2- create a post
 * 3- search by category/ticker/name 
 * 
 **/

// CREATE
export async function createCompany(company: CreateCompanyParams) {
  try {
    await connectToDatabase();

    const newCompnay = await Company.create(company);

    return JSON.parse(JSON.stringify(newCompnay));
  } catch (error) {
    handleError(error);
  }
}

// READ
export async function getCompanyById(companyId: string) {
  try {
    await connectToDatabase();

    const company = await Company.findOne({ clerkId: companyId });

    if (!company) throw new Error("Company not found");

    return company;
  } catch (error) {
    handleError(error);
  }
}

// UPDATE
export async function updateCompany(clerkId: string, company: UpdateCompanyParams) {
  try {
    await connectToDatabase();

    const updatedCompany = await Company.findOneAndUpdate({ clerkId }, company, {
      new: true,
    });

    if (!updatedCompany) throw new Error("Company update failed");
    
    return updatedCompany;
  } catch (error) {
    handleError(error);
  }
}

// DELETE
export async function deleteCompany(clerkId: string) {
  try {
    await connectToDatabase();

    // Find company to delete
    const companyToDelete = await Company.findOne({ clerkId });

    if (!companyToDelete) {
      throw new Error("Company not found");
    }

    // Delete company
    const deletedCompany = await Company.findByIdAndDelete(companyToDelete._id);
    revalidatePath("/");

    return deletedCompany ? JSON.parse(JSON.stringify(deletedCompany)) : null;
  } catch (error) {
    handleError(error);
  }
}
export async function fetchInvestmentsByCompanyClerkId(clerkId: string) {
  try {
    await connectToDatabase();

    // Find the user by clerkId
    const user = await User.findOne({ clerkId: clerkId });

    if (!user) {
      throw new Error('User not found');
    }

    // Extract companyClerkId from the user's record
    const companyClerkIds = user.companyClerkId;

    if (!companyClerkIds || companyClerkIds.length === 0) {
      throw new Error('No companyClerkId found for the user');
    }

    // Find the stocks with companyClerkId equal to any of the user's companyClerkIds
    const investments = await Stock.find({ companyClerkId: { $in: companyClerkIds } })
        .sort({ date: 1 });  // Use -1 for descending order, or 1 for ascending order

    return investments;
  } catch (error) {
    console.error('Error fetching investments:', error);
    throw new Error('Could not fetch investments');
  }
}

// // USE CREDITS
// export async function updateCredits(companyId: string, creditFee: number) {
//   try {
//     await connectToDatabase();

//     const updatedCompanyCredits = await Company.findOneAndUpdate(
//       { _id: companyId },
//       { $inc: { creditBalance: creditFee }},
//       { new: true }
//     )

//     if(!updatedCompanyCredits) throw new Error("Company credits update failed");

//     return JSON.parse(JSON.stringify(updatedCompanyCredits));
//   } catch (error) {
//     handleError(error);
//   }
// }
