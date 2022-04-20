import { Component, OnInit } from '@angular/core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { AuthService } from 'src/app/auth/services/auth.service';
import { Router } from '@angular/router';
import { RegistroComponent } from '../../../auth/pages/registro/registro.component';


@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss']
})
export class NavBarComponent implements OnInit {

  faBars = faBars;
  color: boolean = false;
  user:any = null;
    

  constructor(
    private authService:AuthService,
    private router:Router,
  ) { }

  ngOnInit(): void {
    console.log("usuarioo",this.user);
    
    this.authService.getCurrentUser$().subscribe( (user) =>{
      this.user = user;
      console.log("SUB",user)
    })
    
  }

  isLogin(){
    return this.authService.loggedIn()
  }

  checkRoute(){
     return !this.router.isActive("/auth",false);
  }

  logout(){
    this.authService.logout()
  }

  //Determina el fondo del nav
  checkColor(): string{
    this.color = this.router.isActive("/auth",false);
    
    if(this.color){
      return "color-auth"
    }else{
      return "color"
    }
  }

  currentUser(){
    console.log("Usuario",this.user)
  }
}
