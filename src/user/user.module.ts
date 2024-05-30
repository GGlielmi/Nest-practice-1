import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { AttendeesModule } from 'src/attendees/attendees.module';
import { ManufacturerModule } from 'src/manufacturer/manufacturer.module';

@Module({
  imports: [AttendeesModule, ManufacturerModule],
  controllers: [UserController],
})
export class UserModule {}
