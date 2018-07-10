// import app from 'src/app'
// 
//   app.service('myHttp', function(){
//     this.myFunc = function(a){
//       console.log("http: " + a) ;
//       return 0 ;
//     } ;
//   })
  
  export default {
  name: 'myHttp', 
  config: function(){
      this.myFunc = function(a){
        console.log("http: " + a) ;
        return 0 ;
      } ;
    }
  }
