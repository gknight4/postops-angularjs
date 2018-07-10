class LoginController {
  constructor(poHttp, $scope, $mdDialog){
//     var self = this ;
//     this.scope = $scope ;
//     this.mdDialog = $mdDialog ;
//    $scope.useremail = "something" ;
//    self.useremail = "and then" ;
    
//    console.log($mdDialog);
    $scope.passwordtype="password" ;
    $scope.showpassword = false ;
    $scope.loginmode = "login" ;
    $scope.regAlertText = "this alert";
    $scope.regAlertMode = "hide";
    $scope.regAlertEmail = {text: "That email is in use", mode: "hide"} ;
    $scope.regAlertError = {text: "That user Exists", mode: "hide"} ;
    $scope.regAlertPassword = {text: 
"A password must have at least 8 characters, including lower case, upper case, a digit, and a symbol", mode: "hide"} ;
//    console.log(poHttp);
//    console.log(CryptoJS.SHA256);
    

    function cancel (){
//      console.log($scope.useremail) ;
      $mdDialog.hide() ;
    }
    
    function returnData (ret){
      $mdDialog.hide(ret) ;
    }
    
    function doLogin (){
      let hash = CryptoJS.SHA256($scope.password).toString() ;
      poHttp.httpC("login", {useremail: $scope.useremail, password: hash}).then(r=>{
        let ret = {
          useremail: $scope.useremail,
          password: hash,
          rememberme: $scope.rememberme,
          auth: r.header,
        }
        returnData(ret) ;
//        console.log(r);
      }) ;
    }
    
    function doRegister (){
      let hash = CryptoJS.SHA256($scope.password).toString() ;
      console.log("do register") ;
      poHttp.httpC("register", {useremail: $scope.useremail, password: hash}).then(r=>{
        if (r.result === "userexists"){
          $scope.regAlertError = {text: "That User already exists", mode: "poAlertWarning"} ;
        }
        if (r.result == "ok"){
          $scope.regAlertError = {text: "You're Registered! Now use the same information to Login.", mode: "poAlertPrimary"};
        }
        console.log(r);
//         let ret = {
//           useremail: $scope.useremail,
//           password: hash,
//           auth: r.header,
//         }
//        returnData() ;
//        console.log(r);
      }) ;
    }
    
    $scope.handlechange = e=>{
      switch (e){
        case "showpassword":
          $scope.passwordtype = ($scope.showpassword) ? "text" : "password" ;
          break ;
        case "sendlogin":
          doLogin();
          break ;
        case "sendregister":
          doRegister();
          break ;
        case "register":
          $scope.loginmode = "register" ;
          break ;
        case "login":
          $scope.loginmode = "login" ;
          break ;
        case "cancel":
          cancel();
          break ;
        default:
          break;
      }
//      console.log("change") ;
//      console.log(e);
    }
    
  }
  
}

/*export default {
  name : 'myBlank',
  config : {
    bindings: {  
      testtext: '<', 
    },
    controller       : [ LoginController ],
    template: 
`
  <div>blank with {{$ctrl.testtext}}</div>
`,
  }
};*/

export default {
      controller: LoginController,
      templateUrl: 'src/components/LoginDialog.html',
      parent: angular.element(document.body),
//      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false, // $scope.customFullscreen // Only for -xs, -sm breakpoints.
    };
