import {BaseEntity} from "./base/BaseEntity";
import {Workspace} from "./Workspace.ts";

export class CustomerInvitation extends BaseEntity{
  email: string;
  role: number;
  pending: boolean;
  workspace?: Workspace;
}
