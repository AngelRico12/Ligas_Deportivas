import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-equipo',
  templateUrl: './equipo.component.html',
  styleUrls: ['./equipo.component.css'],
})
export class EquipoComponent {
  categoria: string = '';
  nombre_club: string = '';


  clubLogoUrl = '';
  jugador = { nombre_completo: '', fecha_nacimiento: '', sexo: '', id_equipo: '', nombreClub: '', categoria: '', posicion: '', foto: ''}; // datos por defecto
  jugadorRecuperado = { nombre_completo: '', fecha_nacimiento: '', sexo: '', posicion: '', foto: '', ciudad_nacimiento: '',
  apodo: '', anios_experiencia:'', amonestaciones: '', puntos_acumulados: '', correo: '', pasatiempos: '', musica_favorita: '', redes_sociales:''
  };
  // Se usa string para manejar formato de fecha

  fotosJugadores: { [posicion: string]: string } = {};
  fotoArchivo: File | null = null;
  deportes = [
    {
      nombre: 'Fútbol',
      posiciones: ['Portero', 'Defensa', 'Defensa_izq', 'Defensa_cent', 'Defensa_der', 'Mediocampo_izq', 'Mediocampo_cent', 'Mediocampo_der', 'Delantero_izq', 'Delantero_cent', 'Delantero_der'],
      banca: Array(4).fill(''),
    },
    {
      nombre: 'Fútbol Americano',
      posiciones: ['Quarterback', 'Running Back', 'Wide Receiver 1', 'Wide Receiver 2', 'Tight End', 'Lineman 1', 'Lineman 2', 'Lineman 3', 'Lineman 4', 'Lineman 5'],
      banca: Array(3).fill(''),
    },
    {
      nombre: 'Tenis',
      posiciones: ['Titular'],
      banca: Array(2).fill(''),
    },
    {
      nombre: 'Béisbol',
      posiciones: ['Catcher', 'Pitcher', 'Primera Base', 'Segunda Base', 'Tercera Base', 'Shortstop', 'Jardinero 1', 'Jardinero 2', 'Jardinero 3'],
      banca: Array(2).fill(''),
    },
    {
      nombre: 'Básquet',
      posiciones: ['Base', 'Escolta', 'Alero', 'Ala-pívot', 'Pívot'],
      banca: Array(2).fill(''),
    },
  ];
  formularioVisible = false;
  posicionSeleccionada = '';
  formularioRecuperado = false;
  posicionOcupada: boolean = false;


  constructor(private router: Router, private http: HttpClient) {}



  ngOnInit(): void {
    this.obtenerCategoriaYClub();
    this.obtenerIdUsuarioYHacerSolicitud();
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);

        if (usuario.id_usuario) {
          this.obtenerCategoria(usuario.id_usuario);
        } else {
          console.error('El usuario no tiene un id_usuario asociado.');
        }

