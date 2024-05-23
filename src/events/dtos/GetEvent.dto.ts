import { ApiProperty } from '@nestjs/swagger';
import { UpdateEventDto } from './UpdateEvent.dto';

export class GetEvent extends UpdateEventDto {
  @ApiProperty({ example: [{ attendeeId: 0 }] })
  attendees: { attendeeId: number }[];
}
