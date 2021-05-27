import { NgModule, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ClipboardModule } from 'ngx-clipboard';
import { LightboxModule } from 'ngx-lightbox';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../pages/dashboard/dashboard.component';
import { ClientsComponent } from '../../pages/clients/clients.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ProductsComponent } from 'src/app/pages/products/products.component';
import { UsersComponent } from 'src/app/pages/users/users.component';
import { AjouterProduitComponent } from 'src/app/pages/products/ajouter-produit/ajouter-produit.component';
import { UpdateProduitComponent } from 'src/app/pages/products/update-produit/update-produit.component';
import { AjouterClientComponent } from 'src/app/pages/clients/ajouter-client/ajouter-client.component';
import { UpdateClientComponent } from 'src/app/pages/clients/update-client/update-client.component';
import { AjouterUserComponent } from 'src/app/pages/users/ajouter-user/ajouter-user.component';
import { UpdateUserComponent } from 'src/app/pages/users/update-user/update-user.component';
// import { ToastrModule } from 'ngx-toastr';
import {MatTableModule} from '@angular/material/table';
import {MatSortModule} from '@angular/material/sort';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';

import {MatCardModule} from '@angular/material/card';

import {MatProgressBarModule} from '@angular/material/progress-bar';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatIconModule} from '@angular/material/icon';

import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import { SnackbarComponent } from 'src/app/pages/snackbar/snackbar.component';
import { GroupesComponent } from 'src/app/pages/groupes/groupes.component';
import { AjouterGroupeComponent } from 'src/app/pages/groupes/ajouter-groupe/ajouter-groupe.component';
import { UpdateGroupeComponent } from 'src/app/pages/groupes/update-groupe/update-groupe.component';
import { CommandeComponent } from 'src/app/pages/commande/commande.component';
import { BonlivComponent } from 'src/app/pages/commande/bonliv/bonliv.component';
import { FactureComponent } from 'src/app/pages/commande/facture/facture.component';
import { AjouterCommandeComponent } from 'src/app/pages/commande/ajouter-commande/ajouter-commande.component';
import { NgxMatSelectSearchModule } from 'ngx-mat-select-search';
import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { VoirbonComponent } from 'src/app/pages/livraison/voirbon/voirbon.component';
import { LivraisonComponent } from 'src/app/pages/livraison/livraison.component';
import { VoirfactureComponent } from 'src/app/pages/stock/shared/factures/voirfacture/voirfacture.component';
import { FacturesComponent } from 'src/app/pages/stock/shared/factures/liste/factures.component';
import { FactureAchatComponent } from 'src/app/pages/stock/shared/factures/factureAchat.component';
import { FournisseurComponent } from 'src/app/pages/fournisseur/fournisseur.component';
import { AjouterFournisseurComponent } from 'src/app/pages/fournisseur/ajouter-fournisseur/ajouter-fournisseur.component';
import { UpdateFournisseurComponent } from 'src/app/pages/fournisseur/update-fournisseur/update-fournisseur.component';
import { MatiereComponent } from 'src/app/pages/stock/shared/matiere/matiere.component';
import { AjouterMatiereComponent } from 'src/app/pages/stock/shared/matiere/ajouter-matiere/ajouter-matiere.component';
import { ConsulterMatiereComponent } from 'src/app/pages/stock/shared/matiere/consulter-matiere/consulter-matiere.component';
import { ReceptionComponent } from 'src/app/pages/stock/shared/receptions/reception.component';
import { ReceptionsComponent } from 'src/app/pages/stock/shared/receptions/liste/receptions.component';
import { AjouterReceptionComponent } from 'src/app/pages/stock/shared/receptions/ajouter-reception/ajouter-reception.component';
import { AddbonServiceComponent } from 'src/app/pages/stock/shared/receptions/addbon-service/addbon-service.component';
import { VoirReceptionComponent } from 'src/app/pages/stock/shared/receptions/voir-reception/voir-reception.component';
import { VoirservicereceptionComponent } from 'src/app/pages/stock/shared/receptions/voirservicereception/voirservicereception.component';
import { CommandesapproComponent } from 'src/app/pages/stock/shared/commandesappro/liste/commandesappro.component';
import { CommandeapproComponent } from 'src/app/pages/stock/shared/commandesappro/commandeappro.component';
import { CommandeAproserviceComponent } from 'src/app/pages/stock/shared/commandesappro/commande-aproservice/commande-aproservice.component';
import { AjouterFactureComponent } from 'src/app/pages/stock/shared/factures/ajouter-facture/ajouter-facture.component';
import { AjouterCommandeapproComponent } from 'src/app/pages/stock/shared/commandesappro/ajouter-commandeappro/ajouter-commandeappro.component';
import { DemandesComponent } from 'src/app/pages/stock/shared/demandes/liste/demandes.component';
import { DemandeComponent } from 'src/app/pages/stock/shared/demandes/demande.component';
import { AddDemandComponent } from 'src/app/pages/stock/shared/demandes/add-demand/add-demand.component';
import { InventairesComponent } from 'src/app/pages/stock/shared/inventaires/liste/inventaires.component';
import { InventaireComponent } from 'src/app/pages/stock/shared/inventaires/inventaire.component';
import { ConsulterInventaireComponent } from 'src/app/pages/stock/shared/inventaires/consulter-inventaire/consulter-inventaire.component';
import { ProfileUserComponent } from 'src/app/pages/profile-user/profile-user.component';
import { ConsulterDemandComponent } from 'src/app/pages/stock/shared/demandes/consulter-demand/consulter-demand.component';
import { SortieProductionComponent } from 'src/app/pages/stock/shared/matiere/sortie-production/sortie-production.component';
import { AjouterTypematComponent } from 'src/app/pages/stock/shared/typemat/ajouter-typemat/ajouter-typemat.component';
import { TypeMatComponent } from 'src/app/pages/stock/shared/typemat/liste/typemat.component';
import { ModifierTypematComponent } from 'src/app/pages/stock/shared/typemat/modifier-typemat/modifier-typemat.component';


