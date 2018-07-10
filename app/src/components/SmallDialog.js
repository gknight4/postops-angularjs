class SmallController {
  constructor($scope, $mdDialog){
    $scope.loginmode = "login" ;
    this.scope = $scope ;
    $scope.useremail = "start" ;
    
  $scope.handlechange = e=>{
    console.log(e) ;
    console.log($scope.useremail) ;
  }

    
  }
  
  
  
}


export default {
      controller: SmallController,
      templateUrl: 'src/components/SmallDialog.html',
      parent: angular.element(document.body),
//      targetEvent: ev,
      clickOutsideToClose:true,
      fullscreen: false, // $scope.customFullscreen // Only for -xs, -sm breakpoints.
    };
