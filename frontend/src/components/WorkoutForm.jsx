import React, { useState, useEffect } from 'react';

const WorkoutForm = ({ onSubmit, editingWorkout, onCancelEdit }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [exercises, setExercises] = useState([
    { exerciseName: '', sets: [{ weight: '', reps: '' }] }
  ]);
  const [memo, setMemo] = useState('');

  useEffect(() => {
    if (editingWorkout) {
      setDate(editingWorkout.date);
      setExercises(editingWorkout.exercises.map(ex => ({
        exerciseName: ex.exerciseName,
        sets: ex.sets.map(s => ({ weight: String(s.weight), reps: String(s.reps) }))
      })));
      setMemo(editingWorkout.memo || '');
    }
  }, [editingWorkout]);

  const resetForm = () => {
    setDate(new Date().toISOString().split('T')[0]);
    setExercises([{ exerciseName: '', sets: [{ weight: '', reps: '' }] }]);
    setMemo('');
  };

  const addExercise = () => {
    setExercises([...exercises, { exerciseName: '', sets: [{ weight: '', reps: '' }] }]);
  };

  const removeExercise = (index) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((_, i) => i !== index));
    }
  };

  const addSet = (exerciseIndex) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets.push({ weight: '', reps: '' });
    setExercises(updated);
  };

  const removeSet = (exerciseIndex, setIndex) => {
    const updated = [...exercises];
    if (updated[exerciseIndex].sets.length > 1) {
      updated[exerciseIndex].sets = updated[exerciseIndex].sets.filter((_, i) => i !== setIndex);
      setExercises(updated);
    }
  };

  const updateExerciseName = (index, name) => {
    const updated = [...exercises];
    updated[index].exerciseName = name;
    setExercises(updated);
  };

  const updateSet = (exerciseIndex, setIndex, field, value) => {
    const updated = [...exercises];
    updated[exerciseIndex].sets[setIndex][field] = value;
    setExercises(updated);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const workout = {
      date,
      exercises: exercises.map(ex => ({
        exerciseName: ex.exerciseName,
        sets: ex.sets.map(s => ({
          weight: Number(s.weight),
          reps: Number(s.reps)
        }))
      })),
      memo
    };

    onSubmit(workout, editingWorkout?.workoutId);
    resetForm();
  };

  const handleCancel = () => {
    resetForm();
    onCancelEdit();
  };

  return (
    <form onSubmit={handleSubmit} className="workout-form">
      {editingWorkout && (
        <div className="editing-badge">編集中</div>
      )}

      <div className="form-group">
        <label>日付</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
      </div>

      {exercises.map((exercise, exIndex) => (
        <div key={exIndex} className="exercise-block">
          <div className="exercise-header">
            <input
              type="text"
              value={exercise.exerciseName}
              onChange={(e) => updateExerciseName(exIndex, e.target.value)}
              placeholder="種目名（例: ベンチプレス）"
              className="exercise-name-input"
              required
            />
            {exercises.length > 1 && (
              <button type="button" onClick={() => removeExercise(exIndex)} className="remove-btn">
                ✕
              </button>
            )}
          </div>

          {exercise.sets.map((set, setIndex) => (
            <div key={setIndex} className="set-row">
              <span className="set-number">{setIndex + 1}</span>
              <input
                type="number"
                value={set.weight}
                onChange={(e) => updateSet(exIndex, setIndex, 'weight', e.target.value)}
                placeholder="kg"
                className="set-input"
                required
              />
              <span className="set-separator">×</span>
              <input
                type="number"
                value={set.reps}
                onChange={(e) => updateSet(exIndex, setIndex, 'reps', e.target.value)}
                placeholder="回"
                className="set-input"
                required
              />
              {exercise.sets.length > 1 && (
                <button type="button" onClick={() => removeSet(exIndex, setIndex)} className="remove-set-btn">
                  ✕
                </button>
              )}
            </div>
          ))}

          <button type="button" onClick={() => addSet(exIndex)} className="add-set-btn">
            + セット追加
          </button>
        </div>
      ))}

      <button type="button" onClick={addExercise} className="add-exercise-btn">
        + 種目追加
      </button>

      <div className="form-group">
        <label>メモ</label>
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="調子など"
        />
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          {editingWorkout ? '更新する' : '記録する'}
        </button>
        {editingWorkout && (
          <button type="button" onClick={handleCancel} className="cancel-btn">
            キャンセル
          </button>
        )}
      </div>
    </form>
  );
};

export default WorkoutForm;