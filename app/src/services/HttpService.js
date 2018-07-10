export default {
name: 'poHttp', 
config: function(){
  
this.baseUrl = ((window.origin.indexOf("localhost") > 0) ||(window.origin.indexOf("127.0.0.1") > 0)) ? 
  "http://localhost:6026"  :
  "https://postops.us:6026" ;
  
//  console.log(this.baseUrl);
//  console.log(window);

this.po = function (method, body){
        var ret = {
            cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
            credentials: 'same-origin', // include, same-origin, *omit
            headers: {
                'user-agent': 'Mozilla/4.0 MDN Example',
                'content-type': 'application/json'
            },
            method: method, // *GET, POST, PUT, DELETE, etc.
            mode: 'cors', // no-cors, cors, *same-origin
            redirect: 'follow', // *manual, follow, error
            referrer: 'no-referrer', // *client, no-referrer
        }
        if (body !== "") ret.body = body ;
        return ret ;
    }

this.afetch = function (url, httpObj){// auth fetch, try with the current auth, and then login and try again
  return new Promise((res, rej)=>{ 
    return fetch(url, httpObj).then(resp => { 
      if ((resp.status >= 400) && (resp.status < 500)){// auth fail
        let useremail = sessionStorage.getItem("useremail") ;
        let password = sessionStorage.getItem("password") ;
        this.login({useremail: useremail, password: password}).then(
          resp=>{// success with server
            if (resp.result === "ok"){// successful login
              if (resp.result === "ok"){
                this.httpC("gslogin", {auth: resp.header, useremail: useremail, password: password}) ;// save login / auth info
                return fetch(url, httpObj).then(// do the original fetch
                  resp=>{res(resp)},
                  resp=>{rej(resp)}// server fail
                );
              }
            }
          },
          resp=>{rej(resp)}
        );
      } else {
        res(resp); // return the result
      }
    }, resp => {rej (resp)}) ;// server fail
  })
}

this.register = function (params){
  return new Promise((res, rej)=>{
    let url = this.baseUrl + "/open/users" ;
    let httpObj = this.po ("POST", JSON.stringify(params)) ;
//    return fetch(url, httpObj).then(response => {console.log(response)})
    return fetch(url, httpObj).then(response => response.json().then(resp=>{ res(resp); }), e=>{rej(e)});
  })
}

this.tryServer = function(){
//   console.log("trying server") ;
//   console.log(this.baseUrl);
  return new Promise((res, rej)=>{
      fetch(this.baseUrl, this.po ("GET", "")).then(res, rej);
    })
}

this.login = function (params){
//  console.log(params) ;
//  console.log("login");
  return new Promise((res, rej)=>{
    let httpObj = this.po ("GET", "") ;
    let url = this.baseUrl + "/open/authenticate/" + params.useremail + "/" + params.password ;
    console.log(url);
    return fetch(url, httpObj).then(response => response.json().then(resp=>{
//      console.log(resp);
      if (resp.result === "ok") {
        resp.header = response.headers.get("Authorization") ;
      }
//      console.log(resp.header);
      res(resp); 
    }));
  })
}

this.checkAuth = function (params){// this is the first attempt to contact the server
//  console.log("checkAuth");
//  console.log(this.baseUrl);
  return new Promise((res, rej)=>{
    let httpObj = this.po ("GET", "") ;
    httpObj.headers['Authorization'] = params.auth; // "a" + 
//    console.log(params.auth);
    let url = this.baseUrl + "/auth/check" ;
    return fetch(url, httpObj).then(
      response => response.json().then(
        resp=>{ res(resp); }
      ), e=>{rej(e)} // rej is called if the server is down, *not* just unauth
    );
  })
}

 this.trylogin = function(params, res, rej){
//   params.useremail="x";
   this.login(params).then(
     r=>{
      if (r.result === "ok"){
//        console.log(r);
        params.auth = r.header ;
//        console.log(params);
        this.httpC("gslogin", params) ;
        res({result: "ok"});
      } else {
       res(r)
      }
    }
   );
 }
 
 // http://localhost:6026/open/authenticate/a/3e23e8160039594a33894f6564e1b1348bbd7a0088d42c4acb73eeaed59c009d

this.checklogin = function (params){// may have auth, useremail, password, or may be undefined / null
// can return serverdown, ok, fail - if 'ok' then we're logged in
//  console.log("check login 2");
//  console.log(params);
  return new Promise((res, rej)=>{
    this.tryServer().then(
      r=>{// server is up
        if (params.auth){
//          params.auth="a";
          this.checkAuth(params).then(
            r=>{
              if(r.result === "ok"){
//                 console.log("auth is ok");
                res({result: "ok"}) ;
              } else {
//                console.log("try login again");
                this.trylogin(params, res, rej);
              }
            },
            r=>{console.log(r)}
          );
        } else {
          this.trylogin(params, res,rej) ;
        }
      },
      r=>{res({result: "serverdown"})}//fail
    );
  });
  
}

//   checkLogin = e=>{
// /*
// look for a stored auth header, try it
// if the auth fails, or there is none, then look for useremail / password credentials, and try those
// */    
//     httpC("tryserver").then(e=>{this.props.setServerUp(true)}, e=>{this.props.setServerUp(false)})
//     let auth = logInOut("getauth");// get the auth header
// //    console.log("auth: " + auth);
//     if(auth){
//       httpC("checkauth", {auth: auth}).then(e=>{
//         if (e.result === "ok"){
// //          console.log("got ok");
//           this.setLoggedIn();
// //          this.setState({loggedIn: true}, this.loadSS);
//         } else {// auth header failed
// //          console.log("failed: " + e.result);
//           this.tryLogin();
//         }
//       });
//     } else {
//       this.tryLogin();
//     }
//   }
  


this.addStringStore = function (params){
//  console.log("add strsto2");
//  console.log(params);
  return new Promise((res, rej)=>{
    let url = this.baseUrl + "/auth/stringstore" ;
    let httpObj = this.po ("POST", JSON.stringify(params)) ;
    httpObj.headers['Authorization'] = sessionStorage.getItem("auth");
    console.log("in add string");
    console.log(httpObj);
    return fetch(url, httpObj).then(response => response.json().then(resp=>{ res(resp); }), e=>{rej(e)});
  })
}

this.getStringStores = function (params){
  return new Promise((res, rej)=>{
    let url = this.baseUrl + "/auth/stringstore" ; //  + params.type ;
    let httpObj = this.po ("GET", "") ;
    httpObj.headers['Authorization'] = sessionStorage.getItem("auth");
    return this.afetch(url, httpObj).then(response => response.json().then(resp=>{ res(resp); }), e=>{rej(e)});
  })
}

this.setStringStores = function (params){// update the whole table
//  console.log("set strsto2");
//  console.log(params);
  return new Promise((res, rej)=>{
    let url = this.baseUrl + "/auth/all/stringstore" ; //  + params.type ;
    let httpObj = this.po ("PUT", JSON.stringify(params)) ;
    httpObj.headers['Authorization'] = sessionStorage.getItem("auth");
//    console.log(httpObj);
    return fetch(url, httpObj).then(response => response.json().then(resp=>{ res(resp); }), e=>{rej(e)});
  })
}

this.checkDups = function (newString, oldList){
  if (oldList == null) return false ;
  let dup = false ;
  oldList.forEach(e=>{
    if (e === newString) dup = true ;
  });
  return dup ;
}

this.removeOldStrings = function (sendStrings, oldStrings){
//  console.log(oldStrings);
  var dup = false ;
  let i = 0 ;
  var e ;
  while (i < sendStrings.length){
    e = sendStrings[i];
    switch(e.type){
      case "url":
        dup = this.checkDups(e.text, oldStrings.urls) ;
        break ;
      case "header":
        dup = this.checkDups(e.text, oldStrings.headers) ;
        break ;
      case "form":
        dup = this.checkDups(e.text, oldStrings.forms) ;
        break ;
      case "json":
        dup = this.checkDups(e.text, oldStrings.jsons) ;
        break ;
      case "raw":
        dup = this.checkDups(e.text, oldStrings.raws) ;
        break ;
      default:
        break ;
    }
    if (dup) {
      sendStrings.splice(i, 1);
    } else {
      i++ ;
    }
  };
}

this.addRemainingStrings = function (sendStrings, oldStrings){
//  console.log("add remaining") ;
//  console.log(props);
//   let headers = safeCopyArray(props.headers) ; // props.headers.slice(0);
//   let urls = safeCopyArray(props.urls) ; // props.urls.slice(0);
//   let jsons = safeCopyArray(props.jsons) ; // props.jsons.slice(0);
//   let forms = safeCopyArray(props.forms) ; // props.forms.slice(0);
//   let raws = safeCopyArray(props.raws) ; // props.raws.slice(0);
  sendStrings.forEach(e=>{
    switch(e.type){
      case "header":
        oldStrings.headers.push(e.text);
        break ;
      case "url":
        oldStrings.urls.push(e.text);
        break ;
      case "json":
        oldStrings.jsons.push(e.text);
        break ;
      case "form":
        oldStrings.forms.push(e.text);
        break ;
      case "raw":
        oldStrings.raws.push(e.text);
        break ;
      default:
        break ;
    }
  });
//  console.log("headers");
//  console.log(headers);
//   props.setHeaders(headers);// save to Redux
//   props.setUrls(urls);
//   props.setForms(forms);
//   props.setJsons(jsons);
//   props.setRaws(raws);
}

this.addStringStores = function (params){
//  console.log(params.oldStrings);
//   console.log("add") ;
//   console.log(strings);
//   return ;
/*
strings is an object of all of the fields taken from the form: headers, urls, jsons, forms, raw, bodytype
sendStrings is an array of all those strings, with "type" of string
**/  
  let sendStrings = [] ;
//   if (Array.isArray(strings.urls)){
//   } else {
//     sendStrings.push({type: "url", text: strings.urls});
//   }
  params.strings.urls.forEach(e=>{ if (e !== "") sendStrings.push({type: "url", text: e}) }) ;
  params.strings.headers.forEach(e=>{ if (e !== "") sendStrings.push({type: "header", text: e}) }) ;
  switch (params.strings.bodytype){// this is the body type
    case "Raw":
      sendStrings.push({type: "raw", text: params.strings.raw});
      break ;
    case "Json":
      params.strings.jsons.forEach(e=>{ if (e !== "") sendStrings.push({type: "json", text: e}) }) ;
      break ;
    case "Form":
      params.strings.forms.forEach(e=>{ if (e !== "") sendStrings.push({type: "form", text: e}) }) ;
      break ;
    default:
      break ;
  }
  console.log(sendStrings);
  this.removeOldStrings(sendStrings, params.oldStrings);
  console.log(sendStrings);
  if(sendStrings.length > 0) {
    this.addRemainingStrings(sendStrings, params.oldStrings)
    this.httpC("addstrsto", sendStrings) ;
  }
}

this.initStringStores = function (props){
//  console.log("init string stores");
  let strings= {
    headers:    [
    "content-type: application/json",
    "authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOiIyMDE4LTA2LTE0VDEyOjIyOjMyLjQ3MTk3MjQ0Ny0wNDowMCIsImZsYWdzIjoxLCJpZCI6IjViMjI4YzM4YTRlMDI4NjY2N2NhMGJhMiJ9.T4odF9DBI0nHjliYNPzFMs0-iHw62kjvxn5Ho5a1WCM", ],
    urls:    [
      "https://postops.us:6026/open/users",
      "https://postops.us:6026/open/authenticate/bob@me.com/edea01c16b2d3c55694cb68967b344ee548d4a9a9ca3612fcf569e6ae93e0802",
      "https://postops.us:6026/auth/stringstore"],
    jsons:    ["useremail: bob@me.com", "password: edea01c16b2d3c55694cb68967b344ee548d4a9a9ca3612fcf569e6ae93e0802"],
    bodytype: "Json",// forces the 'jsons' values to be accepted
  }
/*  props.setHeaders(strings.headers);// save to Redux
  props.setUrls(strings.urls);
  props.setForms([]);
  props.setJsons(strings.jsons); // theDuck0! hash
  props.setRaws([]);
  props.setSeq(0);*/
//  addStringStores(props, strings);// this is really designed for taking strings from the form *not* initializing!
}

this.processStringStores = function (e, params){
//  console.log(e) ;
//  console.log(props) ;
  if (e == null) {
//    initStringStores(props);
    return ;
  }
  let headers = [], urls = [], forms = [], jsons = [], raws = [] ;
  for(let i = 0 ; i < e.length ; i++){
    switch (e[i].type){
      case "header":
        headers.push(e[i].text) ;
        break ;
      case "url":
        urls.push(e[i].text) ;
        break ;
      case "form":
        forms.push(e[i].text) ;
        break ;
      case "json":
        jsons.push(e[i].text) ;
        break ;
      case "raw":
        raws.push(e[i].text) ;
        break ;
      default:
        break ;
    }
  }
  params.headers = headers ;
  params.urls = urls ;
  params.forms = forms ;
  params.jsons = jsons ;
  params.raws = raws ;
//  console.log("returning");
//  console.log(params.urls);
//  console.log(params);
  
//  console.log(headers);
/*  props.setHeaders(headers);// save to Redux
  props.setUrls(urls);
  props.setForms(forms);
  props.setJsons(jsons);
  props.setRaws(raws);
  props.setSeq(0);*/
}
/*
in angularjs:
the suggested strings are going to be in the po component
they will be passed back and forth as "params", an object with headers, urls, forms, jsons, raws, fields
 * */



// this.processStringStores = function (e, params){
// //  console.log("process") ;
//   this.processStringStores(e, params) ;
//   console.log(params) ;
// }

this.loadStringStores = function (params){
//  console.log("load stringstores");
  return new Promise((res, rej)=>{
    this.getStringStores(params).then(e=>{
      this.processStringStores(e, params);
      res();
    });
  }) ;
}

  this.httpC = function (type, params){
  switch(type){
    case "register":
      return this.register(params);
    case "login":
      return this.login(params);
    case "checklogin":
      return this.checklogin(params);
    case "checkauth":
      return this.checkAuth(params);
    case "addstrsto":
      return this.addStringStore(params);
    case "getstrstos":
      return this.getStringStores(params);
    case "setstrstos":
      return this.setStringStores(params);
    case "tryserver":
      return this.tryServer();
    case "ssLoadStringStores":
      return this.loadStringStores(params);
    case "ssAddStringStores":
      return this.addStringStores(params);
    case "poPostOpsRequest":
      return this.PostOpsRequest(params);
      
    case "gslogin":
//      console.log("save login in loginout");
      sessionStorage.setItem("auth", params.auth) ;
      sessionStorage.setItem("useremail", params.useremail) ;
      sessionStorage.setItem("password", params.password) ;
      break ;
    case "gslogout":
      sessionStorage.removeItem("auth") ;
      localStorage.removeItem("useremail") ;
      localStorage.removeItem("password") ;
      break ;
    case "gsrememberme":
//      console.log("rememberme");
//      console.log(params);
      localStorage.setItem("useremail", params.useremail) ;
      localStorage.setItem("password", params.password);
      break ;
    case "gsgetauth":
      return sessionStorage.getItem("auth");
    case "gsgetlogin":
      let useremail = localStorage.getItem("useremail") ;
      let password = localStorage.getItem("password") ;
      return {useremail: useremail, password: password};
    default:
      break ;
  }
},
    
  this.myFunc = function(a){
    console.log("http: " + a) ;
    return 0 ;
  } ;
  
this.keyValSep = function (comb){
  let posCo = comb.indexOf(":") ;
  let key = comb.substr(0, posCo) ;
  let val = comb.substr(posCo + 1).trim();
  return {key: key, val: val} ;
}

this.getBodyRaw = function (str) {
  return str ;
}

this.getJsonObj = function (jsons){
  let obj = "{\n" ;
  var prop ;
  var sep ;
  jsons.forEach(v=>{
    if (v !== ""){
      prop = this.keyValSep(v) ;
      sep = isNaN(prop.val) ? "\"" : "" ;
      obj += "    \"" + prop.key + "\": " + sep + prop.val + sep + ",\n" ;
    }
  });
  obj = obj.substr(0, obj.length - 2) + "\n}" ;
//  obj += "}" ;
  //console.log(obj) ;
  return obj ;
}

this.getFormLine = function (forms){
  let line = "" ;
  var prop ;
  forms.forEach(v=>{
    if (v !== ""){
      prop = this.keyValSep(v) ;
      line += encodeURI(prop.key) + "=" + encodeURI(prop.val) + "&" ;
    }
  });
  return line.substr(0, line.length - 1) ;
}

this.addHeaders = function (httpObj, headers){
  var head ;
  headers.forEach(v=>{
    if (v !== ""){
      head = this.keyValSep(v) ;
      httpObj.headers[head.key] = head.val;
    }
  });
}

this.PostOpsProxyRequest = function (url, httpObj, res, rej){
//  console.log("po proxy");
//  console.log(httpObj);
  
  let proxy = {url: url, method: httpObj.method, headers: [], body: httpObj.body}; // , headers: httpObj.headers,
  for (var prop in httpObj.headers){
    proxy.headers.push(prop + ": " + httpObj.headers[prop]) ;
  }
  url = this.baseUrl + "/auth/proxy" ;
//  console.log("upd headers");
  httpObj.method = "POST" ;
  httpObj.headers = {
      'user-agent': 'Mozilla/4.0 MDN Example',
      'content-type': 'application/json',
      'Authorization' : sessionStorage.getItem("auth"),
  }
  httpObj.body = JSON.stringify(proxy) ;
//  console.log(httpObj) ;
//  let ret = {headers: [], status: 123, body: "none"} ;
//  return new Promise((res2, rej2)=>{});
//  console.log(httpObj);
  return fetch(url, httpObj).then(response => response.json().then(resp=>{ res(resp); }), e=>{rej(e)});
  
//  return fetch(proxy, httpObj).then(response => {
//    response.text().then(r=>{
//      res(processResponse(response, r));
//    });
//  }) ;
}

this.processResponse = function (response, body){
// process the response into a status code, headers array, and body
//  console.log(response);
//  console.log(body);
  let ret = {headers: []} ;
  
  for(var key of response.headers.keys()) {
    ret.headers.push(key + ": " + response.headers.get(key));
  }
  ret.status = response.status ;
  ret.body = body ;
  return ret ;
}

this.PostOpsRequest = function (params){
//  console.log(useProxy);
//   console.log("strings") ;
//   console.log(params);
  return new Promise((res, rej)=>{
    let url = params.urls[0] ;
    var body = ""
    if ((params.method === "POST") || (params.method === "PUT") || params.useProxy) {
      switch(params.bodytype){
        case "Raw":
          body = this.getBodyRaw(params.raw) ;
          console.log(params.raw);
          break ;
        case "Json":
          body = this.getJsonObj(params.jsons) ;
          break ;
        case "Form":
          body = this.getFormLine(params.forms) ;
          break ;
        default:
          break ;
      }
    }
//    console.log("body: " + body) ;
    let httpObj = this.po (params.method, body) ;
    httpObj.headers = {"user-agent": "Mozilla/4.0 MDN Example"}
    this.addHeaders (httpObj, params.headers) ;
//    console.log(httpObj);
//    httpObj.mode = "no-cors" ;
    
//    console.log(httpObj);
//    return fetch(url, httpObj).then(r => {console.log(r)}) ;
//    httpObj.headers['Authorization'] = sessionStorage.getItem("auth");
    if(params.useProxy){
      return this.PostOpsProxyRequest(url, httpObj, res, rej);
    } else {
      console.log("fetching");
      console.log(url) ;
      console.log(httpObj);
      return fetch(url, httpObj).then(response => {
        response.text().then(r=>{
          res(this.processResponse(response, r));
        });
      }) ;
    }
  })
  
}
  
      
  }
}
