import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Category { 'id' : bigint, 'name' : string }
export interface Task {
  'id' : bigint,
  'completionDate' : [] | [bigint],
  'completed' : boolean,
  'description' : string,
  'category' : string,
}
export interface _SERVICE {
  'addCategory' : ActorMethod<[string], bigint>,
  'addTask' : ActorMethod<[string, string], bigint>,
  'completeTask' : ActorMethod<[bigint], undefined>,
  'deleteCategory' : ActorMethod<[bigint], undefined>,
  'deleteTask' : ActorMethod<[bigint], undefined>,
  'getCategories' : ActorMethod<[], Array<Category>>,
  'getTasks' : ActorMethod<[], Array<Task>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