        if (usuario.id_club) {
          this.obtenerNombreClub(usuario.id_club);
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

  obtenerCategoriaYClub(): void {
    // Recuperar el objeto 'usuario' del localStorage
    const usuario = localStorage.getItem('usuario');
  
    if (!usuario) {
      console.error('No se encontró el objeto usuario en localStorage');
      return;
    }
  
    // Parsear el JSON almacenado en localStorage a un objeto JavaScript
    const usuarioObj = JSON.parse(usuario);
    const id_usuario = usuarioObj.id_usuario;
  
    const url = `http://localhost:3000/api/Ecategoria/categoria-club/${id_usuario}`;
  
    // Realizar la petición HTTP
    this.http.get<{ categoria: string, nombre_club: string }>(url).subscribe(
      (response) => {
        this.categoria = response.categoria;
        this.nombre_club = response.nombre_club;
        console.log('Datos recibidos:', response);
  
        // Llamar al método verificarPosicionesOcupadas después de cargar los datos
        this.verificarPosicionesOcupadas();
      },
      (error) => {
        console.error('Error al obtener la categoría y el club:', error);
      }
    );
  }

  verificarPosicionesOcupadas(): void {
    if (!this.categoria || !this.nombre_club) {
      console.warn('Categoría o nombre del club no disponibles todavía.');
      return;
    }
  
    const posiciones = this.deportes.find(
      (deporte) => deporte.nombre === this.categoria
    )?.posiciones;
  
    if (!posiciones) {
      console.error('No se encontraron posiciones para la categoría seleccionada.');
      return;
    }
  
    posiciones.forEach((posicion) => {
      const apiUrl = `http://localhost:3000/uploads/${this.nombre_club}/fotos/${this.categoria}/${posicion}/foto.png`;
  
      this.http.get(apiUrl, { responseType: 'blob' }).subscribe(
        (response) => {
          const fotoUrl = URL.createObjectURL(response);
          this.fotosJugadores[posicion] = fotoUrl;
          console.log(`Foto cargada para la posición ${posicion}: ${fotoUrl}`);
        },
        (error) => {
          console.warn(`No se encontró foto para la posición ${posicion}.`);
        }
      );
    });
  }
  

  verificarPosicionOcupada(): void {
    this.obtenerIdUsuarioYHacerSolicitud();
   
    const apiUrl = `http://localhost:3000/api/juga/jugador/${this.jugador.posicion}/${this.jugador.id_equipo}`;
    
    this.http.get<{ 
      success: boolean; 
      message: string; 
    }>(apiUrl).subscribe((response) => {
      if (response.success) {
        this.posicionOcupada = true;
      } else {
        this.posicionOcupada = false;
      }
      console.log('Posición ocupada:', this.posicionOcupada);
    }, (error) => {
      console.error('Error al verificar la posición:', error);
      // Opcionalmente puedes manejar errores cambiando la variable a false si lo deseas
      this.posicionOcupada = false;
    });
    
  
  }
  
  obtenerJugador(
    nombre_completo: string,
    sexo: 'M' | 'F',
    fecha_nacimiento: string,
    peso?: number,
    estatura?: number,
    apodo?: string,
    posicion?: string,
    foto?: string,
    ciudad_nacimiento?: string,
    anios_experiencia?: number,
    amonestaciones?: number,
    puntos_acumulados?: number,
    correo?: string,
    pasatiempos?: string,
    musica_favorita?: string,
    redes_sociales?: string
  ): void {
    const apiUrl = `http://localhost:3000/api/juga/jugador/${this.jugador.posicion}/${this.jugador.id_equipo}`;
    const SERVER_URL = 'http://localhost:3000';
  
    this.http.get<{
      success: boolean;
      jugador: {
        id_jugador: number;
        nombre_completo: string;
        fecha_nacimiento: string;
        sexo: 'M' | 'F';
        posicion?: string;
        foto?: string;
        ciudad_nacimiento?: string;
        apodo?: string;
        anios_experiencia?: number;
        amonestaciones?: number;
        puntos_acumulados?: number;
        correo?: string;
        pasatiempos?: string;
        musica_favorita?: string;
        redes_sociales?: string;
      }[];
    }>(apiUrl).subscribe(
      (response) => {
        // Verificamos que el arreglo 'jugador' no esté vacío
        if (response.success && response.jugador.length > 0) {
          const data = response.jugador[0]; // Tomamos el primer elemento del arreglo
          this.jugadorRecuperado = {
            nombre_completo: data.nombre_completo || '',
            fecha_nacimiento: data.fecha_nacimiento || '',
            sexo: data.sexo || '',
            posicion: data.posicion || '',
            // Concatenamos la URL base del servidor a la ruta de la foto
            foto: data.foto ? `${SERVER_URL}${data.foto}` : '',
            ciudad_nacimiento: data.ciudad_nacimiento || '',
            apodo: data.apodo || '',
            anios_experiencia: data.anios_experiencia?.toString() || '',
            amonestaciones: data.amonestaciones?.toString() || '',
            puntos_acumulados: data.puntos_acumulados?.toString() || '',
            correo: data.correo || '',
            pasatiempos: data.pasatiempos || '',
            musica_favorita: data.musica_favorita || '',
            redes_sociales: data.redes_sociales || ''
          };
          console.log('Jugador recuperado:', this.jugadorRecuperado);
        } else {
          console.warn('No se encontró ningún jugador.');
        }
      },
      (error) => {
        console.error('Error al obtener el jugador:', error);
      }
    );
  }
  

  obtenerIdUsuarioYHacerSolicitud(): void {
    const usuarioString = localStorage.getItem('usuario');
    if (usuarioString) {
      try {
        const usuario = JSON.parse(usuarioString);
        const id_usuario = usuario.id_usuario;

        // Hacer la solicitud a la API con el id_usuario
        this.http.get(`http://localhost:3000/api/juga/${id_usuario}`).subscribe(
          (response: any) => {
            console.log('Respuesta de la API:', response);
            // Asignar el id_equipo a this.jugador.id_equipo
            if (response.success) {
              this.jugador.id_equipo = response.id_equipo; // Asigna el valor a la variable
            } else {
              console.error('No se pudo obtener el id_equipo.');
            }
          },
          (error) => {
            console.error('Error al hacer la solicitud:', error);
          }
        );
      } catch (error) {
        console.error('Error al parsear el objeto usuario:', error);
      }
    } else {
      console.error('No se encontró el objeto usuario en el localStorage.');
    }
  }

 

  obtenerCategoria(id_dt: number): void {
    const apiUrl = `http://localhost:3000/api/Ecategoria/${id_dt}`;
    this.http.get<{ categoria: string }>(apiUrl).subscribe(
      (response) => {
        this.jugador.categoria = response.categoria; // Asignar el valor a jugador.categoria
        this.mostrarPlantilla(response.categoria);
      },
      (error) => {
        console.error('Error al obtener la categoría:', error);
      }
    );
  }

  mostrarPlantilla(categoria: string): void {
    const formations = document.querySelectorAll('.formation-container') as NodeListOf<HTMLElement>;
    formations.forEach((formation) => {
      formation.style.display = 'none';
    });

    const formation = document.getElementById(categoria);
    if (formation) {
      formation.style.display = 'block';
    } else {
      console.error('No se encontró la plantilla para la categoría:', categoria);
    }
  }

  obtenerNombreClub(clubId: number): void {
    const apiUrl = `http://localhost:3000/api/clubes/${clubId}`;
    this.http.get<{ success: boolean; club: { nombre: string; logotipo: string } }>(apiUrl).subscribe(
      (response) => {
        if (response.success && response.club) {
          const nombreClub = response.club.nombre;
          this.clubLogoUrl = `http://localhost:3000/uploads/${nombreClub}/logotipo/${nombreClub}.png`;
          this.jugador.nombreClub = nombreClub; // Asignar el valor a jugador.nombreClub
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


  abrirFormulario(posicion: string): void {
      
    this.posicionSeleccionada = posicion;
    this.jugador.posicion = this.posicionSeleccionada;
  
    // Verificar si la posición está ocupada antes de abrir el formulario
    const apiUrl = `http://localhost:3000/api/juga/jugador/${this.jugador.posicion}/${this.jugador.id_equipo}`;
  
    this.http.get<{ 
      success: boolean; 
      message: string; 
    }>(apiUrl).subscribe((response) => {
      if (response.success) {
        this.posicionOcupada = true;
        this.formularioVisible = false; // No mostrar el formulario
        this.formularioRecuperado = true;
        console.log('Posición ocupada. Ejecutando obtenerJugador...');
        
        // Ejecutar obtenerJugador si la posición está ocupada
        this.obtenerJugador('nombre_completo', 'M', 'fecha_nacimiento');
      } else {
        this.posicionOcupada = false;
        this.formularioVisible = true; // Mostrar el formulario
        console.log('Posición no ocupada. Mostrando formulario...');
        
        // Asegurarse de que los valores se actualicen al abrir el formulario
        const usuarioString = localStorage.getItem('usuario');
        if (usuarioString) {
          const usuario = JSON.parse(usuarioString);
          
          // Obtener el id_club y el id_usuario
          if (usuario.id_club) {
            this.obtenerNombreClub(usuario.id_club);
          }
          if (usuario.id_usuario) {
            this.obtenerCategoria(usuario.id_usuario);
            this.obtenerIdUsuarioYHacerSolicitud();
          }
        }
      }
    }, (error) => {
      console.error('Error al verificar la posición:', error);
      this.posicionOcupada = false;
      this.formularioVisible = true; // Permitir abrir el formulario en caso de error
    });
  }
  
  cerrarFormulario2(): void {
    this.formularioRecuperado = false;
    this.obtenerIdUsuarioYHacerSolicitud();

  }

  cerrarFormulario(): void {
    this.formularioVisible = false;
    this.jugador = { nombre_completo: '', fecha_nacimiento: '', sexo: '', id_equipo: '', nombreClub: '',
    categoria: '', posicion: '', foto: ''};
    this.fotoArchivo = null;
    this.obtenerIdUsuarioYHacerSolicitud();
    
  }

  cargarFoto(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fotoArchivo = input.files[0];
    }
  }

  guardarJugador(): void {
    if (!this.fotoArchivo) {
      alert('Por favor selecciona una foto.');
      return;
    }

    const fotoRuta2 = `http://localhost:3000/uploads/${this.jugador.nombreClub}/fotos/${this.jugador.categoria}/${this.jugador.posicion}/${this.fotoArchivo?.name}`;
  this.jugador.foto = fotoRuta2;  // Asegúrate de asignar la ruta antes de enviar los datos
  
    const formData = new FormData();
    formData.append('nombre_completo', this.jugador.nombre_completo);
    formData.append('fecha_nacimiento', this.jugador.fecha_nacimiento);
    formData.append('sexo', this.jugador.sexo);
    formData.append('id_equipo', this.jugador.id_equipo.toString());
    formData.append('nombreClub', this.nombre_club);
    formData.append('categoria', this.categoria);
    formData.append('posicion', this.jugador.posicion);
    formData.append('foto', this.jugador.foto);
    formData.append('foto', this.fotoArchivo);

  
    // Log para verificar lo que se envía
    console.log('Datos enviados al servidor:');
    console.log('Nombre Completo:', this.jugador.nombre_completo);
    console.log('Fecha de Nacimiento:', this.jugador.fecha_nacimiento);
    console.log('Sexo:', this.jugador.sexo);
    console.log('ID Equipo:', this.jugador.id_equipo);
    console.log('Foto:', this.fotoArchivo);
    console.log('nombreClub:', this.nombre_club);
    console.log('categoria:', this.categoria);
    console.log('posicion:', this.jugador.posicion);
    console.log('foto:', this.jugador.foto);
  
    const apiUrl = 'http://localhost:3000/api/juga/Cjugador';
    this.http.post(apiUrl, formData).subscribe(
      (response: any) => {
        if (response.success) {
          // Construir la ruta de la foto
          


          const fotoRuta = `http://localhost:3000/uploads/${this.jugador.nombreClub}/fotos/${this.jugador.categoria}/${this.jugador.posicion}/${this.fotoArchivo?.name}`;
          this.fotosJugadores[this.posicionSeleccionada] = fotoRuta;
          alert('Jugador registrado exitosamente.');
          this.cerrarFormulario();
        } else {
          alert('Error al guardar el jugador.');
        }
      },
      (error) => {
        console.error('Error al guardar el jugador:', error);
        alert('Ocurrió un error en el servidor.');
      }
    );
  }
  

  ////////////////////////

 

}
