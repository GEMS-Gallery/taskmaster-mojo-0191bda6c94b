export const idlFactory = ({ IDL }) => {
  const Category = IDL.Record({ 'id' : IDL.Nat, 'name' : IDL.Text });
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'completionDate' : IDL.Opt(IDL.Int),
    'completed' : IDL.Bool,
    'description' : IDL.Text,
    'category' : IDL.Text,
  });
  return IDL.Service({
    'addCategory' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'addTask' : IDL.Func([IDL.Text, IDL.Text], [IDL.Nat], []),
    'completeTask' : IDL.Func([IDL.Nat], [], []),
    'deleteCategory' : IDL.Func([IDL.Nat], [], []),
    'deleteTask' : IDL.Func([IDL.Nat], [], []),
    'getCategories' : IDL.Func([], [IDL.Vec(Category)], ['query']),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
