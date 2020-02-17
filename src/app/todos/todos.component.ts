import { Component, OnInit } from '@angular/core';
import {Todo, TodosService} from '../shared/todos.service';
import {FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-todos',
  templateUrl: './todos.component.html',
  styleUrls: ['./todos.component.scss']
})
export class TodosComponent implements OnInit {

  typesOfShoes: string[] = ['Boots', 'Clogs', 'Loafers', 'Moccasins', 'Sneakers'];

  todos: Todo[] = []
  userForm: FormGroup
  
  constructor(private todosService: TodosService) { }

  ngOnInit(): void {
    this.todosService.load().subscribe(todos => {
      this.todos = todos
      console.log("todos: ", this.todos)
    })

    this.userForm = new FormGroup({
      title: new FormControl('', Validators.required)
    })

    console.log(this.userForm)
  }

  submit() {
    const {title} = this.userForm.value

    const todo: Todo = {
      title,
      date: new Date,
      completed: false
    }

    console.log("todo create", title, todo);

    this.todosService.create(todo).subscribe(todo => {
      this.todos.push(todo)
      this.userForm.reset()
    }, err => console.error(err))
  }

  remove(todo: Todo) {
    this.todosService.remove(todo).subscribe(() => {
      this.todos = this.todos.filter(t => t.id !== todo.id)
    }, err => console.error(err))
  }

  onChange(id: string) {
    console.log(id)
    this.todosService.onToggle(id)
  }
}
