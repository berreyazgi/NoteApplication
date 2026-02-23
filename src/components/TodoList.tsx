import React, { useState } from 'react';
import { useApp } from '../context/StateContext';
import { Trash2, Plus, CheckCircle, Circle } from 'lucide-react';

const TodoList: React.FC = () => {
  const { todos, addTodo, toggleTodo, deleteTodo, updateTodoText } = useApp();
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim()) {
      addTodo(inputValue.trim());
      setInputValue('');
    }
  };

  return (
    <div className="widget">
      <div className="widget-header">
        <h2>To-Do List</h2>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-8">
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-grow bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-base font-medium outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500/40 placeholder:text-white/20 text-white transition-all"
        />
        <button type="submit" className="bg-gradient-to-br from-violet-600 to-indigo-600 text-white p-4 rounded-2xl hover:from-violet-500 hover:to-indigo-500 transition-all shadow-lg shadow-violet-500/20 active:scale-95">
          <Plus size={24} />
        </button>
      </form>

      <div className="todo-list">
        {todos.map(todo => (
          <div key={todo.id} className="todo-item">
            <button onClick={() => toggleTodo(todo.id)} className="btn-icon shrink-0">
              {todo.completed ? (
                <CheckCircle size={20} color="#7B6CF6" fill="rgba(123,108,246,0.15)" />
              ) : (
                <Circle size={20} color="rgba(255,255,255,0.2)" />
              )}
            </button>
            <input
              className={`todo-text ${todo.completed ? 'completed' : ''}`}
              value={todo.text}
              onChange={(e) => updateTodoText(todo.id, e.target.value)}
              style={{
                border: 'none',
                background: 'transparent',
                outline: 'none',
                width: '100%',
                color: todo.completed ? 'rgba(255,255,255,0.3)' : '#E8E6F0'
              }}
            />
            <button onClick={() => deleteTodo(todo.id)} className="btn-icon shrink-0" style={{ marginLeft: 'auto' }}>
              <Trash2 size={18} color="#ef4444" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TodoList;
