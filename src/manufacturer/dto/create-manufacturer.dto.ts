import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class CreateManufacturerDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @Min(0)
  @IsInt()
  userId: number;
}
