import { useDispatch, useSelector } from 'react-redux';
import {
  addTask,
  setNewTaskInput,
  selectNewTaskInput,
} from '../Redux/todosSlice';

function AddTask() {
  const dispatch = useDispatch();
  const description = useSelector(selectNewTaskInput);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(addTask());
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <div className="input-wrapper">
        <span className="input-icon">✏️</span>
        <input
          type="text"
          value={description}
          onChange={(e) => dispatch(setNewTaskInput(e.target.value))}
          placeholder="What needs to be done?"
        />
      </div>
      <button type="submit" className="btn-add">
        <span>＋</span>
        <span>Add</span>
      </button>
    </form>
  );
}

export default AddTask;
