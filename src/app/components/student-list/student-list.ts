import { Component, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FirebaseService } from '../../services/firebase';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-student-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './student-list.html',
  styleUrls: ['./student-list.css']
})
export class StudentListComponent implements OnChanges {
  @Input() club: string = '';
  @Output() editRequested = new EventEmitter<any>();
  @Output() showNotification = new EventEmitter<{message: string, type: 'success' | 'error'}>();
  
  students$: Observable<any[]> = of([]);
  showDeleteConfirmation: boolean = false;
  studentToDelete: any = null;

  constructor(private firebaseService: FirebaseService) {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes['club'] && this.club) {
      this.loadStudents();
    }
  }

  loadStudents() {
    this.students$ = this.firebaseService.getStudentsByClub(this.club);
  }

  trackById(index: number, student: any): string {
    return student.id;
  }

  requestDelete(student: any) {
    this.studentToDelete = student;
    this.showDeleteConfirmation = true;
  }

  cancelDelete() {
    this.showDeleteConfirmation = false;
    this.studentToDelete = null;
  }

  async confirmDelete() {
    if (!this.studentToDelete || !this.club) {
      this.showNotification.emit({
        message: 'Datos insuficientes para eliminar',
        type: 'error'
      });
      return;
    }

    try {
      await this.firebaseService.deleteStudent(this.club, this.studentToDelete.id);
      this.showNotification.emit({
        message: 'Estudiante eliminado con éxito',
        type: 'success'
      });
      // Recargar la lista de estudiantes después de eliminar
      this.loadStudents();
    } catch (err) {
      console.error('Error al eliminar estudiante:', err);
      this.showNotification.emit({
        message: 'Error al eliminar estudiante',
        type: 'error'
      });
    } finally {
      this.showDeleteConfirmation = false;
      this.studentToDelete = null;
    }
  }

  editStudent(student: any) {
    this.editRequested.emit({ ...student, club: this.club });
  }
}