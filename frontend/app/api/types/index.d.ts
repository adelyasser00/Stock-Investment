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
  params: { id: string; type: TransformationTypeKey };
  searchParams: { [key: string]: string | string[] | undefined };
};
