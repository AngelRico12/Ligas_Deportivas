// services/team.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EquipoDTService {
  private apiUrl = 'http://localhost:3000/api/team/create-team';

  constructor(private http: HttpClient) {}

  createTeamAndAssignDT(data: any): Observable<any> {
    return this.http.post(this.apiUrl, data);
  }


  editarEquipo(data: any) {
    const apiUrl = 'http://localhost:3000/api/team/edit'; // Ruta al endpoint de edición
    return this.http.put(apiUrl, data);
  }
  
}
