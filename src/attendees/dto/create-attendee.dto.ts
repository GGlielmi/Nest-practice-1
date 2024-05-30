import { IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateAttendeeDto extends CreateUserDto {
  @IsNotEmpty()
  name: string;

  @Min(0)
  age: number;

  @IsOptional()
  @IsNumber()
  funds: number = 0;
}
