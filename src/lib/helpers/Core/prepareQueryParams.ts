// import { apiPropsForQuaryParams } from "@/lib/interfaces/typeInterfaces/apiProps";
export interface apiPropsForQuaryParams {
  page?: string | number;
  limit?: string | number;
  userId?: string;
  UserId?: string;
  search_string?: string;
  SearchName?: string;
  searchString?: string;
  sort_by?: string;
  sort_type?: string;
  month?: string;
  salesRepId?: string | number;
  year: string | number;
  approved: string;
  category: string;
  specialization: string;
  sales_rep_id: string;
  from_date: string;
  to_date: string;
  orderBy: string;
  orderType: string;
  searchValue: string;
  date_from: string;
  date_to: string;
}

export const prepareQueryParams = (params: Partial<apiPropsForQuaryParams>) => {
  let queryParams: any = { page: params.page, limit: params.limit };
  Object.entries(params).map(([key, value]: any) => {
    if (value) {
      if (key == "search_string") {
        queryParams[key] = encodeURIComponent(value);
      } else if (key == "SearchName") {
        queryParams[key] = encodeURIComponent(value);
      } else if (key == "searchString") {
        queryParams[key] = encodeURIComponent(value);
      } else if (key == "orderBy") {
        queryParams["sort_by"] = value;
      } else if (key == "orderType") {
        queryParams["sort_type"] = value;
      } else {
        queryParams[key] = value;
      }
    }
  });

  return queryParams;
};
