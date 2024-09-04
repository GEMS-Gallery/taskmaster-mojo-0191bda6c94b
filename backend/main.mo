import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Iter "mo:base/Iter";

actor {
  type Task = {
    id: Nat;
    description: Text;
    completed: Bool;
    completionDate: ?Int;
  };

  stable var taskIdCounter: Nat = 0;
  stable var taskEntries: [(Nat, Task)] = [];

  let tasks = HashMap.fromIter<Nat, Task>(taskEntries.vals(), 0, Int.equal, Int.hash);

  public func addTask(description: Text) : async Nat {
    let id = taskIdCounter;
    taskIdCounter += 1;
    let task: Task = {
      id = id;
      description = description;
      completed = false;
      completionDate = null;
    };
    tasks.put(id, task);
    id
  };

  public query func getTasks() : async [Task] {
    Iter.toArray(tasks.vals())
  };

  public func completeTask(id: Nat) : async () {
    switch (tasks.get(id)) {
      case (null) {
        // Task not found, do nothing
      };
      case (?task) {
        let updatedTask: Task = {
          id = task.id;
          description = task.description;
          completed = true;
          completionDate = ?Time.now();
        };
        tasks.put(id, updatedTask);
      };
    };
  };

  public func deleteTask(id: Nat) : async () {
    tasks.delete(id);
  };

  system func preupgrade() {
    taskEntries := Iter.toArray(tasks.entries());
  };

  system func postupgrade() {
    taskEntries := [];
  };
}
