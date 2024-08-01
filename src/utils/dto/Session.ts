import {BaseEntity} from "./base/BaseEntity";

export class Session extends BaseEntity {
  isNewSessionTriggered?: boolean = false;
  createdDate?: string;
}
