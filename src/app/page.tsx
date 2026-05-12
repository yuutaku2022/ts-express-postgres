"use client";
import { useState, useRef, useEffect } from "react";
import Button from "../components/button"

type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export default function Home() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`http://localhost:8000/todos`)
      .then(res => res.json())
      .then(data => setTasks(data));
  }, []);
  
  useEffect(() => {
    if (modalOpen && inputRef.current) {
      inputRef.current.focus();
    }
    if (editModalOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [modalOpen, editModalOpen]);

  const createTask = async (title: string) => {
    const res = await fetch(`http://localhost:8000/todos`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title }),
    });
    const createdTask = await res.json();
    setTasks([...tasks, createdTask]);
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const updateTask = async (id: string, title: string) => {
    const res = await fetch(`http://localhost:8000/todos/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title }),
    })
    const editedTask = await res.json();
    setTasks(tasks.map((task) => task.id === id ? editedTask : task));
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <main className="w-full max-w-3xl p-6">
        <div className="bg-white p-8 rounded-2xl shadow-lg"
          onClick={() => {
            if (selectedTaskId) {
              setSelectedTaskId(null);
            }
          }}
        >
          <div className="flex justify-start gap-3 mb-6">
            <Button onClick={(e) => {
              e.stopPropagation();
              if (selectedTaskId) {
                const task = tasks.find(t => t.id === selectedTaskId);
                if (task) {
                  setInputValue(task.title);
                }
                setEditModalOpen(true);
              }
            }} label="Edit" />

            <Button onClick={(e) => {
              e.stopPropagation();
              if (selectedTaskId) {
                setDeleteModalOpen(true);
              }
            }} label="Delete" />
          </div>
          {tasks.length === 0 && (
            <p className="text-center text-gray-500 pb-4">No tasks yet. Add a task to get started!</p>
          )}
          <ul>
            {tasks.map((task) => {
              return (
              <li key={task.id} className="mb-4" onClick={(e) => e.stopPropagation()}>
                <div 
                  onClick={() => {
                    if (selectedTaskId === task.id) {
                      setSelectedTaskId(null);
                      return;
                    }
                    setSelectedTaskId(task.id);
                  }}
                  className={`flex items-center gap-4 p-4 border rounded-xl transition cursor-pointer
                    ${selectedTaskId === task.id ? "bg-blue-100 border-blue-400" : "hover:bg-gray-50"}
                  `}
                >
                  <input
                    type="checkbox"
                    className="w-5 h-5 cursor-pointer"
                    checked={task.completed}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => {
                      setTasks((prev) => prev.map((t) => t.id === task.id ? { ...t, completed: e.target.checked } : t));
                    }}
                  />
                  <p className={`text-lg`}>
                    {task.title}
                  </p>
                </div>
              </li>
              )
            })}
          </ul>
          <Button onClick={(e) => {
            e.stopPropagation();
            setModalOpen(true);
          }} label="Add Task" />
        </div>
        {modalOpen && (
          <div 
            onClick={() => setModalOpen(false)}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md p-6 rounded-2xl animate-fadeIn"
            >
              <h2 className="text-2xl font-bold mb-4">Add Task</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                createTask(inputValue);
                setInputValue("");
                setModalOpen(false);
              }}>
                <input 
                  type="text" 
                  placeholder="Task Name" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  ref={inputRef}
                  className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <div className="flex justify-center gap-3">
                  <Button
                    label="Save" 
                    type="submit"
                    disabled={inputValue.trim() === ""}
                  />
                  <Button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setInputValue("");
                      setModalOpen(false);
                    }} 
                    label="Cancel"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
        {editModalOpen && (
          <div 
            onClick={() => setEditModalOpen(false)}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md p-6 rounded-2xl animate-fadeIn"
            >
              <h2 className="text-2xl font-bold mb-4">Edit Task</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                if(selectedTaskId){
                  updateTask(selectedTaskId, inputValue);
                }
                setInputValue("");
                setEditModalOpen(false);
                setSelectedTaskId(null);
              }}>
                <input 
                  type="text" 
                  placeholder="Task Name" 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)} 
                  ref={inputRef}
                  className="w-full p-2 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                <div className="flex justify-center gap-3">
                  <Button
                    label="Save" 
                    type="submit"
                    disabled={inputValue.trim() === ""}
                  />
                  <Button 
                    onClick={() => {
                      setInputValue("");
                      setEditModalOpen(false);
                    }} 
                    label="Cancel"
                  />
                </div>
              </form>
            </div>
          </div>
        )}
        {deleteModalOpen && (
          <div 
            onClick={() => setDeleteModalOpen(false)}
            className="fixed inset-0 flex items-center justify-center bg-black/50 z-50"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-md p-6 rounded-2xl animate-fadeIn"
            >
              <h2 className="text-2xl font-bold mb-4">Delete Task</h2>
              <p className="mb-6">Are you sure you want to delete this task?</p>
                <div className="flex justify-center gap-3">
                  <Button
                    label="Delete"
                    onClick={() => {
                      if (selectedTaskId) {
                        deleteTask(selectedTaskId);
                        setSelectedTaskId(null);
                        setDeleteModalOpen(false);
                      }
                    }}
                  />
                  <Button 
                    onClick={() => {
                      setDeleteModalOpen(false);
                    }} 
                    label="Cancel"
                  />
                </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}