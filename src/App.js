import React, { useState, useEffect, useRef } from "react";
import { 
  FaBell, 
  FaCheck, 
  FaClock, 
  FaEdit, 
  FaTrash, 
  FaBirthdayCake, 
  FaStop, 
  FaRedo, 
  FaUserPlus,
  FaTimes,
  FaPlay,
  FaGoogle,
  FaEnvelope,
  FaLock,
  FaUser
} from "react-icons/fa";
import { Chart } from "react-google-charts";
import "./App.css";
// Firebase Configuration

import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from 'firebase/auth';
import logo from '/home/vikash/Vicky files/task-manager/src/Antsign2 .png';

// Firebase Configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Login Component
const Login = ({ onLogin }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isSignup) {
        await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
      } else {
        await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
      }
      onLogin();
    } catch (error) {
      console.error(error);
      setError(error.message); // Display error message
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      onLogin();
    } catch (error) {
      console.error(error);
      setError(error.message); // Display error message
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-panel">
          <div className="logo-section">
          <img src={logo} alt="Lotus Logo" className="lotus-logo" />
            <h1>We are The AntSign Technologies</h1>
          </div>
          
          <p className="login-prompt">Please login to your account</p>
          
          <form onSubmit={handleEmailAuth}>
            <input
              type="email"
              placeholder="Username"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
            />
            
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            />
            
            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'LOADING...' : 'LOG IN'}
            </button>
          </form>
          
          {error && <p className="error-message">{error}</p>} {/* Display error message */}
          
          <button onClick={handleGoogleLogin} className="google-button">
            Sign in with Google
          </button>
          
          <a href="#" className="forgot-link">Forgot password?</a>
          
          <div className="signup-section">
            <span>Don't have an account? </span>
            <button onClick={() => setIsSignup(true)} className="create-button">
              CREATE NEW
            </button>
          </div>
        </div>
        
        <div className="content-panel">
          <h2>We are more than just a company</h2>
          <p>Antsign Technologies believes in a future where technology is accessible to all. By embracing open-source principles, the company encourages innovation and community engagement, allowing everyone to contribute to and benefit from technological advancements. Their commitment to quality and customer satisfaction positions them as a reliable partner for businesses looking to thrive in an increasingly digital world.</p>
        </div>
      </div>
    </div>
  );
}

// TaskForm Component
const TaskForm = ({ task, setTask, handleSubmit, handleAlarmUpload }) => {
  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={task.title}
            onChange={(e) => setTask(prev => ({ ...prev, title: e.target.value }))}
            required
            className="input-field"
            placeholder="Task Title"
          />
        </div>

        <div className="form-group">
          <label>Description</label>
          <textarea
            value={task.description}
            onChange={(e) => setTask(prev => ({ ...prev, description: e.target.value }))}
            className="input-field"
            placeholder="Task Description"
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Priority</label>
            <select 
              value={task.priority}
              onChange={(e) => setTask(prev => ({ ...prev, priority: e.target.value }))}
              className="select-field"
            >
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="form-group">
            <label>Category</label>
            <select 
              value={task.category}
              onChange={(e) => setTask(prev => ({ ...prev, category: e.target.value }))}
              className="select-field"
            >
              <option value="Work">Work</option>
              <option value="Personal">Personal</option>
              <option value="Shopping">Shopping</option>
              <option value="Health">Health</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Due Date & Time</label>
            <input
              type="datetime-local"
              value={task.date}
              onChange={(e) => setTask(prev => ({ ...prev, date: e.target.value }))}
              className="input-field"
            />
          </div>

          <div className="form-group">
            <label>Status</label>
            <select 
              value={task.status}
              onChange={(e) => setTask(prev => ({ ...prev, status: e.target.value }))}
              className="select-field"
            >
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
              <option value="In Review">In Review</option>
              <option value="Canceled">Canceled</option>
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Alarm Sound</label>
          <div className="file-input-container">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAlarmUpload}
              className="file-input"
            />
            {task.alarmSound && (
              <button 
                type="button" 
                onClick={() => {
                  const audio = new Audio(task.alarmSound);
                  audio.play();
                }}
                className="preview-button"
              >
                <FaPlay /> Preview
              </button>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button">
        {task.id ? "Update Task" : "Add Task"}
      </button>
    </form>
  );
};

