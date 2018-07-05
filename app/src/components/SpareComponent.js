class MyAutoCompleteController {
//   constructor($mdBottomSheet, $log) {
//     this.$mdBottomSheet = $mdBottomSheet;
//     this.$log = $log;
//   }
}

export default {
  name : 'myAutoComplete',
  config : {
    bindings: {  
      testtext: '<', 
    },
    controller       : [ MyAutoCompleteController ], // '$mdBottomSheet', '$log', 
    template: 
`
  <div>auto complete with {{$ctrl.testtext}}</div>
`,
  }
};