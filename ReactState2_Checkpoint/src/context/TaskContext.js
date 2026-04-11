import { createContext, useContext } from "react";
import useTasks from "../hooks/useTasks";

// TaskContext — makes task state and actions available to the entire component tree
const TaskContext = createContext();

export function TaskProvider({ children }) {
  const taskState = useTasks();
  return (
    <TaskContext.Provider value={taskState}>{children}</TaskContext.Provider>
  );
}

// useTaskContext — convenience hook to consume the context
export function useTaskContext() {
  return useContext(TaskContext);
}
