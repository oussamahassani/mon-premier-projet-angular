# [Hayet appro front-Angular])


## File Structure
## File Structure
Within the download you'll find the following directories and files:

```
HAYET PROJECT APPROVISONNEMENT
General :
  Pagination : Liste-component.ts : Sort dynamique => 
  ActiveSortHeader : Les attribut de sort actif, 
  Dans le ts : Si l'array sort ne contient pas l'attribut il l'affecte, sinon récupére l'index de l'attribut et lui affecte la valeur dans ValueSortHeader selon "asc" ou "desc"
  ValueSortHeader: La valeur pour chaque attribut : 1 ou -1, 
  Dans la fichier file affecte a la variable obj => obj[attribut]=valuer 
  Exemple => obj["createdAt"]=1
  La fonction de desactivation est "deleteEntity(id,valeur)" 
  Exemple pour desactiver : deleteEntity(id,false)
  Exemple pour reactiver : deleteEntity(id,true)

  -staut="attente" => Toujours en miniscule
  -Au niveau du backend pour la récupération du numéro du commandesor et commandeappro, le route se trouve dans le fichier facture.js même au niveau de l'appel des services
  A faire:
   Suppression des declarations et imports non utilisés de tout les composants

├── CHANGELOG.md
├── README.md
├── angular.json
├── e2e
├── package.json
├── src
│   ├── app
│   │   ├── app.component.html
│   │   ├── app.component.scss
│   │   ├── app.component.spec.ts
│   │   ├── app.component.ts
│   │   ├── app.module.ts
│   │   ├── app.routing.ts
│   │   ├── components
│   │   │   ├── components.module.spec.ts
│   │   │   ├── components.module.ts
│   │   │   ├── footer
│   │   │   │   ├── footer.component.html
│   │   │   │   ├── footer.component.scss
│   │   │   │   ├── footer.component.spec.ts
│   │   │   │   └── footer.component.ts
│   │   │   ├── navbar
│   │   │   │   ├── navbar.component.html
│   │   │   │   ├── navbar.component.scss
│   │   │   │   ├── navbar.component.spec.ts
│   │   │   │   └── navbar.component.ts
│   │   │   └── sidebar
│   │   │       ├── sidebar.component.html : Ligne 493 => Commentaire contenant la navigation du module commerciale
│   │   │       ├── sidebar.component.scss
│   │   │       ├── sidebar.component.spec.ts
│   │   │       └── sidebar.component.ts : Ligne 14 a 119 => Supprimer les routes dynamiques vu que les routes sont devenus static
     
│   │   ├── layouts
│   │   │   ├── admin-layout
│   │   │   │   ├── admin-layout.component.html
│   │   │   │   ├── admin-layout.component.scss : Contient la position du snackbar
│   │   │   │   ├── admin-layout.component.spec.ts
│   │   │   │   ├── admin-layout.component.ts : Ligne 54: A supprimer la fonction GrouperDemande()

│   │   │   │   ├── admin-layout.module.ts : Providers contient le type de la date selon l'endroit pour le moment c'est "FR" ainsi qu'une fonction "RegisterLocalDate(fr) pour la langue"
│   │   │   │   └── admin-layout.routing.ts
│   │   ├── pages
│   │   │   ├── dashboard
│   │   │   │   ├── dashboard.component.html
│   │   │   │   ├── dashboard.component.scss
│   │   │   │   ├── dashboard.component.spec.ts
│   │   │   │   └── dashboard.component.ts
│   │   │   ├── clients : Partie du module commerciale
│   │   │   │   ├── clients.component.html : A fixer français-anglais, qteModal a supprimer
│   │   │   │   ├── clients.component.scss
│   │   │   │   ├── clients.component.spec.ts
│   │   │   │   ├── clients.component.ts
│   │   │   │   ├── ajouter-client
│   │   │   │   │     ├── ajouter-client.component.html : Manque :form.controls.touched
│   │   │   │   │     ├── ajouter-client.component.scss
│   │   │   │   │     ├── ajouter-client.component.spec.ts
│   │   │   │   │     └── ajouter-client.component.ts
│   │   │   │   ├── update-client
│   │   │   │   │     ├── update-client.component.html : ngmodel instead of formgroup
│   │   │   │   │     ├── update-client.component.scss
│   │   │   │   │     ├── update-client.component.spec.ts
│   │   │   │   │     └── update-client.component.ts : ngmodel instead of formgroup
│   │   │   ├── commande : Partie du module commerciale
│   │   │   │   ├── commande.component.html : qteModal a supprimer
│   │   │   │   ├── commande.component.scss
│   │   │   │   ├── commande.component.spec.ts
│   │   │   │   ├── commande.component.ts
│   │   │   │   ├── ajouter-commande : aucun commentaire
│   │   │   │   │     ├── ajouter-commande.component.html
│   │   │   │   │     ├── ajouter-commande.component.scss
│   │   │   │   │     ├── ajouter-commande.component.spec.ts
│   │   │   │   │     └── ajouter-commande.component.ts
│   │   │   │   ├── bonliv => Ajout de bon de livraison
│   │   │   │   │     ├── bonliv.component.html 
│   │   │   │   │     ├── bonliv.component.scss
│   │   │   │   │     ├── bonliv.component.spec.ts
│   │   │   │   │     └── bonliv.component.ts : fonction getProducts() doit être changer en getMultipleProductsByIds
│   │   │   │   ├── facture=> Ajout de facture
│   │   │   │   │     ├── facture.component.html
│   │   │   │   │     ├── facture.component.scss
│   │   │   │   │     ├── facture.component.spec.ts
│   │   │   │   │     └── facture.component.ts 
│   │   │   ├── fournisseur
│   │   │   │   ├── fournisseur.component.html
│   │   │   │   ├── fournisseur.component.scss
│   │   │   │   ├── fournisseur.component.spec.ts
│   │   │   │   ├── fournisseur.component.ts
│   │   │   │   ├── ajouter-fournisseur
│   │   │   │   │     ├── ajouter-fournisseur.component.html 
│   │   │   │   │     ├── ajouter-fournisseur.component.scss
│   │   │   │   │     ├── ajouter-fournisseur.component.spec.ts
│   │   │   │   │     └── ajouter-fournisseur.component.ts : A supprimer les variables non utilisées comme typeList et type
│   │   │   │   ├── update-fournisseur
│   │   │   │   │     ├── update-fournisseur.component.html
│   │   │   │   │     ├── update-fournisseur.component.scss
│   │   │   │   │     ├── update-fournisseur.component.spec.ts
│   │   │   │   │     └── update-fournisseur.component.ts
│   │   │   │   ├── historique-fournisseur => Contient l'historique du fournisseur par bon de reception
│   │   │   │   │     ├── historique-fournisseur.component.html
│   │   │   │   │     ├── historique-fournisseur.component.scss
│   │   │   │   │     ├── historique-fournisseur.component.spec.ts
│   │   │   │   │     └── historique-fournisseur.component.ts : a supprimer la fonction de mise a jour onUpdateFournisseurSubmit() 
│   │   │   ├── groupes : Template d'xpr
│   │   │   │   ├── groupes.component.html
│   │   │   │   ├── groupes.component.scss
│   │   │   │   ├── groupes.component.spec.ts
│   │   │   │   └── groupes.component.ts
│   │   │   ├── livraison 
│   │   │   │   ├── livraison.component.html : Bug => Lorsque on parcours la liste pour accéder a l'item on fais : "element.item.id" au lieu de "element.id" pour tout les attributs 
│   │   │   │   ├── livraison.component.scss
│   │   │   │   ├── livraison.component.spec.ts
│   │   │   │   ├── livraison.component.ts
│   │   │   │   ├── voirbon
│   │   │   │   │     ├── voirbon.component.html 
│   │   │   │   │     ├── voirbon.component.scss
│   │   │   │   │     ├── voirbon.component.spec.ts
│   │   │   │   │     └── voirbon.component.ts : fonction getProducts() doit être changer en getMultipleProductsByIds + lightbox buger
│   │   │   ├── login
│   │   │   │   ├── login.component.html
│   │   │   │   ├── login.component.scss
│   │   │   │   ├── login.component.spec.ts
│   │   │   │   └── login.component.ts
│   │   │   ├── products : Partie du module commerciale
│   │   │   │   ├── products.component.html : A fixer français-anglais, qteModal a supprimer
│   │   │   │   ├── products.component.scss
│   │   │   │   ├── products.component.spec.ts
│   │   │   │   ├── products.component.ts
│   │   │   │   ├── ajouter-produit
│   │   │   │   │     ├── ajouter-produit.component.html : Manque :form.controls.touched
│   │   │   │   │     ├── ajouter-produit.component.scss
│   │   │   │   │     ├── ajouter-produit.component.spec.ts
│   │   │   │   │     └── ajouter-produit.component.ts
│   │   │   │   ├── update-produit
│   │   │   │         ├── update-produit.component.html : ngmodel instead of formgroup
│   │   │   │         ├── update-produit.component.scss
│   │   │   │         ├── update-produit.component.spec.ts
│   │   │   │         └── update-produit.component.ts : ngmodel instead of formgroup
│   │   │   ├── profile-user =>Vide
│   │   │   │    ├── profile-user.component.html
│   │   │   │    ├── profile-user.component.scss
│   │   │   │    ├── profile-user.component.spec.ts
│   │   │   │    └── profile-user.component.ts
│   │   │   ├── snackbar : Inject snackbar et use it as a component (Parceque la Snackbar normale est bugée au niveau de l'affichage sur la plateforme")
│   │   │   │    ├── snackbar.component.html
│   │   │   │    ├── snackbar.component.scss
│   │   │   │    ├── snackbar.component.spec.ts
│   │   │   │    └── snackbar.component.ts 
│   │   │   ├── stock
│   │   │   │   ├── mp
│   │   │   │   │     ├── mp.component.html 
│   │   │   │   │     ├── mp.component.scss
│   │   │   │   │     ├── mp.component.spec.ts
│   │   │   │   │     └── mp.component.ts
│   │   │   │   ├── shared
│   │   │   │   │     ├── commandesappro
│   │   │   │   │     │    ├── commandesappro.component.html 
│   │   │   │   │     │    ├── commandesappro.component.scss
│   │   │   │   │     │    ├── commandesappro.component.spec.ts
│   │   │   │   │     │    ├── commandesappro.component.ts
│   │   │   │   │     │    ├── ajouter-commandeappro
│   │   │   │   │     │    │   ├── ajouter-commandeappro.component.html 
│   │   │   │   │     │    │   ├── ajouter-commandeappro.component.scss
│   │   │   │   │     │    │   ├── ajouter-commandeappro.component.spec.ts
│   │   │   │   │     │    │   └── ajouter-commandeappro.component.ts : Ligne 69 sort fournisseur by price
│   │   │   │   │     │    │        Ligne 170-174 : Grouper les commandes selon les fournisseurs avec la liste  │   │   │   │   │     │    │        des matiéres pour chaque fournisseur
│   │   │   │   │     │    ├── consulter-commande
│   │   │   │   │     │    │   ├── consulter-commande.component.html 
│   │   │   │   │     │    │   ├── consulter-commande.component.scss
│   │   │   │   │     │    │   ├── consulter-commande.component.spec.ts
│   │   │   │   │     │    │   └── consulter-commande.component.ts
│   │   │   │   │     │    ├── ajouter-facture => Ajout de facture interne
│   │   │   │   │     │    │   ├── ajouter-facture.component.html 
│   │   │   │   │     │    │   ├── ajouter-facture.component.scss
│   │   │   │   │     │    │   ├── ajouter-facture.component.spec.ts
│   │   │   │   │     │    │   └── ajouter-facture.component.ts
│   │   │   │   │     ├── commandesor
│   │   │   │   │     │    │   ├── commandessor.component.html 
│   │   │   │   │     │    │   ├── commandessor.component.scss
│   │   │   │   │     │    │   ├── commandessor.component.spec.ts
│   │   │   │   │     │    │   ├── commandessor.component.ts => fonction getTypes => query back end
│   │   │   │   │     │    ├── ajouter-commandesor
│   │   │   │   │     │    │   ├── ajouter-commandesor.component.html 
│   │   │   │   │     │    │   ├── ajouter-commandesor.component.scss
│   │   │   │   │     │    │   ├── ajouter-commandesor.component.spec.ts
│   │   │   │   │     │    │   └── ajouter-commandesor.component.ts
│   │   │   │   │     │    ├── consulter-commandesor
│   │   │   │   │     │    │   ├─  consulter-commandesor.component.html 
│   │   │   │   │     │    │   ├── consulter-commandesor.component.scss
│   │   │   │   │     │    │   ├── consulter-commandesor.component.spec.ts
│   │   │   │   │     │    │   └── consulter-commandesor.component.ts
│   │   │   │   │     ├── demandeint
│   │   │   │   │     │    │   ├── demandeint.component.html 
│   │   │   │   │     │    │   ├── demandeint.component.scss
│   │   │   │   │     │    │   ├── demandeint.component.spec.ts
│   │   │   │   │     │    │   ├── demandeint.component.ts
│   │   │   │   │     │    ├── liste
│   │   │   │   │     │    │   ├── demandesint.component.html 
│   │   │   │   │     │    │   ├── demandesint.component.scss
│   │   │   │   │     │    │   ├── demandesint.component.spec.ts
│   │   │   │   │     │    │   └── demandesint.component.ts
│   │   │   │   │     │    ├── consulter-demand
│   │   │   │   │     │    │   ├─  consulter-demandint.component.html 
│   │   │   │   │     │    │   ├── consulter-demandint.component.scss
│   │   │   │   │     │    │   ├── consulter-demandint.component.spec.ts
│   │   │   │   │     │    │   └── consulter-demandint.component.ts
│   │   │   │   │     │    ├── add-demand
│   │   │   │   │     │    │   ├─  add-demandint.component.html A retirer le stock min et le stock max
│   │   │   │   │     │    │   ├── add-demandint.component.scss
│   │   │   │   │     │    │   ├── add-demandint.component.spec.ts
│   │   │   │   │     │    │   └── add-demandint.component.ts
│   │   │   │   │     ├── demandes
│   │   │   │   │     │    │   ├── demandes.component.html 
│   │   │   │   │     │    │   ├── demandes.component.scss
│   │   │   │   │     │    │   ├── demandes.component.spec.ts
│   │   │   │   │     │    │   ├── demandes.component.ts : A supprimer la fonction de confirmDemand()
│   │   │   │   │     │    ├── consulter-demand
│   │   │   │   │     │    │   ├─  consulter-demand.component.html : A retirer stock min et stock max
│   │   │   │   │     │    │   ├── consulter-demand.component.scss
│   │   │   │   │     │    │   ├── consulter-demand.component.spec.ts
│   │   │   │   │     │    │   └── consulter-demand.component.ts
│   │   │   │   │     │    ├── add-demand
│   │   │   │   │     │    │   ├─  add-demand.component.html A retirer le stock min et le stock max
│   │   │   │   │     │    │   ├── add-demand.component.scss
│   │   │   │   │     │    │   ├── add-demand.component.spec.ts
│   │   │   │   │     │    │   └── add-demand.component.ts : Lors de l'ajout commanderMatiere sert a mettre       │   │   │   │   │     │    │        l'attribut de la matiére "demandeEnCours" a true pour ne pas passer une 
│   │   │   │   │     │    │        autre commande (manque la condition sur la matiére)
│   │   │   │   │     ├── factures : A refaire toute la partie de la facture avec la liason avec les bon de       │   │   │   │   │     │    │         receptions (non fonctionnel pour le moment)
│   │   │   │   │     ├── inventaires
│   │   │   │   │     │    │   ├── inventaires.component.html 
│   │   │   │   │     │    │   ├── inventaires.component.scss
│   │   │   │   │     │    │   ├── inventaires.component.spec.ts
│   │   │   │   │     │    │   ├── inventaires.component.ts
│   │   │   │   │     │    ├── consulter-inventaire
│   │   │   │   │     │    │   ├─  consulter-inventaire.component.html
│   │   │   │   │     │    │   ├── consulter-inventaire.component.scss
│   │   │   │   │     │    │   ├── consulter-inventaire.component.spec.ts
│   │   │   │   │     │    │   └── consulter-inventaire.component.ts : Calcul de cmp totalement faux
│   │   │   │   │     │    ├── ajouter-inventaire : Récuperation de l'inventaire du matiere component et ajout de │   │   │   │   │     │    │   │  valeur pour chaque lot
│   │   │   │   │     │    │   ├─  ajouter-inventaire.component.html
│   │   │   │   │     │    │   ├── ajouter-inventaire.component.scss
│   │   │   │   │     │    │   ├── ajouter-inventaire.component.spec.ts
│   │   │   │   │     │    │   └── ajouter-inventaire.component.ts
│   │   │   │   │     ├── matiere
│   │   │   │   │     │    │   ├── matiere.component.html 
│   │   │   │   │     │    │   ├── matiere.component.scss
│   │   │   │   │     │    │   ├── matiere.component.spec.ts
│   │   │   │   │     │    │   ├── matiere.component.ts
│   │   │   │   │     │    ├── liste : Itheb khdemha ena bidi mafhemtech
│   │   │   │   │     │    │   ├─  liste-matiere.component.html
│   │   │   │   │     │    │   ├── liste-matiere.component.scss
│   │   │   │   │     │    │   ├── liste-matiere.component.spec.ts
│   │   │   │   │     │    │   └── liste-matiere.component.ts 
│   │   │   │   │     │    ├── mouvement
│   │   │   │   │     │    │   ├─  mouvement.component.html
│   │   │   │   │     │    │   ├── mouvement.component.scss
│   │   │   │   │     │    │   ├── mouvement.component.spec.ts
│   │   │   │   │     │    │   └── mouvement.component.ts
│   │   │   │   │     │    ├── sortie-production : A supprimer tout le composant
│   │   │   │   │     │    ├── ajouter-matiere : Partie ouda, a corriger la categorie et les familles et l'ajout  │   │   │   │   │     │    │   │      du fournisseur, le design et le touched form 
│   │   │   │   │     │    │   ├─  ajouter-matiere.component.html
│   │   │   │   │     │    │   ├── ajouter-matiere.component.scss
│   │   │   │   │     │    │   ├── ajouter-matiere.component.spec.ts
│   │   │   │   │     │    │   └── ajouter-matiere.component.ts
│   │   │   │   │     │    ├── consulter-matiere : Partie ouda, a corriger la categorie et les familles et        │   │   │   │   │     │    │   │       l'ajout du fournisseur, le design et le touched form 
│   │   │   │   │     │    │   ├─  consulter-matiere.component.html
│   │   │   │   │     │    │   ├── consulter-matiere.component.scss
│   │   │   │   │     │    │   ├── consulter-matiere.component.spec.ts
│   │   │   │   │     │    │   └── consulter-matiere.component.ts
│   │   │   │   │     ├── receptions
│   │   │   │   │     │    │   ├── receptions.component.html 
│   │   │   │   │     │    │   ├── receptions.component.scss
│   │   │   │   │     │    │   ├── receptions.component.spec.ts
│   │   │   │   │     │    │   ├── receptions.component.ts : A revoir les fonctions d'upload de fichier facture/bl
│   │   │   │   │     │    ├── voir-reception
│   │   │   │   │     │    │   ├─  voir-reception.component.html
│   │   │   │   │     │    │   ├── voir-reception.component.scss
│   │   │   │   │     │    │   ├── voir-reception.component.spec.ts
│   │   │   │   │     │    │   └── voir-reception.component.ts : Lors du changement du statut => If reception     │   │   │   │   │     │    │   │   update reception(front-back),matiere(back),lot(back), ajouter de mouvement   │ │   │   │   │   │     │    │   │   (back) et update commande (front-back) nouvelle version du code                │   │   │   │   │     │    │   │    disponible sur discord discussion privée Itheb
│   │   │   │   │     │    ├── ajouter-reception
│   │   │   │   │     │    │   ├─  ajouter-reception.component.html
│   │   │   │   │     │    │   ├── ajouter-reception.component.scss
│   │   │   │   │     │    │   ├── ajouter-reception.component.spec.ts
│   │   │   │   │     │    │   └── ajouter-reception.component.ts : Lors de l'ajout statut => If reception update |   |   |   |   |     |    |   |   reception(front-back),matiere(back),lot(back), ajouter de mouvement (back) et  |   |   |   |   |     |    |   |   update commande (front-back) nouvelle version du code disponible sur discord   |   |   |   |   |     |    |   |   discussion privée Itheb 
|   |   |   └── └──   └──  └── └── prixChanged=> update prix du fournisseur pour la matiére x
│   │   └── variables
│   │       └── charts.ts
│   ├── assets
│   │   ├── fonts
│   │   ├── img
│   │   ├── scss
│   │   │   ├── angular-differences
│   │   │   ├── argon.scss
│   │   │   ├── core
│   │   │   └── custom
│   │   └── vendor
│   ├── browserslist
│   ├── environments
│   ├── favicon.ico
│   ├── index.html
│   ├── main.ts
│   ├── polyfills.ts
│   ├── styles.scss
│   ├── test.ts
│   ├── tsconfig.app.json
│   ├── tsconfig.spec.json
│   └── tslint.json
├── tsconfig.json
└── tslint.json
```

## Browser Support
- Google Chrome
