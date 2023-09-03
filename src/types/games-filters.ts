export interface GamesFilters {
  fieldPath: string;
  operator: '<' | '<=' | '==' | '!=' | '>=' | '>' | 'array-contains' | 'in' | 'array-contains-any' | 'not-in';
  value: string;
  sortBy?: {
    fieldPath: string;
    value: 'asc' | 'desc';
  };
}
