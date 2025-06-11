import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  API_URL = 'http://localhost:3000/api/Admin'; // Ajusta según tu backend

  constructor(private http: HttpClient) { }

  // Listar solicitudes de clubes
  listarSolicitudes(): Observable<any> {
    return this.http.get(`${this.API_URL}/solicitudes`);
  }

  // Aprobar un club
  aprobarClub(id_club: number): Observable<any> {
    return this.http.post(`${this.API_URL}/aprobar/${id_club}`, {});
  }

  // Eliminar un club
  eliminarClub(id_club: number): Observable<any> {
    return this.http.delete(`${this.API_URL}/eliminar/${id_club}`);
  }
}
