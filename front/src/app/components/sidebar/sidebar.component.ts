import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
  expectedRole?: string;
  submenu?: RouteInfo[];
}

export const ROUTES: RouteInfo[] = [
  { path: '/dashboard', title: 'Dashboard', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: '' },
  {
    path: '/products', title: 'Produits', icon: 'ni-box-2 text-blue', class: 'side-pointer', expectedRole: 'productsview',
    submenu: [
      { path: '/products', title: 'Liste produits', icon: 'ni-box-2 text-blue', class: 'side-pointer', expectedRole: 'productsview' },
      { path: '/products/ajouter-produit', title: 'Ajouter Produit', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'productscreate' },
      
    ]
  },
  {
    path: '/commandes', title: 'Commandes', icon: 'ni-basket text-orange', class: 'side-pointer', expectedRole: 'commandsview',
    submenu: [
      { path: '/commandes', title: 'Liste commandes', icon: 'ni-basket text-primary', class: 'side-pointer', expectedRole: 'commandsview' },
      { path: '/commandes/ajouter-commande', title: 'Ajouter Commande', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'commandscreate' }
    ]
  },
  {
    path: '/livraison', title: 'Livraisons', icon: 'ni-delivery-fast text-red', class: 'side-pointer', expectedRole: 'livraisonsview',
    submenu: [
      { path: '/livraison', title: 'Liste livraisons', icon: 'ni-bus-front-12 text-primary', class: 'side-pointer', expectedRole: 'livraisonsview' }
    ]
  },
  {
    path: '/factures', title: 'Factures', icon: 'ni-single-copy-04 text-green', class: 'side-pointer', expectedRole: 'facturesview',
    submenu: [
      { path: '/factures', title: 'Liste factures', icon: 'ni-single-copy-04 text-primary', class: 'side-pointer', expectedRole: 'facturesview' }
    ]
  },
  {
    path: '/clients', title: 'Clients', icon: 'ni-circle-08 text-orange', class: 'side-pointer', expectedRole: 'clients',
    submenu: [
      { path: '/clients', title: 'Liste clients', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'clients' },
      { path: '/clients/ajouter-client', title: 'Ajouter Client', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'clientscreate' }
    ]
  },
  {
    path: '/fournisseurs', title: 'Fournisseurs', icon: 'ni-istanbul text-red', class: 'side-pointer', expectedRole: 'fournisseursview',
    submenu: [
      { path: '/fournisseurs', title: 'Liste fournisseurs', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'fournisseursview' },
      { path: '/fournisseurs/ajouter-fournisseur', title: 'Ajouter Fournisseur', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'fournisseurscreate' }
    ]
  },
  {
    path: '/mp/famille', title: 'Famille de matière', icon: 'ni-istanbul text-red', class: 'side-pointer', expectedRole: 'fournisseursview',
    submenu: [
      { path: '/mp/famille', title: 'Liste des familles de matière', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'fournisseursview' },
      { path: '/mp/famille/ajouter', title: 'Ajouter une famille de matière', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'fournisseurscreate' }
    ]
  },
  {
    path: '/matieres', title: 'Matiére premiére', icon: 'ni-atom text-blue', class: 'side-pointer', expectedRole: 'matieresview',
    submenu: [
      { path: '/matieres', title: 'Liste matiére premiére', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'matieresview' },
      { path: '/matieres/ajouter-matiere', title: 'Ajouter Matiére', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'matierescreate' }
    ]
  },
  {
    path: '/demandes', title: 'Demandes', icon: 'ni-paper-diploma text-green', class: 'side-pointer', expectedRole: 'demandesview',
    submenu: [
      { path: '/demandes', title: 'Liste demandes', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'demandesview' },
      { path: '/demandes/add-demande', title: 'Ajouter Demande', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'demandescreate' }
    ]
  },
  {
    path: '/commandesap', title: 'Bon de commande', icon: 'ni-basket text-orange', class: 'side-pointer', expectedRole: 'demandesview',
    submenu: [
      { path: '/commandesap', title: 'Liste bons de commande', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'demandesview' }
    ]
  },
  {
    path: '/inventaires', title: 'Inventaire', icon: 'ni-basket text-purple', class: 'side-pointer', expectedRole: 'inventairesview',
    submenu: [
      { path: '/inventaires', title: 'Liste des inventaires', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'demandesview' },
      { path: '/matieres', title: 'Faire l\'inventaire', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'demandesview' }
    ]
  },
  {
    path: '/receptions', title: 'Bon de receptions', icon: 'ni-bus-front-12 text-red', class: 'side-pointer', expectedRole: 'receptionsview',
    submenu: [
      { path: '/receptions', title: 'Liste bon de receptions', icon: 'ni-tv-2 text-primary', class: 'side-pointer', expectedRole: 'receptionsview' }
    ]
  },
  {
    path: '/users', title: 'Employees', icon: 'ni-badge text-info', class: 'side-pointer', expectedRole: 'usersview',
    submenu: [
      { path: '/users', title: 'Liste employees', icon: 'ni-badge text-blue', class: 'side-pointer', expectedRole: 'usersview' },
      { path: '/users/ajouter-user', title: 'Ajouter employée', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'userscreate' }
    ]
  },
  {
    path: '/groupes', title: 'Permissions', icon: 'ni-key-25 text-pink', class: 'side-pointer', expectedRole: 'groupesview',
    submenu: [
      { path: '/groupes', title: 'Liste groupes', icon: 'ni-circle-08 text-primary', class: 'side-pointer', expectedRole: 'groupesview' },
      { path: '/groupes/ajouter-groupe', title: 'Ajouter Groupe', icon: 'ni-fat-add text-primary', class: 'side-pointer', expectedRole: 'groupescreate' }
    ]
  },
  
  /* { path: '/icons', title: 'Icons',  icon:'ni-planet text-blue', class: '' },
   { path: '/maps', title: 'Maps',  icon:'ni-pin-3 text-orange', class: '' },
   { path: '/user-profile', title: 'User profile',  icon:'ni-single-02 text-yellow', class: '' },
   { path: '/tables', title: 'Tables',  icon:'ni-bullet-list-67 text-red', class: '' },
   { path: '/login', title: 'Login',  icon:'ni-key-25 text-info', class: '' },
   { path: '/register', title: 'Register',  icon:'ni-circle-08 text-pink', class: '' },*/

];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
  animations: [
    //service vente
    //Magasinier
    trigger('indicatorRotate', [
      state('SVcollapsed', style({transform: 'rotate(90deg)'})),
      state('SVexpanded', style({transform: 'rotate(0deg)'})),
      state('MGcollapsed', style({transform: 'rotate(90deg)'})),
      state('MGexpanded', style({transform: 'rotate(0deg)'})),
      state('FOexpanded', style({transform: 'rotate(90deg)'})),
      state('FOcollapsed', style({transform: 'rotate(0deg)'})),
      state('TYexpanded', style({transform: 'rotate(90deg)'})),
      state('TYcollapsed', style({transform: 'rotate(0deg)'})),
      state('MPexpanded', style({transform: 'rotate(90deg)'})),
      state('MPcollapsed', style({transform: 'rotate(0deg)'})),
      state('DAexpanded', style({transform: 'rotate(90deg)'})),
      state('DAcollapsed', style({transform: 'rotate(0deg)'})),
      state('BOexpanded', style({transform: 'rotate(90deg)'})),
      state('BOcollapsed', style({transform: 'rotate(0deg)'})),
      state('DPAPcollapsed', style({transform: 'rotate(90deg)'})),
      state('DPAPexpanded', style({transform: 'rotate(0deg)'})),
      state('DPFAcollapsed', style({transform: 'rotate(90deg)'})),
      state('DPFAexpanded', style({transform: 'rotate(0deg)'})),
      state('DIexpanded', style({transform: 'rotate(90deg)'})),
      state('DIcollapsed', style({transform: 'rotate(0deg)'})),
      state('DSexpanded', style({transform: 'rotate(90deg)'})),
      state('DScollapsed', style({transform: 'rotate(0deg)'})),
      state('Gsexpanded', style({transform: 'rotate(90deg)'})),
      state('Gscollapsed', style({transform: 'rotate(0deg)'})),
      transition('expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4,0.0,0.2,1)')
      ),
    ])
  ]
})
export class SidebarComponent implements OnInit {

  SVexpanded: boolean = false;
  MGexpanded: boolean = false;
  DPAPexpanded: boolean = false;
  DPFAexpanded: boolean = false;
  FOexpanded:boolean=false;
  TYexpanded:boolean=false;
  MPexpanded:boolean=false;
  DAexpanded:boolean=false;
  DIexpanded:boolean=false;
  BOexpanded:boolean=false;
  DSexpanded:boolean=false;
  Gsexpanded:boolean=false;
  public menuItems: any[];
  public isCollapsed = true;

  constructor(private router: Router) { }

  ngOnInit() {
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.router.events.subscribe((event) => {
      this.isCollapsed = true;
    });
  }
}
