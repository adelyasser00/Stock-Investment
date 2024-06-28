"use server";

import { revalidatePath } from "next/cache";

import Company from "../database/models/company.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

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

    return JSON.parse(JSON.stringify(company));
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
    
    return JSON.parse(JSON.stringify(updatedCompany));
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

export async function createPost(authorId: string, postParams: PostParams) {
    try {
        await connectToDatabase();

        const newPost = new Post({
            author: authorId,
            title: postParams.title,
            content: postParams.content,
            contentSnippet: postParams.contentSnippet,
            image: postParams.image,
            link: postParams.link,
            upvotes: 0, // Default value
            downvotes: 0 // Default value
        });

        await newPost.save();
        return newPost;
    } catch (error) {
        console.error('Error creating post:', error);
        throw new Error('Could not create post');
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
