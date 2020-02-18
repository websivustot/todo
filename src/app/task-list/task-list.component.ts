import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TaskService } from 'src/app/task.service';
import { Task } from 'src/app/task.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss']
})
export class TaskListComponent implements OnInit {

  tasks: Task[] = []
  userForm: FormGroup

  constructor(private taskService: TaskService) { }

  ngOnInit() {
    this.taskService.getTasks().subscribe(data => {
      this.tasks = data.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data() as Task
        };
      })
      console.log(this.tasks.length)

    });    

    this.userForm = new FormGroup({
      title: new FormControl('', Validators.required)
    })
  }

  submit() {
    const {title} = this.userForm.value

    const task: Task = {
      title,
      date: new Date,
      completed: false
    }

    console.log("task created", title, task);

    this.create(task)
    this.userForm.reset()
  }

  onChange(task: Task) {    
    
    //this.onToggle(task.id)
    const idx = this.tasks.findIndex(t => t.id === task.id)
    console.log(task.id,idx,this.tasks[idx])
    this.tasks[idx].completed = !this.tasks[idx].completed    
        
    this.update(this.tasks[idx]);
    
  }

  create(task: Task){
    this.taskService.createTask(task);
  }

  update(task: Task) {
    this.taskService.updateTask(task);
  }

  delete(id: string) {
    this.taskService.deleteTask(id);
  }  

  onToggle(id: string) {    
    
    const idx = this.tasks.findIndex(t => t.id === id)
    console.log(id,idx,this.tasks[idx])
    this.tasks[idx].completed = !this.tasks[idx].completed    
    console.log(this.tasks)
  } 

}
