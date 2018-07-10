import LoginDialog from 'src/components/LoginDialog' ;
import SmallDialog from 'src/components/SmallDialog' ;

class PoComponentController {
  constructor(poHttp, $scope, $mdDialog){ // , myHttp
     var self = this ;
    self.method       = "GET";
    self.urlTitle     = "Url" ;
//    self.urlSuggestions = ["one", "two", "three"];
    self.urls        = [""] ; // "the url is this";
    self.headers      = [] ; // ["four", "four", "six"];
    self.forms        = [] ; // ["seven", "eight"];
    self.jsons        = [] ; // ["nine", "ten"];
//    self.headerSuggs  = ["and", "the", "rest"] ;
    self.bodytype     = "Json";
    self.loggedIn     = false ;
    self.useproxy     = false ;
    self.suggs        = {headers: [], urls: ["one", "two", "thfour"], forms: [], jsons: [], raws: []};
    self.respStatus   = 200 ;
    self.respHeaders  = ["a", "b", "c"] ;
    self.respBody     = "this is the body" ;
    
    $scope.loginout = function (ev){
        if(self.loggedIn){
          poHttp.httpC("gslogout");
          self.loggedIn = false ;
        } else {
          $mdDialog.show(LoginDialog).then(
            a=>{
              if (a){
                poHttp.httpC("gslogin", a) ;
                if (a.rememberme){
                  poHttp.httpC("gsrememberme", a);
                }
                self.loggedIn = true ;
//                console.log(a);
              }
            }
          ) ;
        }
    }
    $scope.checkLogin = e=>{
      let upa = poHttp.httpC("gsgetlogin") ;// user, password, auth
      upa.auth = poHttp.httpC("gsgetauth");
      poHttp.httpC("checklogin", upa).then(r=>{
        self.loggedIn = (r.result === "ok") ;
        $scope.$apply();
        if(r.result === "ok"){
          $scope.loadStringStores();
        }
        
      });
    }
    
    $scope.checkLogin();
    
    $scope.loadStringStores = function(){
//      console.log("loading strings");
//        console.log(self.suggs.urls);
      let params = {};
      poHttp.httpC("ssLoadStringStores", params).then(r=>{
        self.suggs = params ;
//        console.log(self.suggs.urls);
        self.checkKeyValArray(self.headers);
        self.checkKeyValArray(self.jsons);
        self.checkKeyValArray(self.forms);
//        console.log("self.suggs.urls");
//        console.log(params.urls);
        $scope.$apply();
        
      }) ;
    }
    
    $scope.sendRequest = function(){
      console.log("send request");
      let strings = {headers: self.headers, urls: self.urls, jsons: self.jsons, forms: self.forms, raw: self.raw, 
        bodytype: self.bodytype, method: self.method, useProxy: self.useproxy};
      poHttp.httpC("ssAddStringStores", {strings: strings, oldStrings: self.suggs});
//      console.log(strings);
/*    let strings = Object.assign({}, {headers: this.state.headers}, {urls: this.state.url}, 
      {jsons: this.state.jsons}, {forms: this.state.forms}, {raw: this.state.bodyraw}, {bodytype: this.state.bodytype},
      {method: this.state.method}
                              );
    addStringStores(this.props, strings);*/
       poHttp.httpC("poPostOpsRequest", strings).then(r=>{
// //      PostOpsRequest(useProxy, strings).then(r=>{
          self.respStatus = r.status ;
          self.respHeaders = r.headers ;
          self.respBody = r.body ;
       });
    }
    
    
    $scope.onACChange = function(type, id, val){
//      console.log("change: " + val);
      let acType = id.substr(0, 2);
      let arrId = parseInt(id.substr(2)) ;
      let arrIds = {ur: self.urls, hd: self.headers, js: self.jsons, fm: self.forms};
      if ((type === "text") || (type === "textSel")){
        arrIds[acType][arrId] = val ;
      }
      if ((type === "blur") || (type === "textSel")){
        if (acType !== "ur") self.checkKeyValArray(arrIds[acType]);
      }
    }
  }

    checkKeyValArray (arr){
//      console.log("check array of " + arr.length + " members") ;
      if (arr.length == 0) arr.push("");
      for (let i = 0 ; i < arr.length - 1 ; i++){
        if (arr[i] === "") arr.splice(i, 1) ;
      }
      if (arr[arr.length - 1] != "") arr.push("") ;
    }
  
}

export default {
  name : 'poComponent',
  config : {
    bindings: {  
//      testtext: '<', 
    },
    controller       : ['poHttp', '$scope', '$mdDialog', PoComponentController ],
    templateUrl: 'src/components/PoComponent.html',
  }
};

/*
to do:
got register / login / logout, auto login on startup
load / update / save strings:
send the request

 * */