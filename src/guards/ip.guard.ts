import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
} from "@nestjs/common";
import * as requestIp from "@supercharge/request-ip";

import { ProjectService } from "../modules/project/project.service";

@Injectable()
export class IpsGuard implements CanActivate {
  private logger = new Logger(IpsGuard.name);

  constructor(private readonly projectService: ProjectService) {}

  public canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const ip = requestIp.getClientIp(request);

    if (!ip) {
      return false;
    }

    this.logger.debug(ip);

    const { allowedIps } = this.projectService;
    const isAllowed = allowedIps.includes(ip);

    return isAllowed;
  }
}
