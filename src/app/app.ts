import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentFormComponent } from './components/student-form/student-form';
import { StudentListComponent } from './components/student-list/student-list';
import { FirebaseService } from './services/firebase';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    StudentFormComponent,
    StudentListComponent
  ],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class AppComponent {
  title = 'Registro de Clubs';
  clubs: string[] = [];
  activeTab: string = 'Danza';
  studentToEdit: any = null;

  constructor(private firebaseService: FirebaseService) {
    this.clubs = this.firebaseService.getClubs();
  }

  changeTab(club: string) {
    this.activeTab = club;
    this.studentToEdit = null; 
  }

  onStudentAdded() {
    this.studentToEdit = null; 
  }

  handleEditRequest(student: any) {
    this.studentToEdit = student;
  }
}