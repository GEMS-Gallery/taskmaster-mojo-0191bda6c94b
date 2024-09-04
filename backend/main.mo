import Bool "mo:base/Bool";
import Error "mo:base/Error";
import Hash "mo:base/Hash";
import List "mo:base/List";
import Nat "mo:base/Nat";
import Result "mo:base/Result";

import Array "mo:base/Array";
import HashMap "mo:base/HashMap";
import Text "mo:base/Text";
import Time "mo:base/Time";
import Int "mo:base/Int";
import Iter "mo:base/Iter";
import Debug "mo:base/Debug";

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

  public func addTask(description: Text, category: Text) : async Result.Result<Nat, Text> {
    try {
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
      Debug.print("Task added successfully: " # debug_show(id));
      #ok(id)
    } catch (e) {
      Debug.print("Error adding task: " # Error.message(e));
      #err("Failed to add task: " # Error.message(e))
    }
  };

  public query func getTasks() : async Result.Result<[Task], Text> {
    try {
      let taskList = Iter.toArray(tasks.vals());
      Debug.print("Retrieved " # debug_show(taskList.size()) # " tasks");
      #ok(taskList)
    } catch (e) {
      Debug.print("Error retrieving tasks: " # Error.message(e));
      #err("Failed to retrieve tasks: " # Error.message(e))
    }
  };

  public func completeTask(id: Nat) : async Result.Result<(), Text> {
    switch (tasks.get(id)) {
      case (null) {
        Debug.print("Task not found: " # debug_show(id));
        #err("Task not found")
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
        Debug.print("Task completed: " # debug_show(id));
        #ok()
      };
    };
  };

  public func deleteTask(id: Nat) : async Result.Result<(), Text> {
    switch (tasks.remove(id)) {
      case (null) {
        Debug.print("Task not found for deletion: " # debug_show(id));
        #err("Task not found")
      };
      case (_) {
        Debug.print("Task deleted: " # debug_show(id));
        #ok()
      };
    };
  };

  public func addCategory(name: Text) : async Result.Result<Nat, Text> {
    try {
      let id = categoryIdCounter;
      categoryIdCounter += 1;
      let category: Category = {
        id = id;
        name = name;
      };
      categories.put(id, category);
      Debug.print("Category added: " # debug_show(id));
      #ok(id)
    } catch (e) {
      Debug.print("Error adding category: " # Error.message(e));
      #err("Failed to add category: " # Error.message(e))
    }
  };

  public query func getCategories() : async Result.Result<[Category], Text> {
    try {
      let defaultCats = Array.map<Text, Category>(defaultCategories, func(name) {
        {
          id = 0;
          name = name;
        }
      });
      let allCategories = Array.append(defaultCats, Iter.toArray(categories.vals()));
      Debug.print("Retrieved " # debug_show(allCategories.size()) # " categories");
      #ok(allCategories)
    } catch (e) {
      Debug.print("Error retrieving categories: " # Error.message(e));
      #err("Failed to retrieve categories: " # Error.message(e))
    }
  };

  public func deleteCategory(id: Nat) : async Result.Result<(), Text> {
    switch (categories.remove(id)) {
      case (null) {
        Debug.print("Category not found for deletion: " # debug_show(id));
        #err("Category not found")
      };
      case (_) {
        Debug.print("Category deleted: " # debug_show(id));
        #ok()
      };
    };
  };

  public query func healthCheck() : async Text {
    "Canister is healthy"
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
