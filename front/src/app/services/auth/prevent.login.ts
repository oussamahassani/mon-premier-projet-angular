import { Injectable } from '@angular/core';
import {Router,CanActivate } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class PreventLogin implements CanActivate {

  constructor(private authservice: AuthService, private router:Router) {}

  canActivate(){
    if(!this.authservice.loggedIn()){
        return true ;
    } else {
        this.router.navigate(['dashboard']);
        return false ;
    }
}
} 