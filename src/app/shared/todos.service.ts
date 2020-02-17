import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map, catchError} from 'rxjs/operators';
import {Observable} from 'rxjs';

export interface Todo {
  id?: string
  title: string
  date: Date
  completed: boolean
}

interface CreateResponse {
  name: string
}

@Injectable({providedIn: 'root'})
export class TodosService {
  static url = 'https://todo-8c35c.firebaseio.com/tasks'

  public todos: Todo[] = []

  constructor(private http: HttpClient) {
  }

  load(): Observable<Todo[]> {
    return this.http
      .get<Todo[]>(`${TodosService.url}.json`)
      .pipe(map(todos => {
        if (!todos) {
          return []
        }

        this.todos = Object.keys(todos).map(key => ({...todos[key], id: key}))
        return this.todos
        //return todos
      }))
  }

  create(todo: Todo): Observable<Todo> {
    return this.http
      .post<CreateResponse>(`${TodosService.url}.json`, todo)
      .pipe(map(res => {
          console.log("create", todo)
        return {...todo, id: res.name}
      }))
  }

  remove(todo: Todo): Observable<void> {
    return this.http
      .delete<void>(`${TodosService.url}/${todo.id}.json`)
      .pipe(map(res => {
        console.log("delete", res)
      
    }))
  }

  onToggle(id: string): Observable<void> {    
    const idx = this.todos.findIndex(t => t.id === id)
    this.todos[idx].completed = !this.todos[idx].completed
    let tempTodo = {        
        "completed": this.todos[idx].completed
    }
    console.log("Is changed: ", idx, `${TodosService.url}/${this.todos[idx].id}.json`, tempTodo);

    const url = "${TodosService.url}/${this.todos[idx].id}.json";

    return this.http
      .patch(url, tempTodo, { headers: {"Content-Type":"application/json"}})
      .pipe(catchError(this.handleError('patch error')));
  } 

  handleError(str: string): any {
      console.log(str)
  }

}