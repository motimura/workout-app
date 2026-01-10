import React, { useState, useEffect } from 'react';
import WorkoutList from './components/WorkoutList';
import WorkoutForm from './components/WorkoutForm';
import { getWorkouts, createWorkout, deleteWorkout } from './api/workouts';
import './App.css';

function App() {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWorkouts = async () => {
    setLoading(true);
    const data = await getWorkouts();
    setWorkouts(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const handleCreate = async (workout) => {
    await createWorkout(workout);
    fetchWorkouts();
  };

  const handleDelete = async (id) => {
    await deleteWorkout(id);
    fetchWorkouts();
  };

  return (
    <div className="app">
      <h1>💪 ワークアウト記録</h1>
      <WorkoutForm onSubmit={handleCreate} />
      <h2>記録一覧</h2>
      {loading ? (
        <p>読み込み中...</p>
      ) : (
        <WorkoutList
          workouts={workouts}
          onDelete={handleDelete}
          onSelect={(w) => console.log(w)}
        />
      )}
    </div>
  );
}

export default App;