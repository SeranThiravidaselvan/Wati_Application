interface Author {
   id: number;
   name: string;
   enName: string;
}

interface Book {
   id: number;
   name: string;
   pictureUrl: string;
   rating: number;
   bookDuration: string;
   author: Author[];
}

export interface AudioBookQueryParams {
   GenreIds?: number[];
   AuthorIds?: number[];
   NarratorIds?: number[];
   BookSeriesIds?: number[];
   BookLanguageIds?: number[];
   ExceptGenreIds?: number[];
   ExceptAuthorIds?: number[];
   ExceptNarratorIds?: number[];
   ExceptBookSeriesIds?: number[];
   ExceptBookLanguageIds?: number[];
   LowerRating?: number;
   HighRating?: number;
   LowerDuration?: number;
   HighDuration?: number;
   Sort?: string;
   PageIndex?: number;
   PageSize?: number;
}

interface Author {
   id: number;
   name: string;
   enName: string;
}

interface AudioBook {
   id: number;
   name: string;
   pictureUrl: string;
   rating: number;
   bookDuration: string;
   author: Author[];
}

interface AudioBookPaginatedResponse {
   pageIndex: number;
   pageSize: number;
   count: number;
   data: AudioBook[];
}
