import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'id' : bigint, 'name' : string }
export type Result = { 'ok' : Array<Task> } |
  { 'err' : string };
export type Result_1 = { 'ok' : Array<Category> } |
  { 'err' : string };
export type Result_2 = { 'ok' : null } |
  { 'err' : string };
export type Result_3 = { 'ok' : bigint } |
  { 'err' : string };
export interface Task {
  'id' : bigint,
  'completionDate' : [] | [bigint],
  'completed' : boolean,
  'description' : string,
  'category' : string,
}
export interface _SERVICE {
  'addCategory' : ActorMethod<[string], Result_3>,
  'addTask' : ActorMethod<[string, string], Result_3>,
  'completeTask' : ActorMethod<[bigint], Result_2>,
  'deleteCategory' : ActorMethod<[bigint], Result_2>,
  'deleteTask' : ActorMethod<[bigint], Result_2>,
  'getCategories' : ActorMethod<[], Result_1>,
  'getTasks' : ActorMethod<[], Result>,
  'healthCheck' : ActorMethod<[], string>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
