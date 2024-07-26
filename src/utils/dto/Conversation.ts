import {BaseEntity} from "./base/BaseEntity";
import {Session} from "./Session";

export class Conversation extends BaseEntity {
  message: string;
  response: string;
  sequence: number;
  session?: Session;
  agentResponseParam: AgentResponseParam;
}

export class AgentResponseParam {
  data: any[];
  sql: string;
  response: string;
  columnNames: string[];
  suggestions: string[];
}
