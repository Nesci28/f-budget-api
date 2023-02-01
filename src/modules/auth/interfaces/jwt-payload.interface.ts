import { UserRole } from "@yest/yest-stats-api-typescript-fetch";

export interface JwtPayload {
  userId: string;
  role: UserRole;
}
