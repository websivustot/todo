import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Task } from 'src/app/task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private firestore: AngularFirestore) { }

  getTasks() {
    return this.firestore.collection('tasks').snapshotChanges();
  }

  createTask(task: Task){
    return this.firestore.collection('tasks').add(task);
  }

  updateTask(task: Task){
    this.firestore.doc('tasks/' + task.id).update(task).then(() => {console.log(task.title + " is updated")});
    //delete task.id;
  }

  deleteTask(taskId: string){
    this.firestore.doc('tasks/' + taskId).delete();
  }
}
