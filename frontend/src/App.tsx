// frontend/src/App.tsx
import { useContext, useEffect, useState } from 'react';
import { httpsCallable }                       from 'firebase/functions';
import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  where
}                                              from 'firebase/firestore';
import { AuthCtx }                             from './contexts/AuthContext';
import { db, functions }                       from './firebase';
import type { LogWithTask, Task }              from './types';
import TaskForm                                from './components/TaskForm';

export default function App() {
  // ① Get the signed-in user (or null if signed out)
  const user = useContext(AuthCtx);

  // ② State: the list of today’s LogEntries joined with their Task
  const [entries, setEntries] = useState<LogWithTask[]>([]);

  // ③ Subscribe to today’s logEntries whenever the user changes
  useEffect(() => {
    if (!user) return;  // nothing to do if not signed in

    const today = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
    const q = query(
      collection(db, 'logEntries'),
      where('userId', '==', user.uid),
      where('date',   '==', today)
    );

    const unsub = onSnapshot(q, async snap => {
      // ③a Flatten each doc to { id, userId, taskId, date, status }
      const raw = snap.docs.map(d => ({
        id: d.id,
        ...(d.data() as Omit<LogWithTask, 'id' | 'task'>)
      }));

      // ③b Fetch the full Task objects for each distinct taskId
      const uniqueIds = [...new Set(raw.map(e => e.taskId))];
      const tasks: Task[] = await Promise.all(
        uniqueIds.map(id =>
          getDoc(doc(db, 'tasks', id)).then(snap =>
            snap.data() as Task
          )
        )
      );

      // ③c Build a lookup from taskId → Task
      const taskMap: Record<string, Task> = Object.fromEntries(
        uniqueIds.map((id, i) => [id, tasks[i]])
      );

      // ③d Merge each LogEntry with its Task and update state
      setEntries(
        raw.map(e => ({ ...e, task: taskMap[e.taskId] }))
      );
    });

    return unsub;  // cleanup listener on unmount or user change
  }, [user]);

  // ④ Prepare the callable function for toggling completion
  const completeTaskFn = httpsCallable(functions, 'completeTask');
  const toggle = async (entryId: string) => {
    await completeTaskFn({ entryId });
  };

  // ⑤ If explicitly signed out, prompt to log in
  if (user === null) return <h1>Please log in to continue</h1>;

  // ⑥ Render
  return (
    <div>
      <h1>Today's Tasks</h1>

      {/* Task creation form */}
      <TaskForm />

      {/* Either show empty state or the list */}
      {entries.length === 0 ? (
        <p>No tasks for today! 🎉</p>
      ) : (
        <ul>
          {entries.map(e => (
            <li key={e.id}>
              <label>
                <input
                  type="checkbox"
                  checked={e.status === 'completed'}
                  onChange={() => toggle(e.id)}
                />
                {' '}{e.task.title}
              </label>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
