import express from 'express' //1°
import dotenv from 'dotenv' //2°
import cors from 'cors' //3°
import conectarDB  from './config/db.js'; //3°
import userRoutes from './routes/userRoutes.js';
import projectRoutes from './routes/projectRoutes.js'
import taskRoutes from './routes/taskRoutes.js'


const app = express();
 
app.use(cors()); 

app.use(express.json()); 

dotenv.config(); 

conectarDB(); 

//Router
app.use("/api/users", userRoutes); //4°
app.use("/api/projects", projectRoutes); //4°
app.use("/api/task", taskRoutes); //4°


const PORT = process.env.PORT || 3800; 

const server = app.listen(PORT, () => {
     console.log(`MERN app listening on port ${PORT}!`);
    });

//socket.io
import { Server } from "socket.io"

const io = new Server(server, {
    pingTimeout: 60000,
    cors: {
        origin: '*',
    }
});

io.on("connection", (socket)=> {
    console.log("socket.io is connected")
    //Events socket io
    socket.on("open project", (projectId)=>{
        socket.join(projectId);
    });


    socket.on("add task" ,(task) =>{     
        socket.to(task.project).emit("task added", task);
    });

    socket.on("delete task", (task)=>{
        socket.to(task.project._id).emit("task deleted", task);
    })

    socket.on("update task", (task) =>{
        const project = task.project._id;
        socket.to(project).emit("updated task", task);
    });

    socket.on("complete task", (task) => {
        const project = task.project;
        socket.to(project).emit("completed task", task);
    })

});

