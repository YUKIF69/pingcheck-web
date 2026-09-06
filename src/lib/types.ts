// Монітор як він приходить з API
export interface Monitor {
  id: string;
  name: string;
  url: string;
  intervalMinutes: number;
  isActive: boolean;
  isPublic: boolean;
  slug: string | null;
  createdAt: string;
  pingLogs: { isUp: boolean; responseMs: number; checkedAt: string }[];
}

// Результат одного пінгу
export interface PingLog {
  id: string;
  monitorId: string;
  statusCode: number | null;
  responseMs: number;
  isUp: boolean;
  checkedAt: string;
}

// Відповідь після логіну/реєстрації
export interface AuthResponse {
  access_token: string;
}
