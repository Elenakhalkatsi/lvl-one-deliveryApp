import { GetAll } from '../interface/get-all.interface';

export function escapeLikeString(raw: string): string {
  return raw.replace(/[\\%_]/g, '\\$&');
}

export function getAllQuery(queryBuilder, options: GetAll) {
  if (options.sortBy) {
    queryBuilder.orderBy(options.sortBy, options.sortDir);
  }
  if (options.searchBy) {
    const column = Object.keys(options.searchBy)[0];
    queryBuilder.andWhere(`${column} like :any`, {
      any: `%${escapeLikeString(options.searchBy[column])}%`,
    });
  }
  if (options.startDate && options.endDate) {
    queryBuilder.where(
      `date BETWEEN '${options.startDate}' AND '${options.endDate}'`,
    );
  }
  const limit = Math.min(options.limit, 25);
  if (options.limit) {
    queryBuilder.limit(limit);
  } else {
    queryBuilder.limit(25);
  }
  if (options.page) {
    const page = options.page - 1;
    queryBuilder.offset(page * limit);
  }
}
