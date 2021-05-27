import { Routes } from '@angular/router';

import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ClientsComponent } from '../../pages/clients/clients.component';
import { ProductsComponent } from 'src/app/pages/products/products.component';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { AjouterProduitComponent } from 'src/app/pages/products/ajouter-produit/ajouter-produit.component';
import { UpdateProduitComponent } from 'src/app/pages/products/update-produit/update-produit.component';
import { AjouterClientComponent } from 'src/app/pages/clients/ajouter-client/ajouter-client.component';
import { UpdateClientComponent } from 'src/app/pages/clients/update-client/update-client.component';
import { GroupesComponent } from 'src/app/pages/groupes/groupes.component';
import { AjouterGroupeComponent } from 'src/app/pages/groupes/ajouter-groupe/ajouter-groupe.component';
import { UpdateGroupeComponent } from 'src/app/pages/groupes/update-groupe/update-groupe.component';
import { AjouterUserComponent } from 'src/app/pages/users/ajouter-user/ajouter-user.component';
import { UpdateUserComponent } from 'src/app/pages/users/update-user/update-user.component';
import { RoleGuard } from 'src/app/services/auth/role.guard';
import { AjouterCommandeComponent } from 'src/app/pages/commande/ajouter-commande/ajouter-commande.component';
import { CommandeComponent } from 'src/app/pages/commande/commande.component';
import { BonlivComponent } from 'src/app/pages/commande/bonliv/bonliv.component';
import { LivraisonComponent } from 'src/app/pages/livraison/livraison.component';
import { VoirbonComponent } from 'src/app/pages/livraison/voirbon/voirbon.component';
import { FactureComponent } from 'src/app/pages/commande/facture/facture.component';
import { FacturesComponent } from 'src/app/pages/stock/shared/factures/liste/factures.component';
import { FactureAchatComponent } from 'src/app/pages/stock/shared/factures/factureAchat.component';
import { VoirfactureComponent } from 'src/app/pages/stock/shared/factures/voirfacture/voirfacture.component';
import { FournisseurComponent } from 'src/app/pages/fournisseur/fournisseur.component';
import { AjouterFournisseurComponent } from 'src/app/pages/fournisseur/ajouter-fournisseur/ajouter-fournisseur.component';
import { UpdateFournisseurComponent } from 'src/app/pages/fournisseur/update-fournisseur/update-fournisseur.component';
import { MatiereComponent } from 'src/app/pages/stock/shared/matiere/matiere.component';
import { AjouterMatiereComponent } from 'src/app/pages/stock/shared/matiere/ajouter-matiere/ajouter-matiere.component';
import { ConsulterMatiereComponent } from 'src/app/pages/stock/shared/matiere/consulter-matiere/consulter-matiere.component';
import { DemandesComponent } from 'src/app/pages/stock/shared/demandes/liste/demandes.component';
import { AddDemandComponent } from 'src/app/pages/stock/shared/demandes/add-demand/add-demand.component';
import { CommandesapproComponent } from 'src/app/pages/stock/shared/commandesappro/liste/commandesappro.component';
import { CommandeapproComponent } from 'src/app/pages/stock/shared/commandesappro/commandeappro.component';
import { AjouterCommandeapproComponent } from 'src/app/pages/stock/shared/commandesappro/ajouter-commandeappro/ajouter-commandeappro.component';
import { CommandeAproserviceComponent } from 'src/app/pages/stock/shared/commandesappro/commande-aproservice/commande-aproservice.component';
import { ReceptionsComponent } from 'src/app/pages/stock/shared/receptions/liste/receptions.component';
import { ReceptionComponent } from 'src/app/pages/stock/shared/receptions/reception.component';
import { AjouterReceptionComponent } from 'src/app/pages/stock/shared/receptions/ajouter-reception/ajouter-reception.component';
import { AddbonServiceComponent } from 'src/app/pages/stock/shared/receptions/addbon-service/addbon-service.component';
import { VoirReceptionComponent } from 'src/app/pages/stock/shared/receptions/voir-reception/voir-reception.component';
import { VoirservicereceptionComponent } from 'src/app/pages/stock/shared/receptions/voirservicereception/voirservicereception.component';
import { AjouterFactureComponent } from 'src/app/pages/stock/shared/factures/ajouter-facture/ajouter-facture.component';
import { InventairesComponent } from 'src/app/pages/stock/shared/inventaires/liste/inventaires.component';
import { InventaireComponent } from 'src/app/pages/stock/shared/inventaires/inventaire.component';

