class AlertController {
  constructor($scope){
//     console.log("alert") ;
//     console.log($scope.alerttext);
//     console.log(this.alerttext);
//    console.log($transclude());
//    $scope.body = "this body" ;
  }
}

/*
<md-button class="md-primary">Click me</md-button>
<md-button class="md-accent">or maybe me</md-button>
<md-button class="md-warn">Careful</md-button> 

  // alerts: primary, secondary, success, danger, warning, info, light, dark
  //         #cae3fe, #e1e2e4, #d3edda, #f8d6d9, #fff4ce, #cfebf0, #fefefe, #d5d7d8

 * */

export default {
  name : 'poAlert',
  config : {
    bindings: {  
//       alerttext: '<', 
//       alertmode: '<',
      alert: '<',
    },
    controller       : ['$scope', AlertController ],
//    transclude: true,
//    styles: ['h1 { color: red; font-weight: bold; }', '.primary {color: red}'],
    template: 
`
<style>

.poAlertPrimary{
  background-color: #cae3fe;
}

.poAlertSecondary{
  background-color: #e1e2e4;
}

.poAlertSuccess{
  background-color: #d3edda;
}

.poAlertDanger{
  background-color: #f8d6d9;
}

.poAlertWarning{
  background-color: #fff4ce;
}

.poAlertInfo{
  background-color: #cfebf0;
}

.poAlertLight{
  background-color: #fefefe;
}

.poAlertDark{
  background-color: #d5d7d8;
}

</style>
  <div ng-show="$ctrl.alert.mode != 'hide'" style="width: 250px; padding: 10px;" class="{{$ctrl.alert.mode}}">{{$ctrl.alert.text}}</div>
`,
  }
};