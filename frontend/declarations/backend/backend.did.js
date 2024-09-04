export const idlFactory = ({ IDL }) => {
  const Task = IDL.Record({
    'id' : IDL.Nat,
    'completionDate' : IDL.Opt(IDL.Int),
    'completed' : IDL.Bool,
    'description' : IDL.Text,
  });
  return IDL.Service({
    'addTask' : IDL.Func([IDL.Text], [IDL.Nat], []),
    'completeTask' : IDL.Func([IDL.Nat], [], []),
    'deleteTask' : IDL.Func([IDL.Nat], [], []),
    'getTasks' : IDL.Func([], [IDL.Vec(Task)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
