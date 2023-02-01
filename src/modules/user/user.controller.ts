import { Body, Controller, Param, Query, UseGuards } from "@nestjs/common";
import { ResultHandler } from "@yest/result-handler";
import { JwtTokenGuard, ScopesGuard } from "@yest/security";
import {
  UserArchiveResponse,
  UserCreate,
  UserCreateResponse,
  UserFindByIdResponse,
  UserGetAllResponse,
  UserPatch,
  UserPatchResponse,
  UserPopulateRequestBody,
  UserSearch,
  UserSearchResponse,
  UserUpdate,
  UserUpdateResponse,
} from "@yest/yest-stats-api-typescript-fetch";

import { UserService } from "./user.service";

@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async userCreate(
    @Body() user: UserCreate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<UserCreateResponse> {
    const { isDryRun } = query;
    const res = await this.userService.create(user, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async userSearch(
    @Body() body: UserSearch,
  ): Promise<UserSearchResponse> {
    const res = await this.userService.search(body);
    const { value, pagination, distincts } = res;
    return ResultHandler.ok(value, pagination, distincts);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async userGetById(
    @Param() params: { id: string },
    @Body() body: UserPopulateRequestBody,
  ): Promise<UserFindByIdResponse> {
    const { id: userId } = params;
    const { populate } = body;
    const res = await this.userService.getById(userId, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async userGetAll(
    @Query() query: { isArchived?: boolean },
    @Body() body: UserPopulateRequestBody,
  ): Promise<UserGetAllResponse> {
    const { isArchived } = query;
    const { populate } = body;
    const res = await this.userService.getAll(isArchived, populate);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async userPatch(
    @Param() params: { id: string },
    @Body() user: UserPatch,
  ): Promise<UserPatchResponse> {
    const { id: userId } = params;
    const res = await this.userService.patch(userId, user);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async userUpdate(
    @Param() params: { id: string },
    @Body() user: UserUpdate,
    @Query()
    query: {
      isDryRun?: boolean;
    },
  ): Promise<UserUpdateResponse> {
    const { id: userId } = params;
    const { isDryRun } = query;
    const res = await this.userService.update(userId, user, isDryRun);
    return ResultHandler.ok(res);
  }

  @UseGuards(JwtTokenGuard, ScopesGuard)
  public async userArchive(
    @Param() params: { id: string },
  ): Promise<UserArchiveResponse> {
    const { id: userId } = params;
    const res = await this.userService.archive(userId);
    return ResultHandler.ok(res);
  }
}
