class MyAutoCompleteController {

  constructor($scope){
    var self=this ;
    this.myPlace = "this is the real thing" ;
    this.simulateQuery = false;
    this.isDisabled    = false;
    this.parentChange = ($scope.$parent.onACChange) ? $scope.$parent.onACChange : e=>{/*console.log("fake")*/} ;
//    console.log(this.acid) ;
//    console.log($scope.acid);
//    this.scope = $scope ;
//    self.onChange = $scope.$parent.onMyChange ;

//    console.log($scope.$parent.onMyChange);
//    console.log($scope.$parent.onMyChange2);
//    this.selectedItem = "one or" ;

//    this.suggs        = this.loadSuggestions();
    this.placeHolder = "original mine" ;
    this.myweird = "none" ;
//    this.$doCheck = this.onInit ;// $onInit, $onChanges, $doCheck, $onDestroy, $postLink
    $scope.onBlur = function (){
      if($scope.$parent.onMyChange) {
        $scope.$parent.onMyChange("blur", self.acid) ;
      }
//      console.log("blur");
    }
  }
  
//   onInit(){
//     console.log("initx") ;
//     this.defaultvalue = "what" ;
//   }
  
    querySearch (query, suggs) {
      var results = query ? suggs.filter( this.createFilterFor(query) ) : suggs,
          deferred;
      if (self.simulateQuery) {
        deferred = $q.defer();
        $timeout(function () { deferred.resolve( results ); }, Math.random() * 1000, false);
        return deferred.promise;
      } else {
        return new Promise((res, rej)=>{res(results)}) ;
      }
    }

    searchTextChange(text) {
//       console.log('Text changed to ' + text);
      this.parentChange("text", this.acid, text);
//      this.returnvalue = text ;
//      if(this.onChange) this.onChange("new") ;
//      this.scope.$parent.onMyChange2("new");
      
//      console.log(this.selecteditem);
//      this.onmychange() ;
//       console.log(this.returnvalue);
    }

    selectedItemChange(item) {
      if(item){
//         console.log('Item changed to ' + JSON.stringify(item));
//         this.returnvalue = (item) ? item : "" ;
        this.parentChange("textSel", this.acid, item) ;
      }
//      this.onmychange() ;
    }
    
//     $scope.onBlur = function (){
//       console.log("blur");
//     }
    
//     loadSuggestions(){
//       return this.suggestions.map( function (sugg) {
//         return {
//           value: sugg.toLowerCase(),
//           display: sugg
//         };
//       });
//     }

    createFilterFor(query) {
      var lowercaseQuery = query.toLowerCase();

      return function filterFn(sugg) {
        return (sugg.indexOf(lowercaseQuery) === 0);
      };

    }
    
    onBlur  (){
//      console.log("blur");
      this.parentChange("blur", this.acid);
//       if(this.scope.$parent.onMyChange) {
//         this.scope.$parent.onMyChange("blur", this.acid) ;
//       }
    }
    

}

export default {
  name : 'myAutoComplete',
  config : {
    bindings: {  
      placehold: '@', 
      suggestions: '<', 
      optindex: '<',
      returnvalue: '=',
      selecteditem: '<',
      acid: '<',
    },
    controller       : ['$scope', MyAutoCompleteController ],
    template: 
`
<div>
  <md-autocomplete
      ng-disabled="$ctrl.isDisabled"
      md-no-cache="$ctrl.noCache"
      md-selected-item="$ctrl.selecteditem"
      md-search-text-change="$ctrl.searchTextChange($ctrl.searchText)"
      md-search-text="$ctrl.searchText"
      md-selected-item-change="$ctrl.selectedItemChange(item)"
      md-items="item in $ctrl.querySearch($ctrl.searchText, $ctrl.suggestions)"
      md-item-text="item"
      md-min-length="0"
      ng-blur="$ctrl.onBlur()"
      placeholder={{$ctrl.placehold}}
    >
    <md-item-template>
      <span md-highlight-text="$ctrl.searchText" md-highlight-flags="^i">{{item}}</span>
    </md-item-template>
  </md-autocomplete>
</div>
`,
  }
};