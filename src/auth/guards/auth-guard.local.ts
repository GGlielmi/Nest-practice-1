import { AuthGuard } from '@nestjs/passport';

export class AuthGuardLocal extends AuthGuard('local') {} // 'local' is default value for PassportStrategy
// it calls the validate method on the class that implements it
