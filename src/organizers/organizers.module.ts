import { Module } from '@nestjs/common';
import { OrganizersService } from './services/organizers.service';
import { OrganizersController } from './controllers/organizers.controller';

@Module({
  controllers: [OrganizersController],
  providers: [OrganizersService],
})
export class OrganizersModule {}
