export interface tanstackTablePropTypes {
  isPaginatedData?: boolean;
  paginationDetails?: any;
  columns: any;
  data: any[];
  loading: boolean;
  getData: ({ page, limit, sort_by, sort_type }: Partial<any>) => void;
  removeSortingForColumnIds?: string[];
}
