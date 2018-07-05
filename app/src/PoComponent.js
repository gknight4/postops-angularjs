class PoComponentController {
  constructor($mdBottomSheet, $log) {
    this.$mdBottomSheet = $mdBottomSheet;
    this.$log = $log;
  }
}

export default {
  name : 'poComponent',
  config : {
    bindings         : {  
      selected: '<', 
      testtext : '<', 
    },
    templateUrl      : 'src/PoComponent.html',
    controller       : [ '$mdBottomSheet', '$log', PoComponentController ]
  }
};