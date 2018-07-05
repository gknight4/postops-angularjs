// Load libraries
import angular from 'angular';

import 'angular-animate';
import 'angular-aria';
import 'angular-material';

import AppController from 'src/AppController';
import PoComponent from 'src/PoComponent' ;
import MyAutoComplete from 'src/components/MyAutoCompleteComponent' ;
import HttpHeaders from 'src/components/HeadersComponent' ;
import Blank from 'src/components/BlankComponent' ;
//import Users from 'src/users/Users';

export default angular.module( 'starter-app', [ 'ngMaterial', ] ) // Users.name 
  .config(($mdIconProvider, $mdThemingProvider) => {
    // Register the user `avatar` icons
    $mdIconProvider
      .defaultIconSet("./assets/svg/avatars.svg", 128)
//       .icon("menu", "./assets/svg/menu.svg", 24)
//       .icon("share", "./assets/svg/share.svg", 24)
//       .icon("google_plus", "./assets/svg/google_plus.svg", 24)
//       .icon("hangouts", "./assets/svg/hangouts.svg", 24)
//       .icon("twitter", "./assets/svg/twitter.svg", 24)
      .icon("login", "./assets/svg/login.svg", 24)
      .icon("logout", "./assets/svg/logout.svg", 24)
//       .icon("phone", "./assets/svg/phone.svg", 24);

    $mdThemingProvider.theme('default')
      .primaryPalette('brown')
      .accentPalette('red');
  })
  .controller('AppController', AppController)
  .component(PoComponent.name, PoComponent.config)
  .component(MyAutoComplete.name, MyAutoComplete.config)
  .component(HttpHeaders.name, HttpHeaders.config)
//   .component(HttpHeaders.name, HttpHeaders.config)
//   .component(HttpHeaders.name, HttpHeaders.config)
//   .component(HttpHeaders.name, HttpHeaders.config)
  .component(Blank.name, Blank.config)
  
  ;
