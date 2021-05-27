import {AbstractControl} from '@angular/forms';
export interface StateGroup {
  letter: string;
  names: string[];
}
export function passValidation(control : AbstractControl){
    if(control && (control.value !== null || control.value !== undefined)){
      const cpass =  control.value ;
      const pass = control.root.get('password');
      if(pass){
        const passVal = pass.value ;
        if(passVal != cpass ){
          return {
            isError : true
          }
        }
      }
  
    }
    return null ; 
  }


  export function emailValidation(control : AbstractControl){
    if(control && (control.value !== null || control.value !== undefined)){
      const regex = new RegExp(/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/);
      if(!regex.test(control.value)){
          return {
            isError : true
          }
        }
      
  
    }
    return null ; 
  }
  
  export function cinValidation(control : AbstractControl){
    if(control && (control.value !== null || control.value !== undefined)){
      const regex = new RegExp(/^\d{4}-?\d{4}$/);
      if(!regex.test(control.value)){
          return {
            isError : true
          }
        }  
    }
    return null ; 
  }

  
  export function ribValidation(control : AbstractControl){
    if(control && (control.value !== null || control.value !== undefined)){
      const regex = new RegExp(/^\d{10}-?\d{10}$/);
      if(!regex.test(control.value)){
          return {
            isError : true
          }
        }  
    }
    return null ; 
  }
  export function RegionValidator(control: AbstractControl): { [key: string]: boolean } | null {


    var stateGroups: StateGroup[] = [
      {
        letter: 'A',
        names: ['Aachech,Sfax', 'Agareb,Sfax', 'Aïn Djeloula,Kairouan', 'Aïn Draham,Jendouba', 'Akouda,Sousse', 'El Assouda,Sidi Bouzid', 'Amdoun,Béja', 'Amiret El Fhoul,Monastir', 'Amiret Hajjaj,Monastir', 'Amiret Touazra,Monastir', 'Aousja,Bizerte', 'Ariana,Ariana', 'Azmour,Nabeul']
      }, {
        letter: 'B',
        names: ['Bargou,Siliana',
          'Béja,Béja',
          'Bekalta,Monastir',
          'Belkhir,Gafsa',
          'Bembla,Monastir',
          'Ben Arous,Ben Arous',
          'Ben Gardane,Médenine',
          'Beni Hassen,Monastir',
          'Béni Khalled,Nabeul',
          'Beni Khedache,Médenine',
          'Béni Khiar,Nabeul',
          'Beni Mtir,Jendouba',
          'BennaneBodheur,Monastir',
          'Bir Ali Ben Khalifa,Sfax',
          'Bir El Hafey,Sidi Bouzid',
          'Bir Lahmar,Tataouine',
          'Bir Mcherga,Zaghouan',
          'Bizerte,Bizerte',
          'Borj El Amri,la Manouba',
          'Bou Arada,Siliana',
          'Bou Argoub,Nabeul',
          'Bou Hajla,Kairouan',
          'Bou Merdes,Mahdia',
          'Bou Mhel elBassatine,Ben Arous',
          'Bou Salem,Jendouba',
          'Bouchemma,Gabès',
          'Bouficha,Sousse',
          'Bouhjar,Monastir'
        ]
      }, {
        letter: 'C',
        names: ['Carthage,Tunis',
          'Cebbala Ouled Asker,Sidi Bouzid',
          'Chebba,Mahdia',
          'Chebika,Kairouan',
          'Chenini Nahal,Gabès',
          'Cherahil,Monastir',
          'Chihia,Sfax',
          'Chorbane,Mahdia'
        ]
      }, {
        letter: 'D',
        names: [
          'Dahmani,du Kef',
          'Dar Allouch,Nabeul',
          'Dar Chaâbane,Nabeul',
          'Degache,Tozeur',
          'Dehiba,Tataouine',
          'Denn,la Manouba',
          'Djebel Oust,Zaghouan',
          'Djedeida,la Manouba',
          'Djerba,Ajim,Médenine',
          'Djerba,Houmt Souk,Médenine',
          'Djerba,Midoun,Médenine',
          'Douar Hicher,la Manouba',
          'Douz,Kébili'
        ]
      }, {
        letter: 'E',
        names: [
          'Echrarda,Kairouan',
          'El Aïn,Sfax',
          'El Alâa,Kairouan',
          'El Alia,Bizerte',
          'El Amra,Sfax',
          'El Aroussa,Siliana',
          'El Ayoun,Kasserine',
          'El Batan,la Manouba',
          'El Bradâa,Mahdia',
          'El Fahs,Zaghouan',
          'El Ghnada,Monastir',
          'El Golâa,Kébili',
          'El Guettar,Gafsa',
          'El Hamma,Gabès',
          'El Hamma du Jérid,Tozeur',
          'El Haouaria,Nabeul',
          'El Hencha,Sfax',
          'El Jem,Mahdia',
          'El Krib,Siliana',
          'El Ksar,Gafsa',
          'El Ksour,du Kef',
          'El Maâgoula,Béja',
          'El Maâmoura,Nabeul',
          'El Masdour,Monastir',
          'El Mida,Nabeul',
          'El Mourouj,Ben Arous',
          'Enfida,Sousse',
          'Ennasr,Sfax',
          'Essaïda,Sidi Bouzid',
          'Essouassi,Mahdia',
          'Ezzahra,Ben Arous',
          'Ezzouhour,Sousse',
          'Ezzouhour,Kasserine'
        ]
      }, {
        letter: 'F',
        names: [
          'Faouar,Kébili',
          'Fériana,Kasserine',
          'Fernana,Jendouba',
          'Fouchana,Ben Arous',
          'Foussana,Kasserine'
        ]
      }, {
        letter: 'G',
        names: [
          'Gaâfour,Siliana',
          'Gabès,Gabès',
          'Gafsa,Gafsa',
          'Ghannouch,Gabès',
          'Ghar El Melh,Bizerte',
          'Ghardimaou,Jendouba',
          'Ghezala,Bizerte',
          'Ghomrassen,Tataouine',
          'Goubellat,Béja',
          'Graïba,Sfax',
          'Gremda,Sfax',
          'Grombalia,Nabeul'
        ]
      }, {
        letter: 'H',
        names: ['Hadjeb,Sfax',
          'Haffouz,Kairouan',
          'Haïdra,Kasserine',
          'Hajeb El Ayoun,Kairouan',
          'Hammam Chott,Ben Arous',
          'Hammam Ghezèze,Nabeul',
          'Hammam Lif,Ben Arous',
          'Hammam Sousse,Sousse',
          'Hammamet,Nabeul',
          'Hassi El Ferid,Kasserine',
          'Hazeg Ellouza,Sfax',
          'Hazoua,Tozeur',
          'Hebira,Mahdia',
          'Hergla,Sousse',
          'Hkaima,Mahdia'
        ]
      }, {
        letter: 'J',
        names: [
          'Jebiniana,Sfax',
          'Jedelienne,Kasserine',
          'Jemmal,Monastir',
          'Jemna,Kébili',
          'Jendouba,Jendouba',
          'Jérissa,du Kef',
          'Jilma,Sidi Bouzid',
          'Joumine,Bizerte'
        ]
      }, {
        letter: 'K',
        names: [
          'Kairouan,Kairouan',
          'Kalâa Kebira,Sousse',
          'Kalâa Seghira,Sousse',
          'Kalâat elAndalous,Ariana',
          'Kalâat Khasba,du Kef',
          'Kalaat Senan,du Kef',
          'Kasserine,Kasserine',
          'Kébili,Kébili',
          'Kélibia,Nabeul',
          'Kerkennah,Sfax',
          'Kerker,Mahdia',
          'Kesra,Siliana',
          'Khalidia,Ben Arous',
          'Khniss,Monastir',
          'Kondar,Sousse',
          'Korba,Nabeul',
          'Korbous,Nabeul',
          'Ksar Hellal,Monastir',
          'Ksibet elMédiouni,Monastir',
          'Ksibet Thrayet,Sousse',
          'Ksour Essef,Mahdia'
        ]
      }, {
        letter: 'L',
        names: [
          'La Goulette,Tunis',
          'La Manouba,la Manouba',
          'La Marsa,Tunis',
          'La Soukra,Ariana',
          'Lamta,Monastir',
          'Le Bardo,Tunis',
          'Le Kef,du Kef',
          'Le Kram,Tunis',
          'Le Sers,du Kef',
          'Lela,Gafsa'
        ]
      }, {
        letter: 'M',
        names: [
          'Msaken,Sousse',
          'Mahdia,Mahdia',
          'Mahrès,Sfax',
          'Majel Bel Abbès,Kasserine',
          'Makthar,Siliana',
          'Mareth,Gabès',
          'Mateur,Bizerte',
          'Matmata,Gabès',
          'Mdhilla,Gafsa',
          'Médenine,Médenine',
          'Medjez elBab,Béja',
          'Mégrine,Ben Arous',
          'Meknassy,Sidi Bouzid',
          'Melloulèche,Mahdia',
          'Menzel Abderrahmane,Bizerte',
          'Menzel Bourguiba,Bizerte',
          'Menzel Bouzaiane,Sidi Bouzid',
          'Menzel Bouzelfa,Nabeul',
          'Menzel Chaker,Sfax',
          'Menzel El Habib,Gabès',
          'Menzel Ennour,Monastir',
          'Menzel Fersi,Monastir',
          'Menzel Hayet,Monastir',
          'Menzel Horr,Nabeul',
          'Menzel Jemil,Bizerte',
          'Menzel Kamel,Monastir',
          'Menzel Mehiri,Kairouan',
          'Menzel Salem,du Kef',
          'Menzel Temime,Nabeul',
          'Messaadine,Sousse',
          'Métlaoui,Gafsa',
          'Metline,Bizerte',
          'Métouia,Gabès',
          'Mezzouna,Sidi Bouzid',
          'Mnihla,Ariana',
          'Mohamedia,Ben Arous',
          'Moknine,Monastir',
          'Monastir,Monastir',
          'Mornag,Ben Arous',
          'Mornaguia,la Manouba',
          'Moularès,Gafsa',
        ]
      }, {
        letter: 'N',
        names: [
          'Nabeul,Nabeul',
          'Nadhour,Zaghouan',
          'Nadhour Sidi Ali Ben Abed,Sfax',
          'Nasrallah,Kairouan',
          'Nebeur,du Kef',
          'Nefta,Tozeur',
          'Nefza,Béja',
          'Nouvelle Matmata,Gabès'
        ]
      }, {
        letter: 'O',
        names: ['Ouabed Khazanet,Sfax',
          'Ouchtata,Béja',
          'Oudhref,Gabès',
          'Oued Ellil,la Manouba',
          'Oued Meliz,Jendouba',
          'Ouerdanine,Monastir',
          'Oueslatia,Kairouan',
          'Ouled Chamekh,Mahdia',
          'Ouled Haffouz,Sidi Bouzid'
        ]
      }, {
        letter: 'R',
        names: [
          'Radès,Ben Arous',
          'Raf Raf,Bizerte',
          'Raoued,Ariana',
          'Ras Jebel,Bizerte',
          'Redeyef,Gafsa',
          'Regueb,Sidi Bouzid',
          'Rejiche,Mahdia',
          'Remada,Tataouine',
          'Rjim Maatoug,Kébili',
          'Rouhia,Siliana'
        ]
      }, {
        letter: 'S',
        names: [
          'Sahline Moôtmar,Monastir',
          'Sakiet Eddaïer,Sfax',
          'Sakiet Ezzit,Sfax',
          'Sakiet Sidi Youssef,du Kef',
          'Saouaf,Zaghouan',
          'Sayada,Monastir',
          'Sbeïtla,Kasserine',
          'Sbiba,Kasserine',
          'Sbikha,Kairouan',
          'Sejnane,Bizerte',
          'Sened,Gafsa',
          'Sfax,Sfax',
          'Sidi Aïch,Gafsa',
          'Sidi Ali Ben Aoun,Sidi Bouzid',
          'Sidi Alouane,Mahdia',
          'Sidi Ameur,Monastir',
          'Sidi Bennour,Monastir',
          'Sidi Bou Ali,Sousse',
          'Sidi Bou Rouis,Siliana',
          'Sidi Bou Saïd,Tunis',
          'Sidi Bouzid,Sidi Bouzid',
          'Sidi El Hani,Sousse',
          'Sidi Hassine,Tunis',
          'Sidi Ismail,Béja',
          'Sidi Makhlouf,Médenine',
          'Sidi Thabet,Ariana',
          'Sidi Zid,Mahdia',
          'Siliana,Siliana',
          'Skhira,Sfax',
          'Slouguia,Béja',
          'Smâr,Tataouine',
          'Soliman,Nabeul',
          'Somâa,Nabeul',
          'Souk Jedid,Sidi Bouzid',
          'Souk Lahad,Kébili',
          'Sousse,Sousse'
        ]
      }, {
        letter: 'T',
        names: [
          'Tabarka,Jendouba',
          'Tajerouine,du Kef',
          'Takelsa,Nabeul',
          'Tamerza,Tozeur',
          'Tataouine,Tataouine',
          'Tazarka,Nabeul',
          'Téboulba,Monastir',
          'Teboulbou,Gabès',
          'Tebourba,la Manouba',
          'Téboursouk,Béja',
          'Testour,Béja',
          'Thala,Kasserine',
          'Thélepte,Kasserine',
          'Thibar,Béja',
          'Thyna,Sfax',
          'Tinja,Bizerte',
          'Tlelsa,Mahdia',
          'Touiref,du Kef',
          'Touza,Monastir',
          'Tozeur,Tozeur',
          'Tunis,Tunis'
        ]
      }, {
        letter: 'U',
        names: ['Utique,Bizerte']
      }, {
        letter: 'Z',
        names: [
          'Zaghouan,Zaghouan',
          'Zaouiet Djedidi,Nabeul',
          'Zaouiet Kontoch,Monastir',
          'Zaouiet Sousse,Sousse',
          'Zarat,Gabès',
          'Zarzis,Médenine',
          'Zarzis Nord,Médenine',
          'Zelba,Mahdia',
          'Zéramdine,Monastir',
          'Zriba,Zaghouan'
        ]
      }];
    if (control && (control.value !== null || control.value !== undefined)) {
      var vrai = stateGroups.filter(item => {
        return item.names.some(name => name === control.value)
        //item.names.filter(name => name === control.value)
      })
      if (vrai.length === 0) {
        return { 'regionError': true };
      }
    }
    return null;
  }
  export function CountriesValidator(control: AbstractControl): { [key: string]: boolean } | null {


    var countryList = [
      "Afghanistan",
      "Albania",
      "Algeria",
      "American Samoa",
      "Andorra",
      "Angola",
      "Anguilla",
      "Antarctica",
      "Antigua and Barbuda",
      "Argentina",
      "Armenia",
      "Aruba",
      "Australia",
      "Austria",
      "Azerbaijan",
      "Bahamas (the)",
      "Bahrain",
      "Bangladesh",
      "Barbados",
      "Belarus",
      "Belgium",
      "Belize",
      "Benin",
      "Bermuda",
      "Bhutan",
      "Bolivia (Plurinational State of)",
      "Bonaire, Sint Eustatius and Saba",
      "Bosnia and Herzegovina",
      "Botswana",
      "Bouvet Island",
      "Brazil",
      "British Indian Ocean Territory (the)",
      "Brunei Darussalam",
      "Bulgaria",
      "Burkina Faso",
      "Burundi",
      "Cabo Verde",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Cayman Islands (the)",
      "Central African Republic (the)",
      "Chad",
      "Chile",
      "China",
      "Christmas Island",
      "Cocos (Keeling) Islands (the)",
      "Colombia",
      "Comoros (the)",
      "Congo (the Democratic Republic of the)",
      "Congo (the)",
      "Cook Islands (the)",
      "Costa Rica",
      "Croatia",
      "Cuba",
      "Curaçao",
      "Cyprus",
      "Czechia",
      "Côte d'Ivoire",
      "Denmark",
      "Djibouti",
      "Dominica",
      "Dominican Republic (the)",
      "Ecuador",
      "Egypt",
      "El Salvador",
      "Equatorial Guinea",
      "Eritrea",
      "Estonia",
      "Eswatini",
      "Ethiopia",
      "Falkland Islands (the) [Malvinas]",
      "Faroe Islands (the)",
      "Fiji",
      "Finland",
      "France",
      "French Guiana",
      "French Polynesia",
      "French Southern Territories (the)",
      "Gabon",
      "Gambia (the)",
      "Georgia",
      "Germany",
      "Ghana",
      "Gibraltar",
      "Greece",
      "Greenland",
      "Grenada",
      "Guadeloupe",
      "Guam",
      "Guatemala",
      "Guernsey",
      "Guinea",
      "Guinea-Bissau",
      "Guyana",
      "Haiti",
      "Heard Island and McDonald Islands",
      "Holy See (the)",
      "Honduras",
      "Hong Kong",
      "Hungary",
      "Iceland",
      "India",
      "Indonesia",
      "Iran (Islamic Republic of)",
      "Iraq",
      "Ireland",
      "Isle of Man",
      "Israel",
      "Italy",
      "Jamaica",
      "Japan",
      "Jersey",
      "Jordan",
      "Kazakhstan",
      "Kenya",
      "Kiribati",
      "Korea (the Democratic People's Republic of)",
      "Korea (the Republic of)",
      "Kuwait",
      "Kyrgyzstan",
      "Lao People's Democratic Republic (the)",
      "Latvia",
      "Lebanon",
      "Lesotho",
      "Liberia",
      "Libya",
      "Liechtenstein",
      "Lithuania",
      "Luxembourg",
      "Macao",
      "Madagascar",
      "Malawi",
      "Malaysia",
      "Maldives",
      "Mali",
      "Malta",
      "Marshall Islands (the)",
      "Martinique",
      "Mauritania",
      "Mauritius",
      "Mayotte",
      "Mexico",
      "Micronesia (Federated States of)",
      "Moldova (the Republic of)",
      "Monaco",
      "Mongolia",
      "Montenegro",
      "Montserrat",
      "Morocco",
      "Mozambique",
      "Myanmar",
      "Namibia",
      "Nauru",
      "Nepal",
      "Netherlands (the)",
      "New Caledonia",
      "New Zealand",
      "Nicaragua",
      "Niger (the)",
      "Nigeria",
      "Niue",
      "Norfolk Island",
      "Northern Mariana Islands (the)",
      "Norway",
      "Oman",
      "Pakistan",
      "Palau",
      "Palestine, State of",
      "Panama",
      "Papua New Guinea",
      "Paraguay",
      "Peru",
      "Philippines (the)",
      "Pitcairn",
      "Poland",
      "Portugal",
      "Puerto Rico",
      "Qatar",
      "Republic of North Macedonia",
      "Romania",
      "Russian Federation (the)",
      "Rwanda",
      "Réunion",
      "Saint Barthélemy",
      "Saint Helena, Ascension and Tristan da Cunha",
      "Saint Kitts and Nevis",
      "Saint Lucia",
      "Saint Martin (French part)",
      "Saint Pierre and Miquelon",
      "Saint Vincent and the Grenadines",
      "Samoa",
      "San Marino",
      "Sao Tome and Principe",
      "Saudi Arabia",
      "Senegal",
      "Serbia",
      "Seychelles",
      "Sierra Leone",
      "Singapore",
      "Sint Maarten (Dutch part)",
      "Slovakia",
      "Slovenia",
      "Solomon Islands",
      "Somalia",
      "South Africa",
      "South Georgia and the South Sandwich Islands",
      "South Sudan",
      "Spain",
      "Sri Lanka",
      "Sudan (the)",
      "Suriname",
      "Svalbard and Jan Mayen",
      "Sweden",
      "Switzerland",
      "Syrian Arab Republic",
      "Taiwan (Province of China)",
      "Tajikistan",
      "Tanzania, United Republic of",
      "Thailand",
      "Timor-Leste",
      "Togo",
      "Tokelau",
      "Tonga",
      "Trinidad and Tobago",
      "Tunisia",
      "Turkey",
      "Turkmenistan",
      "Turks and Caicos Islands (the)",
      "Tuvalu",
      "Uganda",
      "Ukraine",
      "United Arab Emirates (the)",
      "United Kingdom of Great Britain and Northern Ireland (the)",
      "United States Minor Outlying Islands (the)",
      "United States of America (the)",
      "Uruguay",
      "Uzbekistan",
      "Vanuatu",
      "Venezuela (Bolivarian Republic of)",
      "Viet Nam",
      "Virgin Islands (British)",
      "Virgin Islands (U.S.)",
      "Wallis and Futuna",
      "Western Sahara",
      "Yemen",
      "Zambia",
      "Zimbabwe",
      "Åland Islands"
    ];
    if (control && (control.value !== null || control.value !== undefined)) {
      var vrai = countryList.filter(item => item===control.value)
        //return item.names.some(name => name === control.value)
        //item.names.filter(name => name === control.value)
        
      if (vrai.length === 0) {
        return { 'countryError': true };
      }
    }
    return null;
  }