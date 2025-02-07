import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from "class-validator";

export class LoginAuthDto {
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
}
