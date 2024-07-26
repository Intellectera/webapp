import {BaseEntity} from "./base/BaseEntity";
import {Workspace} from "./Workspace";
import {ResourceType} from "./ResourceType";

export class Resource extends BaseEntity{
  workspace: Workspace;
  status: number;
  type: ResourceType;

  constructor(name: string, id: string, workspace: Workspace) {
    super(name, id);
    this.workspace = workspace;
  }
}
