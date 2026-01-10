import { getToken } from './cognito';

const API_URL = process.env.REACT_APP_API_URL;

const getHeaders = async () => {
  const token = await getToken();
  return {
    'Content-Type': 'application/json',
    'Authorization': token
  };
};

export const getWorkouts = async () => {
  const headers = await getHeaders();
  const response = await fetch(API_URL, { headers });
  const data = await response.json();
  return data.workouts;
};

export const getWorkout = async (id) => {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}/${id}`, { headers });
  return response.json();
};

export const createWorkout = async (workout) => {
  const headers = await getHeaders();
  const response = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify(workout),
  });
  return response.json();
};

export const deleteWorkout = async (id) => {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
    headers,
  });
  return response.json();
};

export const updateWorkout = async (id, workout) => {
  const headers = await getHeaders();
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers,
    body: JSON.stringify(workout),
  });
  return response.json();
};