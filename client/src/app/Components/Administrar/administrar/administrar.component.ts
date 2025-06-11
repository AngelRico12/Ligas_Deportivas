//component con verificacion de categorias

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EquipoDTService } from '../../../Services/EquipoDT/equipo-dt.service';
import { AuthService } from '../../../Services/Auth/auth.service';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-administrar',
  templateUrl: './administrar.component.html',
  styleUrls: ['./administrar.component.css'],
})
export class AdministrarComponent implements OnInit {
  editMode = false;
  formStep: number = 1;  // Controla en qué parte del formulario estamos
  createTeamForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';
  categorias: string[] = ['Fútbol', 'Fútbol Americano', 'Tenis', 'Béisbol', 'Básquet'];
  coloresDisponibles: string[] = [
    'azul', 'cafe', 'morado', 'negro', 'rojo', 
    'turquesa', 'amarillo', 'blanco', 'gris', 
    'naranja', 'purpura', 'rosa', 'verde'
  ];
  colorLocal = '';
  colorVisitante = '';
  clubLogoUrl = '';
  categoriaSeleccionada: string | null = null;
  equiposPorCategoria: { [categoria: string]: boolean } = {};

  constructor(
    private fb: FormBuilder,
    private equipoDTService: EquipoDTService,
    private authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {
    this.createTeamForm = this.fb.group({
      nombre_dt: ['', Validators.required],
      correo_dt: ['', [Validators.required, Validators.email]],
      contraseña_dt: ['', Validators.required],
      categoria: ['', Validators.required],
      colores: [''],
    });
  }

  toggleEditMode(): void {
    this.editMode = !this.editMode;
  }


  ngOnInit(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        if (usuario.id_club) {
          this.obtenerNombreClub(usuario.id_club);
          this.verificarEquipos(usuario.id_club);
        } else {
          console.error('El usuario no tiene un club asociado.');
        }
      } catch (error) {
        console.error('Error al parsear el objeto usuario:', error);
      }
    } else {
      console.error('No se encontró el objeto usuario en el localStorage.');
    }
  }

  ////////////////

  cambiarColor(tipo: 'local' | 'visitante', direccion: number) {
    const colores = this.coloresDisponibles;
    const indexActual = tipo === 'local'
      ? colores.indexOf(this.colorLocal)
      : colores.indexOf(this.colorVisitante);
  
    let nuevoIndex = (indexActual + direccion + colores.length) % colores.length;
  
    if (tipo === 'local') {
      this.colorLocal = colores[nuevoIndex];
    } else {
      this.colorVisitante = colores[nuevoIndex];
    }
  }
  ///////////////////////

  verificarEquipos2(clubId: number): void {
    const apiUrl = `http://localhost:3000/api/team/categorias/${clubId}`;
    this.http.get<{ categorias: string[] }>(apiUrl).subscribe(
      (response) => {
        if (response.categorias) {
          this.equiposPorCategoria = {}; // Resetea el objeto antes de llenarlo
          response.categorias.forEach((categoria) => {
            this.equiposPorCategoria[categoria] = true; // Marca que ya existe un equipo en esta categoría
          });
        }
      },
      (error) => {
        console.error('Error al verificar los equipos:', error);
      }
    );
  }
 
  obtenerNombreClub(clubId: number): void {
    const apiUrl = `http://localhost:3000/api/clubes/${clubId}`;
    this.http.get<{ success: boolean; club: { nombre: string; logotipo: string } }>(apiUrl).subscribe(
      (response) => {
        if (response.success && response.club) {
          const nombreClub = response.club.nombre;
          this.clubLogoUrl = `http://localhost:3000/uploads/${nombreClub}/logotipo/${nombreClub}.png`;
        } else {
          console.error('Error: Club no encontrado en la respuesta.');
        }
      },
      (error) => {
        console.error('Error al obtener el nombre del club:', error);
        this.clubLogoUrl = '';
      }
    );
  }

  verificarEquipos(clubId: number): void {
    const apiUrl = `http://localhost:3000/api/team/categorias/${clubId}`;
    this.http.get<{ categorias: string[] }>(apiUrl).subscribe(
      (response) => {
        if (response.categorias) {
          this.equiposPorCategoria = {}; // Resetea el objeto antes de llenarlo
          response.categorias.forEach((categoria) => {
            this.equiposPorCategoria[categoria] = true; // Marca que ya existe un equipo en esta categoría
          });
        }
      },
      (error) => {
        console.error('Error al verificar los equipos:', error);
      }
    );
  }
  
  seleccionarCategoria(categoria: string): void {
    this.categoriaSeleccionada = categoria;
    this.createTeamForm.get('categoria')?.setValue(categoria); // Actualiza el FormControl del formulario
  
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      const usuario = JSON.parse(usuarioString);
      if (usuario.id_club) {
        this.verificarEquipos(usuario.id_club); // Verificar equipos solo cuando seleccionamos la categoría
      }
    }
  }


  
  
  

  seleccionarColor(tipo: 'local' | 'visitante', color: string): void {
    if (tipo === 'local') {
      this.colorLocal = color;
      if (this.colorVisitante === color) this.colorVisitante = '';
    } else {
      this.colorVisitante = color;
      if (this.colorLocal === color) this.colorLocal = '';
    }
  }

  getCategoriaIconPath(categoria: string): string {
    return `assets/icons/${categoria.toLowerCase().replace(/ /g, '_')}.png`;
  }

  onSubmit(): void {
    if (this.createTeamForm.invalid) {
      return;
    }
  
    const formData = this.createTeamForm.value;
    const usuarioString = localStorage.getItem('usuario');
    if (!usuarioString) {
      this.errorMessage = 'No estás autenticado. Inicia sesión.';
      return;
    }
  
    const usuario = JSON.parse(usuarioString);
    const data = {
      ...formData,
      colores: `${this.colorLocal}-${this.colorVisitante}`,
      usuario: {
        id_club: usuario.id_club,
      },
    };
  
    this.loading = true;
    this.equipoDTService.createTeamAndAssignDT(data).subscribe(
      (response) => {
        this.successMessage = 'Equipo y DT creados exitosamente.';
        this.createTeamForm.reset();
        this.loading = false;
        window.location.reload(); // Recarga la página después del éxito
      },
      (error) => {
        this.loading = false;
        this.errorMessage = error.error.message || 'Error al crear equipo y asignar DT.';
      }
    );
  }
  

