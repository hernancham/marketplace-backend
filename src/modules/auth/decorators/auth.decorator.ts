import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "src/entities/user.entity";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../guards/auth.guard";
import { RolesGuard } from "../guards/roles.guard";

export const Auth = (...roles: UserRole[]) => applyDecorators(Roles(...roles),UseGuards(AuthGuard, RolesGuard));