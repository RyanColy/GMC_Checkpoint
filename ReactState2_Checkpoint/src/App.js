import { TaskProvider } from "./context/TaskContext";
import HomePage from "./pages/HomePage";
import "./App.css";

// App — root component, wraps the app with the global TaskProvider
function App() {
  return (
    <TaskProvider>
      <HomePage />
    </TaskProvider>
  );
}

export default App;
