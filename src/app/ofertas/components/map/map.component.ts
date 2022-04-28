import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MessageService } from 'primeng/api';

import { GeneralService } from '../../services/general.service';
declare var google: any

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {

  @Input() coordenadas:any = null ;
  @Input() edit:boolean = false ;

  @Output() updateCoords = new EventEmitter<any>();

  options: any;
  overlays: any[] = [];
  dialogVisible: boolean = false;
  markerTitle?: string | null;
  selectedPosition: any;
  infoWindow: any;
  draggable: boolean = false;

  constructor(
    private messageService: MessageService,
    private generalService: GeneralService
    ) { }

  ngOnInit(): void {

    this.generalService.getUpdateCoords$().subscribe(
      (resp:any)=>{
        if(this.edit){
          this.coordenadas = resp;
          this.clear()
          this.ngOnInit()
        }
        
      }
    )

    this.options = {
      center: { lat: this.coordenadas.lat, lng: this.coordenadas.lng },
      zoom: 12
    };

    // console.log(this.coordenadas)

    this.initOverlays();

    this.infoWindow = new google.maps.InfoWindow();
  }

  handleMapClick(event: any) {
    this.dialogVisible = true;
    this.selectedPosition = event.latLng;
  }

  handleOverlayClick(event: any) {
    let isMarker = event.overlay.getTitle != undefined;

    if (isMarker) {
      let title = event.overlay.getTitle();
      this.infoWindow.setContent('' + title + '');
      this.infoWindow.open(event.map, event.overlay);
      event.map.setCenter(event.overlay.getPosition());

      this.messageService.add({ severity: 'info', summary: 'Marker Selected', detail: title });
    }
    else {
      this.messageService.add({ severity: 'info', summary: 'Shape Selected', detail: '' });
    }
  }

  addMarker() {
    this.overlays.push(new google.maps.Marker({ position: { lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng() }, title: this.markerTitle, draggable: this.draggable }));
    this.markerTitle = null;
    this.dialogVisible = false;
  }

  addMarkerClick(event: any) {
    //Si podemos editar el mapa eliminamos los markers y añadimos el nuevo
    if(this.edit){
      this.clear();

      this.selectedPosition = event.latLng;

      this.coordenadas.lat = this.selectedPosition.lat();
      this.coordenadas.lng = this.selectedPosition.lng();

      
      this.updateCoords.emit(this.coordenadas)
      
      this.overlays.push(new google.maps.Marker({ position: { lat: this.selectedPosition.lat(), lng: this.selectedPosition.lng() }, title: "Ubicación", draggable: this.draggable }));
      
      this.markerTitle = null;
      this.dialogVisible = false;
    }
    
  }

  handleDragEnd(event: any) {
    this.messageService.add({ severity: 'info', summary: 'Marker Dragged', detail: event.overlay.getTitle() });
  }

  initOverlays() {
    if (!this.overlays || !this.overlays.length) {
      this.overlays = [
        new google.maps.Marker({ position: { lat: this.coordenadas.lat, lng: this.coordenadas.lng }, title: "Ubicación" }),
      ];
    }
  }

  zoomIn(map: any) {
    map.setZoom(map.getZoom() + 1);
  }

  zoomOut(map: any) {
    map.setZoom(map.getZoom() - 1);
  }

  clear() {
    this.overlays = [];
  }

}