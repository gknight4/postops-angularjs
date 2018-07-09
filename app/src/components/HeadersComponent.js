class HeadersController {
  constructor(){
    this.placeHolder = "Header";
  }
}

export default {
  name : 'httpHeaders',
  config : {
    bindings: {  
      testtext: '<', 
      httpheaders: '<',
      suggestions: '<',
    },
    controller       : [ HeadersController ],
    template: 
`
  <div ng-repeat="head in $ctrl.httpheaders">
    <my-auto-complete
        placehold="$ctrl.placeHolder" suggestions="$ctrl.suggestions" returnvalue="$ctrl.fakeHeader" selecteditem="head"
      ></my-auto-complete>
  </div>
`,
  }
};