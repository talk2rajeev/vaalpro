import React from 'react';
import { useGetTodosQuery } from '../api/apiSlice';

const DashboardPage: React.FC = () => {
  const { data: todos, isLoading, isError, error } = useGetTodosQuery();

  if (isLoading) return <div className="p-8">Loading todos...</div>;
  if (isError) return <div className="p-8 text-red-500">Error: {JSON.stringify(error)}</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">ValDoc Dashboard</h1>
      <div className="bg-white shadow-lg rounded-lg overflow-hidden border border-gray-200">
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700">Todo List (Redux-Toolkit & RTK Query Test)</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {todos?.slice(0, 10).map((todo: any) => (
            <li key={todo.id} className="px-6 py-4 flex items-center hover:bg-gray-50 transition-colors">
              <span className={`w-3 h-3 rounded-full mr-4 ${todo.completed ? 'bg-green-500' : 'bg-yellow-500'}`} />
              <span className={`text-lg ${todo.completed ? 'line-through text-gray-400' : 'text-gray-700'}`}>
                {todo.title}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default DashboardPage;
