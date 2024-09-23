
import { Dispatch, SetStateAction } from "react";
import { FileData } from "./files";

export interface tanstackTablePropTypes {
  isPaginatedData?: boolean;
  paginationDetails?: any;
  columns: any;
  data: any[];
  loading: boolean;
  getData:   ({
    page,
    limit,
    sort_by,
    sort_type,
    
   }: Partial<FileData>) => void;
  removeSortingForColumnIds?: string[];
}

// export interface paginationPropTypes {
//   paginationDetails: any;
//   capturePageNum: (value: number) => void;
//   captureRowPerItems: (value: number) => void;
//   limitOptionsFromProps?: { tite: string; value: number }[] | any;
//   limitValue?: number;
// }