import { ConsulterInventaireComponent } from 'src/app/pages/stock/shared/inventaires/consulter-inventaire/consulter-inventaire.component';
import { ProfileUserComponent } from 'src/app/pages/profile-user/profile-user.component';
import { ConsulterDemandComponent } from 'src/app/pages/stock/shared/demandes/consulter-demand/consulter-demand.component';
import { SortieProductionComponent } from 'src/app/pages/stock/shared/matiere/sortie-production/sortie-production.component';
import { HistoriqueFournisseurComponent } from 'src/app/pages/fournisseur/historique-fournisseur/historique-fournisseur.component';
import { ConsulterCommandeComponent } from 'src/app/pages/stock/shared/commandesappro/consulter-commande/consulter-commande.component';
import { DemandesintComponent } from 'src/app/pages/stock/shared/demandeint/liste/demandesint.component';
import { DemandeintComponent } from 'src/app/pages/stock/shared/demandeint/demandeint.component';
import { AddDemandintComponent } from 'src/app/pages/stock/shared/demandeint/add-demand/add-demandint.component';
import { ConsulterDemandintComponent } from 'src/app/pages/stock/shared/demandeint/consulter-demand/consulter-demandint.component';
import { CommandessorComponent } from 'src/app/pages/stock/shared/commandesor/liste/commandessor.component';
import { CommandesorComponent } from 'src/app/pages/stock/shared/commandesor/commandesor.component';
import { AjouterCommandesorComponent } from 'src/app/pages/stock/shared/commandesor/ajouter-commandesor/ajouter-commandesor.component';
import { AjouterTypematComponent } from 'src/app/pages/stock/shared/typemat/ajouter-typemat/ajouter-typemat.component';
import { TypeMatComponent } from 'src/app/pages/stock/shared/typemat/liste/typemat.component';
import { ModifierTypematComponent } from 'src/app/pages/stock/shared/typemat/modifier-typemat/modifier-typemat.component';
import { AjouterInventaireComponent } from 'src/app/pages/stock/shared/inventaires/ajouter-inventaire/ajouter-inventaire.component';
import { ConsulterCommandesorComponent } from 'src/app/pages/stock/shared/commandesor/consulter-commandesor/consulter-commandesor.component';
import { MpComponent } from 'src/app/pages/stock/mp/mp.component';
import { FamilleComponent } from 'src/app/pages/stock/shared/typemat/famille.component';
import { ListeMatiereComponent } from 'src/app/pages/stock/shared/matiere/liste/liste-matiere.component';
import { MouvementComponent } from 'src/app/pages/stock/shared/matiere/mouvement/mouvement.component';
import { DemandeComponent } from 'src/app/pages/stock/shared/demandes/demande.component';
import { DemandeprixComponent } from 'src/app/pages/stock/shared/demandeprixall/demandeprix/demandeprix.component';
import { ShowallComponent } from 'src/app/pages/stock/shared/demandeprixall/showall/showall.component';
import { DetaildemandeComponent } from 'src/app/pages/stock/shared/demandeprixall/detaildemande/detaildemande.component';
import { ReclamationFournissuerComponent } from 'src/app/pages/stock/shared/factures/reclamation-fournissuer/reclamation-fournissuer.component';
import { AddDdosierFournissuerComponent } from 'src/app/pages/stock/shared/dossierfournissuer/add-ddosier-fournissuer/add-ddosier-fournissuer.component';
import { DossierFournissuerComponent } from 'src/app/pages/stock/shared/dossierfournissuer/dossier-fournissuer/dossier-fournissuer.component';
import { ConsultedossierfournisseurComponent } from 'src/app/pages/stock/shared/dossierfournissuer/consultedossierfournisseur/consultedossierfournisseur.component';
import { AddservicesComponent } from 'src/app/pages/stock/shared/gestionservices/addservices/addservices.component';
import { ShowservicesComponent } from 'src/app/pages/stock/shared/gestionservices/showservices/showservices.component';
import { ListeservicesComponent } from 'src/app/pages/stock/shared/gestionservices/listeservices/listeservices.component';
import { ConsultserviceComponent } from 'src/app/pages/stock/shared/gestionservices/consultservice/consultservice.component';
import { ConsultdemandeServiceComponent } from 'src/app/pages/stock/shared/demandes/consult-service/consult-service.component';
export const AdminLayoutRoutes: Routes = [
        {
                path: 'dashboard', component: DashboardComponent/*, canActivate: [RoleGuard]*/,
                data: { expectedRole: 'dashboard', title: 'Tableau de bord' }
        },

        {
                path: 'clients', component: ClientsComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'clientsview', title: 'Clients' }
        },
        {
                path: 'clients/ajouter-client', component: AjouterClientComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'clientscreate', title: 'Ajouter client' }
        },
        {
                path: 'clients/update-client', component: UpdateClientComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'clientsupdate', title: 'Mise a jour client' }
        },
        {
                path: 'fournisseurs', component: FournisseurComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'fournisseursview', title: 'Fournisseurs' }
        },
        {
                path: 'fournisseurs/ajouter-fournisseur', component: AjouterFournisseurComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'fournisseurscreate', title: 'Ajouter fournisseur' }
        },
        {
                path: 'fournisseurs/update-fournisseur', component: UpdateFournisseurComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'fournisseursupdate', title: 'Mise a jour fournisseur' }
        },
        {
                path: 'fournisseurs/historique-fournisseur', component: HistoriqueFournisseurComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'fournisseursupdate', title: 'Mise a jour fournisseur' }
        }, 
         {
                path: 'fournisseurs/reclamation-fournisseur', component: ReclamationFournissuerComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'fournisseursreclamation', title: 'Reclamtion fournisseur' }
        },

        {
                path: 'Demandedeparix/detail-demande', component: DetaildemandeComponent, //canActivate: [RoleGuard],
                data: {title: 'consulter detaill' }
        },
        {
                path: 'Demandedeparix/add', component: DemandeprixComponent, //canActivate: [RoleGuard],
                data: {title: 'Demande de prix' }
        },    {
                path: 'Demandedeparix', component: ShowallComponent, //canActivate: [RoleGuard],
                data: {title: 'Afficher tout les demande' }
        },

        {
                path: 'services', component: ListeservicesComponent, //canActivate: [RoleGuard],
                data: {title: 'Afficher tout les demande' }
        }, {
                path: 'services/detail-services', component: ConsultserviceComponent, //canActivate: [RoleGuard],
                data: {title: 'consulter detaill' }
        },
        {
                path: 'services/add', component: AddservicesComponent, //canActivate: [RoleGuard],
                data: {title: 'Demande de prix' }
        },
    
         {
                path: 'listeDossier/detail-dossier', component: ConsultedossierfournisseurComponent, //canActivate: [RoleGuard],
                data: {title: 'Demande de prix' }
        },{
                path: 'listeDossier/ajouterDossier', component: AddDdosierFournissuerComponent, //canActivate: [RoleGuard],
                data: {title: 'Demande de prix' }
        },
        {
                path: 'listeDossier', component: DossierFournissuerComponent, //canActivate: [RoleGuard],
                data: {title: 'Afficher tout les demande' }
        },
        



        {        path: 'mp', component: MpComponent,  //canActivate: [RoleGuard],
                data: { expectedRole: 'typematcreate', title: 'Matière premiére',breadcrumb:'Matière première', category:'mp' },
                children:[
                {        path: '', component: DashboardComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpadmin', title: 'Tableaux de bord', breadcrumb:'Tableaux de bord' }
                },
                //all shared component comes here 
                {        path: 'famille', component: FamilleComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpfamille', title: 'Familles', breadcrumb:'Familles' },
                        children:[
                                {        path: '', component: TypeMatComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpfamilleview', title: ''}
                                },
                                {
                                        path: 'ajouter', component: AjouterTypematComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpfamillecreate', title: 'Ajouter', breadcrumb:'Ajouter famille' }
                                },
                                {
                                        path: 'modifier', component: ModifierTypematComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpfamilleupdate', title: 'Modifier', breadcrumb:'Modifier famille' }
                                }
                        ]
                },
                {        path: 'demandesint', component: DemandeintComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpdemandesint', title: 'Demande de prélévement', breadcrumb:'Demande de prélévement' },
                        children:[
                                {        path: '', component: DemandesintComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandeintview', title: ''}
                                },
                                {
                                        path: 'ajouter', component: ListeMatiereComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandesintcreate', title: 'Ajouter une demande de prélévement', breadcrumb:'Ajouter une demande de prélévement' }
                                },
                                {
                                        path: 'add-demandeint', component: AddDemandintComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandesintcreate', title: 'Crée une demande de prélévement', breadcrumb:'Crée une demande de prélévement' }
                                },
                                {
                                        path: 'consulter-demandeint', component: ConsulterDemandintComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandesintview', title: 'Consulter demande interieurs', breadcrumb: 'Consulter la demande de prélévement' }
                                }
                        ]
                },
                {        path: 'demandes', component: DemandeComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpdemandes', title: 'Demande d\'achat', breadcrumb:'Demande d\'achat' },
                        children:[
                                {        path: '', component: DemandesComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandeintview', title: ''}
                                },
                                {
                                        path: 'ajouter', component: ListeMatiereComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandesreate', title: 'Ajouter une demande d\'achat', breadcrumb:'Ajouter une demande d\'achat' }
                                },
                                {
                                        path: 'add-demande', component: AddDemandComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandescreate', title: 'Crée demandes', breadcrumb:'Crée une demande d\'achat' }
                                },
                                {
                                        path: 'add-demandeservice', component: ShowservicesComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandescreate', title: 'Crée demandes', breadcrumb:'Crée une demande d\'achat' }
                                },
                                {
                                        path: 'consulter-demande', component: ConsulterDemandComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpdemandesview', title: 'Consulter demande', breadcrumb:'Consulter une demande d\'achat' }
                                },
                                {  path: 'consulter-service', component: ConsultdemandeServiceComponent, //canActivate: [RoleGuard],
                                data: { expectedRole: 'mpdemandesview', title: 'Consulter demande', breadcrumb:'Consulter une demande d\'achat' }

                                },
                                {
                                        path: 'add-commandeap', component: AjouterCommandeapproComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'commandsapcreate', title: 'Ajouter bon de commande', breadcrumb:'Ajouter bon de commande' }
                                },
                        ]
                },
                {        path: 'commandessor', component: CommandesorComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpcmdsor', title: 'Commande de prélévement', breadcrumb:'Commande de prélévement' },
                        children:[
                                {        path: '', component: CommandessorComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpcmdsorview', title: ''}
                                },
                                {        path: 'consulter-commandesor', component: ConsulterCommandesorComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpcmdsorcreate', title: 'Consulter commande de prélévement' , breadcrumb:'Consulter de prélévement'}
                                },
                                {        path: 'ajouter-commandesor', component: AjouterCommandesorComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpcmdsorcreate', title: 'Crée une commande de prélévement' , breadcrumb:'Crée une commande de prélévement'}
                                },                
                        ]
                },
                {        path: 'commandesap', component: CommandeapproComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpcommande', title: 'Demande d\'achat', breadcrumb:'Commande d\'achat' },
                        children:[
                                {        path: '', component: CommandesapproComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpcommandeview', title: ''}
                                },
                                {        path: 'consulter-commandeap', component: ConsulterCommandeComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpcommandeview', title: 'Consulter commande d\'achat' , breadcrumb:'Consulter commande d\'achat'}
                                },
                                {

                                   path:'consulter-commandeapservice' , component:CommandeAproserviceComponent ,
                                   data : {expectedRole :'mpcommandeview'  ,title:'Consulter commande d\'achat'  }
                                }
                
                        ]
                },
                {        path: 'factures', component: FactureAchatComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpfactures', title: 'Facture d\'achat', breadcrumb:'Facture d\'achat' },
                        children:[
                                {        path: '', component: FacturesComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpfactureview', title: ''}
                                },
                                {        path: 'voir-facture', component: VoirfactureComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpfactureview', title: 'Consulter facture d\'achat' , breadcrumb:'Consulter facture d\'achat'}
                                }
                
                        ]
                },
                {        path: 'receptions', component: ReceptionComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpreceptions', title: 'Bon de receptions', breadcrumb:'Bon de receptions' },
                        children:[
                                {        path: '', component: ReceptionsComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpreceptionsview', title: ''}
                                },
                                {        path: 'voir-bon', component: VoirReceptionComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpreceptionview', title: 'Voir un bon de reception' , breadcrumb:'Voir un bon de reception'}
                                },{
                                path : 'voirservice-bon',component:VoirservicereceptionComponent,
                                data : {title: 'Voir un bon de reception'}
                                },
                                {        path: 'add-bon', component: AjouterReceptionComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpreceptioncreate', title: 'Ajouter un bon de reception' , breadcrumb:'Ajouter un bon de reception'}
                                },
                                {        path: 'add-bonservice', component: AddbonServiceComponent, //canActivate: [RoleGuard],
                                data: { expectedRole: 'mpreceptioncreate', title: 'Ajouter un bon de reception' , breadcrumb:'Ajouter un bon de reception'}
                        },

                                {        path: 'add-facture', component: AjouterFactureComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpfactureview', title: 'Ajouter facture d\'achat' , breadcrumb:'Ajouter une facture d\'achat'}
                                }
                
                        ]
                },
                {        path: 'inventaires', component: InventaireComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpreceptions', title: 'Bon de receptions', breadcrumb:'Inventaires' },
                        children:[
                                                                {
                                        path: '', component: InventairesComponent,
                                        data: { expectedRole: 'inventairesview', title: '' }
                                },
                                {
                                        path: 'consulter-inventaire', component: ConsulterInventaireComponent,
                                        data: { expectedRole: 'inventairesview', title: 'Voir inventaire', breadcrumb:'Consulter une inventaire' }
                                },
                                {
                                        path: 'ajouter-inventaire', component: ListeMatiereComponent,
                                        data: { expectedRole: 'inventairesview', title: 'Ajouter inventaire', breadcrumb:'Ajouter une inventaire' }

                                },{
                                        
                                        path: 'executer-inventaire', component: AjouterInventaireComponent,
                                        data: { expectedRole: 'inventairesview', title: 'Executer inventaire', breadcrumb:'Executer inventaire' }
                                }
                
                        ]
                },
                {        path: 'matieres', component: MatiereComponent, //canActivate: [RoleGuard],
                        data: { expectedRole: 'mpmatieres', title: 'Matiéres premiéres' },
                        children:[
                                {        path: '', component: ListeMatiereComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpmatieresview', title: 'Liste matiéres premiéres',breadcrumb:'Liste des matieres premiére'}
                                },
                                {
                                        path: 'ajouter-matiere', component: AjouterMatiereComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpmatierescreate', title: 'Ajouter matiére premiére', breadcrumb:'Ajouter matiére premiére' }
                                },
                                {
                                        path: 'consulter-matiere', component: ConsulterMatiereComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpmatieresview', title: 'Consulter matiere', breadcrumb: 'Consulter matiére premiére' }
                                },
                                {
                                        path: 'consulter-mouvement', component: MouvementComponent, //canActivate: [RoleGuard],
                                        data: { expectedRole: 'mpmatieresview', title: 'Consulter etat de mouvement', breadcrumb: 'Consulter etat de mouvement' }
                                }

                        ]
                },
                
                ]
        },
        {
                path: 'groupes', component: GroupesComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'groupesview', title: 'Groupes' }
        },
        {
                path: 'groupes/ajouter-groupe', component: AjouterGroupeComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'groupescreate', title: 'Ajouter Groupe' }
        },
        {
                path: 'groupes/update-groupe', component: UpdateGroupeComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'groupesupdate', title: 'Mise a jour groupes' }
        },
        // {
        //         path: 'products', component: ProductsComponent, //canActivate: [RoleGuard],
        //         data: { expectedRole: 'productsview', title: 'Products' }
        // },
        // {
        //         path: 'products/ajouter-produit', component: AjouterProduitComponent, //canActivate: [RoleGuard],
        //         data: { expectedRole: 'productscreate', title: 'Ajouter product' }
        // },
        // {
        //         path: 'products/update-produit', component: UpdateProduitComponent, //canActivate: [RoleGuard],
        //         data: { expectedRole: 'productsupdate', title: 'Mise a jour product' }
        // },
        {
                path: 'users', component: UsersComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'usersview', title: 'Users' }
        },
        {
                path: 'users/ajouter-user', component: AjouterUserComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'userscreate', title: 'Ajouter user' }
        },
        {
                path: 'users/update-user', component: UpdateUserComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'usersupdate', title: 'Mise a jour user' }
        },
        {
                path: 'commandes', component: CommandeComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'commandsview', title: 'Commandes' }
        },
        {
                path: 'commandes/ajouter-commande', component: AjouterCommandeComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'commandscreate', title: 'Ajouter commande' }
        },
        {
                path: 'commande/add-bon', component: BonlivComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'livraisoncreate', title: 'Bon de livraison' }
        },
        {
                path: 'commande/add-facture', component: FactureComponent,//canActivate:[RoleGuard],
                data: { expectedRole: 'facturecreate', title: 'Facture' }
        },
        {
                path: 'livraison', component: LivraisonComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'livraisonsview', title: 'Livraisons' }
        },
        {
                path: 'livraison/voir-bon', component: VoirbonComponent, //canActivate: [RoleGuard],
                data: { expectedRole: 'livraisonsview', title: 'Voir bon de livraison' }
        },
        {
                path: 'profile', component: ProfileUserComponent,
                data: { title: 'Profile' }
        }
];
