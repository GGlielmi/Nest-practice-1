import { ICredentials } from './local.strategy';

export class AuthDto implements ICredentials {
  user: string;
  pass: string;
}
