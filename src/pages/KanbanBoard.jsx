import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Tasks from '../components/Tasks';
import Paper from '@mui/material/Paper';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import AddNewTask from '../components/AddTask';

const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  textAlign: 'center',
  color: theme.palette.text.secondary,
  minHeight: '80vh'
}));

const darkTheme = createTheme({ palette: { mode: 'dark' } });

function KanbanBoard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/todos')
      .then(res => setTasks(res.data))
      .catch(err => console.log('Error fetching tasks', err));
  }, []);
  const GetTasks =()=>{
    axios.get('http://localhost:3000/todos')
      .then(res => setTasks(res.data))
      .catch(err => console.log('Error fetching tasks', err));
  }
  const AddTask = (event, formData) => {
    
  
    axios.post('http://localhost:3000/todos', formData, {headers: {
      'content-type': 'application/json'
  }})
      .then(res => {
        setTasks(prevState => [...prevState, res.data]);
        event.target.reset();
        
      })
      .catch(err => console.log('Error adding task', err));
  }
  const DeleteTask = (taskId) => {
    axios.delete(`http://localhost:3000/todos/${taskId}`)
      .then(() => {
        setTasks(prevState => prevState.filter(task => task.id !== taskId));
      })
      .catch(err => console.log('Error deleting task', err));
  }
  const EditStatus = (taskId, formData) => {
    axios.put(`http://localhost:3000/todos/${taskId}`, formData, {headers: {
        'content-type': 'application/json'
    }})
    .then(res => {
        setTasks(prevState => prevState.map(task => {
          if (task.id === res.data.id) {
            return res.data;
          } else {
            return task;
          }
        })) 
    
    })
      .catch(err => console.log('Error editing task', err));
  }

  return (

    <div className="kanban-board" style={{display: 'flex',flexDirection:'row',  width: '90vw', justifyContent: 'space-evenly', minHeight: '80vh'}}>
        <ThemeProvider theme={darkTheme}>
            <Item elevation={12}  style={{width:300, padding:20}}>
        <h3>To-Do</h3>
        {tasks.filter(task => task.status === 'todo').map(task => (
          <Tasks key={task.id} task={task} DeleteTask={DeleteTask} EditTask={EditStatus} />

        ))
        }
        <AddNewTask AddTask={AddTask} />
      </Item>
      <Item elevation={12}  style={{width:300, padding:20}}>
        <h3>In Progress</h3>
        {tasks.filter(task => task.status === 'inProgress').map(task => (
          <Tasks key={task.id} task={task} DeleteTask={DeleteTask} EditTask={EditStatus} />
        ))}
      </Item>
      <Item elevation={12}  style={{width:300, padding:20}}>
        <h3>Done</h3>
        {tasks.filter(task => task.status === 'done').map(task => (
           <Tasks key={task.id} task={task} DeleteTask={DeleteTask} EditTask={EditStatus} />
        ))}
      </Item>
        </ThemeProvider>
      
      {/* <form onSubmit={AddTask}>
        <input type="text" name="title" placeholder="Title" required />
        <textarea name="description" placeholder="Description" required></textarea>
        <input type="file" name="attachment" />
        <button type="submit">Add Task</button>
      </form> */}
      
    </div>
  );
}

export default KanbanBoard