import { Component } from '@angular/core';
import {AuthService} from '../../services/auth/auth.service';
import {Router} from '@angular/router' ;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent {
  hide=true;
  constructor(
    private authService:AuthService,
    private router:Router
    ) {}
    user = {
      email: null,
      password: null
    };
    error : string ;
    validation:string;
    loginIn = false;

onLoginSubmit(){
  this.loginIn = true;

    if(!this.user.email || !this.user.password){
      this.validation = 'Les champs email et mot de passe sont obligatoires';
      this.loginIn = false;
    } else {
    this.authService.authenticateUser(this.user).subscribe(data =>{
      console.log(data)
     if(data.success){
      this.authService.sotreUserData(data.token);
       console.log(data.token , this.authService.getIdfromToken())
 
        this.router.navigate(['/dashboard'], { queryParams: { id: this.authService.getIdfromToken() } });
     } else{
        this.error = data.msg ; 
     }
     this.loginIn = false;
    });
  }
}

get passwordInput() { return this.user.password; } 

}
