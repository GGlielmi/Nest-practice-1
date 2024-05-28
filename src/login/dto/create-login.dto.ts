export class CreateLoginDto {
  credentials: [username: string, password: string];
  userAgent: string;
  ipAddress: string;
  failed: boolean;
}
