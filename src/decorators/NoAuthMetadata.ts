import { SetMetadata } from '@nestjs/common';

export const NO_AUTH_METADATA = 'no-auth';

export const NoAuth = () => SetMetadata(NO_AUTH_METADATA, true);
