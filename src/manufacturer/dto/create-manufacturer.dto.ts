import { IsNotEmpty, IsString } from 'class-validator';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

export class CreateManufacturerDto extends CreateUserDto {
  @IsString()
  @IsNotEmpty()
  brand: string;
}
