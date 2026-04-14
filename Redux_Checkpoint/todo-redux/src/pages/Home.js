import { useSelector } from 'react-redux';
import { selectAllTasks } from '../Redux/todosSlice';
import AddTask from '../components/AddTask';
import ListTask from '../components/ListTask';

function Home() {
  const tasks = useSelector(selectAllTasks);
  const doneCount = tasks.filter((t) => t.isDone).length;
  const pendingCount = tasks.length - doneCount;

  return (
    <div className="app">
      <div className="app-header">
        <h1>My Tasks</h1>
        <p className="subtitle">Stay focused, get things done.</p>
      </div>

      {tasks.length > 0 && (
        <div className="stats-bar">
          <div className="stat-chip total">
            <span className="stat-num">{tasks.length}</span> Total
          </div>
          <div className="stat-chip done">
            <span className="stat-num">{doneCount}</span> Done
          </div>
          <div className="stat-chip pending">
            <span className="stat-num">{pendingCount}</span> Pending
          </div>
        </div>
      )}

      <div className="card">
        <AddTask />
      </div>

      <div className="card">
        <ListTask />
      </div>
    </div>
  );
}

export default Home;