// TaskList Component
const TaskList = ({ 
  tasks, 
  onComplete, 
  onDelete, 
  onSnooze, 
  onShare, 
  onRepeat, 
  onEdit,
  activeAlarms,
  stopAlarm 
}) => {
  return (
    <div className="task-list">
      <h2>Tasks</h2>
      {tasks.length === 0 ? (
        <p className="no-tasks">No tasks available.</p>
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className={`task-card ${task.completed ? "completed" : ""} ${task.status === "Overdue" ? "overdue" : ""}`}
            >
              <div className="task-header">
                <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
                <span className="category-badge">{task.category}</span>
                {task.sharedWith?.length > 0 && (
                  <span className="shared-badge">
                    Shared ({task.sharedWith.length})
                  </span>
                )}
              </div>

              <h3 className="task-title">{task.title}</h3>
              <p className="task-description">{task.description}</p>

              <div className="task-info">
                <span className="due-date">
                  <FaClock /> {new Date(task.date).toLocaleString()}
                </span>
                <span className={`status-badge ${task.status.toLowerCase().replace(" ", "-")}`}>
                  {task.status}
                </span>
              </div>

              <div className="task-actions">
                <button onClick={() => onEdit(task)} className="edit-button">
                  <FaEdit />
                </button>
                <button onClick={() => onDelete(task.id)} className="delete-button">
                  <FaTrash />
                </button>
                <button onClick={() => onSnooze(task.id)} className="snooze-button">
                  <FaClock />
                </button>
                <button onClick={() => onShare(task.id)} className="share-button">
                  <FaUserPlus />
                </button>
                {task.completed && (
                  <button onClick={() => onRepeat(task)} className="repeat-button">
                    <FaRedo />
                  </button>
                )}
                {activeAlarms.current.has(task.id) && (
                  <button 
                    onClick={() => stopAlarm(task.id)}
                    className="stop-alarm-button"
                  >
                    <FaStop />
                  </button>
                )}
                {!task.completed && (
                  <button 
                    onClick={() => onComplete(task.id)}
                    className="complete-button"
                  >
                    <FaCheck />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ShareModal Component
const ShareModal = ({ 
  show, 
  onClose, 
  inviteEmail, 
  setInviteEmail, 
  onSubmit,
  sharedWith = [],
  onRemoveShare,
  taskId
}) => {
  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>Share Task</h3>
          <button onClick={onClose} className="close-button">
            <FaTimes />
          </button>
        </div>
        <form onSubmit={onSubmit} className="share-form">
          <div className="form-group">
            <label>Email Address:</label>
            <input
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter email to share"
              required
              className="input-field"
            />
          </div>
          <button type="submit" className="submit-button">
            Share Task
          </button>
        </form>

        {sharedWith.length > 0 && (
          <div className="shared-users-section">
            <h4>Shared With:</h4>
            <ul className="shared-users-list">
              {sharedWith.map((email, index) => (
                <li key={index} className="shared-user-item">
                  <span>{email}</span>
                  <button
                    onClick={() => onRemoveShare(taskId, email)}
className="remove-share-button"
                    title="Remove share"
                  >
                    <FaTrash />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// BirthdayForm Component
const BirthdayForm = ({ birthday, setBirthday, handleSubmit, handleAlarmUpload }) => {
  return (
    <form className="birthday-form" onSubmit={handleSubmit}>
      <div className="form-grid">
        <div className="form-group">
          <label>Name</label>
          <input
            type="text"
            value={birthday.name}
            onChange={(e) => setBirthday(prev => ({ ...prev, name: e.target.value }))}
            required
            className="input-field"
            placeholder="Person's Name"
          />
        </div>

        <div className="form-group">
          <label>Birth Date</label>
          <input
            type="date"
            value={birthday.date}
            onChange={(e) => setBirthday(prev => ({ ...prev, date: e.target.value }))}
            required
            className="input-field"
          />
        </div>

        <div className="form-group">
          <label>Reminder Sound</label>
          <div className="file-input-container">
            <input
              type="file"
              accept="audio/*"
              onChange={handleAlarmUpload}
              className="file-input"
            />
            {birthday.alarmSound && (
              <button 
                type="button" 
                onClick={() => {
                  const audio = new Audio(birthday.alarmSound);
                  audio.play();
                }}
                className="preview-button"
              >
                <FaPlay /> Preview
              </button>
            )}
          </div>
        </div>
      </div>

      <button type="submit" className="submit-button">
        {birthday.id ? "Update Birthday" : "Add Birthday"}
      </button>
    </form>
  );
};

// BirthdayList Component
const BirthdayList = ({ birthdays, onEdit, onDelete }) => {
  const getNextBirthdayDate = (birthDate) => {
    const today = new Date();
    const birthday = new Date(birthDate);
    birthday.setFullYear(today.getFullYear());
    
    if (birthday < today) {
      birthday.setFullYear(today.getFullYear() + 1);
    }
    
    return birthday;
  };

  const sortedBirthdays = [...birthdays].sort((a, b) => {
    return getNextBirthdayDate(a.date) - getNextBirthdayDate(b.date);
  });

  return (
    <div className="birthday-list">
      <h2>Birthday Reminders</h2>
      {sortedBirthdays.length === 0 ? (
        <p className="no-birthdays">No birthdays added yet.</p>
      ) : (
        <div className="birthday-grid">
          {sortedBirthdays.map((birthday) => {
            const nextBirthday = getNextBirthdayDate(birthday.date);
            const daysUntil = Math.ceil(
              (nextBirthday - new Date()) / (1000 * 60 * 60 * 24)
            );
            
            return (
              <div key={birthday.id} className="birthday-card">
                <div className="birthday-icon">
                  <FaBirthdayCake />
                </div>
                <h3 className="birthday-name">{birthday.name}</h3>
                <p className="birthday-date">
                  {new Date(birthday.date).toLocaleDateString()}
                </p>
                <p className="days-until">
                  {daysUntil === 0
                    ? "Today!"
                    : daysUntil === 1
                    ? "Tomorrow!"
                    : `${daysUntil} days away`}
                </p>
                <div className="birthday-actions">
                  <button onClick={() => onEdit(birthday)} className="edit-button">
                    <FaEdit />
                  </button>
                  <button onClick={() => onDelete(birthday.id)} className="delete-button">
                    <FaTrash />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const activeAlarms = useRef(new Set());
  const alarmAudios = useRef(new Map());
  
  const [tasks, setTasks] = useState([]);
  const [birthdays, setBirthdays] = useState([]);
  const [activeTab, setActiveTab] = useState('tasks');
  const [alarmPaused, setAlarmPaused] = useState(false);
  const [showShareModal, setShowShareModal] = useState(null);
  
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [sortBy, setSortBy] = useState("date");
  const [inviteEmail, setInviteEmail] = useState("");

  // Initialize task state with default values
  const getDefaultDateTime = () => {
    const date = new Date();
    date.setMinutes(date.getMinutes() + 30);
    return date.toISOString().slice(0, 16);
  };

  const [task, setTask] = useState({
    title: "",
    description: "",
    priority: "Medium",
    date: getDefaultDateTime(),
    status: "In Progress",
    alarm: null,
    alarmSound: null,
    completed: false,
    category: "Work",
    sharedWith: [],
    assignedBy: null,
    repeat: false
  });

  // Initialize birthday state
  const [birthday, setBirthday] = useState({
    name: "",
    date: "",
    alarm: null,
    alarmSound: null,
  });

  // Authentication effect
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsLoggedIn(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Notification permission effect
  useEffect(() => {
    if (!("Notification" in window)) {
      console.warn("This browser does not support desktop notifications");
      return;
    }
    
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  // Alarm checking effect
  useEffect(() => {
    if (alarmPaused) {
      stopAllAlarms();
      return;
    }

    const checkTaskAlarms = () => {
      const now = new Date();
      
      tasks.forEach((taskItem) => {
        if (!taskItem.completed && taskItem.status !== "Completed") {
          const taskDate = new Date(taskItem.date);
          const isOverdue = taskDate <= now;
          const alarmNotActive = !activeAlarms.current.has(taskItem.id);
          
          if (isOverdue && alarmNotActive) {
            // Send notification
            if (Notification.permission === "granted") {
              new Notification(`Task Due: ${taskItem.title}`, {
                body: taskItem.description || "Your task is due now!",
                icon: "/favicon.ico"
              });
            }

            // Play alarm sound if available
            if (taskItem.alarmSound) {
              try {
                const audio = new Audio(taskItem.alarmSound);
                audio.loop = true;
                
                const playPromise = audio.play();
                if (playPromise !== undefined) {
                  playPromise
                    .then(() => {
                      alarmAudios.current.set(taskItem.id, audio);
                      activeAlarms.current.add(taskItem.id);
                    })
                    .catch(error => {
                      console.error("Error playing alarm:", error);
                    });
                }
              } catch (error) {
                console.error("Error creating audio:", error);
              }
            }

            // Update task status
            setTasks(prevTasks => 
              prevTasks.map(t => 
                t.id === taskItem.id ? { ...t, status: "Overdue" } : t
              )
            );
          }
        }
      });
    };

    const checkBirthdayAlarms = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      birthdays.forEach((birthdayItem) => {
        const birthdayDate = new Date(birthdayItem.date);
        
        // Check for tomorrow's birthdays
        if (
          birthdayDate.getDate() === tomorrow.getDate() &&
          birthdayDate.getMonth() === tomorrow.getMonth()
        ) {
          if (Notification.permission === "granted") {
            new Notification(`Birthday Tomorrow: ${birthdayItem.name}`, {
              body: `Don't forget ${birthdayItem.name}'s birthday tomorrow!`,
              icon: "/favicon.ico"
            });
          }
        }

        // Check for today's birthdays
        if (
          birthdayDate.getDate() === today.getDate() &&
          birthdayDate.getMonth() === today.getMonth() &&
          !activeAlarms.current.has(`birthday-${birthdayItem.id}`)
        ) {
          if (birthdayItem.alarmSound && !alarmPaused) {
            try {
              const audio = new Audio(birthdayItem.alarmSound);
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                playPromise
                  .then(() => {
                    activeAlarms.current.add(`birthday-${birthdayItem.id}`);
                  })
                  .catch(console.error);
              }
            } catch (error) {
              console.error("Error playing birthday alarm:", error);
            }
          }
        }
      });
    };

    const intervalId = setInterval(() => {
      checkTaskAlarms();
      checkBirthdayAlarms();
    }, 60000); // Check every minute

    // Initial check
    checkTaskAlarms();
    checkBirthdayAlarms();

    return () => {
      clearInterval(intervalId);
      stopAllAlarms();
    };
  }, [tasks, birthdays, alarmPaused]);

  const stopAlarm = (id) => {
    const audio = alarmAudios.current.get(id);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
      alarmAudios.current.delete(id);
      activeAlarms.current.delete(id);
      
      // Update task status when alarm is stopped
      setTasks(prev =>
        prev.map(t =>
          t.id === id
            ? { ...t, status: t.status === "Overdue" ? "In Progress" : t.status }
            : t
        )
      );
    }
  };
  
  const stopAllAlarms = () => {
    alarmAudios.current.forEach((audio, id) => {
      audio.pause();
      audio.currentTime = 0;
      
      // Update status for all tasks with active alarms
      setTasks(prev =>
        prev.map(t =>
          activeAlarms.current.has(t.id)
            ? { ...t, status: t.status === "Overdue" ? "In Progress" : t.status }
            : t
        )
      );
    });
    
    alarmAudios.current.clear();
    activeAlarms.current.clear();
  };
  
  // Update the alarm checking effect
  useEffect(() => {
    if (alarmPaused) {
      stopAllAlarms();
      return;
    }
  
    const checkTaskAlarms = () => {
      const now = new Date();
      
      tasks.forEach((taskItem) => {
        // Skip if task is completed or marked as Completed
        if (taskItem.completed || taskItem.status === "Completed") {
          return;
        }
  
        const taskDate = new Date(taskItem.date);
        const isOverdue = taskDate <= now;
        const alarmNotActive = !activeAlarms.current.has(taskItem.id);
        
        if (isOverdue && alarmNotActive) {
          // Show notification if permitted
          if (Notification.permission === "granted") {
            new Notification(`Task Due: ${taskItem.title}`, {
              body: taskItem.description || "Your task is due now!",
              icon: "/favicon.ico"
            });
          }
  
          // Only play alarm if custom sound is provided and task isn't completed
          if (taskItem.alarmSound && !taskItem.completed) {
            try {
              const audio = new Audio(taskItem.alarmSound);
              audio.loop = false;
              
              // Store audio element before playing
              alarmAudios.current.set(taskItem.id, audio);
              activeAlarms.current.add(taskItem.id);
              
              const playPromise = audio.play();
              if (playPromise !== undefined) {
                playPromise.catch(error => {
                  console.error("Error playing alarm:", error);
                  // Clean up on error
                  alarmAudios.current.delete(taskItem.id);
                  activeAlarms.current.delete(taskItem.id);
                });
              }
            } catch (error) {
              console.error("Error creating audio:", error);
            }
          }
        }
      });
    };
  
    // Set up the interval to check alarms
    const intervalId = setInterval(checkTaskAlarms, 1000);
    
    // Clean up on unmount
    return () => clearInterval(intervalId);
  }, [tasks, alarmPaused]);

  const handleAlarmSoundUpload = (e, type) => {
    const file = e.target.files[0];
    if (file) {
      const audioURL = URL.createObjectURL(file);
      if (type === 'task') {
        setTask(prev => ({
          ...prev,
          alarm: file,
          alarmSound: audioURL
        }));
      } else {
        setBirthday(prev => ({
          ...prev,
          alarm: file,
          alarmSound: audioURL
        }));
      }
    }
  };

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (task.id) {
      setTasks(prevTasks =>
        prevTasks.map(t =>
          t.id === task.id
            ? { ...task, id: t.id, alarmSound: task.alarmSound || t.alarmSound }
            : t
        )
      );
    } else {
      setTasks([...tasks, { ...task, id: Date.now(), alarmSound: task.alarmSound }]);
    }
    setTask({
      title: "",
      description: "",
      priority: "Medium",
      date: getDefaultDateTime(),
      status: "In Progress",
      alarm: null,
      alarmSound: null,
      completed: false,
      category: "Work",
      sharedWith: [],
      assignedBy: null,
      repeat: false
    });
  };

  const handleBirthdaySubmit = (e) => {
    e.preventDefault();
    const newBirthday = {
      ...birthday,
      id: birthday.id || Date.now(),
      date: new Date(birthday.date).setHours(12, 0, 0, 0)
    };
    
    if (birthday.id) {
      setBirthdays(prev => prev.map(b => b.id === birthday.id ? newBirthday : b));
    } else {
      setBirthdays([...birthdays, newBirthday]);
    }
    
    setBirthday({
      name: "",
      date: "",
      alarm: null,
      alarmSound: null
    });
  };

  const handleCompleteTask = (id) => {
    setTasks(prev =>
      prev.map(t =>
        t.id === id ? { ...t, completed: true, status: "Completed" } : t
      )
    );
    stopAlarm(id);
  };

  const handleSnooze = (id) => {
    const snoozeTime = new Date(Date.now() + 30 * 60000);
    setTasks(prev =>
      prev.map(t =>
        t.id === id
          ? {
              ...t,
              date: snoozeTime.toISOString().slice(0, 16),
              status: "In Progress"
            }
          : t
      )
    );
    stopAlarm(id);
  };

  const handleDeleteTask = (id) => {
    stopAlarm(id);
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  const handleRepeatTask = (task) => {
    const newTask = {
      ...task,
      id: Date.now(),
      completed: false,
      status: "In Progress",
      date: getDefaultDateTime(),
      sharedWith: [],
      assignedBy: null
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  const handleShareTask = async (e) => {
    e.preventDefault();
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inviteEmail)) {
      alert("Please enter a valid email address");
      return;
    }
  
    const taskToShare = tasks.find(t => t.id === showShareModal);
    
    try {
      const response = await fetch('http://localhost:5000/api/share-task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskDetails: taskToShare,
          recipientEmail: inviteEmail
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to share task');
      }
  
      // Update local state only after successful sharing
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === showShareModal
            ? {
                ...task,
                sharedWith: [...(task.sharedWith || []), inviteEmail]
              }
            : task
        )
      );
  
      alert('Task shared successfully!');
      setInviteEmail("");
      setShowShareModal(null);
    } catch (error) {
      console.error('Error sharing task:', error);
      alert('Failed to share task. Please try again.');
    }
  };

  const handleRemoveShare = (taskId, email) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              sharedWith: task.sharedWith.filter(sharedEmail => sharedEmail !== email)
            }
          : task
      )
    );
  };

  const filteredTasks = tasks
    .filter(t => filterStatus === "All" ? true : t.status === filterStatus)
    .filter(t => filterPriority === "All" ? true : t.priority === filterPriority)
    .sort((a, b) => {
      switch (sortBy) {
        case "date":
          return new Date(a.date) - new Date(b.date);
        case "priority":
          const priorityOrder = { High: 0, Medium: 1, Low: 2 };
          return priorityOrder[a.priority] - priorityOrder[b.priority];
        default:
          return 0;
      }
    });

  if (!isLoggedIn) {
    return <Login onLogin={() => setIsLoggedIn(true)} />;
  }
  return (
    <div className="app-container">
      <header className="app-header">
        <img src="/Tasko1.png" alt="Tasko Logo" className="app-logo" />
        <h1 className="app-title">Tasko</h1>
        <button 
          className={`bell-button ${alarmPaused ? 'paused' : ''}`}
          onClick={() => setAlarmPaused(!alarmPaused)}
        >
          <FaBell />
        </button>
      </header>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tasks
        </button>
        <button 
          className={`tab-button ${activeTab === 'birthdays' ? 'active' : ''}`}
          onClick={() => setActiveTab('birthdays')}
        >
          Birthday Reminders
        </button>
      </div>

      {activeTab === 'tasks' ? (
        <>
          <TaskForm 
            task={task}
            setTask={setTask}
            handleSubmit={handleTaskSubmit}
            handleAlarmUpload={(e) => handleAlarmSoundUpload(e, 'task')}
          />

          <div className="task-filters">
            <div className="filter-group">
              <label>Status:</label>
              <select 
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="filter-select"
              >
                <option value="All">All</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Overdue">Overdue</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Priority:</label>
              <select 
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="filter-select"
              >
                <option value="All">All</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div className="filter-group">
              <label>Sort By:</label>
              <select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="filter-select"
              >
                <option value="date">Due Date</option>
                <option value="priority">Priority</option>
              </select>
            </div>
          </div>

          <TaskList 
            tasks={filteredTasks}
            onComplete={handleCompleteTask}
            onDelete={handleDeleteTask}
            onSnooze={handleSnooze}
            onShare={setShowShareModal}
            onRepeat={handleRepeatTask}
            onEdit={setTask}
            activeAlarms={activeAlarms}
            stopAlarm={stopAlarm}
          />

          <div className="chart-container">
            <Chart
              chartType="PieChart"
              data={[
                ["Task Status", "Count"],
                ["Completed", tasks.filter((t) => t.completed).length],
                ["Pending", tasks.filter((t) => !t.completed).length],
                ["Overdue", tasks.filter((t) => t.status === "Overdue").length],
              ]}
              options={{ 
                title: "Task Completion Status",
                colors: ['#2ecc71', '#3498db', '#e74c3c'],
                backgroundColor: 'transparent',
                legend: { position: 'bottom' }
              }}
              width={"100%"}
              height={"400px"}
            />
          </div>
        </>
      ) : (
        <>
          <BirthdayForm 
            birthday={birthday}
            setBirthday={setBirthday}
            handleSubmit={handleBirthdaySubmit}
            handleAlarmUpload={(e) => handleAlarmSoundUpload(e, 'birthday')}
          />
          <BirthdayList 
            birthdays={birthdays}
            onEdit={setBirthday}
            onDelete={(id) => setBirthdays(prev => prev.filter(b => b.id !== id))}
          />
        </>
      )}

      <ShareModal 
        show={showShareModal !== null}
        taskId={showShareModal}
        onClose={() => setShowShareModal(null)}
        inviteEmail={inviteEmail}
        setInviteEmail={setInviteEmail}
        onSubmit={handleShareTask}
        sharedWith={tasks.find(t => t.id === showShareModal)?.sharedWith || []}
        onRemoveShare={handleRemoveShare}
      />


    </div>
  );
};
export default App;