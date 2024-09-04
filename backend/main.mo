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
    category: Text;
  };

  type Category = {
    id: Nat;
    name: Text;
  };

  stable var taskIdCounter: Nat = 0;
  stable var categoryIdCounter: Nat = 0;
  stable var taskEntries: [(Nat, Task)] = [];
  stable var categoryEntries: [(Nat, Category)] = [];

  let tasks = HashMap.fromIter<Nat, Task>(taskEntries.vals(), 0, Int.equal, Int.hash);
  let categories = HashMap.fromIter<Nat, Category>(categoryEntries.vals(), 0, Int.equal, Int.hash);

  // Default categories
  let defaultCategories = ["Work", "Personal", "Shopping", "Health", "Finance"];

  public func addTask(description: Text, category: Text) : async Nat {
    let id = taskIdCounter;
    taskIdCounter += 1;
    let task: Task = {
      id = id;
      description = description;
      completed = false;
      completionDate = null;
      category = category;
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
          category = task.category;
        };
        tasks.put(id, updatedTask);
      };
    };
  };

  public func deleteTask(id: Nat) : async () {
    tasks.delete(id);
  };

  public func addCategory(name: Text) : async Nat {
    let id = categoryIdCounter;
    categoryIdCounter += 1;
    let category: Category = {
      id = id;
      name = name;
    };
    categories.put(id, category);
    id
  };

  public query func getCategories() : async [Category] {
    let defaultCats = Array.map<Text, Category>(defaultCategories, func(name) {
      {
        id = 0;
        name = name;
      }
    });
    Array.append(defaultCats, Iter.toArray(categories.vals()))
  };

  public func deleteCategory(id: Nat) : async () {
    categories.delete(id);
  };

  system func preupgrade() {
    taskEntries := Iter.toArray(tasks.entries());
    categoryEntries := Iter.toArray(categories.entries());
  };

  system func postupgrade() {
    taskEntries := [];
    categoryEntries := [];
  };
}
