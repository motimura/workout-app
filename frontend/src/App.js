import React, { useState, useEffect } from 'react';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import Auth from './components/Auth';
import { getWorkouts, createWorkout, updateWorkout, deleteWorkout } from './api/workouts';
import { getCurrentUser, signOut } from './api/cognito';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingWorkout, setEditingWorkout] = useState(null);

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      user.getSession((err, session) => {
        if (session && session.isValid()) {
          setIsLoggedIn(true);
        }
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, []);

  const fetchWorkouts = async () => {
    const data = await getWorkouts();
    setWorkouts(data);
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchWorkouts();
    }
  }, [isLoggedIn]);

  const handleSubmit = async (workout, workoutId) => {
    if (workoutId) {
      await updateWorkout(workoutId, workout);
      setEditingWorkout(null);
    } else {
      await createWorkout(workout);
    }
    fetchWorkouts();
  };

  const handleDelete = async (id) => {
    await deleteWorkout(id);
    fetchWorkouts();
  };

  const handleEdit = (workout) => {
    setEditingWorkout(workout);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = () => {
    signOut();
    setIsLoggedIn(false);
    setWorkouts([]);
  };

  if (loading) {
    return <div className="app"><p>読み込み中...</p></div>;
  }

  if (!isLoggedIn) {
    return <Auth onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div className="app">
      <div className="header">
        <h1>💪 ワークアウト記録</h1>
        <button onClick={handleLogout} className="logout-btn">ログアウト</button>
      </div>
      <WorkoutForm
        onSubmit={handleSubmit}
        editingWorkout={editingWorkout}
        onCancelEdit={() => setEditingWorkout(null)}
      />
      <h2>記録一覧</h2>
      <WorkoutList
        workouts={workouts}
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
}

export default App;