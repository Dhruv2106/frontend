export interface User {
  id: number;
  email: string;
  name?: string;
  createdAt: string;
}

export interface AuthResponse {
  message: string;
  token: string;
  user: User;
}

export interface Link {
  id: number;
  shortCode: string;
  targetUrl: string;
  shortUrl: string;
  totalClicks: number;
  lastClickedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Analytics {
  totalClicks: number;
  uniqueVisitors: number;
  browserStats: { [key: string]: number };
  osStats: { [key: string]: number };
  countryStats: { [key: string]: number };
  recentClicks: ClickEvent[];
}

export interface ClickEvent {
  browser: string;
  os: string;
  device: string;
  country?: string;
  city?: string;
  referer?: string;
  clickedAt: string;
}

export interface LinkAnalytics {
  link: {
    id: number;
    shortCode: string;
    targetUrl: string;
    totalClicks: number;
  };
  analytics: Analytics;
}
