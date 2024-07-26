import {BaseEntity} from "./base/BaseEntity";

export class CustomerInvitation extends BaseEntity{
  email: string;
  role: number;
  pending: boolean;
}
