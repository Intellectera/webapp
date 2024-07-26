import {BaseEntity} from "./base/BaseEntity";

export class Workspace extends BaseEntity{
  role: WorkspaceRole;
}

export enum WorkspaceRole {
  OWNER = 1,
  ADMIN = 2,
  USER = 3
}
