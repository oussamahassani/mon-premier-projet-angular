import { Component, OnInit } from '@angular/core';
import { AppareilService } from './service/appareil.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit  {
  title = 'mon-premier-projet';
  isAuth = false;
   lastUpdate = new Date();
  appareilOne = 'Machine à laver';
  appareilTwo = 'Frigo';
  appareilThree = 'Ordinateur';
   appareils: any[];
constructor(private appareilService: AppareilService) {
 setTimeout(
      () => {
        this.isAuth = true;
      }, 4000
    );
}
ngOnInit() {
  this.appareils = this.appareilService.appareils;
}
onAllumer() {
    console.log('On allume tout !');
	 this.appareilService.switchOnAll();
}

onEteindre() {
    if(confirm('Etes-vous sûr de vouloir éteindre tous vos appareils ?')) {
      this.appareilService.switchOffAll();
    } else {
      return null;
    }
}
}