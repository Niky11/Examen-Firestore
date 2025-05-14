import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, doc, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  constructor(private firestore: Firestore) {}

  addStudent(club: string, student: any) {
    const clubRef = collection(this.firestore, club);
    return addDoc(clubRef, student);
  }

  getStudentsByClub(club: string): Observable<any[]> {
    const clubRef = collection(this.firestore, club);
    return collectionData(clubRef, { idField: 'id' }) as Observable<any[]>;
  }

  getClubs(): string[] {
    return ['Danza', 'Taekwondo', 'Gimnasio', 'Fútbol', 'Voleibol'];
  }

  updateStudent(club: string, id: string, studentData: any) {
    const studentDoc = doc(this.firestore, `${club}/${id}`);
    return updateDoc(studentDoc, {
      studentNumber: studentData.studentNumber,
      fullName: studentData.fullName,
      email: studentData.email
    });
  }

  deleteStudent(club: string, id: string) {
    const studentDoc = doc(this.firestore, `${club}/${id}`);
    return deleteDoc(studentDoc);
  }
}