import { useState } from "react";
import Navbar from "./Components/Navbar";

function App() {
  const [todo, setTodo] = useState("");
  const [clickEdit, setClickEdit] = useState(false);
  const [editIndex, setEditIndex] = useState(null);

  const [todos, setTodos] = useState([
    { task: "Buy grocery", isWorkDone: false },
    { task: "buy a pen of alkos", isWorkDone: false },
  ]);

  function handelInpValue(e) {
    setTodo(e.target.value);
    if (e.target.value.length === 0) {
      setClickEdit(false);
      setEditIndex(null);
    }
  }

  function handelMarkAsDone(index) {
    const copyOfTodos = todos.map((todo, i) =>
      index === i ? { ...todo, isWorkDone: !todo.isWorkDone } : todo
    );
    setTodos(copyOfTodos);
  }

  function handelAddTodo() {
    if (todo && todo.length > 0) {
      setTodos([...todos, { task: todo, isWorkDone: false }]);
      setTodo("");
    }
  }

  function handelDelete(index) {
    let newTodos = todos.filter((todo, i) => {
      return index !== i;
    });

    setTodos(newTodos);
  }

  function handelEdit(index) {
    setClickEdit(true);
    setTodo(todos[index].task);
    setEditIndex(index);
  }

  function handleEditedTodo() {
    console.log(editIndex);
    
    const updatedTodos = todos.map((item, i) =>
      i === editIndex ? { ...item, task: todo } : item
    );
    setTodos(updatedTodos);
    setTodo("");
    setEditIndex(null);
    setClickEdit(false);
  }

  return (
    <>
      <Navbar />

      <div className="container mx-auto rounded-md bg-violet-500 text-white p-6 shadow-lg">
        <h1 className="text-center font-semibold text-3xl mt-2">
          Todo App - Your Task Manager
        </h1>

        {/* Add Todo Section */}
        <div className="add-todo mt-10 mb-8">
          <h2 className="text-2xl font-bold mb-3 text-center text-yellow-300">
            Add a Task
          </h2>
          <div className="inp flex gap-4 justify-center items-center">
            <input
              onChange={handelInpValue}
              value={todo}
              className="p-3 text-sm rounded-lg border text-black border-gray-300 w-[65%] focus:outline-none focus:ring-2 focus:ring-orange-400"
              type="text"
              placeholder="Enter your task"
            />

              {/* add and edit button */}

             {
              <button
              onClick={clickEdit ? handleEditedTodo : handelAddTodo}
              className="text-lg font-semibold px-4 py-2 rounded-lg bg-yellow-400 text-black hover:bg-yellow-500 transition"
            >
              {clickEdit ? "edit" : "add"}
            </button>
            
            }
            
          </div>
          {/* <div  className="show-finished ml-9 mt-8">
          <input type="checkbox" name="" id="" />
          <label htmlFor="">show finished</label>
          </div> */}
          
        </div>

        {/* Todo List Section */}
        <div className="todos mt-6">
          <h2 className="text-center text-xl font-semibold text-yellow-300 mb-4">
            Your Tasks
          </h2>
          <div className="flex flex-col items-center gap-4">
            {todos.length === 0 && <p>There is no todo to display</p>}
            {todos.map((todo, index) => (
              <div
                key={index}
                className={`todo w-full max-w-2xl bg-purple-800 p-2 rounded-lg shadow-md flex justify-between items-center ${
                  todo.isWorkDone ? "opacity-60" : null
                }`}
              >
                {/* checkbox */}
                <input
                  onClick={() => {
                    handelMarkAsDone(index);
                  }}
                  className="mr-2 mt-1"
                  type="checkbox"
                  name=""
                  id=""
                />

                {/* todo task */}

                <p
                  className={`text-base text-gray-200 flex-1 ${
                    todo.isWorkDone ? "line-through" : "null"
                  }`}
                >
                  {todo.task}
                </p>
                <div className="btn flex gap-2">
                  {/* edit button */}

                  <button
                    style={{ fontSize: "9px" }}
                    onClick={() => {
                      handelEdit(index);
                    }}
                    className={`bg-green-500 px-2  text-sm text-white rounded-lg hover:bg-green-600 transition ${
                      todo.isWorkDone ? "hidden" : null
                    }`}
                  >
                    Edit
                  </button>

                  {/* delete button */}

                  <button
                    style={{ fontSize: "9px" }}
                    onClick={() => {
                      handelDelete(index);
                    }}
                    className="bg-red-500 px-2  text-sm text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