////////
editarEquipo(): void {
  if (!this.categoriaSeleccionada) {
    this.errorMessage = 'Selecciona una categoría antes de editar.';
    return;
  }

  const usuarioString = localStorage.getItem('usuario');
  if (!usuarioString) {
    this.errorMessage = 'No estás autenticado. Inicia sesión.';
    return;
  }

  const usuario = JSON.parse(usuarioString);

  if (!usuario.id_club) {
    this.errorMessage = 'No se encontró el club asociado al usuario.';
    return;
  }

  const data = {
    id_club: usuario.id_club,
    categoria: this.categoriaSeleccionada,
    colores: `${this.colorLocal}-${this.colorVisitante}` || null,
    id_dt: this.createTeamForm.get('id_dt')?.value || null,
    nombre_dt: this.createTeamForm.get('nombre_dt')?.value || null,
    correo_dt: this.createTeamForm.get('correo_dt')?.value || null,
    contraseña_dt: this.createTeamForm.get('contraseña_dt')?.value || null,
  };

  this.loading = true;
  this.equipoDTService.editarEquipo(data).subscribe(
    (response) => {
      this.successMessage = 'Equipo editado exitosamente.';
      this.loading = false;
      this.router.navigate(['/team-list']);
    },
    (error) => {
      this.loading = false;
      this.errorMessage = error.error.message || 'Error al editar el equipo.';
    }
  );
}


///////
goToNextStep() {
  if (this.formStep < 5) {
    this.formStep++;
  }
}

goToPreviousStep() {
  if (this.formStep > 1) {  // Asegúrate de que el paso mínimo sea 1
    this.formStep--;
  }
}


}