/* eslint-disable no-unused-vars */

// ====== USER PARAMS
declare type CreateUserParams = {
  clerkId: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
  photo: string;
};

declare type UpdateUserParams = {
  firstName: string;
  lastName: string;
  username: string;
};

declare type AddInvestedStock = {
  price: Number;
  numOfUnits: Number;
  companyTicker: string;
}

// ====== COMPANY PARAMS
declare type CreateCompanyParams = {
  companyName: string;
  clerkId: string;
  email: string;
  description:string;
  ticker:string;
};

declare type UpdateCompanyParams = {
  companyName: string;
  description:string;
  ticker:string;
};

// ====== URL QUERY PARAMS
declare type FormUrlQueryParams = {
  searchParams: string;
  key: string;
  value: string | number | null;
};

declare type UrlQueryParams = {
  params: string;
  key: string;
  value: string | null;
};

declare type RemoveUrlQueryParams = {
  searchParams: string;
  keysToRemove: string[];
};

declare type SearchParamProps = {
  companyName?: string;  // Optional, search by company name, supports partial matches
  clerkId?: string;      // Optional, search by clerk ID
  email?: string;        // Optional, search by email
  ticker?: string;       // Optional, search by ticker symbol
  searchText?: string;   // Optional, for full-text search on indexed fields like description and article
  page?: string| number;         // Optional, for specifying the page number in pagination
  limit?: string | number;         // Optional, for specifying the number of items per page
};

declare type CompanyQuery = {
    companyName?: RegExp;
    clerkId?: string;
    email?: string;
    ticker?: string;
    $text?: { $search: string };
};


// ====== POST PARAMS
declare type PostParams = {
  title: string,
  content: string,
  image: string,
  link: string
}
