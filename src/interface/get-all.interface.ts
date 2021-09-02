import { SortDir } from '../enum/sort-dir.enum';

export interface GetAll {
  searchBy?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDir?: SortDir;
  startDate?: string;
  endDate?: string;
}
