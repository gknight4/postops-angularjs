class MyAutoCompleteController {

  constructor(){
    this.myPlace = "this is the real thing" ;
    this.simulateQuery = false;
    this.isDisabled    = false;

    this.suggs        = this.loadSuggestions();
    this.placeHolder = "original mine" ;
    this.myweird = "none" ;
  }
  
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
      this.returnvalue = text ;
//       console.log(this.returnvalue);
    }

    selectedItemChange(item) {
//      console.log('Item changed to ' + JSON.stringify(item));
      this.returnvalue = (item) ? item.value : "" ;
    }
    
    loadSuggestions(){
      return this.suggestions.map( function (sugg) {
        return {
          value: sugg.toLowerCase(),
          display: sugg
        };
      });
    }

    createFilterFor(query) {
      var lowercaseQuery = query.toLowerCase();

      return function filterFn(sugg) {
        return (sugg.value.indexOf(lowercaseQuery) === 0);
      };

    }

}

export default {
  name : 'myAutoComplete',
  config : {
    bindings: {  
      placehold: '<', 
      suggestions: '<', 
      optindex: '<',
      returnvalue: '=',
    },
    controller       : [ MyAutoCompleteController ],
    template: 
`
<div>
<!--this is ctrl.placeholder {{$ctrl.myPlace}}<br/>
and weird {{$ctrl.myweird}}-->
  <md-autocomplete
      ng-disabled="$ctrl.isDisabled"
      md-no-cache="$ctrl.noCache"
      md-selected-item="$ctrl.selectedItem"
      md-search-text-change="$ctrl.searchTextChange($ctrl.searchText)"
      md-search-text="$ctrl.searchText"
      md-selected-item-change="$ctrl.selectedItemChange(item)"
      md-items="item in $ctrl.querySearch($ctrl.searchText, $ctrl.suggs)"
      md-item-text="item.display"
      md-min-length="0"
      placeholder={{$ctrl.placehold}}
    <md-item-template>
      <span md-highlight-text="$ctrl.searchText" md-highlight-flags="^i">{{item.display}}</span>
    </md-item-template>
  </md-autocomplete>
</div>
`,
  }
};