import { Injectable, OnApplicationBootstrap } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { YestPaginateResult } from "@yest/mongoose";
import { ResultHandlerException } from "@yest/router";
import {
  BasicOperator,
  User,
  UserCreate,
  UserPatch,
  UserPopulateField,
  UserRole,
  UserSearch,
  UserUpdate,
} from "@yest/yest-stats-api-typescript-fetch";

import { AuthErrors } from "../auth/auth.errors";
import { ProjectService } from "../project/project.service";
import { UserErrors } from "./user.errors";
import { UserRepository } from "./user.repository";

@Injectable()
export class UserService implements OnApplicationBootstrap {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly configService: ConfigService,
    private readonly projectService: ProjectService,
  ) {}

  public async onApplicationBootstrap(): Promise<void> {
    const defaultEmail = this.configService.get<string>("DEFAULT_EMAIL")!;
    let defaultUser: User;
    try {
      defaultUser = await this.getUserByEmail(defaultEmail);
    } catch (err) {
      const defaultPassword =
        this.configService.get<string>("DEFAULT_PASSWORD")!;
      const userCreate: UserCreate = {
        email: defaultEmail,
        password: defaultPassword,
        role: UserRole.Admin,
      };
      defaultUser = await this.userRepository.create(userCreate);
    }

    if (!defaultUser) {
      throw new Error("DefaultUser should be defined -> Impossible");
    }
    const projects = await this.projectService.getAll();
    const projectIds = projects.map((x) => {
      return x.id;
    });
    const userPatch: UserPatch = {
      projectIds,
    };
    await this.patch(defaultUser.id, userPatch);
  }

  public async searchLogin(
    searchParams: UserSearch,
  ): Promise<YestPaginateResult<User, never>> {
    const res = await this.userRepository.searchLogin(searchParams);
    return res;
  }

  public async create(user: UserCreate, isDryRun?: boolean): Promise<User> {
    const res = await this.userRepository.create(user, isDryRun);
    return res;
  }

  public async createMany(userBulk: UserCreate[]): Promise<User[]> {
    const res = await this.userRepository.createMany(userBulk);
    return res;
  }

  public async search(
    searchParams: UserSearch,
  ): Promise<YestPaginateResult<User, never>> {
    const res = await this.userRepository.search(searchParams);
    return res;
  }

  public async getAll(
    isArchived?: boolean,
    populate?: UserPopulateField[],
  ): Promise<User[]> {
    const res = await this.userRepository.getAll(isArchived, populate);
    return res;
  }

  public async getById(
    userId: string,
    populate?: UserPopulateField[],
  ): Promise<User> {
    const res = await this.userRepository.getById(userId, populate);
    return res;
  }

  public async patch(userId: string, user: UserPatch): Promise<User> {
    await this.checkIfAlreadyArchived(userId);
    const res = await this.userRepository.patch(userId, user);
    return res;
  }

  public async update(
    userId: string,
    user: UserUpdate,
    isDryRun?: boolean,
  ): Promise<User> {
    await this.checkIfAlreadyArchived(userId);
    const res = await this.userRepository.update(userId, user, isDryRun);
    return res;
  }

  public async archive(userId: string): Promise<User> {
    await this.checkIfAlreadyArchived(userId);
    const res = await this.userRepository.archive(userId);
    return res;
  }

  public async getUserByEmail(email: string): Promise<User> {
    const userSearch: UserSearch = {
      pagination: {
        limit: 1,
      },
      and: [
        { archived: [{ operator: BasicOperator.Equal, value: false }] },
        {
          email: [
            {
              operator: BasicOperator.Equal,
              isCaseSensitive: false,
              isExactMatching: true,
              values: [email],
            },
          ],
        },
      ],
    };
    const userApi = await this.searchLogin(userSearch);

    const hasOneValue = userApi.value.length === 1;
    const hasOneTotalItems = userApi.pagination.totalItems === 1;
    if (!hasOneValue || !hasOneTotalItems) {
      throw new ResultHandlerException(AuthErrors.wrongCredentials);
    }

    const [user] = userApi.value;
    return user;
  }

  private async checkIfAlreadyArchived(userId: string): Promise<User> {
    const user = await this.getById(userId);
    if (user.archived) {
      throw new ResultHandlerException(UserErrors.alreadyArchived);
    }

    return user;
  }
}
