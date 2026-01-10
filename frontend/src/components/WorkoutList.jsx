import React from 'react';

const WorkoutList = ({ workouts, onDelete, onEdit }) => {
  if (workouts.length === 0) {
    return <p className="no-data">記録がありません</p>;
  }

  return (
    <ul className="workout-list">
      {workouts.map((workout) => (
        <li key={workout.workoutId} className="workout-item">
          <div className="workout-info">
            <div className="workout-date">{workout.date}</div>
            <div className="workout-exercises">
              {workout.exercises.map((ex, i) => (
                <div key={i} className="exercise-summary">
                  <span className="exercise-name">{ex.exerciseName}</span>
                  <span className="exercise-sets">
                    {ex.sets.map((s, j) => (
                      <span key={j} className="set-info">
                        {s.weight}kg×{s.reps}
                      </span>
                    ))}
                  </span>
                </div>
              ))}
            </div>
            {workout.memo && <div className="workout-memo">{workout.memo}</div>}
          </div>
          <div className="workout-actions">
            <button
              className="edit-btn"
              onClick={() => onEdit(workout)}
            >
              編集
            </button>
            <button
              className="delete-btn"
              onClick={() => onDelete(workout.workoutId)}
            >
              削除
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default WorkoutList;