export interface Event {
  id: number;
  title: string;
  description: string;
  location: string;
  date: string;
  created_at: string;
}

export interface Registration {
  id: number;
  event_id: number;
  name: string;
  email: string;
  created_at: string;
}

export interface EventFilters {
  search?: string;
  location?: string;
  date_from?: string;
  date_to?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface EventsResponse {
  events: Event[];
  total: number;
  page: number;
  totalPages: number;
}