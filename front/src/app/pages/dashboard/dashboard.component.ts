import { Component, OnInit } from '@angular/core';
import Chart from 'chart.js';
import {CommandsorService} from '../../services/commandsor/commandsor.service'
import {MatiereService} from '../../services/matiere/matiere.service'
import {CommandeService} from '../../services/commande/commande.service'
import {CommandapproService} from '../../services/commandappro/commandappro.service'
import { ReceptionService } from 'src/app/services/reception/reception.service';
// core components
import {
  chartOptions,
  parseOptions,
  chartExample1,
  chartExample2
} from "../../variables/charts";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  bondecommandes  : any
  bondereceptions : any
  totalstock : any
  public datasets: any;
  public data: any;
  public salesChart;
  public clicked: boolean = true;
  public clicked1: boolean = false;

  constructor( private CommandapproService:CommandapproService ,private CommandsorService:CommandsorService, private ReceptionService:ReceptionService ,
 private CommandeService:CommandeService , private MatiereService : MatiereService) { }

  ngOnInit() {

    this.datasets = [
      [0, 20, 10, 30, 15, 40, 20, 60, 60],
      [0, 20, 5, 25, 10, 30, 15, 40, 40]
    ];
    this.data = this.datasets[0];


   

    parseOptions(Chart, chartOptions());


 
    var chartSales = document.getElementById('chart-sales');

    this.salesChart = new Chart(chartSales, {
			type: 'line',
			options: chartExample1.options,
			data: chartExample1.data
		});
 
    this.get_reception_service()
this.get_commande_apro()
this.get_MatiereService()
 this.get_liste_commande()
 this.get_commande_sortie()
  
}
get_reception_service () {
  this.ReceptionService.getallReception().subscribe(res =>{ console.log(res.obj);

    if(res.obj.length>0){
     let calculmontnat = res.obj.map(el => el.total_ht + el.total_tva ).reduce((a,b) => a+b)
       this.bondereceptions = Number(calculmontnat.toString().replace(/\s/g, '')).toFixed(3).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    }
    else
    this.bondereceptions = 0.000
  })
}
get_commande_sortie() {
  this.CommandsorService.getCommands().subscribe(res => {console.log(res)
    let filtreddate = [...new Set(res.obj.map(el => el.createdAt.slice(0,7)))]
    let count=0;
   let tabcount = [];
   for (let i = 0 ; i < filtreddate.length ; i++) {
   for(let j = 0 ; j < res.obj.length ; j++)
   {
     if(res.obj[j].createdAt.includes(filtreddate[i]))
     count++
   }
   tabcount.push(count)
     count = 0;

   }
   var chartOrders = document.getElementById('chart-orders');
   var ordersChart = new Chart(chartOrders, {
    type: 'bar',
    options: chartExample2.options,
    data: {
      labels: filtreddate,
      datasets: [
        {
          label: "Sales",
          data: tabcount
        }
      ]
    }
  });
  })
}
get_commande_apro () {
  this.CommandapproService.getCommands().subscribe( res => {
    console.log(res.obj);
    if(res.obj.length>0){
      let calculmontnat = res.obj.map(el => el.total_ht + el.total_tva ).reduce((a,b) => a+b)
        this.bondecommandes =  Number(calculmontnat.toString().replace(/\s/g, '')).toFixed(3).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
     }
     else
     this.bondecommandes = 0.000
   })
}
 get_liste_commande() {
   this.CommandeService.getCommands().subscribe(res =>
    console.log(res)
    )
 }

get_MatiereService() {
  this.MatiereService.getMatieres().subscribe(res =>
    {console.log(res);
    if(res.obj.length > 0) {
    let somme = res.obj.map(el => el.prix_initial * el.stock_reel).reduce((a,b) => a+b) 
    this.totalstock = Number(somme.toString().replace(/\s/g, '')).toFixed(3).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ')
    }
    })
}


  public updateOptions() {
    this.salesChart.data.datasets[0].data = this.data;
    this.salesChart.update();
  }

}
