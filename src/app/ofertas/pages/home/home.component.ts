import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GeneralService } from '../../services/general.service';
import { ComunidadAutonoma, Producto } from '../../../interfaces/interfaces';
import { faArrowUp,faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';
import { debounceTime, tap } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {
  

  //Iconos
  faArrowUp = faArrowUp;
  lupa = faMagnifyingGlass

  productos:Producto[] = [];
  comunidadesAutonomas!:ComunidadAutonoma[] ;

  showButton = false;
  private pageNum = 0;

  //Pixeles para que salga el botón de subir scroll
  private scrollHeight = 300;


  public search: FormControl = new FormControl('');

  filter:any ={
    titulo: '',
    tipo: '',
    comunidadAutonoma: null,
  }
  

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private generalService:GeneralService
  ) { }

  ngOnInit(): void {
    
    //Inicianlizamos los datos de las comunidades 
    this.generalService.getComunidadesAutonomas().subscribe(
      (resp:any)=>{
        //mapeo la respuesta para cambiar el nombre de los atributos
        var comunidadesChange = resp.data.map((c:any)=>{
          var cChang:any = {};
          cChang['name'] = c.nombre;
          cChang['value'] = c.id;

          return cChang;
        })

        this.comunidadesAutonomas = comunidadesChange;
      
      }
    )


    //Para que tras dejar de escribir en el filtro tarde un tiempo en hacer la petición 
    this.search.valueChanges
        .pipe(
          debounceTime(350) // tiempo que tiene que esperar
        )
        .subscribe(v => {
          this.doFilter()
          console.log(v);
       });


    this.onScrollDown(this.filter);
    
  }

  @HostListener('window:scroll')
  onWindowScroll():void{
    const yOffSet = window.pageYOffset;
    const scrollTop = this.document.documentElement.scrollTop;

    this.showButton = (yOffSet || scrollTop) > this.scrollHeight;
  }

  onScrollTop():void{
    this.document.documentElement.scrollTop = 0;
  }

  onScrollDown(opciones:any){
    // console.log("Down");
    this.pageNum++;

    this.generalService.getProductsByPage({
      page: this.pageNum,
      q: {
        titulo: opciones.titulo,
        tipo: opciones.tipo,
        comunidadAutonoma: opciones.comunidadAutonoma
      }
    
    }).subscribe(
      (resp:any)=>{
      
        this.productos = this.productos.concat(resp.data.data);
      },
      (error:any) =>{
        console.log(error)
      }
    )
  }

  doFilter(){
    
    //Reinicio parametros
    this.productos.splice(0,this.productos.length);

    this.pageNum = 0;

    //Si se selecciona una comunidad autonoma extreamos su id y lo pasamos al filtro
    if(this.filter.comunidadAutonoma){
      this.filter.comunidadAutonoma = this.filter.comunidadAutonoma.value
    }

    this.onScrollDown(this.filter)
    
    
  }

  doFiltere(){
    
    
    
  }
}
