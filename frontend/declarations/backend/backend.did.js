export const idlFactory = ({ IDL }) => {
  const Result_3 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const Category = IDL.Record({ 'id' : IDL.Nat, 'name' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Vec(Category), 'err' : IDL.Text });
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'completionDate' : IDL.Opt(IDL.Int),
    'completed' : IDL.Bool,
    'description' : IDL.Text,
    'category' : IDL.Text,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Vec(Task), 'err' : IDL.Text });
  return IDL.Service({
    'addCategory' : IDL.Func([IDL.Text], [Result_3], []),
    'addTask' : IDL.Func([IDL.Text, IDL.Text], [Result_3], []),
    'completeTask' : IDL.Func([IDL.Nat], [Result_2], []),
    'deleteCategory' : IDL.Func([IDL.Nat], [Result_2], []),
    'deleteTask' : IDL.Func([IDL.Nat], [Result_2], []),
    'getCategories' : IDL.Func([], [Result_1], ['query']),
    'getTasks' : IDL.Func([], [Result], ['query']),
    'healthCheck' : IDL.Func([], [IDL.Text], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
