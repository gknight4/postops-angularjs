/**
 * Main App Controller for the AngularJS Material Starter App
 * @param UsersDataService
 * @param $mdSidenav
 * @constructor
 */
function AppController($mdSidenav) { // UsersDataService, 
  var self = this;

  self.selected     = null;
  self.testtext     = "not a real Placeholder" ;
  self.method       = "GET";
  self.urlTitle     = "Url" ;
  self.urlSuggestions = ["one", "two", "three"];
  self.url        = "the url is this";
  self.headers      = ["four", "five", "six"];
  self.headerSuggs  = ["and", "the", "rest"] ;
  self.bodytype     = "Json";
  self.users        = [ ];
  self.selectUser   = selectUser;
  self.toggleList   = toggleUsersList;
  self.login        = login;
  self.weapon       = "axe";

  // Load all registered users

//   UsersDataService
//         .loadAllUsers()
//         .then( function( users ) {
//           self.users    = [].concat(users);
//           self.selected = users[0];
//         });

  // *********************************
  // Internal methods
  // *********************************

  /**
   * Hide or Show the 'left' sideNav area
   */
  function toggleUsersList() {
    $mdSidenav('left').toggle();
  }

  /**
   * Select the current avatars
   * @param menuId
   */
  function selectUser ( user ) {
    self.selected = angular.isNumber(user) ? $scope.users[user] : user;
  }
  function login(){
    console.log("login");
    console.log(this.weapon);
  }

}

export default [ '$mdSidenav', AppController ]; //  'UsersDataService',
