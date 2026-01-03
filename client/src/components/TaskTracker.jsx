import React, { useState, useEffect } from 'react';
import { Trash2, Edit2, Plus, X, Check, AlertCircle, Loader } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const TaskTracker = () => {
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    dueDate: '',
    status: 'Pending'
  });

  // Fetch all tasks on component mount
  useEffect(() => {
    fetchTasks();
  }, []);

  // API Functions
  const fetchTasks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/alltasks`);
      const data = await response.json();
      console.log(data.data);
      
      
      if (data.success) {
        setTasks(data.data);
      } else {
        setError('Failed to fetch tasks');
      }
    } catch (err) {
      setError('Unable to connect to server. Please ensure the backend is running on port 5000.');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };


  const createTask = async (taskData) => {
    try {
      const response = await fetch(`${API_URL}/createTask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchTasks();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Create error:', err);
      return { success: false, message: 'Failed to create task' };
    }
  };

  const updateTask = async (id, taskData) => {
    try {
      const response = await fetch(`${API_URL}/updateTask/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchTasks();
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Update error:', err);
      return { success: false, message: 'Failed to update task' };
    }
  };

  const deleteTask = async (id) => {
    try {
      const response = await fetch(`${API_URL}/deleteTask/${id}`, {
        method: 'DELETE'
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchTasks()
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (err) {
      console.error('Delete error:', err);
      return { success: false, message: 'Failed to delete task' };
    }
  };


  // Form Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.dueDate) {
      alert('Please fill in all required fields');
      return;
    }

    setLoading(true);
    let result;

    if (editingTask) {
      result = await updateTask(editingTask._id, formData);
    } else {
      result = await createTask(formData);
    }

    setLoading(false);

    if (result.success) {
      resetForm();
    } else {
      alert(result.message || 'Operation failed');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'Medium',
      dueDate: '',
      status: 'Pending'
    });
    setEditingTask(null);
    setShowForm(false);
  };

  const handleEdit = (task) => {
    setFormData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate.split('T')[0],
      status: task.status
    });
    setEditingTask(task);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setLoading(true);
      const result = await deleteTask(id);
      setLoading(false);
      
      if (!result.success) {
        alert(result.message || 'Failed to delete task');
      }
    }
  };

  const getPriorityColor = (priority) => {
    switch(priority) {
      case 'High': return 'bg-red-100 text-red-800 border-red-300';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'Low': return 'bg-green-100 text-green-800 border-green-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  const pendingTasks = tasks.filter(task => task.status === 'Pending');
  console.log(tasks);
  
  const completedTasks = tasks.filter(task => task.status === 'Completed');
  console.log(completedTasks);
  

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Task Tracker</h1>
              <p className="text-gray-600 mt-1">Connected to MongoDB Backend</p>
            </div>
            <button
              onClick={() => setShowForm(!showForm)}
              disabled={loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? <Loader size={20} className="animate-spin" /> : (showForm ? <X size={20} /> : <Plus size={20} />)}
              {showForm ? 'Cancel' : 'New Task'}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <AlertCircle className="text-red-600 shrink-0 mt-0.5" size={20} />
            <div>
              <h3 className="text-red-800 font-semibold">Connection Error</h3>
              <p className="text-red-700 text-sm mt-1">{error}</p>
              <button
                onClick={fetchTasks}
                className="text-red-600 underline text-sm mt-2 hover:text-red-800"
              >
                Retry Connection
              </button>
            </div>
          </div>
        )}

        {/* Task Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              {editingTask ? 'Edit Task' : 'Create New Task'}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter task title"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Task Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  placeholder="Enter task description (optional)"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Priority
                  </label>
                  <select
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Due Date <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="dueDate"
                    value={formData.dueDate}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading && <Loader size={16} className="animate-spin" />}
                  {editingTask ? 'Update Task' : 'Create Task'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  disabled={loading}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Task Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Total Tasks</p>
            <p className="text-3xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-gray-600 text-sm">Completed</p>
            <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
          </div>
        </div>

        {/* Loading State */}
        {loading && tasks.length === 0 && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <Loader size={40} className="animate-spin mx-auto text-indigo-600 mb-3" />
            <p className="text-gray-600">Loading tasks...</p>
          </div>
        )}

        {/* Pending Tasks */}
        {!loading && (
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Pending Tasks</h2>
            {pendingTasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No pending tasks. Great job! 🎉
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    // onToggleStatus={toggleTaskStatus}
                    getPriorityColor={getPriorityColor}
                    formatDate={formatDate}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Completed Tasks */}
        {!loading && (
          <div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Completed Tasks</h2>
            {completedTasks.length === 0 ? (
              <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                No completed tasks yet
              </div>
            ) : (
              <div className="space-y-3">
                {completedTasks.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    onToggleStatus={toggleTaskStatus}
                    getPriorityColor={getPriorityColor}
                    formatDate={formatDate}
                    loading={loading}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const TaskCard = ({ task, onEdit, onDelete, onToggleStatus, getPriorityColor, formatDate, loading }) => {
  return (
    <div className={`bg-white rounded-lg shadow hover:shadow-md transition-shadow p-4 ${task.status === 'Completed' ? 'opacity-75' : ''}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-3 flex-1">
          <button
            onClick={() => onToggleStatus(task)}
            disabled={loading}
            className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors disabled:opacity-50 ${
              task.status === 'Completed'
                ? 'bg-green-500 border-green-500'
                : 'border-gray-300 hover:border-indigo-500'
            }`}
          >
            {task.status === 'Completed' && <Check size={14} className="text-white" />}
          </button>
          
          <div className="flex-1">
            <h3 className={`text-lg font-semibold ${task.status === 'Completed' ? 'line-through text-gray-500' : 'text-gray-800'}`}>
              {task.title}
            </h3>
            {task.description && (
              <p className="text-gray-600 text-sm mt-1">{task.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 mt-3">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className="text-sm text-gray-600">
                Due: {formatDate(task.dueDate)}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                task.status === 'Completed'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {task.status}
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-2 ml-4">
          <button
            onClick={() => onEdit(task)}
            disabled={loading}
            className="text-blue-600 hover:bg-blue-50 p-2 rounded transition-colors disabled:opacity-50"
            title="Edit"
          >
            <Edit2 size={18} />
          </button>
          <button
            onClick={() => onDelete(task._id)}
            disabled={loading}
            className="text-red-600 hover:bg-red-50 p-2 rounded transition-colors disabled:opacity-50"
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskTracker;