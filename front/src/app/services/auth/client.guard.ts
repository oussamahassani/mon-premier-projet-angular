import {Injectable} from '@angular/core'; 
import {Router, CanActivate} from '@angular/router';
import {AuthService} from './auth.service';
import * as decode from 'jwt-decode';

@Injectable()
export class ClientGuard implements CanActivate {
    constructor(private authservice: AuthService,
        private router: Router) {
    }

    canActivate(){
     return true;
    }

}