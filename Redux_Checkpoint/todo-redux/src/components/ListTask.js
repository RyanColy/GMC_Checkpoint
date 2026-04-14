import { useDispatch, useSelector } from 'react-redux';
import {
  selectFilteredTasks,
  selectFilter,
  setFilter,
} from '../Redux/todosSlice';
import { FILTERS, EMPTY_MESSAGES } from '../constants/filters';
import Task from './Task';

function ListTask() {
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);
  const currentFilter = useSelector(selectFilter);
  const empty = EMPTY_MESSAGES[currentFilter];

  return (
    <div className="list-task">
      <div className="filter-segment">
        {FILTERS.map((f) => (
          <button
            key={f.value}
            className={currentFilter === f.value ? 'active' : ''}
            onClick={() => dispatch(setFilter(f.value))}
          >
            {f.label}
          </button>
        ))}
      </div>

      {tasks.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">{empty.icon}</span>
          <p>{empty.title}</p>
          <span>{empty.hint}</span>
        </div>
      ) : (
        <>
          <p className="section-label">{tasks.length} task{tasks.length !== 1 ? 's' : ''}</p>
          <ul className="task-list">
            {tasks.map((task) => (
              <Task key={task.id} task={task} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default ListTask;
