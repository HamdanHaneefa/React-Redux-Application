import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useSelector, useDispatch } from "react-redux"

const Todo = () => {
  const todos = useSelector((state) => state.todo)
  const dispatch = useDispatch()
  const [inputValue, setInputValue] = useState('');
  const [allCompleted, setAllCompleted] = useState(false);

  // Placeholder for remaining todo count
  const remainingCount = todos.filter(todo => !todo.completed).length;


  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && inputValue.trim()) {
      dispatch({type:"ENTER",payload: inputValue})
      setInputValue('');
    }

  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6">
      <div className="bg-gray-100 shadow-md rounded-lg w-full max-w-md">
        <div className="text-center py-4">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Todo</h2>
        </div>

        <div className="border-t border-gray-200">
          <div className="p-4">
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="w-full p-2 text-gray-700 focus:outline-none text-lg"
            />
          </div>

          <ul>
            {todos.map(todo => (
              <li key={todo.id} className="border-t border-gray-200 flex items-center px-4 py-3">
                <div className="mr-3">
                  <input 
                    type="checkbox" 
                    checked={todo.completed}
                    readOnly
                    className="w-5 h-5 cursor-pointer"
                    onChange={() => dispatch({type:"TOGGLE",payload: todo.id})}
                  />
                </div>
                <div className={`flex-grow ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                  {todo.text}
                </div>
                <div className="flex items-center">
                  <button 
                  className="text-gray-400 hover:text-gray-600"
                  onClick={() => dispatch({type:"REMOVE",payload: todo.id})}
                  >
                    <X size={16} />
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="border-t border-gray-200 p-4">
            <div className="flex justify-between items-center text-sm text-gray-600">
              <div>
                <span className="font-medium">Remaining Todos</span>
                <div className="text-gray-500">{remainingCount} item left</div>
              </div>
            </div>

            <div className="mt-4 flex space-x-4">
            
              <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition text-sm w-full"
              onClick={() => dispatch({type:"CLEAR_COMPLETED"}) }>
               Clear Completed
              </button>

              <button className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition text-sm w-full"
               onClick={() => { allCompleted ? dispatch({ type: "UNMARK_ALL"}) : dispatch({ type: "MARK_COMPLETED"});
                setAllCompleted(!allCompleted);
                }} >
                 {allCompleted ? 'Unmark All' : 'Mark All Completed'}
              </button>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Todo;
