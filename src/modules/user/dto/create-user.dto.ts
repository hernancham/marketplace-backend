import { IsEmail, IsNotEmpty, IsOptional, IsPhoneNumber, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
    @MinLength(4, { message: 'El nombre debe tener al menos 4 caracteres.' })
    @MaxLength(50, { message: 'El nombre no debe exceder los 50 caracteres.' })
    @IsNotEmpty({ message: 'El nombre es obligatorio.' })
    name: string;
  
    @IsEmail({}, { message: 'El correo electrónico no es válido.' })
    @MaxLength(100, { message: 'El correo electrónico no debe exceder los 100 caracteres.' })
    @IsNotEmpty({ message: 'El email es obligatorio.' })
    email: string;
  
    @IsString()
    @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres.' })
    @MaxLength(20, { message: 'La contraseña no debe exceder los 20 caracteres.' })
    /* @Matches(/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@$!%*?&#])/, {
      message: 'La contraseña debe incluir al menos una mayúscula, una minúscula, un número y un carácter especial.',
    }) */
    @IsNotEmpty({ message: 'La contraseña es obligatoria.' })
    password: string;
  
    @IsPhoneNumber('PE', { message: 'El número de teléfono no es válido.' }) // 'ZZ' acepta cualquier código internacional
    @IsOptional()
    phone?: string;
  
    @IsString()
    @MaxLength(255, { message: 'La dirección no debe exceder los 255 caracteres.' })
    @IsOptional()
    address?: string;
  
    @IsUrl({}, { message: 'La URL de la imagen de perfil no es válida.' })
    @IsOptional()
    profileImageUrl?: string;
}
