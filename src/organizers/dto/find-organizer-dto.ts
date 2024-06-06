import { PartialType } from '@nestjs/swagger';
import { UpdateOrganizerDto } from './update-organizer.dto';

export class FindOrganizerDto extends PartialType(UpdateOrganizerDto) {}