import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { HistoriqueFournisseurComponent } from 'src/app/pages/fournisseur/historique-fournisseur/historique-fournisseur.component';
import { ConsulterCommandeComponent } from 'src/app/pages/stock/shared/commandesappro/consulter-commande/consulter-commande.component';
import { CommandessorComponent } from 'src/app/pages/stock/shared/commandesor/liste/commandessor.component';
import { CommandesorComponent } from 'src/app/pages/stock/shared/commandesor/commandesor.component';
import { AjouterCommandesorComponent } from 'src/app/pages/stock/shared/commandesor/ajouter-commandesor/ajouter-commandesor.component';
import { DemandesintComponent } from 'src/app/pages/stock/shared/demandeint/liste/demandesint.component';
import { DemandeintComponent } from 'src/app/pages/stock/shared/demandeint/demandeint.component';
import { ConsulterDemandintComponent } from 'src/app/pages/stock/shared/demandeint/consulter-demand/consulter-demandint.component';
import { AddDemandintComponent } from 'src/app/pages/stock/shared/demandeint/add-demand/add-demandint.component';
import { AjouterInventaireComponent } from 'src/app/pages/stock/shared/inventaires/ajouter-inventaire/ajouter-inventaire.component';
import { ConsulterCommandesorComponent } from 'src/app/pages/stock/shared/commandesor/consulter-commandesor/consulter-commandesor.component';
registerLocaleData(localeFr);

import { MpComponent } from 'src/app/pages/stock/mp/mp.component';
import { FamilleComponent } from 'src/app/pages/stock/shared/typemat/famille.component';
import { ListeMatiereComponent } from 'src/app/pages/stock/shared/matiere/liste/liste-matiere.component';
import { MouvementComponent } from 'src/app/pages/stock/shared/matiere/mouvement/mouvement.component';
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
@NgModule({
  imports: [
    MatCardModule,
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    LightboxModule,
    ReactiveFormsModule,
    HttpClientModule,
    NgbModule,
    ClipboardModule,
    MatButtonModule,
    MatInputModule,
    MatRadioModule,
    MatFormFieldModule,
    MatIconModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSelectModule,
    NgxMatSelectSearchModule,
    MatDialogModule,
    MatSnackBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatAutocompleteModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSlideToggleModule,
    MatProgressSpinnerModule
  ],
  declarations: [
    DashboardComponent,
    ClientsComponent,
    ProductsComponent,
    UsersComponent,
    AjouterProduitComponent,
    UpdateProduitComponent,
    AjouterClientComponent,
    UpdateClientComponent,
    AjouterUserComponent,
    UpdateUserComponent,
    SnackbarComponent,
    GroupesComponent,
    AjouterGroupeComponent,
    UpdateGroupeComponent,
    BonlivComponent,
    FactureComponent,
    CommandeComponent,
    AjouterCommandeComponent,
    LivraisonComponent,
    VoirbonComponent,
    FacturesComponent,
    FactureAchatComponent,
    VoirfactureComponent,
    FournisseurComponent,
    AjouterFournisseurComponent,
    UpdateFournisseurComponent,
    MatiereComponent,
    AjouterMatiereComponent,
    ConsulterMatiereComponent,
    ReceptionsComponent,
    ReceptionComponent,
    AjouterReceptionComponent,
    VoirReceptionComponent,
    CommandesapproComponent,
    CommandeapproComponent,
    AjouterCommandeComponent,
    AjouterFactureComponent,
    AjouterCommandeapproComponent,
    DemandesComponent,
    DemandeComponent,
    AddDemandComponent,
    InventairesComponent,
    InventaireComponent,
    ConsulterInventaireComponent,
    ProfileUserComponent,
    ConsulterDemandComponent,
    SortieProductionComponent,
    HistoriqueFournisseurComponent,
    ConsulterCommandeComponent,
    CommandessorComponent,
    CommandesorComponent,
    DemandesintComponent,
    ConsulterDemandintComponent,
    AddDemandintComponent,
    AjouterCommandesorComponent,
    AjouterTypematComponent,
    TypeMatComponent,
    ModifierTypematComponent,
    AjouterInventaireComponent,
    ConsulterCommandesorComponent,
    MpComponent,
    FamilleComponent,
    DemandeintComponent,
    ListeMatiereComponent,
    MouvementComponent,
    DemandeprixComponent,
    ShowallComponent,
    DetaildemandeComponent,
    ReclamationFournissuerComponent,
    AddDdosierFournissuerComponent,
    DossierFournissuerComponent,
    ConsultedossierfournisseurComponent,
    AddservicesComponent,
    ShowservicesComponent,
    ListeservicesComponent, 
    ConsultserviceComponent,
    ConsultdemandeServiceComponent,
    CommandeAproserviceComponent,
    AddbonServiceComponent,
    VoirservicereceptionComponent
  ],
  providers:[
    {provide: MAT_DATE_LOCALE, useValue: 'en-GB'},
    {provide: LOCALE_ID, useValue: 'fr'}
  ]
})

export class AdminLayoutModule {}
