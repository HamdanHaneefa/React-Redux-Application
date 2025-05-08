import { useSelector, useDispatch } from "react-redux"
import { increment,decrement } from "../redux-toolkit/counterReducer"


export const Counter = () => {
  const count = useSelector((state) => state.value)
  const dispatch = useDispatch()

   
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 pt-0">
        <div className="bg-gray-100 shadow-md rounded-lg p-8 w-full max-w-md text-center">
          <h2 className="text-3xl font-semibold text-gray-700 mb-4">Counter</h2>
          <div className="text-5xl font-bold text-blue-600 mb-6">{count}</div>
  
          <div className="flex justify-center space-x-4">
            <button
              onClick={() => dispatch(increment())}
              className="px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-md hover:bg-blue-600 transition"
            >
              +
            </button>
            <button
              onClick={() => dispatch(decrement())}
              className="px-6 py-3 bg-red-500 text-white text-lg font-semibold rounded-md hover:bg-red-600 transition"
            >
              -
            </button>
          </div>
        </div>
      </div>
    </>
  );
  
  }