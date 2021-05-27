import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
import { AuthService } from './auth.service';
import * as decode from 'jwt-decode';
// tslint:disable-next-line:label-position

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private authservice: AuthService, private router: Router) {}
  canActivate(Route: ActivatedRouteSnapshot): boolean {

    let permessionId: any = [];
    this.authservice.getOneUser(this.authservice.getIdfromToken())
    .subscribe((res) => {
      res.permissions.forEach( (permission) => {
        permessionId.push(permission);
        });
        this.authservice.getGroupes(permessionId)
        .subscribe((res) => {
          permessionId = res ;
          let role: any = [];
          permessionId.forEach( (groupe) => {
            role = role.concat(groupe.permissions);
        });
    const expectedRole = Route.data.expectedRole.split(',');
    let haveAccess = false;
    expectedRole.forEach( (Myrole) => {
      if(role.includes(Myrole)){
      haveAccess = true;
       }
    });

      if (!this.authservice.loggedIn() || !haveAccess) {
        // navigate to not found page
        this.router.navigate(['/dashboard'], { queryParams: { id: this.authservice.getIdfromToken() } });
        return false;
      }

    }, err => {
      console.log(err);
    });
  });
      return true;
    }


}