import { Injectable } from '@nestjs/common';

@Injectable()
export class PaginationService {
  paginate(list: any[], page: number = 1, pageSize: number = 10): any[] {
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;

    const results = list.slice(startIndex, endIndex);

    return results;
  }

  generatePaginationResponse(list: any[], total: number, page: number, pageSize: number): any {
    const totalPages = Math.ceil(total / pageSize);

    return {
      list,
      total,
      page,
      pageSize,
      totalPages,
    };
  }
}
