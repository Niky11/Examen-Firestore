import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FirebaseService } from '../../services/firebase';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './student-form.html',
  styleUrls: ['./student-form.css']
})
export class StudentFormComponent implements OnChanges {
  @Output() studentAdded = new EventEmitter<void>();
  @Input() studentToEdit: any = null;
  
  studentForm: FormGroup;
  clubs: string[] = [];
  isEditing: boolean = false;
  currentStudentId: string | null = null;
  showMessage: boolean = false;
  message: string = '';
  messageType: 'success' | 'error' = 'success';

  constructor(
    private fb: FormBuilder,
    private firebaseService: FirebaseService
  ) {
    this.studentForm = this.fb.group({});
    this.clubs = this.firebaseService.getClubs();
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['studentToEdit'] && this.studentToEdit) {
      this.isEditing = true;
      this.currentStudentId = this.studentToEdit.id;
      this.studentForm.patchValue({
        studentNumber: this.studentToEdit.studentNumber,
        fullName: this.studentToEdit.fullName,
        email: this.studentToEdit.email,
        club: this.studentToEdit.club
      });
    }
  }

  initForm() {
    this.studentForm = this.fb.group({
      studentNumber: ['', [Validators.required, Validators.pattern(/^[0-9]+$/)]],
      fullName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      club: ['', Validators.required]
    });
  }

  showNotification(message: string, type: 'success' | 'error') {
    this.message = message;
    this.messageType = type;
    this.showMessage = true;
    
    setTimeout(() => {
      this.showMessage = false;
    }, 2000);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const { club, ...studentData } = this.studentForm.value;

      if (this.isEditing && this.currentStudentId) {
        this.firebaseService.updateStudent(club, this.currentStudentId, studentData)
          .then(() => {
            this.showNotification('Estudiante actualizado con éxito!', 'success');
            this.resetForm();
          })
          .catch(error => {
            console.error('Error al actualizar:', error);
            this.showNotification('Error al actualizar el estudiante', 'error');
          });
      } else {
        this.firebaseService.addStudent(club, studentData)
          .then(() => {
            this.showNotification('Estudiante registrado con éxito!', 'success');
            this.resetForm();
          })
          .catch(error => {
            console.error('Error al registrar:', error);
            this.showNotification('Error al registrar el estudiante', 'error');
          });
      }
    }
  }

  resetForm() {
    this.studentForm.reset();
    this.studentToEdit = null;
    this.currentStudentId = null;
    this.isEditing = false;
    this.studentAdded.emit();
  }
}