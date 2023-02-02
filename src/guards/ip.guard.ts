import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import * as requestIp from "@supercharge/request-ip";

import { ProjectService } from "../modules/project/project.service";

@Injectable()
export class IpsGuard implements CanActivate {
  constructor(private readonly projectService: ProjectService) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = requestIp.getClientIp(request);

    if (!ip) {
      return false;
    }

    const { allowedIps } = this.projectService;
    const isAllowed = allowedIps.includes(ip);

    return isAllowed;
  }
}
