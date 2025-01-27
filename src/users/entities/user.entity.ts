import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    BeforeInsert,
    DeleteDateColumn,
  } from 'typeorm';
  
  @Entity('users')
  export class User {
    @PrimaryGeneratedColumn("uuid") // Cambiamos a UUID
    id: string;

    @Column()
    name: string;
  
    // Datos personales básicos
    @Column({ unique: true })
    email: string;
  
    @Column()
    password: string;
  
    // Rol del usuario: por defecto será "buyer"
    @Column({ default: 'buyer' }) // Puede ser: 'buyer', 'seller', 'admin'
    role: string;
  
    // Estado de la cuenta: Activo, Inactivo, etc.
    @Column({ default: 'active' }) // Puede ser: 'active', 'inactive', 'banned'
    status: string;
  
    // Control de fechas
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;

    @DeleteDateColumn()
    deleteAt: Date;
  
    // Foto de perfil del usuario
    @Column({ nullable: true })
    profileImageUrl: string;
  
    // Número de teléfono (puede ser único)
    @Column({ nullable: true, unique: true })
    phoneNumber: string;
  
    // Ubicación del usuario (para vendedores)
    @Column({ nullable: true })
    address: string;
  
    // Verificación de email o teléfono
    @Column({ default: false })
    isEmailVerified: boolean;
  
    @Column({ default: false })
    isPhoneVerified: boolean;
  }
  