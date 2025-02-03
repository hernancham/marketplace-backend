import { applyDecorators, UseGuards } from "@nestjs/common";
import { UserRole } from "src/users/entities/user.entity";
import { Roles } from "./roles.decorator";
import { AuthGuard } from "../guard/auth.guard";
import { RolesGuard } from "../guard/roles.guard";

export const Auth = (...roles: UserRole[]) => applyDecorators(Roles(...roles),UseGuards(AuthGuard, RolesGuard));