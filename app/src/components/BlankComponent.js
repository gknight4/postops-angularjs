class BlankController {
}

export default {
  name : 'myBlank',
  config : {
    bindings: {  
      testtext: '<', 
    },
    controller       : [ BlankController ],
    template: 
`
  <div>blank with {{$ctrl.testtext}}</div>
`,
  }
};