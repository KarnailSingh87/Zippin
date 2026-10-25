(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[888],{3454:function(e,t,r){"use strict";var i,n;e.exports=(null==(i=r.g.process)?void 0:i.env)&&"object"==typeof(null==(n=r.g.process)?void 0:n.env)?r.g.process:r(7663)},3837:function(e,t,r){(window.__NEXT_P=window.__NEXT_P||[]).push(["/_app",function(){return r(3585)}])},18:function(e,t,r){"use strict";let i,n;r.d(t,{H:function(){return AuthProvider},a:function(){return useAuth}});var s,a,o,l,c=r(5893),d=r(7294);let getDefaultsFromPostinstall=()=>void 0;var u=r(3454);/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let stringToByteArray$1=function(e){let t=[],r=0;for(let i=0;i<e.length;i++){let n=e.charCodeAt(i);n<128?t[r++]=n:(n<2048?t[r++]=n>>6|192:((64512&n)==55296&&i+1<e.length&&(64512&e.charCodeAt(i+1))==56320?(n=65536+((1023&n)<<10)+(1023&e.charCodeAt(++i)),t[r++]=n>>18|240,t[r++]=n>>12&63|128):t[r++]=n>>12|224,t[r++]=n>>6&63|128),t[r++]=63&n|128)}return t},byteArrayToString=function(e){let t=[],r=0,i=0;for(;r<e.length;){let n=e[r++];if(n<128)t[i++]=String.fromCharCode(n);else if(n>191&&n<224){let s=e[r++];t[i++]=String.fromCharCode((31&n)<<6|63&s)}else if(n>239&&n<365){let s=e[r++],a=e[r++],o=e[r++],l=((7&n)<<18|(63&s)<<12|(63&a)<<6|63&o)-65536;t[i++]=String.fromCharCode(55296+(l>>10)),t[i++]=String.fromCharCode(56320+(1023&l))}else{let s=e[r++],a=e[r++];t[i++]=String.fromCharCode((15&n)<<12|(63&s)<<6|63&a)}}return t.join("")},h={byteToCharMap_:null,charToByteMap_:null,byteToCharMapWebSafe_:null,charToByteMapWebSafe_:null,ENCODED_VALS_BASE:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",get ENCODED_VALS(){return this.ENCODED_VALS_BASE+"+/="},get ENCODED_VALS_WEBSAFE(){return this.ENCODED_VALS_BASE+"-_."},HAS_NATIVE_SUPPORT:"function"==typeof atob,encodeByteArray(e,t){if(!Array.isArray(e))throw Error("encodeByteArray takes an array as a parameter");this.init_();let r=t?this.byteToCharMapWebSafe_:this.byteToCharMap_,i=[];for(let t=0;t<e.length;t+=3){let n=e[t],s=t+1<e.length,a=s?e[t+1]:0,o=t+2<e.length,l=o?e[t+2]:0,c=n>>2,d=(3&n)<<4|a>>4,u=(15&a)<<2|l>>6,h=63&l;o||(h=64,s||(u=64)),i.push(r[c],r[d],r[u],r[h])}return i.join("")},encodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?btoa(e):this.encodeByteArray(stringToByteArray$1(e),t)},decodeString(e,t){return this.HAS_NATIVE_SUPPORT&&!t?atob(e):byteArrayToString(this.decodeStringToByteArray(e,t))},decodeStringToByteArray(e,t){this.init_();let r=t?this.charToByteMapWebSafe_:this.charToByteMap_,i=[];for(let t=0;t<e.length;){let n=r[e.charAt(t++)],s=t<e.length,a=s?r[e.charAt(t)]:0;++t;let o=t<e.length,l=o?r[e.charAt(t)]:64;++t;let c=t<e.length,d=c?r[e.charAt(t)]:64;if(++t,null==n||null==a||null==l||null==d)throw new DecodeBase64StringError;let u=n<<2|a>>4;if(i.push(u),64!==l){let e=a<<4&240|l>>2;if(i.push(e),64!==d){let e=l<<6&192|d;i.push(e)}}}return i},init_(){if(!this.byteToCharMap_){this.byteToCharMap_={},this.charToByteMap_={},this.byteToCharMapWebSafe_={},this.charToByteMapWebSafe_={};for(let e=0;e<this.ENCODED_VALS.length;e++)this.byteToCharMap_[e]=this.ENCODED_VALS.charAt(e),this.charToByteMap_[this.byteToCharMap_[e]]=e,this.byteToCharMapWebSafe_[e]=this.ENCODED_VALS_WEBSAFE.charAt(e),this.charToByteMapWebSafe_[this.byteToCharMapWebSafe_[e]]=e,e>=this.ENCODED_VALS_BASE.length&&(this.charToByteMap_[this.ENCODED_VALS_WEBSAFE.charAt(e)]=e,this.charToByteMapWebSafe_[this.ENCODED_VALS.charAt(e)]=e)}}};let DecodeBase64StringError=class DecodeBase64StringError extends Error{constructor(){super(...arguments),this.name="DecodeBase64StringError"}};let base64Encode=function(e){let t=stringToByteArray$1(e);return h.encodeByteArray(t,!0)},base64urlEncodeWithoutPadding=function(e){return base64Encode(e).replace(/\./g,"")},index_esm_base64Decode=function(e){try{return h.decodeString(e,!0)}catch(e){console.error("base64Decode failed: ",e)}return null},getDefaultsFromGlobal=()=>/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */(function(){if("undefined"!=typeof self)return self;if("undefined"!=typeof window)return window;if(void 0!==r.g)return r.g;throw Error("Unable to locate global object.")})().__FIREBASE_DEFAULTS__,getDefaultsFromEnvVariable=()=>{if(void 0===u||void 0===u.env)return;let e=u.env.__FIREBASE_DEFAULTS__;if(e)return JSON.parse(e)},getDefaultsFromCookie=()=>{let e;if("undefined"==typeof document)return;try{e=document.cookie.match(/__FIREBASE_DEFAULTS__=([^;]+)/)}catch(e){return}let t=e&&index_esm_base64Decode(e[1]);return t&&JSON.parse(t)},getDefaults=()=>{try{return getDefaultsFromPostinstall()||getDefaultsFromGlobal()||getDefaultsFromEnvVariable()||getDefaultsFromCookie()}catch(e){console.info(`Unable to get __FIREBASE_DEFAULTS__ due to: ${e}`);return}},getDefaultEmulatorHost=e=>getDefaults()?.emulatorHosts?.[e],index_esm_getDefaultAppConfig=()=>getDefaults()?.config,getExperimentalSetting=e=>getDefaults()?.[`_${e}`];/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Deferred=class Deferred{constructor(){this.reject=()=>{},this.resolve=()=>{},this.promise=new Promise((e,t)=>{this.resolve=e,this.reject=t})}wrapCallback(e){return(t,r)=>{t?this.reject(t):this.resolve(r),"function"==typeof e&&(this.promise.catch(()=>{}),1===e.length?e(t):e(t,r))}}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm_getUA(){return"undefined"!=typeof navigator&&"string"==typeof navigator.userAgent?navigator.userAgent:""}let FirebaseError=class FirebaseError extends Error{constructor(e,t,r){super(t),this.code=e,this.customData=r,this.name="FirebaseError",Object.setPrototypeOf(this,FirebaseError.prototype),Error.captureStackTrace&&Error.captureStackTrace(this,ErrorFactory.prototype.create)}};let ErrorFactory=class ErrorFactory{constructor(e,t,r){this.service=e,this.serviceName=t,this.errors=r}create(e,...t){let r=t[0]||{},i=`${this.service}/${e}`,n=this.errors[e],s=n?function(e,t){try{let r=0,i="";for(;r<e.length;){let n=e.indexOf("{$",r);if(-1===n){i+=e.substring(r);break}let s=e.indexOf("}",n+2);if(-1===s){i+=e.substring(r);break}let a=e.substring(n+2,s),o=t[a];i+=e.substring(r,n)+(null!=o?String(o):`<${a}?>`),r=s+1}return i}catch(t){return e}}(n,r):"Error",a=`${this.serviceName}: ${s} (${i}).`,o=new FirebaseError(i,a,r);return o}};function deepEqual(e,t){if(e===t)return!0;let r=Object.keys(e),i=Object.keys(t);for(let n of r){if(!i.includes(n))return!1;let r=e[n],s=t[n];if(isObject(r)&&isObject(s)){if(!deepEqual(r,s))return!1}else if(r!==s)return!1}for(let e of i)if(!r.includes(e))return!1;return!0}function isObject(e){return null!==e&&"object"==typeof e}/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm_querystring(e){let t=[];for(let[r,i]of Object.entries(e))Array.isArray(i)?i.forEach(e=>{t.push(encodeURIComponent(r)+"="+encodeURIComponent(e))}):t.push(encodeURIComponent(r)+"="+encodeURIComponent(i));return t.length?"&"+t.join("&"):""}function querystringDecode(e){let t={},r=e.replace(/^\?/,"").split("&");return r.forEach(e=>{if(e){let[r,i]=e.split("=");t[decodeURIComponent(r)]=decodeURIComponent(i)}}),t}function extractQuerystring(e){let t=e.indexOf("?");if(!t)return"";let r=e.indexOf("#",t);return e.substring(t,r>0?r:void 0)}let ObserverProxy=class ObserverProxy{constructor(e,t){this.observers=[],this.unsubscribes=[],this.observerCount=0,this.task=Promise.resolve(),this.finalized=!1,this.onNoObservers=t,this.task.then(()=>{e(this)}).catch(e=>{this.error(e)})}next(e){this.forEachObserver(t=>{t.next(e)})}error(e){this.forEachObserver(t=>{t.error(e)}),this.close(e)}complete(){this.forEachObserver(e=>{e.complete()}),this.close()}subscribe(e,t,r){let i;if(void 0===e&&void 0===t&&void 0===r)throw Error("Missing Observer.");void 0===(i=!function(e,t){if("object"!=typeof e||null===e)return!1;for(let r of t)if(r in e&&"function"==typeof e[r])return!0;return!1}(e,["next","error","complete"])?{next:e,error:t,complete:r}:e).next&&(i.next=noop),void 0===i.error&&(i.error=noop),void 0===i.complete&&(i.complete=noop);let n=this.unsubscribeOne.bind(this,this.observers.length);return this.finalized&&this.task.then(()=>{try{this.finalError?i.error(this.finalError):i.complete()}catch(e){}}),this.observers.push(i),n}unsubscribeOne(e){void 0!==this.observers&&void 0!==this.observers[e]&&(delete this.observers[e],this.observerCount-=1,0===this.observerCount&&void 0!==this.onNoObservers&&this.onNoObservers(this))}forEachObserver(e){if(!this.finalized)for(let t=0;t<this.observers.length;t++)this.sendOne(t,e)}sendOne(e,t){this.task.then(()=>{if(void 0!==this.observers&&void 0!==this.observers[e])try{t(this.observers[e])}catch(e){"undefined"!=typeof console&&console.error&&console.error(e)}})}close(e){this.finalized||(this.finalized=!0,void 0!==e&&(this.finalError=e),this.task.then(()=>{this.observers=void 0,this.onNoObservers=void 0}))}};function noop(){}/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function index_esm_getModularInstance(e){return e&&e._delegate?e._delegate:e}/**
 * @license
 * Copyright 2025 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function isCloudWorkstation(e){try{let t=e.startsWith("http://")||e.startsWith("https://")?new URL(e).hostname:e;return t.endsWith(".cloudworkstations.dev")}catch{return!1}}async function pingServer(e){let t=await fetch(e,{credentials:"include"});return t.ok}let Component=class Component{constructor(e,t,r){this.name=e,this.instanceFactory=t,this.type=r,this.multipleInstances=!1,this.serviceProps={},this.instantiationMode="LAZY",this.onInstanceCreated=null}setInstantiationMode(e){return this.instantiationMode=e,this}setMultipleInstances(e){return this.multipleInstances=e,this}setServiceProps(e){return this.serviceProps=e,this}setInstanceCreatedCallback(e){return this.onInstanceCreated=e,this}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let p="[DEFAULT]";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Provider=class Provider{constructor(e,t){this.name=e,this.container=t,this.component=null,this.instances=new Map,this.instancesDeferred=new Map,this.instancesOptions=new Map,this.onInitCallbacks=new Map}get(e){let t=this.normalizeInstanceIdentifier(e);if(!this.instancesDeferred.has(t)){let e=new Deferred;if(this.instancesDeferred.set(t,e),this.isInitialized(t)||this.shouldAutoInitialize())try{let r=this.getOrInitializeService({instanceIdentifier:t});r&&e.resolve(r)}catch(e){}}return this.instancesDeferred.get(t).promise}getImmediate(e){let t=this.normalizeInstanceIdentifier(e?.identifier),r=e?.optional??!1;if(this.isInitialized(t)||this.shouldAutoInitialize())try{return this.getOrInitializeService({instanceIdentifier:t})}catch(e){if(r)return null;throw e}else{if(r)return null;throw Error(`Service ${this.name} is not available`)}}getComponent(){return this.component}setComponent(e){if(e.name!==this.name)throw Error(`Mismatching Component ${e.name} for Provider ${this.name}.`);if(this.component)throw Error(`Component for ${this.name} has already been provided`);if(this.component=e,this.shouldAutoInitialize()){if("EAGER"===e.instantiationMode)try{this.getOrInitializeService({instanceIdentifier:p})}catch(e){}for(let[e,t]of this.instancesDeferred.entries()){let r=this.normalizeInstanceIdentifier(e);try{let e=this.getOrInitializeService({instanceIdentifier:r});t.resolve(e)}catch(e){}}}}clearInstance(e=p){this.instancesDeferred.delete(e),this.instancesOptions.delete(e),this.instances.delete(e)}async delete(){let e=Array.from(this.instances.values());await Promise.all([...e.filter(e=>"INTERNAL"in e).map(e=>e.INTERNAL.delete()),...e.filter(e=>"_delete"in e).map(e=>e._delete())])}isComponentSet(){return null!=this.component}isInitialized(e=p){return this.instances.has(e)}getOptions(e=p){return this.instancesOptions.get(e)||{}}initialize(e={}){let{options:t={}}=e,r=this.normalizeInstanceIdentifier(e.instanceIdentifier);if(this.isInitialized(r))throw Error(`${this.name}(${r}) has already been initialized`);if(!this.isComponentSet())throw Error(`Component ${this.name} has not been registered yet`);let i=this.getOrInitializeService({instanceIdentifier:r,options:t});for(let[e,t]of this.instancesDeferred.entries()){let n=this.normalizeInstanceIdentifier(e);r===n&&t.resolve(i)}return i}onInit(e,t){let r=this.normalizeInstanceIdentifier(t),i=this.onInitCallbacks.get(r)??new Set;i.add(e),this.onInitCallbacks.set(r,i);let n=this.instances.get(r);return n&&e(n,r),()=>{i.delete(e)}}invokeOnInitCallbacks(e,t){let r=this.onInitCallbacks.get(t);if(r)for(let i of r)try{i(e,t)}catch{}}getOrInitializeService({instanceIdentifier:e,options:t={}}){let r=this.instances.get(e);if(!r&&this.component&&(r=this.component.instanceFactory(this.container,{instanceIdentifier:e===p?void 0:e,options:t}),this.instances.set(e,r),this.instancesOptions.set(e,t),this.invokeOnInitCallbacks(r,e),this.component.onInstanceCreated))try{this.component.onInstanceCreated(this.container,e,r)}catch{}return r||null}normalizeInstanceIdentifier(e=p){return this.component?this.component.multipleInstances?e:p:e}shouldAutoInitialize(){return!!this.component&&"EXPLICIT"!==this.component.instantiationMode}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let index_esm_ComponentContainer=class index_esm_ComponentContainer{constructor(e){this.name=e,this.providers=new Map}addComponent(e){let t=this.getProvider(e.name);if(t.isComponentSet())throw Error(`Component ${e.name} has already been registered with ${this.name}`);t.setComponent(e)}addOrOverwriteComponent(e){let t=this.getProvider(e.name);t.isComponentSet()&&this.providers.delete(e.name),this.addComponent(e)}getProvider(e){if(this.providers.has(e))return this.providers.get(e);let t=new Provider(e,this);return this.providers.set(e,t),t}getProviders(){return Array.from(this.providers.values())}};/**
 * @license
 * Copyright 2017 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let f=[];(a=l||(l={}))[a.DEBUG=0]="DEBUG",a[a.VERBOSE=1]="VERBOSE",a[a.INFO=2]="INFO",a[a.WARN=3]="WARN",a[a.ERROR=4]="ERROR",a[a.SILENT=5]="SILENT";let m={debug:l.DEBUG,verbose:l.VERBOSE,info:l.INFO,warn:l.WARN,error:l.ERROR,silent:l.SILENT},g=l.INFO,_={[l.DEBUG]:"log",[l.VERBOSE]:"log",[l.INFO]:"info",[l.WARN]:"warn",[l.ERROR]:"error"},defaultLogHandler=(e,t,...r)=>{if(t<e.logLevel)return;let i=new Date().toISOString(),n=_[t];if(n)console[n](`[${i}]  ${e.name}:`,...r);else throw Error(`Attempted to log a message with an invalid logType (value: ${t})`)};let Logger=class Logger{constructor(e){this.name=e,this._logLevel=g,this._logHandler=defaultLogHandler,this._userLogHandler=null,f.push(this)}get logLevel(){return this._logLevel}set logLevel(e){if(!(e in l))throw TypeError(`Invalid value "${e}" assigned to \`logLevel\``);this._logLevel=e}setLogLevel(e){this._logLevel="string"==typeof e?m[e]:e}get logHandler(){return this._logHandler}set logHandler(e){if("function"!=typeof e)throw TypeError("Value assigned to `logHandler` must be a function");this._logHandler=e}get userLogHandler(){return this._userLogHandler}set userLogHandler(e){this._userLogHandler=e}debug(...e){this._userLogHandler&&this._userLogHandler(this,l.DEBUG,...e),this._logHandler(this,l.DEBUG,...e)}log(...e){this._userLogHandler&&this._userLogHandler(this,l.VERBOSE,...e),this._logHandler(this,l.VERBOSE,...e)}info(...e){this._userLogHandler&&this._userLogHandler(this,l.INFO,...e),this._logHandler(this,l.INFO,...e)}warn(...e){this._userLogHandler&&this._userLogHandler(this,l.WARN,...e),this._logHandler(this,l.WARN,...e)}error(...e){this._userLogHandler&&this._userLogHandler(this,l.ERROR,...e),this._logHandler(this,l.ERROR,...e)}};let instanceOfAny=(e,t)=>t.some(t=>e instanceof t),v=new WeakMap,y=new WeakMap,b=new WeakMap,x=new WeakMap,w=new WeakMap,I={get(e,t,r){if(e instanceof IDBTransaction){if("done"===t)return y.get(e);if("objectStoreNames"===t)return e.objectStoreNames||b.get(e);if("store"===t)return r.objectStoreNames[1]?void 0:r.objectStore(r.objectStoreNames[0])}return wrap_idb_value_wrap(e[t])},set:(e,t,r)=>(e[t]=r,!0),has:(e,t)=>e instanceof IDBTransaction&&("done"===t||"store"===t)||t in e};function wrap_idb_value_wrap(e){var t;if(e instanceof IDBRequest)return function(e){let t=new Promise((t,r)=>{let unlisten=()=>{e.removeEventListener("success",success),e.removeEventListener("error",error)},success=()=>{t(wrap_idb_value_wrap(e.result)),unlisten()},error=()=>{r(e.error),unlisten()};e.addEventListener("success",success),e.addEventListener("error",error)});return t.then(t=>{t instanceof IDBCursor&&v.set(t,e)}).catch(()=>{}),w.set(t,e),t}(e);if(x.has(e))return x.get(e);let r="function"==typeof(t=e)?t!==IDBDatabase.prototype.transaction||"objectStoreNames"in IDBTransaction.prototype?(n||(n=[IDBCursor.prototype.advance,IDBCursor.prototype.continue,IDBCursor.prototype.continuePrimaryKey])).includes(t)?function(...e){return t.apply(unwrap(this),e),wrap_idb_value_wrap(v.get(this))}:function(...e){return wrap_idb_value_wrap(t.apply(unwrap(this),e))}:function(e,...r){let i=t.call(unwrap(this),e,...r);return b.set(i,e.sort?e.sort():[e]),wrap_idb_value_wrap(i)}:(t instanceof IDBTransaction&&function(e){if(y.has(e))return;let t=new Promise((t,r)=>{let unlisten=()=>{e.removeEventListener("complete",complete),e.removeEventListener("error",error),e.removeEventListener("abort",error)},complete=()=>{t(),unlisten()},error=()=>{r(e.error||new DOMException("AbortError","AbortError")),unlisten()};e.addEventListener("complete",complete),e.addEventListener("error",error),e.addEventListener("abort",error)});y.set(e,t)}(t),instanceOfAny(t,i||(i=[IDBDatabase,IDBObjectStore,IDBIndex,IDBCursor,IDBTransaction])))?new Proxy(t,I):t;return r!==e&&(x.set(e,r),w.set(r,e)),r}let unwrap=e=>w.get(e),E=["get","getKey","getAll","getAllKeys","count"],C=["put","add","delete","clear"],k=new Map;function getMethod(e,t){if(!(e instanceof IDBDatabase&&!(t in e)&&"string"==typeof t))return;if(k.get(t))return k.get(t);let r=t.replace(/FromIndex$/,""),i=t!==r,n=C.includes(r);if(!(r in(i?IDBIndex:IDBObjectStore).prototype)||!(n||E.includes(r)))return;let method=async function(e,...t){let s=this.transaction(e,n?"readwrite":"readonly"),a=s.store;return i&&(a=a.index(t.shift())),(await Promise.all([a[r](...t),n&&s.done]))[0]};return k.set(t,method),method}I={...s=I,get:(e,t,r)=>getMethod(e,t)||s.get(e,t,r),has:(e,t)=>!!getMethod(e,t)||s.has(e,t)};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PlatformLoggerServiceImpl=class PlatformLoggerServiceImpl{constructor(e){this.container=e}getPlatformInfoString(){let e=this.container.getProviders();return e.map(e=>{if(!function(e){let t=e.getComponent();return t?.type==="VERSION"}(e))return null;{let t=e.getImmediate();return`${t.library}/${t.version}`}}).filter(e=>e).join(" ")}};let S="@firebase/app",T="0.16.4",P=new Logger("@firebase/app"),N="[DEFAULT]",A={[S]:"fire-core","@firebase/app-compat":"fire-core-compat","@firebase/analytics":"fire-analytics","@firebase/analytics-compat":"fire-analytics-compat","@firebase/app-check":"fire-app-check","@firebase/app-check-compat":"fire-app-check-compat","@firebase/auth":"fire-auth","@firebase/auth-compat":"fire-auth-compat","@firebase/database":"fire-rtdb","@firebase/data-connect":"fire-data-connect","@firebase/database-compat":"fire-rtdb-compat","@firebase/functions":"fire-fn","@firebase/functions-compat":"fire-fn-compat","@firebase/installations":"fire-iid","@firebase/installations-compat":"fire-iid-compat","@firebase/messaging":"fire-fcm","@firebase/messaging-compat":"fire-fcm-compat","@firebase/performance":"fire-perf","@firebase/performance-compat":"fire-perf-compat","@firebase/remote-config":"fire-rc","@firebase/remote-config-compat":"fire-rc-compat","@firebase/storage":"fire-gcs","@firebase/storage-compat":"fire-gcs-compat","@firebase/firestore":"fire-fst","@firebase/firestore-compat":"fire-fst-compat","@firebase/ai":"fire-vertex","fire-js":"fire-js",firebase:"fire-js-all"},R=new Map,j=new Map,O=new Map;function _addComponent(e,t){try{e.container.addComponent(t)}catch(r){P.debug(`Component ${t.name} failed to register with FirebaseApp ${e.name}`,r)}}function _registerComponent(e){let t=e.name;if(O.has(t))return P.debug(`There were multiple attempts to register component ${t}.`),!1;for(let r of(O.set(t,e),R.values()))_addComponent(r,e);for(let t of j.values())_addComponent(t,e);return!0}function _getProvider(e,t){let r=e.container.getProvider("heartbeat").getImmediate({optional:!0});return r&&r.triggerHeartbeat(),e.container.getProvider(t)}function index_esm_isFirebaseServerApp(e){return null!=e&&void 0!==e.settings}let D=new ErrorFactory("app","Firebase",{"no-app":"No Firebase App '{$appName}' has been created - call initializeApp() first","bad-app-name":"Illegal App name: '{$appName}'","duplicate-app":"Firebase App named '{$appName}' already exists with different {$mismatchedParam}. Existing: '{$oldValue}'. New: '{$newValue}'.","app-deleted":"Firebase App named '{$appName}' already deleted","server-app-deleted":"Firebase Server App has been deleted","no-options":"Need to provide options, when not being deployed to hosting via source.","invalid-app-argument":"firebase.{$appName}() takes either no argument or a Firebase App instance.","invalid-log-argument":"First argument to `onLog` must be null or a function.","idb-open":"Error thrown when opening IndexedDB. Original error: {$originalErrorMessage}.","idb-get":"Error thrown when reading from IndexedDB. Original error: {$originalErrorMessage}.","idb-set":"Error thrown when writing to IndexedDB. Original error: {$originalErrorMessage}.","idb-delete":"Error thrown when deleting from IndexedDB. Original error: {$originalErrorMessage}.","finalization-registry-not-supported":"FirebaseServerApp deleteOnDeref field defined but the JS runtime does not support FinalizationRegistry.","invalid-server-app-environment":"FirebaseServerApp is not for use in browser environments."});/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FirebaseAppImpl=class FirebaseAppImpl{constructor(e,t,r){this._isDeleted=!1,this._options={...e},this._config={...t},this._name=t.name,this._automaticDataCollectionEnabled=t.automaticDataCollectionEnabled,this._container=r,this.container.addComponent(new Component("app",()=>this,"PUBLIC"))}get automaticDataCollectionEnabled(){return this.checkDestroyed(),this._automaticDataCollectionEnabled}set automaticDataCollectionEnabled(e){this.checkDestroyed(),this._automaticDataCollectionEnabled=e}get name(){return this.checkDestroyed(),this._name}get options(){return this.checkDestroyed(),this._options}get config(){return this.checkDestroyed(),this._config}get container(){return this._container}get isDeleted(){return this._isDeleted}set isDeleted(e){this._isDeleted=e}checkDestroyed(){if(this.isDeleted)throw D.create("app-deleted",{appName:this._name})}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let L="13.1.0";function initializeApp(e,t={}){let r=e;if("object"!=typeof t){let e=t;t={name:e}}let i={name:N,automaticDataCollectionEnabled:!0,...t},n=i.name;if("string"!=typeof n||!n)throw D.create("bad-app-name",{appName:String(n)});if(r||(r=index_esm_getDefaultAppConfig()),!r)throw D.create("no-options");let s=R.get(n);if(s){if(deepEqual(r,s.options)){if(deepEqual(i,s.config))return s;throw D.create("duplicate-app",{appName:n,mismatchedParam:"config",oldValue:JSON.stringify(s.config),newValue:JSON.stringify(i)})}throw D.create("duplicate-app",{appName:n,mismatchedParam:"options",oldValue:JSON.stringify(s.options),newValue:JSON.stringify(r)})}let a=new index_esm_ComponentContainer(n);for(let e of O.values())a.addComponent(e);let o=new FirebaseAppImpl(r,i,a);return R.set(n,o),o}function getApp(e=N){let t=R.get(e);if(!t&&e===N&&index_esm_getDefaultAppConfig())return initializeApp();if(!t)throw D.create("no-app",{appName:e});return t}function registerVersion(e,t,r){let i=A[e]??e;r&&(i+=`-${r}`);let n=i.match(/\s|\//),s=t.match(/\s|\//);if(n||s){let e=[`Unable to register library "${i}" with version "${t}":`];n&&e.push(`library name "${i}" contains illegal characters (whitespace or "/")`),n&&s&&e.push("and"),s&&e.push(`version name "${t}" contains illegal characters (whitespace or "/")`),P.warn(e.join(" "));return}_registerComponent(new Component(`${i}-version`,()=>({library:i,version:t}),"VERSION"))}let M="firebase-heartbeat-store",F=null;function getDbPromise(){return F||(F=(function(e,t,{blocked:r,upgrade:i,blocking:n,terminated:s}={}){let a=indexedDB.open(e,1),o=wrap_idb_value_wrap(a);return i&&a.addEventListener("upgradeneeded",e=>{i(wrap_idb_value_wrap(a.result),e.oldVersion,e.newVersion,wrap_idb_value_wrap(a.transaction),e)}),r&&a.addEventListener("blocked",e=>r(e.oldVersion,e.newVersion,e)),o.then(e=>{s&&e.addEventListener("close",()=>s()),n&&e.addEventListener("versionchange",e=>n(e.oldVersion,e.newVersion,e))}).catch(()=>{}),o})("firebase-heartbeat-database",0,{upgrade:(e,t)=>{if(0===t)try{e.createObjectStore(M)}catch(e){console.warn(e)}}}).catch(e=>{throw D.create("idb-open",{originalErrorMessage:e.message})})),F}async function readHeartbeatsFromIndexedDB(e){try{let t=await getDbPromise(),r=t.transaction(M),i=await r.objectStore(M).get(computeKey(e));return await r.done,i}catch(e){if(e instanceof FirebaseError)P.warn(e.message);else{let t=D.create("idb-get",{originalErrorMessage:e?.message});P.warn(t.message)}}}async function writeHeartbeatsToIndexedDB(e,t){try{let r=await getDbPromise(),i=r.transaction(M,"readwrite"),n=i.objectStore(M);await n.put(t,computeKey(e)),await i.done}catch(e){if(e instanceof FirebaseError)P.warn(e.message);else{let t=D.create("idb-set",{originalErrorMessage:e?.message});P.warn(t.message)}}}function computeKey(e){return`${e.name}!${e.options.appId}`}let HeartbeatServiceImpl=class HeartbeatServiceImpl{constructor(e){this.container=e,this._heartbeatsCache=null;let t=this.container.getProvider("app").getImmediate();this._storage=new HeartbeatStorageImpl(t),this._heartbeatsCachePromise=this._storage.read().then(e=>(this._heartbeatsCache=e,e))}async triggerHeartbeat(){try{let e=this.container.getProvider("platform-logger").getImmediate(),t=e.getPlatformInfoString(),r=getUTCDateString();if(this._heartbeatsCache?.heartbeats==null&&(this._heartbeatsCache=await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null)||this._heartbeatsCache.lastSentHeartbeatDate===r||this._heartbeatsCache.heartbeats.some(e=>e.date===r))return;if(this._heartbeatsCache.heartbeats.push({date:r,agent:t}),this._heartbeatsCache.heartbeats.length>30){let e=function(e){if(0===e.length)return -1;let t=0,r=e[0].date;for(let i=1;i<e.length;i++)e[i].date<r&&(r=e[i].date,t=i);return t}(this._heartbeatsCache.heartbeats);this._heartbeatsCache.heartbeats.splice(e,1)}return this._storage.overwrite(this._heartbeatsCache)}catch(e){P.warn(e)}}async getHeartbeatsHeader(){try{if(null===this._heartbeatsCache&&await this._heartbeatsCachePromise,this._heartbeatsCache?.heartbeats==null||0===this._heartbeatsCache.heartbeats.length)return"";let e=getUTCDateString(),{heartbeatsToSend:t,unsentEntries:r}=function(e,t=1024){let r=[],i=e.slice();for(let n of e){let e=r.find(e=>e.agent===n.agent);if(e){if(e.dates.push(n.date),countBytes(r)>t){e.dates.pop();break}}else if(r.push({agent:n.agent,dates:[n.date]}),countBytes(r)>t){r.pop();break}i=i.slice(1)}return{heartbeatsToSend:r,unsentEntries:i}}(this._heartbeatsCache.heartbeats),i=base64urlEncodeWithoutPadding(JSON.stringify({version:2,heartbeats:t}));return this._heartbeatsCache.lastSentHeartbeatDate=e,r.length>0?(this._heartbeatsCache.heartbeats=r,await this._storage.overwrite(this._heartbeatsCache)):(this._heartbeatsCache.heartbeats=[],this._storage.overwrite(this._heartbeatsCache)),i}catch(e){return P.warn(e),""}}};function getUTCDateString(){let e=new Date;return e.toISOString().substring(0,10)}let HeartbeatStorageImpl=class HeartbeatStorageImpl{constructor(e){this.app=e,this._canUseIndexedDBPromise=this.runIndexedDBEnvironmentCheck()}async runIndexedDBEnvironmentCheck(){return!!function(){try{return"object"==typeof indexedDB}catch(e){return!1}}()&&new Promise((e,t)=>{try{let r=!0,i="validate-browser-context-for-indexeddb-analytics-module",n=self.indexedDB.open(i);n.onsuccess=()=>{n.result.close(),r||self.indexedDB.deleteDatabase(i),e(!0)},n.onupgradeneeded=()=>{r=!1},n.onerror=()=>{t(n.error?.message||"")}}catch(e){t(e)}}).then(()=>!0).catch(()=>!1)}async read(){let e=await this._canUseIndexedDBPromise;if(!e)return{heartbeats:[]};{let e=await readHeartbeatsFromIndexedDB(this.app);return e?.heartbeats?e:{heartbeats:[]}}}async overwrite(e){let t=await this._canUseIndexedDBPromise;if(t){let t=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:e.heartbeats})}}async add(e){let t=await this._canUseIndexedDBPromise;if(t){let t=await this.read();return writeHeartbeatsToIndexedDB(this.app,{lastSentHeartbeatDate:e.lastSentHeartbeatDate??t.lastSentHeartbeatDate,heartbeats:[...t.heartbeats,...e.heartbeats]})}}};function countBytes(e){return base64urlEncodeWithoutPadding(JSON.stringify({version:2,heartbeats:e})).length}function _prodErrorMap(){return{"dependent-sdk-initialized-before-auth":"Another Firebase SDK was initialized and is trying to use Auth before Auth is initialized. Please be sure to call `initializeAuth` or `getAuth` before starting any other Firebase SDK."}}_registerComponent(new Component("platform-logger",e=>new PlatformLoggerServiceImpl(e),"PRIVATE")),_registerComponent(new Component("heartbeat",e=>new HeartbeatServiceImpl(e),"PRIVATE")),registerVersion(S,T,""),registerVersion(S,T,"esm2020"),registerVersion("fire-js",""),/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */registerVersion("firebase","13.1.0","app");let U=new ErrorFactory("auth","Firebase",_prodErrorMap()),B=new Logger("@firebase/auth");function _logWarn(e,...t){B.logLevel<=l.WARN&&B.warn(`Auth (${L}): ${e}`,...t)}function _logError(e,...t){B.logLevel<=l.ERROR&&B.error(`Auth (${L}): ${e}`,...t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _fail(e,...t){throw createErrorInternal(e,...t)}function _createError(e,...t){return createErrorInternal(e,...t)}function _errorWithCustomMessage(e,t,r){let i={..._prodErrorMap(),[t]:r},n=new ErrorFactory("auth","Firebase",i);return n.create(t,{appName:e.name})}function _serverAppCurrentUserOperationNotSupportedError(e){return _errorWithCustomMessage(e,"operation-not-supported-in-this-environment","Operations that alter the current user are not supported in conjunction with FirebaseServerApp")}function createErrorInternal(e,...t){if("string"!=typeof e){let r=t[0],i=[...t.slice(1)];return i[0]&&(i[0].appName=e.name),e._errorFactory.create(r,...i)}return U.create(e,...t)}function _assert(e,t,...r){if(!e)throw createErrorInternal(t,...r)}function debugFail(e){let t="INTERNAL ASSERTION FAILED: "+e;throw _logError(t),Error(t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getCurrentUrl(){return"undefined"!=typeof self&&self.location?.href||""}function _getCurrentScheme(){return"undefined"!=typeof self&&self.location?.protocol||null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Delay=class Delay{constructor(e,t){this.shortDelay=e,this.longDelay=t,t>e||debugFail("Short delay should be less than long delay!"),this.isMobile="undefined"!=typeof window&&!!(window.cordova||window.phonegap||window.PhoneGap)&&/ios|iphone|ipod|ipad|android|blackberry|iemobile/i.test(index_esm_getUA())||"object"==typeof navigator&&"ReactNative"===navigator.product}get(){return!("undefined"!=typeof navigator&&navigator&&"onLine"in navigator&&"boolean"==typeof navigator.onLine&&("http:"===_getCurrentScheme()||"https:"===_getCurrentScheme()||function(){let e="object"==typeof chrome?chrome.runtime:"object"==typeof browser?browser.runtime:void 0;return"object"==typeof e&&void 0!==e.id}()||"connection"in navigator))||navigator.onLine?this.isMobile?this.longDelay:this.shortDelay:Math.min(5e3,this.shortDelay)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _emulatorUrl(e,t){e.emulator||debugFail("Emulator should always be set here");let{url:r}=e.emulator;return t?`${r}${t.startsWith("/")?t.slice(1):t}`:r}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FetchProvider=class FetchProvider{static initialize(e,t,r){this.fetchImpl=e,t&&(this.headersImpl=t),r&&(this.responseImpl=r)}static fetch(){return this.fetchImpl?this.fetchImpl:"undefined"!=typeof self&&"fetch"in self?self.fetch:"undefined"!=typeof globalThis&&globalThis.fetch?globalThis.fetch:"undefined"!=typeof fetch?fetch:void debugFail("Could not find fetch implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static headers(){return this.headersImpl?this.headersImpl:"undefined"!=typeof self&&"Headers"in self?self.Headers:"undefined"!=typeof globalThis&&globalThis.Headers?globalThis.Headers:"undefined"!=typeof Headers?Headers:void debugFail("Could not find Headers implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}static response(){return this.responseImpl?this.responseImpl:"undefined"!=typeof self&&"Response"in self?self.Response:"undefined"!=typeof globalThis&&globalThis.Response?globalThis.Response:"undefined"!=typeof Response?Response:void debugFail("Could not find Response implementation, make sure you call FetchProvider.initialize() with an appropriate polyfill")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let V={CREDENTIAL_MISMATCH:"custom-token-mismatch",MISSING_CUSTOM_TOKEN:"internal-error",INVALID_IDENTIFIER:"invalid-email",MISSING_CONTINUE_URI:"internal-error",INVALID_PASSWORD:"wrong-password",MISSING_PASSWORD:"missing-password",INVALID_LOGIN_CREDENTIALS:"invalid-credential",EMAIL_EXISTS:"email-already-in-use",PASSWORD_LOGIN_DISABLED:"operation-not-allowed",INVALID_IDP_RESPONSE:"invalid-credential",INVALID_PENDING_TOKEN:"invalid-credential",FEDERATED_USER_ID_ALREADY_LINKED:"credential-already-in-use",MISSING_REQ_TYPE:"internal-error",EMAIL_NOT_FOUND:"user-not-found",RESET_PASSWORD_EXCEED_LIMIT:"too-many-requests",EXPIRED_OOB_CODE:"expired-action-code",INVALID_OOB_CODE:"invalid-action-code",MISSING_OOB_CODE:"internal-error",CREDENTIAL_TOO_OLD_LOGIN_AGAIN:"requires-recent-login",INVALID_ID_TOKEN:"invalid-user-token",TOKEN_EXPIRED:"user-token-expired",USER_NOT_FOUND:"user-token-expired",TOO_MANY_ATTEMPTS_TRY_LATER:"too-many-requests",PASSWORD_DOES_NOT_MEET_REQUIREMENTS:"password-does-not-meet-requirements",INVALID_CODE:"invalid-verification-code",INVALID_SESSION_INFO:"invalid-verification-id",INVALID_TEMPORARY_PROOF:"invalid-credential",MISSING_SESSION_INFO:"missing-verification-id",SESSION_EXPIRED:"code-expired",MISSING_ANDROID_PACKAGE_NAME:"missing-android-pkg-name",UNAUTHORIZED_DOMAIN:"unauthorized-continue-uri",INVALID_OAUTH_CLIENT_ID:"invalid-oauth-client-id",ADMIN_ONLY_OPERATION:"admin-restricted-operation",INVALID_MFA_PENDING_CREDENTIAL:"invalid-multi-factor-session",MFA_ENROLLMENT_NOT_FOUND:"multi-factor-info-not-found",MISSING_MFA_ENROLLMENT_ID:"missing-multi-factor-info",MISSING_MFA_PENDING_CREDENTIAL:"missing-multi-factor-session",SECOND_FACTOR_EXISTS:"second-factor-already-in-use",SECOND_FACTOR_LIMIT_EXCEEDED:"maximum-second-factor-count-exceeded",BLOCKING_FUNCTION_ERROR_RESPONSE:"internal-error",RECAPTCHA_NOT_ENABLED:"recaptcha-not-enabled",MISSING_RECAPTCHA_TOKEN:"missing-recaptcha-token",INVALID_RECAPTCHA_TOKEN:"invalid-recaptcha-token",INVALID_RECAPTCHA_ACTION:"invalid-recaptcha-action",MISSING_CLIENT_TYPE:"missing-client-type",MISSING_RECAPTCHA_VERSION:"missing-recaptcha-version",INVALID_RECAPTCHA_VERSION:"invalid-recaptcha-version",INVALID_REQ_TYPE:"invalid-req-type"},W=["/v1/accounts:signInWithCustomToken","/v1/accounts:signInWithEmailLink","/v1/accounts:signInWithIdp","/v1/accounts:signInWithPassword","/v1/accounts:signInWithPhoneNumber","/v1/token"],H=new Delay(3e4,6e4);function _addTidIfNecessary(e,t){return e.tenantId&&!t.tenantId?{...t,tenantId:e.tenantId}:t}async function _performApiRequest(e,t,r,i,n={}){return _performFetchWithErrorHandling(e,n,async()=>{let n={},s={};i&&("GET"===t?s=i:n={body:JSON.stringify(i)});let a=index_esm_querystring({...s,key:e.config.apiKey}).slice(1),o=await e._getAdditionalHeaders();o["Content-Type"]="application/json",e.languageCode&&(o["X-Firebase-Locale"]=e.languageCode);let l={method:t,headers:o,...n};return"undefined"!=typeof navigator&&"Cloudflare-Workers"===navigator.userAgent||(l.referrerPolicy="strict-origin-when-cross-origin"),e.emulatorConfig&&isCloudWorkstation(e.emulatorConfig.host)&&(l.credentials="include"),FetchProvider.fetch()(await _getFinalTarget(e,e.config.apiHost,r,a),l)})}async function _performFetchWithErrorHandling(e,t,r){e._canInitEmulator=!1;let i={...V,...t};try{let t=new NetworkTimeout(e),n=await Promise.race([r(),t.promise]);t.clearNetworkTimeout();let s=await n.json();if("needConfirmation"in s)throw _makeTaggedError(e,"account-exists-with-different-credential",s);if(n.ok&&!("errorMessage"in s))return s;{let t=n.ok?s.errorMessage:s.error.message,[r,a]=t.split(" : ");if("FEDERATED_USER_ID_ALREADY_LINKED"===r)throw _makeTaggedError(e,"credential-already-in-use",s);if("EMAIL_EXISTS"===r)throw _makeTaggedError(e,"email-already-in-use",s);if("USER_DISABLED"===r)throw _makeTaggedError(e,"user-disabled",s);let o=i[r]||r.toLowerCase().replace(/[_\s]+/g,"-");if(a)throw _errorWithCustomMessage(e,o,a);_fail(e,o)}}catch(t){if(t instanceof FirebaseError)throw t;_fail(e,"network-request-failed",{message:String(t)})}}async function _performSignInRequest(e,t,r,i,n={}){let s=await _performApiRequest(e,t,r,i,n);return"mfaPendingCredential"in s&&_fail(e,"multi-factor-auth-required",{_serverResponse:s}),s}async function _getFinalTarget(e,t,r,i){let n=`${t}${r}?${i}`,s=e.config.emulator?_emulatorUrl(e.config,n):`${e.config.apiScheme}://${n}`;if(W.includes(r)&&(await e._persistenceManagerAvailable,"COOKIE"===e._getPersistenceType())){let t=e._getPersistence();return t._getFinalTarget(s).toString()}return s}let NetworkTimeout=class NetworkTimeout{clearNetworkTimeout(){clearTimeout(this.timer)}constructor(e){this.auth=e,this.timer=null,this.promise=new Promise((e,t)=>{this.timer=setTimeout(()=>t(_createError(this.auth,"network-request-failed")),H.get())})}};function _makeTaggedError(e,t,r){let i={appName:e.name};r.email&&(i.email=r.email),r.phoneNumber&&(i.phoneNumber=r.phoneNumber);let n=_createError(e,t,i);return n.customData._tokenResponse=r,n}function isEnterprise(e){return void 0!==e&&void 0!==e.enterprise}let RecaptchaConfig=class RecaptchaConfig{constructor(e){if(this.siteKey="",this.recaptchaEnforcementState=[],void 0===e.recaptchaKey)throw Error("recaptchaKey undefined");this.siteKey=e.recaptchaKey.split("/")[3],this.recaptchaEnforcementState=e.recaptchaEnforcementState}getProviderEnforcementState(e){if(!this.recaptchaEnforcementState||0===this.recaptchaEnforcementState.length)return null;for(let t of this.recaptchaEnforcementState)if(t.provider&&t.provider===e)return function(e){switch(e){case"ENFORCE":return"ENFORCE";case"AUDIT":return"AUDIT";case"OFF":return"OFF";default:return"ENFORCEMENT_STATE_UNSPECIFIED"}}(t.enforcementState);return null}isProviderEnabled(e){return"ENFORCE"===this.getProviderEnforcementState(e)||"AUDIT"===this.getProviderEnforcementState(e)}isAnyProviderEnabled(){return this.isProviderEnabled("EMAIL_PASSWORD_PROVIDER")||this.isProviderEnabled("PHONE_PROVIDER")}};async function getRecaptchaConfig(e,t){return _performApiRequest(e,"GET","/v2/recaptchaConfig",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function deleteAccount(e,t){return _performApiRequest(e,"POST","/v1/accounts:delete",t)}async function getAccountInfo(e,t){return _performApiRequest(e,"POST","/v1/accounts:lookup",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function utcTimestampToDateString(e){if(e)try{let t=new Date(Number(e));if(!isNaN(t.getTime()))return t.toUTCString()}catch(e){}}async function getIdTokenResult(e,t=!1){let r=index_esm_getModularInstance(e),i=await r.getIdToken(t),n=_parseToken(i);_assert(n&&n.exp&&n.auth_time&&n.iat,r.auth,"internal-error");let s="object"==typeof n.firebase?n.firebase:void 0,a=s?.sign_in_provider;return{claims:n,token:i,authTime:utcTimestampToDateString(secondsStringToMilliseconds(n.auth_time)),issuedAtTime:utcTimestampToDateString(secondsStringToMilliseconds(n.iat)),expirationTime:utcTimestampToDateString(secondsStringToMilliseconds(n.exp)),signInProvider:a||null,signInSecondFactor:s?.sign_in_second_factor||null}}function secondsStringToMilliseconds(e){return 1e3*Number(e)}function _parseToken(e){let[t,r,i]=e.split(".");if(void 0===t||void 0===r||void 0===i)return _logError("JWT malformed, contained fewer than 3 sections"),null;try{let e=index_esm_base64Decode(r);if(!e)return _logError("Failed to decode base64 JWT payload"),null;return JSON.parse(e)}catch(e){return _logError("Caught error parsing JWT payload as JSON",e?.toString()),null}}function _tokenExpiresIn(e){let t=_parseToken(e);return _assert(t,"internal-error"),_assert(void 0!==t.exp,"internal-error"),_assert(void 0!==t.iat,"internal-error"),Number(t.exp)-Number(t.iat)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _logoutIfInvalidated(e,t,r=!1){if(r)return t;try{return await t}catch(t){throw _isUserInvalidated(t)&&e.auth.currentUser===e&&await e.auth.signOut(),t}}function _isUserInvalidated(e){return e instanceof FirebaseError&&("auth/user-disabled"===e.code||"auth/user-token-expired"===e.code)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ProactiveRefresh=class ProactiveRefresh{constructor(e){this.user=e,this.isRunning=!1,this.timerId=null,this.errorBackoff=3e4}_start(){this.isRunning||(this.isRunning=!0,this.schedule())}_stop(){this.isRunning&&(this.isRunning=!1,null!==this.timerId&&clearTimeout(this.timerId))}getInterval(e){if(e){let e=this.errorBackoff;return this.errorBackoff=Math.min(2*this.errorBackoff,96e4),e}{this.errorBackoff=3e4;let e=this.user.stsTokenManager.expirationTime??0,t=e-Date.now()-3e5;return Math.max(0,t)}}schedule(e=!1){if(!this.isRunning)return;let t=this.getInterval(e);this.timerId=setTimeout(async()=>{await this.iteration()},t)}async iteration(){try{await this.user.getIdToken(!0)}catch(e){e?.code==="auth/network-request-failed"&&this.schedule(!0);return}this.schedule()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let UserMetadata=class UserMetadata{constructor(e,t){this.createdAt=e,this.lastLoginAt=t,this._initializeTime()}_initializeTime(){this.lastSignInTime=utcTimestampToDateString(this.lastLoginAt),this.creationTime=utcTimestampToDateString(this.createdAt)}_copy(e){this.createdAt=e.createdAt,this.lastLoginAt=e.lastLoginAt,this._initializeTime()}toJSON(){return{createdAt:this.createdAt,lastLoginAt:this.lastLoginAt}}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _reloadWithoutSaving(e){let t=e.auth,r=await e.getIdToken(),i=await _logoutIfInvalidated(e,getAccountInfo(t,{idToken:r}));_assert(i?.users.length,t,"internal-error");let n=i.users[0];e._notifyReloadListener(n);let s=n.providerUserInfo?.length?extractProviderData(n.providerUserInfo):[],a=function(e,t){let r=e.filter(e=>!t.some(t=>t.providerId===e.providerId));return[...r,...t]}(e.providerData,s),o=e.isAnonymous,l=!(e.email&&n.passwordHash)&&!a?.length,c={uid:n.localId,displayName:n.displayName||null,photoURL:n.photoUrl||null,email:n.email||null,emailVerified:n.emailVerified||!1,phoneNumber:n.phoneNumber||null,tenantId:n.tenantId||null,providerData:a,metadata:new UserMetadata(n.createdAt,n.lastLoginAt),isAnonymous:!!o&&l};Object.assign(e,c)}async function reload(e){let t=index_esm_getModularInstance(e);await _reloadWithoutSaving(t),await t.auth._persistUserIfCurrent(t),t.auth._notifyListenersIfCurrent(t)}function extractProviderData(e){return e.map(({providerId:e,...t})=>({providerId:e,uid:t.rawId||"",displayName:t.displayName||null,email:t.email||null,phoneNumber:t.phoneNumber||null,photoURL:t.photoUrl||null}))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function requestStsToken(e,t){let r=await _performFetchWithErrorHandling(e,{},async()=>{let r=index_esm_querystring({grant_type:"refresh_token",refresh_token:t}).slice(1),{tokenApiHost:i,apiKey:n}=e.config,s=await _getFinalTarget(e,i,"/v1/token",`key=${n}`),a=await e._getAdditionalHeaders();a["Content-Type"]="application/x-www-form-urlencoded";let o={method:"POST",headers:a,body:r};return e.emulatorConfig&&isCloudWorkstation(e.emulatorConfig.host)&&(o.credentials="include"),FetchProvider.fetch()(s,o)});return{accessToken:r.access_token,expiresIn:r.expires_in,refreshToken:r.refresh_token}}async function revokeToken(e,t){return _performApiRequest(e,"POST","/v2/accounts:revokeToken",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let StsTokenManager=class StsTokenManager{constructor(){this.refreshToken=null,this.accessToken=null,this.expirationTime=null}get isExpired(){return!this.expirationTime||Date.now()>this.expirationTime-3e4}updateFromServerResponse(e){_assert(e.idToken,"internal-error"),_assert(void 0!==e.idToken,"internal-error"),_assert(void 0!==e.refreshToken,"internal-error");let t="expiresIn"in e&&void 0!==e.expiresIn?Number(e.expiresIn):_tokenExpiresIn(e.idToken);this.updateTokensAndExpiration(e.idToken,e.refreshToken,t)}updateFromIdToken(e){_assert(0!==e.length,"internal-error");let t=_tokenExpiresIn(e);this.updateTokensAndExpiration(e,null,t)}async getToken(e,t=!1){return t||!this.accessToken||this.isExpired?(_assert(this.refreshToken,e,"user-token-expired"),this.refreshToken)?(await this.refresh(e,this.refreshToken),this.accessToken):null:this.accessToken}clearRefreshToken(){this.refreshToken=null}async refresh(e,t){let{accessToken:r,refreshToken:i,expiresIn:n}=await requestStsToken(e,t);this.updateTokensAndExpiration(r,i,Number(n))}updateTokensAndExpiration(e,t,r){this.refreshToken=t||null,this.accessToken=e||null,this.expirationTime=Date.now()+1e3*r}static fromJSON(e,t){let{refreshToken:r,accessToken:i,expirationTime:n}=t,s=new StsTokenManager;return r&&(_assert("string"==typeof r,"internal-error",{appName:e}),s.refreshToken=r),i&&(_assert("string"==typeof i,"internal-error",{appName:e}),s.accessToken=i),n&&(_assert("number"==typeof n,"internal-error",{appName:e}),s.expirationTime=n),s}toJSON(){return{refreshToken:this.refreshToken,accessToken:this.accessToken,expirationTime:this.expirationTime}}_assign(e){this.accessToken=e.accessToken,this.refreshToken=e.refreshToken,this.expirationTime=e.expirationTime}_clone(){return Object.assign(new StsTokenManager,this.toJSON())}_performRefresh(){return debugFail("not implemented")}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function assertStringOrUndefined(e,t){_assert("string"==typeof e||void 0===e,"internal-error",{appName:t})}let UserImpl=class UserImpl{constructor({uid:e,auth:t,stsTokenManager:r,...i}){this.providerId="firebase",this.proactiveRefresh=new ProactiveRefresh(this),this.reloadUserInfo=null,this.reloadListener=null,this.uid=e,this.auth=t,this.stsTokenManager=r,this.accessToken=r.accessToken,this.displayName=i.displayName||null,this.email=i.email||null,this.emailVerified=i.emailVerified||!1,this.phoneNumber=i.phoneNumber||null,this.photoURL=i.photoURL||null,this.isAnonymous=i.isAnonymous||!1,this.tenantId=i.tenantId||null,this.providerData=i.providerData?[...i.providerData]:[],this.metadata=new UserMetadata(i.createdAt||void 0,i.lastLoginAt||void 0)}async getIdToken(e){let t=await _logoutIfInvalidated(this,this.stsTokenManager.getToken(this.auth,e));return _assert(t,this.auth,"internal-error"),this.accessToken!==t&&(this.accessToken=t,await this.auth._persistUserIfCurrent(this),this.auth._notifyListenersIfCurrent(this)),t}getIdTokenResult(e){return getIdTokenResult(this,e)}reload(){return reload(this)}_assign(e){this!==e&&(_assert(this.uid===e.uid,this.auth,"internal-error"),this.displayName=e.displayName,this.photoURL=e.photoURL,this.email=e.email,this.emailVerified=e.emailVerified,this.phoneNumber=e.phoneNumber,this.isAnonymous=e.isAnonymous,this.tenantId=e.tenantId,this.providerData=e.providerData.map(e=>({...e})),this.metadata._copy(e.metadata),this.stsTokenManager._assign(e.stsTokenManager))}_clone(e){let t=new UserImpl({...this,auth:e,stsTokenManager:this.stsTokenManager._clone()});return t.metadata._copy(this.metadata),t}_onReload(e){_assert(!this.reloadListener,this.auth,"internal-error"),this.reloadListener=e,this.reloadUserInfo&&(this._notifyReloadListener(this.reloadUserInfo),this.reloadUserInfo=null)}_notifyReloadListener(e){this.reloadListener?this.reloadListener(e):this.reloadUserInfo=e}_startProactiveRefresh(){this.proactiveRefresh._start()}_stopProactiveRefresh(){this.proactiveRefresh._stop()}async _updateTokensIfNecessary(e,t=!1){let r=!1;e.idToken&&e.idToken!==this.stsTokenManager.accessToken&&(this.stsTokenManager.updateFromServerResponse(e),r=!0),t&&await _reloadWithoutSaving(this),await this.auth._persistUserIfCurrent(this),r&&this.auth._notifyListenersIfCurrent(this)}async delete(){if(index_esm_isFirebaseServerApp(this.auth.app))return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this.auth));let e=await this.getIdToken();return await _logoutIfInvalidated(this,deleteAccount(this.auth,{idToken:e})),this.stsTokenManager.clearRefreshToken(),this.auth.signOut()}toJSON(){return{uid:this.uid,email:this.email||void 0,emailVerified:this.emailVerified,displayName:this.displayName||void 0,isAnonymous:this.isAnonymous,photoURL:this.photoURL||void 0,phoneNumber:this.phoneNumber||void 0,tenantId:this.tenantId||void 0,providerData:this.providerData.map(e=>({...e})),stsTokenManager:this.stsTokenManager.toJSON(),_redirectEventId:this._redirectEventId,...this.metadata.toJSON(),apiKey:this.auth.config.apiKey,appName:this.auth.name}}get refreshToken(){return this.stsTokenManager.refreshToken||""}static _fromJSON(e,t){let r=t.displayName??void 0,i=t.email??void 0,n=t.phoneNumber??void 0,s=t.photoURL??void 0,a=t.tenantId??void 0,o=t._redirectEventId??void 0,l=t.createdAt??void 0,c=t.lastLoginAt??void 0,{uid:d,emailVerified:u,isAnonymous:h,providerData:p,stsTokenManager:f}=t;_assert(d&&f,e,"internal-error");let m=StsTokenManager.fromJSON(this.name,f);_assert("string"==typeof d,e,"internal-error"),assertStringOrUndefined(r,e.name),assertStringOrUndefined(i,e.name),_assert("boolean"==typeof u,e,"internal-error"),_assert("boolean"==typeof h,e,"internal-error"),assertStringOrUndefined(n,e.name),assertStringOrUndefined(s,e.name),assertStringOrUndefined(a,e.name),assertStringOrUndefined(o,e.name),assertStringOrUndefined(l,e.name),assertStringOrUndefined(c,e.name);let g=new UserImpl({uid:d,auth:e,email:i,emailVerified:u,displayName:r,isAnonymous:h,photoURL:s,phoneNumber:n,tenantId:a,stsTokenManager:m,createdAt:l,lastLoginAt:c});return p&&Array.isArray(p)&&(g.providerData=p.map(e=>({...e}))),o&&(g._redirectEventId=o),g}static async _fromIdTokenResponse(e,t,r=!1){let i=new StsTokenManager;i.updateFromServerResponse(t);let n=new UserImpl({uid:t.localId,auth:e,stsTokenManager:i,isAnonymous:r});return await _reloadWithoutSaving(n),n}static async _fromGetAccountInfoResponse(e,t,r){let i=t.users[0];_assert(void 0!==i.localId,"internal-error");let n=void 0!==i.providerUserInfo?extractProviderData(i.providerUserInfo):[],s=!(i.email&&i.passwordHash)&&!n?.length,a=new StsTokenManager;a.updateFromIdToken(r);let o=new UserImpl({uid:i.localId,auth:e,stsTokenManager:a,isAnonymous:s}),l={uid:i.localId,displayName:i.displayName||null,photoURL:i.photoUrl||null,email:i.email||null,emailVerified:i.emailVerified||!1,phoneNumber:i.phoneNumber||null,tenantId:i.tenantId||null,providerData:n,metadata:new UserMetadata(i.createdAt,i.lastLoginAt),isAnonymous:!(i.email&&i.passwordHash)&&!n?.length};return Object.assign(o,l),o}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let z=new Map;function _getInstance(e){e instanceof Function||debugFail("Expected a class definition");let t=z.get(e);return t?t instanceof e||debugFail("Instance stored in cache mismatched with class"):(t=new e,z.set(e,t)),t}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let InMemoryPersistence=class InMemoryPersistence{constructor(){this.type="NONE",this.storage={}}async _isAvailable(){return!0}async _set(e,t){this.storage[e]=t}async _get(e){let t=this.storage[e];return void 0===t?null:t}async _remove(e){delete this.storage[e]}_addListener(e,t){}_removeListener(e,t){}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _persistenceKeyName(e,t,r){return`firebase:${e}:${t}:${r}`}InMemoryPersistence.type="NONE";let PersistenceUserManager=class PersistenceUserManager{constructor(e,t,r){this.persistence=e,this.auth=t,this.userKey=r;let{config:i,name:n}=this.auth;this.fullUserKey=_persistenceKeyName(this.userKey,i.apiKey,n),this.fullPersistenceKey=_persistenceKeyName("persistence",i.apiKey,n),this.boundEventHandler=t._onStorageEvent.bind(t);try{this.persistence._addListener(this.fullUserKey,this.boundEventHandler)}catch{}}setCurrentUser(e){return this.persistence._set(this.fullUserKey,e.toJSON())}async getCurrentUser(){let e=await this.persistence._get(this.fullUserKey);if(!e)return null;if("string"==typeof e){let t=await getAccountInfo(this.auth,{idToken:e}).catch(()=>void 0);return t?UserImpl._fromGetAccountInfoResponse(this.auth,t,e):null}return UserImpl._fromJSON(this.auth,e)}removeCurrentUser(){return this.persistence._remove(this.fullUserKey)}savePersistenceForRedirect(){return this.persistence._set(this.fullPersistenceKey,this.persistence.type)}async setPersistence(e){if(this.persistence===e)return;let t=await this.getCurrentUser();if(await this.removeCurrentUser(),this.persistence=e,t)return this.setCurrentUser(t)}delete(){try{this.persistence._removeListener(this.fullUserKey,this.boundEventHandler)}catch{}}static async create(e,t,r="authUser"){if(!t.length)return new PersistenceUserManager(_getInstance(InMemoryPersistence),e,r);let i=(await Promise.all(t.map(async e=>{try{if(await e._isAvailable())return e}catch{}}))).filter(e=>e),n=i[0]||_getInstance(InMemoryPersistence),s=_persistenceKeyName(r,e.config.apiKey,e.name),a=null;for(let r of t)try{let t=await r._get(s);if(t){let i;if("string"==typeof t){let r=await getAccountInfo(e,{idToken:t}).catch(()=>void 0);if(!r)break;i=await UserImpl._fromGetAccountInfoResponse(e,r,t)}else i=UserImpl._fromJSON(e,t);r!==n&&(a=i),n=r;break}}catch{}let o=i.filter(e=>e._shouldAllowMigration);return n._shouldAllowMigration&&o.length&&(n=o[0],a&&await n._set(s,a.toJSON()),await Promise.all(t.map(async e=>{if(e!==n)try{await e._remove(s)}catch{}}))),new PersistenceUserManager(n,e,r)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getBrowserName(e){let t=e.toLowerCase();if(t.includes("opera/")||t.includes("opr/")||t.includes("opios/"))return"Opera";if(_isIEMobile(t))return"IEMobile";if(t.includes("msie")||t.includes("trident/"))return"IE";{if(t.includes("edge/"))return"Edge";if(_isFirefox(t))return"Firefox";if(t.includes("silk/"))return"Silk";if(_isBlackBerry(t))return"Blackberry";if(_isWebOS(t))return"Webos";if(_isSafari(t))return"Safari";if((t.includes("chrome/")||_isChromeIOS(t))&&!t.includes("edge/"))return"Chrome";if(_isAndroid(t))return"Android";let r=e.match(/([a-zA-Z\d\.]+)\/[a-zA-Z\d\.]*$/);if(r?.length===2)return r[1]}return"Other"}function _isFirefox(e=index_esm_getUA()){return/firefox\//i.test(e)}function _isSafari(e=index_esm_getUA()){let t=e.toLowerCase();return t.includes("safari/")&&!t.includes("chrome/")&&!t.includes("crios/")&&!t.includes("android")}function _isChromeIOS(e=index_esm_getUA()){return/crios\//i.test(e)}function _isIEMobile(e=index_esm_getUA()){return/iemobile/i.test(e)}function _isAndroid(e=index_esm_getUA()){return/android/i.test(e)}function _isBlackBerry(e=index_esm_getUA()){return/blackberry/i.test(e)}function _isWebOS(e=index_esm_getUA()){return/webos/i.test(e)}function _isIOS(e=index_esm_getUA()){return/iphone|ipad|ipod/i.test(e)||/macintosh/i.test(e)&&/mobile/i.test(e)}function _isMobileBrowser(e=index_esm_getUA()){return _isIOS(e)||_isAndroid(e)||_isWebOS(e)||_isBlackBerry(e)||/windows phone/i.test(e)||_isIEMobile(e)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _getClientVersion(e,t=[]){let r;switch(e){case"Browser":r=_getBrowserName(index_esm_getUA());break;case"Worker":r=`${_getBrowserName(index_esm_getUA())}-${e}`;break;default:r=e}let i=t.length?t.join(","):"FirebaseCore-web";return`${r}/JsCore/${L}/${i}`}/**
 * @license
 * Copyright 2022 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthMiddlewareQueue=class AuthMiddlewareQueue{constructor(e){this.auth=e,this.queue=[]}pushCallback(e,t){let wrappedCallback=t=>new Promise((r,i)=>{try{let i=e(t);r(i)}catch(e){i(e)}});wrappedCallback.onAbort=t,this.queue.push(wrappedCallback);let r=this.queue.length-1;return()=>{this.queue[r]=()=>Promise.resolve()}}async runMiddleware(e){if(this.auth.currentUser===e)return;let t=[];try{for(let r of this.queue)await r(e),r.onAbort&&t.push(r.onAbort)}catch(e){for(let e of(t.reverse(),t))try{e()}catch(e){}throw this.auth._errorFactory.create("login-blocked",{originalMessage:e?.message})}}};/**
 * @license
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _getPasswordPolicy(e,t={}){return _performApiRequest(e,"GET","/v2/passwordPolicy",_addTidIfNecessary(e,t))}let PasswordPolicyImpl=class PasswordPolicyImpl{constructor(e){let t=e.customStrengthOptions;this.customStrengthOptions={},this.customStrengthOptions.minPasswordLength=t.minPasswordLength??6,t.maxPasswordLength&&(this.customStrengthOptions.maxPasswordLength=t.maxPasswordLength),void 0!==t.containsLowercaseCharacter&&(this.customStrengthOptions.containsLowercaseLetter=t.containsLowercaseCharacter),void 0!==t.containsUppercaseCharacter&&(this.customStrengthOptions.containsUppercaseLetter=t.containsUppercaseCharacter),void 0!==t.containsNumericCharacter&&(this.customStrengthOptions.containsNumericCharacter=t.containsNumericCharacter),void 0!==t.containsNonAlphanumericCharacter&&(this.customStrengthOptions.containsNonAlphanumericCharacter=t.containsNonAlphanumericCharacter),this.enforcementState=e.enforcementState,"ENFORCEMENT_STATE_UNSPECIFIED"===this.enforcementState&&(this.enforcementState="OFF"),this.allowedNonAlphanumericCharacters=e.allowedNonAlphanumericCharacters?.join("")??"",this.forceUpgradeOnSignin=e.forceUpgradeOnSignin??!1,this.schemaVersion=e.schemaVersion}validatePassword(e){let t={isValid:!0,passwordPolicy:this};return this.validatePasswordLengthOptions(e,t),this.validatePasswordCharacterOptions(e,t),t.isValid&&(t.isValid=t.meetsMinPasswordLength??!0),t.isValid&&(t.isValid=t.meetsMaxPasswordLength??!0),t.isValid&&(t.isValid=t.containsLowercaseLetter??!0),t.isValid&&(t.isValid=t.containsUppercaseLetter??!0),t.isValid&&(t.isValid=t.containsNumericCharacter??!0),t.isValid&&(t.isValid=t.containsNonAlphanumericCharacter??!0),t}validatePasswordLengthOptions(e,t){let r=this.customStrengthOptions.minPasswordLength,i=this.customStrengthOptions.maxPasswordLength;r&&(t.meetsMinPasswordLength=e.length>=r),i&&(t.meetsMaxPasswordLength=e.length<=i)}validatePasswordCharacterOptions(e,t){let r;this.updatePasswordCharacterOptionsStatuses(t,!1,!1,!1,!1);for(let i=0;i<e.length;i++)r=e.charAt(i),this.updatePasswordCharacterOptionsStatuses(t,r>="a"&&r<="z",r>="A"&&r<="Z",r>="0"&&r<="9",this.allowedNonAlphanumericCharacters.includes(r))}updatePasswordCharacterOptionsStatuses(e,t,r,i,n){this.customStrengthOptions.containsLowercaseLetter&&(e.containsLowercaseLetter||(e.containsLowercaseLetter=t)),this.customStrengthOptions.containsUppercaseLetter&&(e.containsUppercaseLetter||(e.containsUppercaseLetter=r)),this.customStrengthOptions.containsNumericCharacter&&(e.containsNumericCharacter||(e.containsNumericCharacter=i)),this.customStrengthOptions.containsNonAlphanumericCharacter&&(e.containsNonAlphanumericCharacter||(e.containsNonAlphanumericCharacter=n))}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthImpl=class AuthImpl{constructor(e,t,r,i){this.app=e,this.heartbeatServiceProvider=t,this.appCheckServiceProvider=r,this.config=i,this.currentUser=null,this.emulatorConfig=null,this.operations=Promise.resolve(),this.authStateSubscription=new Subscription(this),this.idTokenSubscription=new Subscription(this),this.beforeStateQueue=new AuthMiddlewareQueue(this),this.redirectUser=null,this.isProactiveRefreshEnabled=!1,this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION=1,this._canInitEmulator=!0,this._isInitialized=!1,this._deleted=!1,this._initializationPromise=null,this._popupRedirectResolver=null,this._errorFactory=U,this._agentRecaptchaConfig=null,this._tenantRecaptchaConfigs={},this._projectPasswordPolicy=null,this._tenantPasswordPolicies={},this._resolvePersistenceManagerAvailable=void 0,this.lastNotifiedUid=void 0,this.languageCode=null,this.tenantId=null,this.settings={appVerificationDisabledForTesting:!1},this.frameworks=[],this.name=e.name,this.clientVersion=i.sdkClientVersion,this._persistenceManagerAvailable=new Promise(e=>this._resolvePersistenceManagerAvailable=e)}_initializeWithPersistence(e,t){return t&&(this._popupRedirectResolver=_getInstance(t)),this._initializationPromise=this.queue(async()=>{if(!this._deleted){try{this.persistenceManager=await PersistenceUserManager.create(this,e)}catch(e){_logWarn(`Failed to initialize persistence: ${e}`),this.persistenceManager=await PersistenceUserManager.create(this,[])}finally{this._resolvePersistenceManagerAvailable?.()}if(!this._deleted){if(this._popupRedirectResolver?._shouldInitProactively)try{await this._popupRedirectResolver._initialize(this)}catch(e){}try{await this.initializeCurrentUser(t)}catch(e){_logWarn(`Failed to initialize current user: ${e}`),await this.directlySetCurrentUser(null).catch(()=>{})}this.lastNotifiedUid=this.currentUser?.uid||null,this._deleted||(this._isInitialized=!0)}}}),this._initializationPromise}async _onStorageEvent(){if(this._deleted)return;let e=await this.assertedPersistence.getCurrentUser();if(this.currentUser||e){if(this.currentUser&&e&&this.currentUser.uid===e.uid){this._currentUser._assign(e),await this.currentUser.getIdToken();return}await this._updateCurrentUser(e,!0)}}async initializeCurrentUserFromIdToken(e){try{let t=await getAccountInfo(this,{idToken:e}),r=await UserImpl._fromGetAccountInfoResponse(this,t,e);await this.directlySetCurrentUser(r)}catch(e){console.warn("FirebaseServerApp could not login user with provided authIdToken: ",e),await this.directlySetCurrentUser(null)}}async initializeCurrentUser(e){if(index_esm_isFirebaseServerApp(this.app)){let e=this.app.settings.authIdToken;return e?new Promise(t=>{setTimeout(()=>this.initializeCurrentUserFromIdToken(e).then(t,t))}):this.directlySetCurrentUser(null)}let t=await this.assertedPersistence.getCurrentUser(),r=t,i=!1;if(e&&this.config.authDomain){await this.getOrInitRedirectPersistenceManager();let t=this.redirectUser?._redirectEventId,n=r?._redirectEventId,s=await this.tryRedirectSignIn(e);(!t||t===n)&&s?.user&&(r=s.user,i=!0)}if(!r)return this.directlySetCurrentUser(null);if(!r._redirectEventId){if(i)try{await this.beforeStateQueue.runMiddleware(r)}catch(e){r=t,this._popupRedirectResolver._overrideRedirectResult(this,()=>Promise.reject(e))}return r?this.reloadAndSetCurrentUserOrClear(r):this.directlySetCurrentUser(null)}return(_assert(this._popupRedirectResolver,this,"argument-error"),await this.getOrInitRedirectPersistenceManager(),this.redirectUser&&this.redirectUser._redirectEventId===r._redirectEventId)?this.directlySetCurrentUser(r):this.reloadAndSetCurrentUserOrClear(r)}async tryRedirectSignIn(e){let t=null;try{t=await this._popupRedirectResolver._completeRedirectFn(this,e,!0)}catch(e){await this._setRedirectUser(null)}return t}async reloadAndSetCurrentUserOrClear(e){try{await _reloadWithoutSaving(e)}catch(e){if(_isUserInvalidated(e))return this.directlySetCurrentUser(null)}return this.directlySetCurrentUser(e)}useDeviceLanguage(){this.languageCode=function(){if("undefined"==typeof navigator)return null;let e=navigator;return e.languages&&e.languages[0]||e.language||null}()}async _delete(){this._deleted=!0}async updateCurrentUser(e){if(index_esm_isFirebaseServerApp(this.app))return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this));let t=e?index_esm_getModularInstance(e):null;return t&&_assert(t.auth.config.apiKey===this.config.apiKey,this,"invalid-user-token"),this._updateCurrentUser(t&&t._clone(this))}async _updateCurrentUser(e,t=!1){if(!this._deleted)return e&&_assert(this.tenantId===e.tenantId,this,"tenant-id-mismatch"),t||await this.beforeStateQueue.runMiddleware(e),this.queue(async()=>{await this.directlySetCurrentUser(e),this.notifyAuthListeners()})}async signOut(){return index_esm_isFirebaseServerApp(this.app)?Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this)):(await this.beforeStateQueue.runMiddleware(null),(this.redirectPersistenceManager||this._popupRedirectResolver)&&await this._setRedirectUser(null),this._updateCurrentUser(null,!0))}setPersistence(e){return index_esm_isFirebaseServerApp(this.app)?Promise.reject(_serverAppCurrentUserOperationNotSupportedError(this)):this.queue(async()=>{await this.assertedPersistence.setPersistence(_getInstance(e))})}_getRecaptchaConfig(){return null==this.tenantId?this._agentRecaptchaConfig:this._tenantRecaptchaConfigs[this.tenantId]}async validatePassword(e){this._getPasswordPolicyInternal()||await this._updatePasswordPolicy();let t=this._getPasswordPolicyInternal();return t.schemaVersion!==this.EXPECTED_PASSWORD_POLICY_SCHEMA_VERSION?Promise.reject(this._errorFactory.create("unsupported-password-policy-schema-version",{})):t.validatePassword(e)}_getPasswordPolicyInternal(){return null===this.tenantId?this._projectPasswordPolicy:this._tenantPasswordPolicies[this.tenantId]}async _updatePasswordPolicy(){let e=await _getPasswordPolicy(this),t=new PasswordPolicyImpl(e);null===this.tenantId?this._projectPasswordPolicy=t:this._tenantPasswordPolicies[this.tenantId]=t}_getPersistenceType(){return this.assertedPersistence.persistence.type}_getPersistence(){return this.assertedPersistence.persistence}_updateErrorMap(e){this._errorFactory=new ErrorFactory("auth","Firebase",e())}onAuthStateChanged(e,t,r){return this.registerStateListener(this.authStateSubscription,e,t,r)}beforeAuthStateChanged(e,t){return this.beforeStateQueue.pushCallback(e,t)}onIdTokenChanged(e,t,r){return this.registerStateListener(this.idTokenSubscription,e,t,r)}authStateReady(){return new Promise((e,t)=>{if(this.currentUser)e();else{let r=this.onAuthStateChanged(()=>{r(),e()},t)}})}async revokeAccessToken(e){if(this.currentUser){let t=await this.currentUser.getIdToken(),r={providerId:"apple.com",tokenType:"ACCESS_TOKEN",token:e,idToken:t};null!=this.tenantId&&(r.tenantId=this.tenantId),await revokeToken(this,r)}}toJSON(){return{apiKey:this.config.apiKey,authDomain:this.config.authDomain,appName:this.name,currentUser:this._currentUser?.toJSON()}}async _setRedirectUser(e,t){let r=await this.getOrInitRedirectPersistenceManager(t);return null===e?r.removeCurrentUser():r.setCurrentUser(e)}async getOrInitRedirectPersistenceManager(e){if(!this.redirectPersistenceManager){let t=e&&_getInstance(e)||this._popupRedirectResolver;_assert(t,this,"argument-error"),this.redirectPersistenceManager=await PersistenceUserManager.create(this,[_getInstance(t._redirectPersistence)],"redirectUser"),this.redirectUser=await this.redirectPersistenceManager.getCurrentUser()}return this.redirectPersistenceManager}async _redirectUserForId(e){return(this._isInitialized&&await this.queue(async()=>{}),this._currentUser?._redirectEventId===e)?this._currentUser:this.redirectUser?._redirectEventId===e?this.redirectUser:null}async _persistUserIfCurrent(e){if(e===this.currentUser)return this.queue(async()=>this.directlySetCurrentUser(e))}_notifyListenersIfCurrent(e){e===this.currentUser&&this.notifyAuthListeners()}_key(){return`${this.config.authDomain}:${this.config.apiKey}:${this.name}`}_startProactiveRefresh(){this.isProactiveRefreshEnabled=!0,this.currentUser&&this._currentUser._startProactiveRefresh()}_stopProactiveRefresh(){this.isProactiveRefreshEnabled=!1,this.currentUser&&this._currentUser._stopProactiveRefresh()}get _currentUser(){return this.currentUser}notifyAuthListeners(){if(!this._isInitialized)return;this.idTokenSubscription.next(this.currentUser);let e=this.currentUser?.uid??null;this.lastNotifiedUid!==e&&(this.lastNotifiedUid=e,this.authStateSubscription.next(this.currentUser))}registerStateListener(e,t,r,i){if(this._deleted)return()=>{};let n="function"==typeof t?t:t.next.bind(t),s=!1,a=this._isInitialized?Promise.resolve():this._initializationPromise;if(_assert(a,this,"internal-error"),a.then(()=>{s||n(this.currentUser)}).catch(e=>{if(!s){if("function"!=typeof t&&t.error)t.error(e);else if(r)r(e);else throw e}}),"function"==typeof t){let n=e.addObserver(t,r,i);return()=>{s=!0,n()}}{let r=e.addObserver(t);return()=>{s=!0,r()}}}async directlySetCurrentUser(e){if(this.currentUser&&this.currentUser!==e&&this._currentUser._stopProactiveRefresh(),e&&this.isProactiveRefreshEnabled&&e._startProactiveRefresh(),this.currentUser=e,this.persistenceManager)try{e?await this.persistenceManager.setCurrentUser(e):await this.persistenceManager.removeCurrentUser()}catch(r){let e=r?.message||String(r),t=_errorWithCustomMessage(this,"internal-error",`An internal AuthError has occurred: ${e}`);throw t.customData={originalError:r},t}}queue(e){return this.operations=this.operations.then(e,e),this.operations}get assertedPersistence(){return _assert(this.persistenceManager,this,"internal-error"),this.persistenceManager}_logFramework(e){!e||this.frameworks.includes(e)||(this.frameworks.push(e),this.frameworks.sort(),this.clientVersion=_getClientVersion(this.config.clientPlatform,this._getFrameworks()))}_getFrameworks(){return this.frameworks}async _getAdditionalHeaders(){let e={"X-Client-Version":this.clientVersion};this.app.options.appId&&(e["X-Firebase-gmpid"]=this.app.options.appId);let t=await this.heartbeatServiceProvider.getImmediate({optional:!0})?.getHeartbeatsHeader();t&&(e["X-Firebase-Client"]=t);let r=await this._getAppCheckToken();return r&&(e["X-Firebase-AppCheck"]=r),e}async _getAppCheckToken(){if(index_esm_isFirebaseServerApp(this.app)&&this.app.settings.appCheckToken)return this.app.settings.appCheckToken;let e=await this.appCheckServiceProvider.getImmediate({optional:!0})?.getToken();return e?.error&&_logWarn(`Error while retrieving App Check token: ${e.error}`),e?.token}};let Subscription=class Subscription{constructor(e){this.auth=e,this.observer=null,this.addObserver=function(e,t){let r=new ObserverProxy(e,void 0);return r.subscribe.bind(r)}(e=>this.observer=e)}get next(){return _assert(this.observer,this.auth,"internal-error"),this.observer.next.bind(this.observer)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let G={async loadJS(){throw Error("Unable to load external scripts")},recaptchaV2Script:"",recaptchaEnterpriseScript:"",gapiScript:""};function _generateCallbackName(e){return`__${e}${Math.floor(1e6*Math.random())}`}let MockGreCAPTCHATopLevel=class MockGreCAPTCHATopLevel{constructor(){this.enterprise=new MockGreCAPTCHA}ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};let MockGreCAPTCHA=class MockGreCAPTCHA{ready(e){e()}execute(e,t){return Promise.resolve("token")}render(e,t){return""}};let q="NO_RECAPTCHA",$="onFirebaseAuthREInstanceReady";let RecaptchaEnterpriseVerifier=class RecaptchaEnterpriseVerifier{constructor(e){this.type="recaptcha-enterprise",this.auth=index_esm_getModularInstance(e)}async verify(e="verify",t=!1){async function retrieveSiteKey(e){if(!t){if(null==e.tenantId&&null!=e._agentRecaptchaConfig)return e._agentRecaptchaConfig.siteKey;if(null!=e.tenantId&&void 0!==e._tenantRecaptchaConfigs[e.tenantId])return e._tenantRecaptchaConfigs[e.tenantId].siteKey}return new Promise(async(t,r)=>{getRecaptchaConfig(e,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}).then(i=>{if(void 0===i.recaptchaKey)r(Error("recaptcha Enterprise site key undefined"));else{let r=new RecaptchaConfig(i);return null==e.tenantId?e._agentRecaptchaConfig=r:e._tenantRecaptchaConfigs[e.tenantId]=r,t(r.siteKey)}}).catch(e=>{r(e)})})}function retrieveRecaptchaToken(t,r,i){let n=window.grecaptcha;isEnterprise(n)?n.enterprise.ready(()=>{n.enterprise.execute(t,{action:e}).then(e=>{r(e)}).catch(()=>{r(q)})}):i(Error("No reCAPTCHA enterprise script loaded."))}if(this.auth.settings.appVerificationDisabledForTesting){let e=new MockGreCAPTCHATopLevel;return e.execute("siteKey",{action:"verify"})}return new Promise((e,r)=>{retrieveSiteKey(this.auth).then(async i=>{if(!t&&isEnterprise(window.grecaptcha)&&RecaptchaEnterpriseVerifier.scriptInjectionDeferred)await RecaptchaEnterpriseVerifier.scriptInjectionDeferred.promise,retrieveRecaptchaToken(i,e,r);else{var n;if("undefined"==typeof window){r(Error("RecaptchaVerifier is only supported in browser"));return}let t=G.recaptchaEnterpriseScript;0!==t.length&&(t+=i+`&onload=${$}`),RecaptchaEnterpriseVerifier.scriptInjectionDeferred=new Deferred,window[$]=()=>{RecaptchaEnterpriseVerifier.scriptInjectionDeferred?.resolve()},(n=t,G.loadJS(n)).then(()=>RecaptchaEnterpriseVerifier.scriptInjectionDeferred?.promise).then(()=>{retrieveRecaptchaToken(i,e,r)}).catch(e=>{r(e)})}}).catch(e=>{r(e)})})}};async function injectRecaptchaFields(e,t,r,i=!1,n=!1){let s;let a=new RecaptchaEnterpriseVerifier(e);if(n)s=q;else try{s=await a.verify(r)}catch(e){s=await a.verify(r,!0)}let o={...t};if("mfaSmsEnrollment"===r||"mfaSmsSignIn"===r){if("phoneEnrollmentInfo"in o){let e=o.phoneEnrollmentInfo.phoneNumber,t=o.phoneEnrollmentInfo.recaptchaToken;Object.assign(o,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:t,captchaResponse:s,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}else if("phoneSignInInfo"in o){let e=o.phoneSignInInfo.recaptchaToken;Object.assign(o,{phoneSignInInfo:{recaptchaToken:e,captchaResponse:s,clientType:"CLIENT_TYPE_WEB",recaptchaVersion:"RECAPTCHA_ENTERPRISE"}})}return o}return i?Object.assign(o,{captchaResp:s}):Object.assign(o,{captchaResponse:s}),Object.assign(o,{clientType:"CLIENT_TYPE_WEB"}),Object.assign(o,{recaptchaVersion:"RECAPTCHA_ENTERPRISE"}),o}async function handleRecaptchaFlow(e,t,r,i,n){if("EMAIL_PASSWORD_PROVIDER"===n){if(!e._getRecaptchaConfig()?.isProviderEnabled("EMAIL_PASSWORD_PROVIDER"))return i(e,t).catch(async n=>{if("auth/missing-recaptcha-token"!==n.code)return Promise.reject(n);{console.log(`${r} is protected by reCAPTCHA Enterprise for this project. Automatically triggering the reCAPTCHA flow and restarting the flow.`);let n=await injectRecaptchaFields(e,t,r,"getOobCode"===r);return i(e,n)}});{let n=await injectRecaptchaFields(e,t,r,"getOobCode"===r);return i(e,n)}}if("PHONE_PROVIDER"!==n)return Promise.reject(n+" provider is not supported.");if(e._getRecaptchaConfig()?.isProviderEnabled("PHONE_PROVIDER")){let n=await injectRecaptchaFields(e,t,r);return i(e,n).catch(async n=>{if(e._getRecaptchaConfig()?.getProviderEnforcementState("PHONE_PROVIDER")==="AUDIT"&&("auth/missing-recaptcha-token"===n.code||"auth/invalid-app-credential"===n.code)){console.log(`Failed to verify with reCAPTCHA Enterprise. Automatically triggering the reCAPTCHA v2 flow to complete the ${r} flow.`);let n=await injectRecaptchaFields(e,t,r,!1,!0);return i(e,n)}return Promise.reject(n)})}{let n=await injectRecaptchaFields(e,t,r,!1,!0);return i(e,n)}}async function _initializeRecaptchaConfig(e){let t=index_esm_getModularInstance(e),r=await getRecaptchaConfig(t,{clientType:"CLIENT_TYPE_WEB",version:"RECAPTCHA_ENTERPRISE"}),i=new RecaptchaConfig(r);if(null==t.tenantId?t._agentRecaptchaConfig=i:t._tenantRecaptchaConfigs[t.tenantId]=i,i.isAnyProviderEnabled()){let e=new RecaptchaEnterpriseVerifier(t);e.verify()}}function extractProtocol(e){let t=e.indexOf(":");return t<0?"":e.substr(0,t+1)}function parsePort(e){if(!e)return null;let t=Number(e);return isNaN(t)?null:t}RecaptchaEnterpriseVerifier.scriptInjectionDeferred=null;/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthCredential=class AuthCredential{constructor(e,t){this.providerId=e,this.signInMethod=t}toJSON(){return debugFail("not implemented")}_getIdTokenResponse(e){return debugFail("not implemented")}_linkToIdToken(e,t){return debugFail("not implemented")}_getReauthenticationResolver(e){return debugFail("not implemented")}};async function linkEmailPassword(e,t){return _performApiRequest(e,"POST","/v1/accounts:signUp",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithPassword(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithPassword",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithEmailLink$1(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithEmailLink",_addTidIfNecessary(e,t))}async function signInWithEmailLinkForLinking(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithEmailLink",_addTidIfNecessary(e,t))}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let EmailAuthCredential=class EmailAuthCredential extends AuthCredential{constructor(e,t,r,i=null){super("password",r),this._email=e,this._password=t,this._tenantId=i}static _fromEmailAndPassword(e,t){return new EmailAuthCredential(e,t,"password")}static _fromEmailAndCode(e,t,r=null){return new EmailAuthCredential(e,t,"emailLink",r)}toJSON(){return{email:this._email,password:this._password,signInMethod:this.signInMethod,tenantId:this._tenantId}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e;if(t?.email&&t?.password){if("password"===t.signInMethod)return this._fromEmailAndPassword(t.email,t.password);if("emailLink"===t.signInMethod)return this._fromEmailAndCode(t.email,t.password,t.tenantId)}return null}async _getIdTokenResponse(e){switch(this.signInMethod){case"password":let t={returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return handleRecaptchaFlow(e,t,"signInWithPassword",signInWithPassword,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return signInWithEmailLink$1(e,{email:this._email,oobCode:this._password});default:_fail(e,"internal-error")}}async _linkToIdToken(e,t){switch(this.signInMethod){case"password":let r={idToken:t,returnSecureToken:!0,email:this._email,password:this._password,clientType:"CLIENT_TYPE_WEB"};return handleRecaptchaFlow(e,r,"signUpPassword",linkEmailPassword,"EMAIL_PASSWORD_PROVIDER");case"emailLink":return signInWithEmailLinkForLinking(e,{idToken:t,email:this._email,oobCode:this._password});default:_fail(e,"internal-error")}}_getReauthenticationResolver(e){return this._getIdTokenResponse(e)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function signInWithIdp(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithIdp",_addTidIfNecessary(e,t))}let OAuthCredential=class OAuthCredential extends AuthCredential{constructor(){super(...arguments),this.pendingToken=null}static _fromParams(e){let t=new OAuthCredential(e.providerId,e.signInMethod);return e.idToken||e.accessToken?(e.idToken&&(t.idToken=e.idToken),e.accessToken&&(t.accessToken=e.accessToken),e.nonce&&!e.pendingToken&&(t.nonce=e.nonce),e.pendingToken&&(t.pendingToken=e.pendingToken)):e.oauthToken&&e.oauthTokenSecret?(t.accessToken=e.oauthToken,t.secret=e.oauthTokenSecret):_fail("argument-error"),t}toJSON(){return{idToken:this.idToken,accessToken:this.accessToken,secret:this.secret,nonce:this.nonce,pendingToken:this.pendingToken,providerId:this.providerId,signInMethod:this.signInMethod}}static fromJSON(e){let t="string"==typeof e?JSON.parse(e):e,{providerId:r,signInMethod:i,...n}=t;if(!r||!i)return null;let s=new OAuthCredential(r,i);return s.idToken=n.idToken||void 0,s.accessToken=n.accessToken||void 0,s.secret=n.secret,s.nonce=n.nonce,s.pendingToken=n.pendingToken||null,s}_getIdTokenResponse(e){let t=this.buildRequest();return signInWithIdp(e,t)}_linkToIdToken(e,t){let r=this.buildRequest();return r.idToken=t,signInWithIdp(e,r)}_getReauthenticationResolver(e){let t=this.buildRequest();return t.autoCreate=!1,signInWithIdp(e,t)}buildRequest(){let e={requestUri:"http://localhost",returnSecureToken:!0};if(this.pendingToken)e.pendingToken=this.pendingToken;else{let t={};this.idToken&&(t.id_token=this.idToken),this.accessToken&&(t.access_token=this.accessToken),this.secret&&(t.oauth_token_secret=this.secret),t.providerId=this.providerId,this.nonce&&!this.pendingToken&&(t.nonce=this.nonce),e.postBody=index_esm_querystring(t)}return e}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function sendPhoneVerificationCode(e,t){return _performApiRequest(e,"POST","/v1/accounts:sendVerificationCode",_addTidIfNecessary(e,t))}async function signInWithPhoneNumber$1(e,t){return _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,t))}async function linkWithPhoneNumber$1(e,t){let r=await _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,t));if(r.temporaryProof)throw _makeTaggedError(e,"account-exists-with-different-credential",r);return r}let K={USER_NOT_FOUND:"user-not-found"};async function verifyPhoneNumberForExisting(e,t){let r={...t,operation:"REAUTH"};return _performSignInRequest(e,"POST","/v1/accounts:signInWithPhoneNumber",_addTidIfNecessary(e,r),K)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PhoneAuthCredential=class PhoneAuthCredential extends AuthCredential{constructor(e){super("phone","phone"),this.params=e}static _fromVerification(e,t){return new PhoneAuthCredential({verificationId:e,verificationCode:t})}static _fromTokenResponse(e,t){return new PhoneAuthCredential({phoneNumber:e,temporaryProof:t})}_getIdTokenResponse(e){return signInWithPhoneNumber$1(e,this._makeVerificationRequest())}_linkToIdToken(e,t){return linkWithPhoneNumber$1(e,{idToken:t,...this._makeVerificationRequest()})}_getReauthenticationResolver(e){return verifyPhoneNumberForExisting(e,this._makeVerificationRequest())}_makeVerificationRequest(){let{temporaryProof:e,phoneNumber:t,verificationId:r,verificationCode:i}=this.params;return e&&t?{temporaryProof:e,phoneNumber:t}:{sessionInfo:r,code:i}}toJSON(){let e={providerId:this.providerId};return this.params.phoneNumber&&(e.phoneNumber=this.params.phoneNumber),this.params.temporaryProof&&(e.temporaryProof=this.params.temporaryProof),this.params.verificationCode&&(e.verificationCode=this.params.verificationCode),this.params.verificationId&&(e.verificationId=this.params.verificationId),e}static fromJSON(e){"string"==typeof e&&(e=JSON.parse(e));let{verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:n}=e;return r||t||i||n?new PhoneAuthCredential({verificationId:t,verificationCode:r,phoneNumber:i,temporaryProof:n}):null}};let ActionCodeURL=class ActionCodeURL{constructor(e){let t=querystringDecode(extractQuerystring(e)),r=t.apiKey??null,i=t.oobCode??null,n=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){switch(e){case"recoverEmail":return"RECOVER_EMAIL";case"resetPassword":return"PASSWORD_RESET";case"signIn":return"EMAIL_SIGNIN";case"verifyEmail":return"VERIFY_EMAIL";case"verifyAndChangeEmail":return"VERIFY_AND_CHANGE_EMAIL";case"revertSecondFactorAddition":return"REVERT_SECOND_FACTOR_ADDITION";default:return null}}(t.mode??null);_assert(r&&i&&n,"argument-error"),this.apiKey=r,this.operation=n,this.code=i,this.continueUrl=t.continueUrl??null,this.languageCode=t.lang??null,this.tenantId=t.tenantId??null}static parseLink(e){let t=function(e){let t=querystringDecode(extractQuerystring(e)).link,r=t?querystringDecode(extractQuerystring(t)).deep_link_id:null,i=querystringDecode(extractQuerystring(e)).deep_link_id,n=i?querystringDecode(extractQuerystring(i)).link:null;return n||i||r||t||e}(e);try{return new ActionCodeURL(t)}catch{return null}}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let EmailAuthProvider=class EmailAuthProvider{constructor(){this.providerId=EmailAuthProvider.PROVIDER_ID}static credential(e,t){return EmailAuthCredential._fromEmailAndPassword(e,t)}static credentialWithLink(e,t){let r=ActionCodeURL.parseLink(t);return _assert(r,"argument-error"),EmailAuthCredential._fromEmailAndCode(e,r.code,r.tenantId)}};EmailAuthProvider.PROVIDER_ID="password",EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD="password",EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD="emailLink";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FederatedAuthProvider=class FederatedAuthProvider{constructor(e){this.providerId=e,this.defaultLanguageCode=null,this.customParameters={}}setDefaultLanguage(e){this.defaultLanguageCode=e}setCustomParameters(e){return this.customParameters=e,this}getCustomParameters(){return this.customParameters}};/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BaseOAuthProvider=class BaseOAuthProvider extends FederatedAuthProvider{constructor(){super(...arguments),this.scopes=[]}addScope(e){return this.scopes.includes(e)||this.scopes.push(e),this}getScopes(){return[...this.scopes]}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let FacebookAuthProvider=class FacebookAuthProvider extends BaseOAuthProvider{constructor(){super("facebook.com")}static credential(e){return OAuthCredential._fromParams({providerId:FacebookAuthProvider.PROVIDER_ID,signInMethod:FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return FacebookAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return FacebookAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return FacebookAuthProvider.credential(e.oauthAccessToken)}catch{return null}}};FacebookAuthProvider.FACEBOOK_SIGN_IN_METHOD="facebook.com",FacebookAuthProvider.PROVIDER_ID="facebook.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let GoogleAuthProvider=class GoogleAuthProvider extends BaseOAuthProvider{constructor(){super("google.com"),this.addScope("profile")}static credential(e,t){return OAuthCredential._fromParams({providerId:GoogleAuthProvider.PROVIDER_ID,signInMethod:GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD,idToken:e,accessToken:t})}static credentialFromResult(e){return GoogleAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return GoogleAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthIdToken:t,oauthAccessToken:r}=e;if(!t&&!r)return null;try{return GoogleAuthProvider.credential(t,r)}catch{return null}}};GoogleAuthProvider.GOOGLE_SIGN_IN_METHOD="google.com",GoogleAuthProvider.PROVIDER_ID="google.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let GithubAuthProvider=class GithubAuthProvider extends BaseOAuthProvider{constructor(){super("github.com")}static credential(e){return OAuthCredential._fromParams({providerId:GithubAuthProvider.PROVIDER_ID,signInMethod:GithubAuthProvider.GITHUB_SIGN_IN_METHOD,accessToken:e})}static credentialFromResult(e){return GithubAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return GithubAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e||!("oauthAccessToken"in e)||!e.oauthAccessToken)return null;try{return GithubAuthProvider.credential(e.oauthAccessToken)}catch{return null}}};GithubAuthProvider.GITHUB_SIGN_IN_METHOD="github.com",GithubAuthProvider.PROVIDER_ID="github.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let TwitterAuthProvider=class TwitterAuthProvider extends BaseOAuthProvider{constructor(){super("twitter.com")}static credential(e,t){return OAuthCredential._fromParams({providerId:TwitterAuthProvider.PROVIDER_ID,signInMethod:TwitterAuthProvider.TWITTER_SIGN_IN_METHOD,oauthToken:e,oauthTokenSecret:t})}static credentialFromResult(e){return TwitterAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return TwitterAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{oauthAccessToken:t,oauthTokenSecret:r}=e;if(!t||!r)return null;try{return TwitterAuthProvider.credential(t,r)}catch{return null}}};TwitterAuthProvider.TWITTER_SIGN_IN_METHOD="twitter.com",TwitterAuthProvider.PROVIDER_ID="twitter.com";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let UserCredentialImpl=class UserCredentialImpl{constructor(e){this.user=e.user,this.providerId=e.providerId,this._tokenResponse=e._tokenResponse,this.operationType=e.operationType}static async _fromIdTokenResponse(e,t,r,i=!1){let n=await UserImpl._fromIdTokenResponse(e,r,i),s=providerIdForResponse(r),a=new UserCredentialImpl({user:n,providerId:s,_tokenResponse:r,operationType:t});return a}static async _forOperation(e,t,r){await e._updateTokensIfNecessary(r,!0);let i=providerIdForResponse(r);return new UserCredentialImpl({user:e,providerId:i,_tokenResponse:r,operationType:t})}};function providerIdForResponse(e){return e.providerId?e.providerId:"phoneNumber"in e?"phone":null}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let MultiFactorError=class MultiFactorError extends FirebaseError{constructor(e,t,r,i){super(t.code,t.message),this.operationType=r,this.user=i,Object.setPrototypeOf(this,MultiFactorError.prototype),this.customData={appName:e.name,tenantId:e.tenantId??void 0,_serverResponse:t.customData._serverResponse,operationType:r}}static _fromErrorAndOperation(e,t,r,i){return new MultiFactorError(e,t,r,i)}};function _processCredentialSavingMfaContextIfNecessary(e,t,r,i){let n="reauthenticate"===t?r._getReauthenticationResolver(e):r._getIdTokenResponse(e);return n.catch(r=>{if("auth/multi-factor-auth-required"===r.code)throw MultiFactorError._fromErrorAndOperation(e,r,t,i);throw r})}async function _link$1(e,t,r=!1){let i=await _logoutIfInvalidated(e,t._linkToIdToken(e.auth,await e.getIdToken()),r);return UserCredentialImpl._forOperation(e,"link",i)}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _reauthenticate(e,t,r=!1){let{auth:i}=e;if(index_esm_isFirebaseServerApp(i.app))return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(i));let n="reauthenticate";try{let s=await _logoutIfInvalidated(e,_processCredentialSavingMfaContextIfNecessary(i,n,t,e),r);_assert(s.idToken,i,"internal-error");let a=_parseToken(s.idToken);_assert(a,i,"internal-error");let{sub:o}=a;return _assert(e.uid===o,i,"user-mismatch"),UserCredentialImpl._forOperation(e,n,s)}catch(e){throw e?.code==="auth/user-not-found"&&_fail(i,"user-mismatch"),e}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _signInWithCredential(e,t,r=!1){if(index_esm_isFirebaseServerApp(e.app))return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(e));let i="signIn",n=await _processCredentialSavingMfaContextIfNecessary(e,i,t),s=await UserCredentialImpl._fromIdTokenResponse(e,i,n);return r||await e._updateCurrentUser(s.user),s}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function startEnrollPhoneMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:start",_addTidIfNecessary(e,t))}new WeakMap;let J="__sak";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BrowserPersistenceClass=class BrowserPersistenceClass{constructor(e,t){this.storageRetriever=e,this.type=t}_isAvailable(){try{if(!this.storage)return Promise.resolve(!1);return this.storage.setItem(J,"1"),this.storage.removeItem(J),Promise.resolve(!0)}catch{return Promise.resolve(!1)}}_set(e,t){return this.storage.setItem(e,JSON.stringify(t)),Promise.resolve()}_get(e){let t=this.storage.getItem(e);return Promise.resolve(t?JSON.parse(t):null)}_remove(e){return this.storage.removeItem(e),Promise.resolve()}get storage(){return this.storageRetriever()}};let BrowserLocalPersistence=class BrowserLocalPersistence extends BrowserPersistenceClass{constructor(){super(()=>window.localStorage,"LOCAL"),this.boundEventHandler=(e,t)=>this.onStorageEvent(e,t),this.listeners={},this.localCache={},this.pollTimer=null,this.fallbackToPolling=_isMobileBrowser(),this._shouldAllowMigration=!0}forAllChangedKeys(e){for(let t of Object.keys(this.listeners)){let r=this.storage.getItem(t),i=this.localCache[t];r!==i&&e(t,i,r)}}onStorageEvent(e,t=!1){if(!e.key){this.forAllChangedKeys((e,t,r)=>{this.notifyListeners(e,r)});return}let r=e.key;t?this.detachListener():this.stopPolling();let triggerListeners=()=>{let e=this.storage.getItem(r);(t||this.localCache[r]!==e)&&this.notifyListeners(r,e)},i=this.storage.getItem(r);(function(){let e=index_esm_getUA();return e.indexOf("MSIE ")>=0||e.indexOf("Trident/")>=0})()&&10===document.documentMode&&i!==e.newValue&&e.newValue!==e.oldValue?setTimeout(triggerListeners,10):triggerListeners()}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let e of Array.from(r))e(t?JSON.parse(t):t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(()=>{this.forAllChangedKeys((e,t,r)=>{this.onStorageEvent(new StorageEvent("storage",{key:e,oldValue:t,newValue:r}),!0)})},1e3)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}attachListener(){window.addEventListener("storage",this.boundEventHandler)}detachListener(){window.removeEventListener("storage",this.boundEventHandler)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.fallbackToPolling?this.startPolling():this.attachListener()),this.listeners[e]||(this.listeners[e]=new Set,this.localCache[e]=this.storage.getItem(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.detachListener(),this.stopPolling())}async _set(e,t){await super._set(e,t),this.localCache[e]=JSON.stringify(t)}async _get(e){let t=await super._get(e);return this.localCache[e]=JSON.stringify(t),t}async _remove(e){await super._remove(e),delete this.localCache[e]}};BrowserLocalPersistence.type="LOCAL";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let BrowserSessionPersistence=class BrowserSessionPersistence extends BrowserPersistenceClass{constructor(){super(()=>window.sessionStorage,"SESSION")}_addListener(e,t){}_removeListener(e,t){}};BrowserSessionPersistence.type="SESSION";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Receiver=class Receiver{constructor(e){this.eventTarget=e,this.handlersMap={},this.boundEventHandler=this.handleEvent.bind(this)}static _getInstance(e){let t=this.receivers.find(t=>t.isListeningto(e));if(t)return t;let r=new Receiver(e);return this.receivers.push(r),r}isListeningto(e){return this.eventTarget===e}async handleEvent(e){let{eventId:t,eventType:r,data:i}=e.data,n=this.handlersMap[r];if(!n?.size)return;e.ports[0].postMessage({status:"ack",eventId:t,eventType:r});let s=Array.from(n).map(async t=>t(e.origin,i)),a=await Promise.all(s.map(async e=>{try{let t=await e;return{fulfilled:!0,value:t}}catch(e){return{fulfilled:!1,reason:e}}}));e.ports[0].postMessage({status:"done",eventId:t,eventType:r,response:a})}_subscribe(e,t){0===Object.keys(this.handlersMap).length&&this.eventTarget.addEventListener("message",this.boundEventHandler),this.handlersMap[e]||(this.handlersMap[e]=new Set),this.handlersMap[e].add(t)}_unsubscribe(e,t){this.handlersMap[e]&&t&&this.handlersMap[e].delete(t),t&&0!==this.handlersMap[e].size||delete this.handlersMap[e],0===Object.keys(this.handlersMap).length&&this.eventTarget.removeEventListener("message",this.boundEventHandler)}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _generateEventId(e="",t=10){let r="";for(let e=0;e<t;e++)r+=Math.floor(10*Math.random());return e+r}Receiver.receivers=[];/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Sender=class Sender{constructor(e){this.target=e,this.handlers=new Set}removeMessageHandler(e){e.messageChannel&&(e.messageChannel.port1.removeEventListener("message",e.onMessage),e.messageChannel.port1.close()),this.handlers.delete(e)}async _send(e,t,r=50){let i,n;let s="undefined"!=typeof MessageChannel?new MessageChannel:null;if(!s)throw Error("connection_unavailable");return new Promise((a,o)=>{let l=_generateEventId("",20);s.port1.start();let c=setTimeout(()=>{o(Error("unsupported_event"))},r);n={messageChannel:s,onMessage(e){if(e.data.eventId===l)switch(e.data.status){case"ack":clearTimeout(c),i=setTimeout(()=>{o(Error("timeout"))},3e3);break;case"done":clearTimeout(i),a(e.data.response);break;default:clearTimeout(c),clearTimeout(i),o(Error("invalid_response"))}}},this.handlers.add(n),s.port1.addEventListener("message",n.onMessage),this.target.postMessage({eventType:e,eventId:l,data:t},[s.port2])}).finally(()=>{n&&this.removeMessageHandler(n)})}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _window(){return window}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _isWorker(){return void 0!==_window().WorkerGlobalScope&&"function"==typeof _window().importScripts}async function _getActiveServiceWorker(){if(!navigator?.serviceWorker)return null;try{let e=await navigator.serviceWorker.ready;return e.active}catch{return null}}/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Y="firebaseLocalStorageDb",Q="firebaseLocalStorage",X="fbase_key";let DBPromise=class DBPromise{constructor(e){this.request=e}toPromise(){return new Promise((e,t)=>{this.request.addEventListener("success",()=>{e(this.request.result)}),this.request.addEventListener("error",()=>{t(this.request.error)})})}};function getObjectStore(e,t){return e.transaction([Q],t?"readwrite":"readonly").objectStore(Q)}async function _putObject(e,t,r){let i=getObjectStore(e,!0).put({[X]:t,value:r});return new DBPromise(i).toPromise()}async function getObject(e,t){let r=getObjectStore(e,!1).get(t),i=await new DBPromise(r).toPromise();return void 0===i?null:i.value}function _deleteObject(e,t){let r=getObjectStore(e,!0).delete(t);return new DBPromise(r).toPromise()}let IndexedDBLocalPersistence=class IndexedDBLocalPersistence{registerLifecycleListeners(){"undefined"!=typeof window&&"function"==typeof window.addEventListener&&(window.addEventListener("pagehide",this.onPageHide),window.addEventListener("pageshow",this.onPageShow))}unregisterLifecycleListeners(){"undefined"!=typeof window&&"function"==typeof window.removeEventListener&&(window.removeEventListener("pagehide",this.onPageHide),window.removeEventListener("pageshow",this.onPageShow))}constructor(){this.type="LOCAL",this.dbPromise=null,this._shouldAllowMigration=!0,this.listeners={},this.localCache={},this.pollTimer=null,this.isClosing=!1,this.pendingWrites=0,this.receiver=null,this.sender=null,this.serviceWorkerReceiverAvailable=!1,this.activeServiceWorker=null,this.onPageHide=()=>{this.isClosing=!0,this.stopPolling(),this.dbPromise&&(this.dbPromise.then(e=>e.close()).catch(()=>{}),this.dbPromise=null)},this.onPageShow=()=>{this.isClosing&&(this.isClosing=!1,Object.keys(this.listeners).length>0&&this.startPolling())},this._workerInitializationPromise=this.initializeServiceWorkerMessaging().then(()=>{},()=>{})}async _openDb(){return this.dbPromise||(this.dbPromise=function _openDatabase(){let e=indexedDB.open(Y,1);return new Promise((t,r)=>{e.addEventListener("error",()=>{r(e.error)}),e.addEventListener("upgradeneeded",()=>{let t=e.result;try{t.createObjectStore(Q,{keyPath:X})}catch(e){r(e)}}),e.addEventListener("success",async()=>{let r=e.result;r.objectStoreNames.contains(Q)?t(r):(r.close(),await function(){let e=indexedDB.deleteDatabase(Y);return new DBPromise(e).toPromise()}(),t(await _openDatabase()))})})}(),this.dbPromise.catch(()=>{this.dbPromise=null})),this.dbPromise}async _withRetries(e){let t=0;for(;;)try{let t=await this._openDb();return await e(t)}catch(e){if(t++>3)throw e;if(this.dbPromise){let e=this.dbPromise;this.dbPromise=null;try{let t=await e;t.close()}catch{}}}}async initializeServiceWorkerMessaging(){return _isWorker()?this.initializeReceiver():this.initializeSender()}async initializeReceiver(){this.receiver=Receiver._getInstance(_isWorker()?self:null),this.receiver._subscribe("keyChanged",async(e,t)=>{let r=await this._poll();return{keyProcessed:r.includes(t.key)}}),this.receiver._subscribe("ping",async(e,t)=>["keyChanged"])}async initializeSender(){if(this.activeServiceWorker=await _getActiveServiceWorker(),!this.activeServiceWorker)return;this.sender=new Sender(this.activeServiceWorker);let e=await this.sender._send("ping",{},800);e&&e[0]?.fulfilled&&e[0]?.value.includes("keyChanged")&&(this.serviceWorkerReceiverAvailable=!0)}async notifyServiceWorker(e){if(this.sender&&this.activeServiceWorker&&(navigator?.serviceWorker?.controller||null)===this.activeServiceWorker)try{await this.sender._send("keyChanged",{key:e},this.serviceWorkerReceiverAvailable?800:50)}catch{}}async _isAvailable(){try{if(!indexedDB)return!1;return await this._withRetries(async e=>{await _putObject(e,J,"1"),await _deleteObject(e,J)}),!0}catch{}return!1}async _withPendingWrite(e){this.pendingWrites++;try{await e()}finally{this.pendingWrites--}}async _set(e,t){return this._withPendingWrite(async()=>(await this._withRetries(r=>_putObject(r,e,t)),this.localCache[e]=t,this.notifyServiceWorker(e)))}async _get(e){let t=await this._withRetries(t=>getObject(t,e));return this.localCache[e]=t,t}async _remove(e){return this._withPendingWrite(async()=>(await this._withRetries(t=>_deleteObject(t,e)),delete this.localCache[e],this.notifyServiceWorker(e)))}async _poll(){if(this.isClosing)return[];try{let e=await this._withRetries(e=>{let t=getObjectStore(e,!1).getAll();return new DBPromise(t).toPromise()});if(this.isClosing||!e||0!==this.pendingWrites)return[];let t=[],r=new Set;if(0!==e.length)for(let{fbase_key:i,value:n}of e)r.add(i),JSON.stringify(this.localCache[i])!==JSON.stringify(n)&&(this.notifyListeners(i,n),t.push(i));for(let e of Object.keys(this.localCache))this.localCache[e]&&!r.has(e)&&(this.notifyListeners(e,null),t.push(e));return t}catch(e){return this.isClosing||_logWarn(`Firebase Auth cross-tab polling failed with error: ${e}`),[]}}notifyListeners(e,t){this.localCache[e]=t;let r=this.listeners[e];if(r)for(let e of Array.from(r))e(t)}startPolling(){this.stopPolling(),this.pollTimer=setInterval(async()=>this._poll(),800)}stopPolling(){this.pollTimer&&(clearInterval(this.pollTimer),this.pollTimer=null)}_addListener(e,t){0===Object.keys(this.listeners).length&&(this.startPolling(),this.registerLifecycleListeners()),this.listeners[e]||(this.listeners[e]=new Set,this._get(e)),this.listeners[e].add(t)}_removeListener(e,t){this.listeners[e]&&(this.listeners[e].delete(t),0===this.listeners[e].size&&delete this.listeners[e]),0===Object.keys(this.listeners).length&&(this.stopPolling(),this.unregisterLifecycleListeners())}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function startSignInPhoneMfa(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:start",_addTidIfNecessary(e,t))}IndexedDBLocalPersistence.type="LOCAL",_generateCallbackName("rcb"),new Delay(3e4,6e4);/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let Z="recaptcha";async function _verifyPhoneNumber(e,t,r){if(!e._getRecaptchaConfig())try{await _initializeRecaptchaConfig(e)}catch(e){console.log("Failed to initialize reCAPTCHA Enterprise config. Triggering the reCAPTCHA v2 verification.")}try{let i;if(i="string"==typeof t?{phoneNumber:t}:t,"session"in i){let t=i.session;if("phoneNumber"in i){_assert("enroll"===t.type,e,"internal-error");let n={idToken:t.credential,phoneEnrollmentInfo:{phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"}},startEnrollPhoneMfaActionCallback=async(e,t)=>{if(t.phoneEnrollmentInfo.captchaResponse===q){_assert(r?.type===Z,e,"argument-error");let i=await injectRecaptchaV2Token(e,t,r);return startEnrollPhoneMfa(e,i)}return startEnrollPhoneMfa(e,t)},s=handleRecaptchaFlow(e,n,"mfaSmsEnrollment",startEnrollPhoneMfaActionCallback,"PHONE_PROVIDER"),a=await s.catch(e=>Promise.reject(e));return a.phoneSessionInfo.sessionInfo}{_assert("signin"===t.type,e,"internal-error");let n=i.multiFactorHint?.uid||i.multiFactorUid;_assert(n,e,"missing-multi-factor-info");let s={mfaPendingCredential:t.credential,mfaEnrollmentId:n,phoneSignInInfo:{clientType:"CLIENT_TYPE_WEB"}},startSignInPhoneMfaActionCallback=async(e,t)=>{if(t.phoneSignInInfo.captchaResponse===q){_assert(r?.type===Z,e,"argument-error");let i=await injectRecaptchaV2Token(e,t,r);return startSignInPhoneMfa(e,i)}return startSignInPhoneMfa(e,t)},a=handleRecaptchaFlow(e,s,"mfaSmsSignIn",startSignInPhoneMfaActionCallback,"PHONE_PROVIDER"),o=await a.catch(e=>Promise.reject(e));return o.phoneResponseInfo.sessionInfo}}{let t={phoneNumber:i.phoneNumber,clientType:"CLIENT_TYPE_WEB"},sendPhoneVerificationCodeActionCallback=async(e,t)=>{if(t.captchaResponse===q){_assert(r?.type===Z,e,"argument-error");let i=await injectRecaptchaV2Token(e,t,r);return sendPhoneVerificationCode(e,i)}return sendPhoneVerificationCode(e,t)},n=handleRecaptchaFlow(e,t,"sendVerificationCode",sendPhoneVerificationCodeActionCallback,"PHONE_PROVIDER"),s=await n.catch(e=>Promise.reject(e));return s.sessionInfo}}finally{r?._reset()}}async function injectRecaptchaV2Token(e,t,r){_assert(r.type===Z,e,"argument-error");let i=await r.verify();_assert("string"==typeof i,e,"argument-error");let n={...t};if("phoneEnrollmentInfo"in n){let e=n.phoneEnrollmentInfo.phoneNumber,t=n.phoneEnrollmentInfo.captchaResponse,r=n.phoneEnrollmentInfo.clientType,s=n.phoneEnrollmentInfo.recaptchaVersion;return Object.assign(n,{phoneEnrollmentInfo:{phoneNumber:e,recaptchaToken:i,captchaResponse:t,clientType:r,recaptchaVersion:s}}),n}if(!("phoneSignInInfo"in n))return Object.assign(n,{recaptchaToken:i}),n;{let e=n.phoneSignInInfo.captchaResponse,t=n.phoneSignInInfo.clientType,r=n.phoneSignInInfo.recaptchaVersion;return Object.assign(n,{phoneSignInInfo:{recaptchaToken:i,captchaResponse:e,clientType:t,recaptchaVersion:r}}),n}}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let PhoneAuthProvider=class PhoneAuthProvider{constructor(e){this.providerId=PhoneAuthProvider.PROVIDER_ID,this.auth=index_esm_getModularInstance(e)}verifyPhoneNumber(e,t){return _verifyPhoneNumber(this.auth,e,index_esm_getModularInstance(t))}static credential(e,t){return PhoneAuthCredential._fromVerification(e,t)}static credentialFromResult(e){return PhoneAuthProvider.credentialFromTaggedObject(e)}static credentialFromError(e){return PhoneAuthProvider.credentialFromTaggedObject(e.customData||{})}static credentialFromTaggedObject({_tokenResponse:e}){if(!e)return null;let{phoneNumber:t,temporaryProof:r}=e;return t&&r?PhoneAuthCredential._fromTokenResponse(t,r):null}};/**
 * @license
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function _withDefaultResolver(e,t){return t?_getInstance(t):(_assert(e._popupRedirectResolver,e,"argument-error"),e._popupRedirectResolver)}PhoneAuthProvider.PROVIDER_ID="phone",PhoneAuthProvider.PHONE_SIGN_IN_METHOD="phone";/**
 * @license
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let IdpCredential=class IdpCredential extends AuthCredential{constructor(e){super("custom","custom"),this.params=e}_getIdTokenResponse(e){return signInWithIdp(e,this._buildIdpRequest())}_linkToIdToken(e,t){return signInWithIdp(e,this._buildIdpRequest(t))}_getReauthenticationResolver(e){return signInWithIdp(e,this._buildIdpRequest())}_buildIdpRequest(e){let t={requestUri:this.params.requestUri,sessionId:this.params.sessionId,postBody:this.params.postBody,tenantId:this.params.tenantId,pendingToken:this.params.pendingToken,returnSecureToken:!0,returnIdpCredential:!0};return e&&(t.idToken=e),t}};function _signIn(e){return _signInWithCredential(e.auth,new IdpCredential(e),e.bypassAuthState)}function _reauth(e){let{auth:t,user:r}=e;return _assert(r,t,"internal-error"),_reauthenticate(r,new IdpCredential(e),e.bypassAuthState)}async function _link(e){let{auth:t,user:r}=e;return _assert(r,t,"internal-error"),_link$1(r,new IdpCredential(e),e.bypassAuthState)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AbstractPopupRedirectOperation=class AbstractPopupRedirectOperation{constructor(e,t,r,i,n=!1){this.auth=e,this.resolver=r,this.user=i,this.bypassAuthState=n,this.pendingPromise=null,this.eventManager=null,this.filter=Array.isArray(t)?t:[t]}execute(){return new Promise(async(e,t)=>{this.pendingPromise={resolve:e,reject:t};try{this.eventManager=await this.resolver._initialize(this.auth),await this.onExecution(),this.eventManager.registerConsumer(this)}catch(e){this.reject(e)}})}async onAuthEvent(e){let{urlResponse:t,sessionId:r,postBody:i,tenantId:n,error:s,type:a}=e;if(s){this.reject(s);return}let o={auth:this.auth,requestUri:t,sessionId:r,tenantId:n||void 0,postBody:i||void 0,user:this.user,bypassAuthState:this.bypassAuthState};try{this.resolve(await this.getIdpTask(a)(o))}catch(e){this.reject(e)}}onError(e){this.reject(e)}getIdpTask(e){switch(e){case"signInViaPopup":case"signInViaRedirect":return _signIn;case"linkViaPopup":case"linkViaRedirect":return _link;case"reauthViaPopup":case"reauthViaRedirect":return _reauth;default:_fail(this.auth,"internal-error")}}resolve(e){this.pendingPromise||debugFail("Pending promise was never set"),this.pendingPromise.resolve(e),this.unregisterAndCleanUp()}reject(e){this.pendingPromise||debugFail("Pending promise was never set"),this.pendingPromise.reject(e),this.unregisterAndCleanUp()}unregisterAndCleanUp(){this.eventManager&&this.eventManager.unregisterConsumer(this),this.pendingPromise=null,this.cleanUp()}};/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ee=new Delay(2e3,1e4);async function signInWithPopup(e,t,r){if(index_esm_isFirebaseServerApp(e.app))return Promise.reject(_createError(e,"operation-not-supported-in-this-environment"));let i=index_esm_getModularInstance(e);!function(e,t,r){if(!(t instanceof r))throw r.name!==t.constructor.name&&_fail(e,"argument-error"),_errorWithCustomMessage(e,"argument-error",`Type of ${t.constructor.name} does not match expected instance.Did you pass a reference from a different Auth SDK?`)}(e,t,FederatedAuthProvider);let n=_withDefaultResolver(i,r),s=new PopupOperation(i,"signInViaPopup",t,n);return s.executeNotNull()}let PopupOperation=class PopupOperation extends AbstractPopupRedirectOperation{constructor(e,t,r,i,n){super(e,t,i,n),this.provider=r,this.authWindow=null,this.pollId=null,PopupOperation.currentPopupAction&&PopupOperation.currentPopupAction.cancel(),PopupOperation.currentPopupAction=this}async executeNotNull(){let e=await this.execute();return _assert(e,this.auth,"internal-error"),e}async onExecution(){1===this.filter.length||debugFail("Popup operations only handle one event");let e=_generateEventId();this.authWindow=await this.resolver._openPopup(this.auth,this.provider,this.filter[0],e),this.authWindow.associatedEvent=e,this.resolver._originValidation(this.auth).catch(e=>{this.reject(e)}),this.resolver._isIframeWebStorageSupported(this.auth,e=>{e||this.reject(_createError(this.auth,"web-storage-unsupported"))}),this.pollUserCancellation()}get eventId(){return this.authWindow?.associatedEvent||null}cancel(){this.reject(_createError(this.auth,"cancelled-popup-request"))}cleanUp(){this.authWindow&&this.authWindow.close(),this.pollId&&window.clearTimeout(this.pollId),this.authWindow=null,this.pollId=null,PopupOperation.currentPopupAction=null}pollUserCancellation(){let poll=()=>{if(this.authWindow?.window?.closed){this.pollId=window.setTimeout(()=>{this.pollId=null,this.reject(_createError(this.auth,"popup-closed-by-user"))},8e3);return}this.pollId=window.setTimeout(poll,ee.get())};poll()}};PopupOperation.currentPopupAction=null;let et=new Map;let RedirectAction=class RedirectAction extends AbstractPopupRedirectOperation{constructor(e,t,r=!1){super(e,["signInViaRedirect","linkViaRedirect","reauthViaRedirect","unknown"],t,void 0,r),this.eventId=null}async execute(){let e=et.get(this.auth._key());if(!e){try{let t=await _getAndClearPendingRedirectStatus(this.resolver,this.auth),r=t?await super.execute():null;e=()=>Promise.resolve(r)}catch(t){e=()=>Promise.reject(t)}et.set(this.auth._key(),e)}return this.bypassAuthState||et.set(this.auth._key(),()=>Promise.resolve(null)),e()}async onAuthEvent(e){if("signInViaRedirect"===e.type)return super.onAuthEvent(e);if("unknown"===e.type){this.resolve(null);return}if(e.eventId){let t=await this.auth._redirectUserForId(e.eventId);if(t)return this.user=t,super.onAuthEvent(e);this.resolve(null)}}async onExecution(){}cleanUp(){}};async function _getAndClearPendingRedirectStatus(e,t){let r=_persistenceKeyName("pendingRedirect",t.config.apiKey,t.name),i=_getInstance(e._redirectPersistence);if(!await i._isAvailable())return!1;let n=await i._get(r)==="true";return await i._remove(r),n}function _overrideRedirectResult(e,t){et.set(e._key(),t)}async function _getRedirectResult(e,t,r=!1){if(index_esm_isFirebaseServerApp(e.app))return Promise.reject(_serverAppCurrentUserOperationNotSupportedError(e));let i=index_esm_getModularInstance(e),n=_withDefaultResolver(i,t),s=new RedirectAction(i,n,r),a=await s.execute();return a&&!r&&(delete a.user._redirectEventId,await i._persistUserIfCurrent(a.user),await i._setRedirectUser(null,t)),a}let AuthEventManager=class AuthEventManager{constructor(e){this.auth=e,this.cachedEventUids=new Set,this.consumers=new Set,this.queuedRedirectEvent=null,this.hasHandledPotentialRedirect=!1,this.lastProcessedEventTime=Date.now()}registerConsumer(e){this.consumers.add(e),this.queuedRedirectEvent&&this.isEventForConsumer(this.queuedRedirectEvent,e)&&(this.sendToConsumer(this.queuedRedirectEvent,e),this.saveEventToCache(this.queuedRedirectEvent),this.queuedRedirectEvent=null)}unregisterConsumer(e){this.consumers.delete(e)}onEvent(e){if(this.hasEventBeenHandled(e))return!1;let t=!1;return this.consumers.forEach(r=>{this.isEventForConsumer(e,r)&&(t=!0,this.sendToConsumer(e,r),this.saveEventToCache(e))}),this.hasHandledPotentialRedirect||!function(e){switch(e.type){case"signInViaRedirect":case"linkViaRedirect":case"reauthViaRedirect":return!0;case"unknown":return isNullRedirectEvent(e);default:return!1}}(e)||(this.hasHandledPotentialRedirect=!0,t||(this.queuedRedirectEvent=e,t=!0)),t}sendToConsumer(e,t){if(e.error&&!isNullRedirectEvent(e)){let r=e.error.code?.split("auth/")[1]||"internal-error";t.onError(_createError(this.auth,r))}else t.onAuthEvent(e)}isEventForConsumer(e,t){let r=null===t.eventId||!!e.eventId&&e.eventId===t.eventId;return t.filter.includes(e.type)&&r}hasEventBeenHandled(e){return Date.now()-this.lastProcessedEventTime>=6e5&&this.cachedEventUids.clear(),this.cachedEventUids.has(eventUid(e))}saveEventToCache(e){this.cachedEventUids.add(eventUid(e)),this.lastProcessedEventTime=Date.now()}};function eventUid(e){return[e.type,e.eventId,e.sessionId,e.tenantId].filter(e=>e).join("-")}function isNullRedirectEvent({type:e,error:t}){return"unknown"===e&&t?.code==="auth/no-auth-event"}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */async function _getProjectConfig(e,t={}){return _performApiRequest(e,"GET","/v1/projects",t)}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let er=/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/,ei=/^https?/;async function _validateOrigin(e){if(e.config.emulator)return;let{authorizedDomains:t}=await _getProjectConfig(e);for(let e of t)try{if(function(e){let t=_getCurrentUrl(),{protocol:r,hostname:i}=new URL(t);if(e.startsWith("chrome-extension://")){let n=new URL(e);return""===n.hostname&&""===i?"chrome-extension:"===r&&e.replace("chrome-extension://","")===t.replace("chrome-extension://",""):"chrome-extension:"===r&&n.hostname===i}if(!ei.test(r))return!1;if(er.test(e))return i===e;let n=e.replace(/\./g,"\\."),s=RegExp("^(.+\\."+n+"|"+n+")$","i");return s.test(i)}(e))return}catch{}_fail(e,"unauthorized-domain")}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let en=new Delay(3e4,6e4);function resetUnloadedGapiModules(){let e=_window().___jsl;if(e?.H){for(let t of Object.keys(e.H))if(e.H[t].r=e.H[t].r||[],e.H[t].L=e.H[t].L||[],e.H[t].r=[...e.H[t].L],e.CP)for(let t=0;t<e.CP.length;t++)e.CP[t]=null}}let es=null,ea=new Delay(5e3,15e3),eo={style:{position:"absolute",top:"-100px",width:"1px",height:"1px"},"aria-hidden":"true",tabindex:"-1"},el=new Map([["identitytoolkit.googleapis.com","p"],["staging-identitytoolkit.sandbox.googleapis.com","s"],["test-identitytoolkit.sandbox.googleapis.com","t"]]);async function _openIframe(e){let t=await (es=es||new Promise((t,r)=>{function loadGapiIframe(){resetUnloadedGapiModules(),gapi.load("gapi.iframes",{callback:()=>{t(gapi.iframes.getContext())},ontimeout:()=>{resetUnloadedGapiModules(),r(_createError(e,"network-request-failed"))},timeout:en.get()})}if(_window().gapi?.iframes?.Iframe)t(gapi.iframes.getContext());else if(_window().gapi?.load)loadGapiIframe();else{var i;let t=_generateCallbackName("iframefcb");return _window()[t]=()=>{gapi.load?loadGapiIframe():r(_createError(e,"network-request-failed"))},(i=`${G.gapiScript}?onload=${t}`,G.loadJS(i)).catch(e=>r(e))}}).catch(e=>{throw es=null,e})),r=_window().gapi;return _assert(r,e,"internal-error"),t.open({where:document.body,url:function(e){let t=e.config;_assert(t.authDomain,e,"auth-domain-config-required");let r=t.emulator?_emulatorUrl(t,"emulator/auth/iframe"):`https://${e.config.authDomain}/__/auth/iframe`,i={apiKey:t.apiKey,appName:e.name,v:L},n=el.get(e.config.apiHost);n&&(i.eid=n);let s=e._getFrameworks();return s.length&&(i.fw=s.join(",")),`${r}?${index_esm_querystring(i).slice(1)}`}(e),messageHandlersFilter:r.iframes.CROSS_ORIGIN_IFRAMES_FILTER,attributes:eo,dontclear:!0},t=>new Promise(async(r,i)=>{await t.restyle({setHideOnLeave:!1});let n=_createError(e,"network-request-failed"),s=_window().setTimeout(()=>{i(n)},ea.get());function clearTimerAndResolve(){_window().clearTimeout(s),r(t)}t.ping(clearTimerAndResolve).then(clearTimerAndResolve,()=>{i(n)})}))}/**
 * @license
 * Copyright 2020 Google LLC.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let ec={location:"yes",resizable:"yes",statusbar:"yes",toolbar:"no"};let AuthPopup=class AuthPopup{constructor(e){this.window=e,this.associatedEvent=null}close(){if(this.window)try{this.window.close()}catch(e){}}};let ed=encodeURIComponent("fac");async function _getRedirectUrl(e,t,r,i,n,s){_assert(e.config.authDomain,e,"auth-domain-config-required"),_assert(e.config.apiKey,e,"invalid-api-key");let a={apiKey:e.config.apiKey,appName:e.name,authType:r,redirectUrl:i,v:L,eventId:n};if(t instanceof FederatedAuthProvider)for(let[r,i]of(t.setDefaultLanguage(e.languageCode),a.providerId=t.providerId||"",!function(e){for(let t in e)if(Object.prototype.hasOwnProperty.call(e,t))return!1;return!0}(t.getCustomParameters())&&(a.customParameters=JSON.stringify(t.getCustomParameters())),Object.entries(s||{})))a[r]=i;if(t instanceof BaseOAuthProvider){let e=t.getScopes().filter(e=>""!==e);e.length>0&&(a.scopes=e.join(","))}for(let t of(e.tenantId&&(a.tid=e.tenantId),Object.keys(a)))void 0===a[t]&&delete a[t];let o=await e._getAppCheckToken(),l=o?`#${ed}=${encodeURIComponent(o)}`:"";return`${function({config:e}){return e.emulator?_emulatorUrl(e,"emulator/auth/handler"):`https://${e.authDomain}/__/auth/handler`}(e)}?${index_esm_querystring(a).slice(1)}${l}`}/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let eu="webStorageSupport",eh=class{constructor(){this.eventManagers={},this.iframes={},this.originValidationPromises={},this._redirectPersistence=BrowserSessionPersistence,this._completeRedirectFn=_getRedirectResult,this._overrideRedirectResult=_overrideRedirectResult}async _openPopup(e,t,r,i){this.eventManagers[e._key()]?.manager||debugFail("_initialize() not called before _openPopup()");let n=await _getRedirectUrl(e,t,r,_getCurrentUrl(),i);return function(e,t,r,i=500,n=600){let s=Math.max((window.screen.availHeight-n)/2,0).toString(),a=Math.max((window.screen.availWidth-i)/2,0).toString(),o="",l={...ec,width:i.toString(),height:n.toString(),top:s,left:a},c=index_esm_getUA().toLowerCase();r&&(o=_isChromeIOS(c)?"_blank":r),_isFirefox(c)&&(t=t||"http://localhost",l.scrollbars="yes");let d=Object.entries(l).reduce((e,[t,r])=>`${e}${t}=${r},`,"");if(function(e=index_esm_getUA()){return _isIOS(e)&&!!window.navigator?.standalone}(c)&&"_self"!==o)return function(e,t){let r=document.createElement("a");r.href=e,r.target=t;let i=document.createEvent("MouseEvent");i.initMouseEvent("click",!0,!0,window,1,0,0,0,0,!1,!1,!1,!1,1,null),r.dispatchEvent(i)}(t||"",o),new AuthPopup(null);let u=window.open(t||"",o,d);_assert(u,e,"popup-blocked");try{u.focus()}catch(e){}return new AuthPopup(u)}(e,n,_generateEventId())}async _openRedirect(e,t,r,i){await this._originValidation(e);let n=await _getRedirectUrl(e,t,r,_getCurrentUrl(),i);return _window().location.href=n,new Promise(()=>{})}_initialize(e){let t=e._key();if(this.eventManagers[t]){let{manager:e,promise:r}=this.eventManagers[t];return e?Promise.resolve(e):(r||debugFail("If manager is not set, promise should be"),r)}let r=this.initAndGetManager(e);return this.eventManagers[t]={promise:r},r.catch(()=>{delete this.eventManagers[t]}),r}async initAndGetManager(e){let t=await _openIframe(e),r=new AuthEventManager(e);return t.register("authEvent",t=>{_assert(t?.authEvent,e,"invalid-auth-event");let i=r.onEvent(t.authEvent);return{status:i?"ACK":"ERROR"}},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER),this.eventManagers[e._key()]={manager:r},this.iframes[e._key()]=t,r}_isIframeWebStorageSupported(e,t){let r=this.iframes[e._key()];r.send(eu,{type:eu},r=>{let i=r?.[0]?.[eu];void 0!==i&&t(!!i),_fail(e,"internal-error")},gapi.iframes.CROSS_ORIGIN_IFRAMES_FILTER)}_originValidation(e){let t=e._key();return this.originValidationPromises[t]||(this.originValidationPromises[t]=_validateOrigin(e)),this.originValidationPromises[t]}get _shouldInitProactively(){return _isMobileBrowser()||_isSafari()||_isIOS()}};let MultiFactorAssertionImpl=class MultiFactorAssertionImpl{constructor(e){this.factorId=e}_process(e,t,r){switch(t.type){case"enroll":return this._finalizeEnroll(e,t.credential,r);case"signin":return this._finalizeSignIn(e,t.credential);default:return debugFail("unexpected MultiFactorSessionType")}}};let PhoneMultiFactorAssertionImpl=class PhoneMultiFactorAssertionImpl extends MultiFactorAssertionImpl{constructor(e){super("phone"),this.credential=e}static _fromCredential(e){return new PhoneMultiFactorAssertionImpl(e)}_finalizeEnroll(e,t,r){return _performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:finalize",_addTidIfNecessary(e,{idToken:t,displayName:r,phoneVerificationInfo:this.credential._makeVerificationRequest()}))}_finalizeSignIn(e,t){return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:finalize",_addTidIfNecessary(e,{mfaPendingCredential:t,phoneVerificationInfo:this.credential._makeVerificationRequest()}))}};let TotpMultiFactorAssertionImpl=class TotpMultiFactorAssertionImpl extends MultiFactorAssertionImpl{constructor(e,t,r){super("totp"),this.otp=e,this.enrollmentId=t,this.secret=r}static _fromSecret(e,t){return new TotpMultiFactorAssertionImpl(t,void 0,e)}static _fromEnrollmentId(e,t){return new TotpMultiFactorAssertionImpl(t,e)}async _finalizeEnroll(e,t,r){return _assert(void 0!==this.secret,e,"argument-error"),_performApiRequest(e,"POST","/v2/accounts/mfaEnrollment:finalize",_addTidIfNecessary(e,{idToken:t,displayName:r,totpVerificationInfo:this.secret._makeTotpVerificationInfo(this.otp)}))}async _finalizeSignIn(e,t){_assert(void 0!==this.enrollmentId&&void 0!==this.otp,e,"argument-error");let r={verificationCode:this.otp};return _performApiRequest(e,"POST","/v2/accounts/mfaSignIn:finalize",_addTidIfNecessary(e,{mfaPendingCredential:t,mfaEnrollmentId:this.enrollmentId,totpVerificationInfo:r}))}};let TotpSecret=class TotpSecret{constructor(e,t,r,i,n,s,a){this.sessionInfo=s,this.auth=a,this.secretKey=e,this.hashingAlgorithm=t,this.codeLength=r,this.codeIntervalSeconds=i,this.enrollmentCompletionDeadline=n}static _fromStartTotpMfaEnrollmentResponse(e,t){return new TotpSecret(e.totpSessionInfo.sharedSecretKey,e.totpSessionInfo.hashingAlgorithm,e.totpSessionInfo.verificationCodeLength,e.totpSessionInfo.periodSec,new Date(e.totpSessionInfo.finalizeEnrollmentTime).toUTCString(),e.totpSessionInfo.sessionInfo,t)}_makeTotpVerificationInfo(e){return{sessionInfo:this.sessionInfo,verificationCode:e}}generateQrCodeUrl(e,t){let r=!1;return(_isEmptyString(e)||_isEmptyString(t))&&(r=!0),r&&(_isEmptyString(e)&&(e=this.auth.currentUser?.email||"unknownuser"),_isEmptyString(t)&&(t=this.auth.name)),`otpauth://totp/${t}:${e}?secret=${this.secretKey}&issuer=${t}&algorithm=${this.hashingAlgorithm}&digits=${this.codeLength}`}};function _isEmptyString(e){return void 0===e||e?.length===0}var ep="@firebase/auth",ef="1.13.8";/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */let AuthInterop=class AuthInterop{constructor(e){this.auth=e,this.internalListeners=new Map}getUid(){return this.assertAuthConfigured(),this.auth.currentUser?.uid||null}async getToken(e){if(this.assertAuthConfigured(),await this.auth._initializationPromise,!this.auth.currentUser)return null;let t=await this.auth.currentUser.getIdToken(e);return{accessToken:t}}addAuthTokenListener(e){if(this.assertAuthConfigured(),this.internalListeners.has(e))return;let t=this.auth.onIdTokenChanged(t=>{e(t?.stsTokenManager.accessToken||null)});this.internalListeners.set(e,t),this.updateProactiveRefresh()}removeAuthTokenListener(e){this.assertAuthConfigured();let t=this.internalListeners.get(e);t&&(this.internalListeners.delete(e),t(),this.updateProactiveRefresh())}assertAuthConfigured(){_assert(this.auth._initializationPromise,"dependent-sdk-initialized-before-auth")}updateProactiveRefresh(){this.internalListeners.size>0?this.auth._startProactiveRefresh():this.auth._stopProactiveRefresh()}};let em=getExperimentalSetting("authIdTokenMaxAge")||300,eg=null,mintCookieFactory=e=>async t=>{let r=t&&await t.getIdTokenResult(),i=r&&(new Date().getTime()-Date.parse(r.issuedAtTime))/1e3;if(i&&i>em)return;let n=r?.token;eg!==n&&(eg=n,await fetch(e,{method:n?"POST":"DELETE",headers:n?{Authorization:`Bearer ${n}`}:{}}))};G={loadJS:e=>new Promise((t,r)=>{let i=document.createElement("script");i.setAttribute("src",e),i.onload=t,i.onerror=e=>{let t=_createError("internal-error");t.customData=e,r(t)},i.type="text/javascript",i.charset="UTF-8",(document.getElementsByTagName("head")?.[0]??document).appendChild(i)}),gapiScript:"https://apis.google.com/js/api.js",recaptchaV2Script:"https://www.google.com/recaptcha/api.js",recaptchaEnterpriseScript:"https://www.google.com/recaptcha/enterprise.js?render="},o="Browser",_registerComponent(new Component("auth",(e,{options:t})=>{let r=e.getProvider("app").getImmediate(),i=e.getProvider("heartbeat"),n=e.getProvider("app-check-internal"),{apiKey:s,authDomain:a}=r.options;_assert(s&&!s.includes(":"),"invalid-api-key",{appName:r.name});let l={apiKey:s,authDomain:a,clientPlatform:o,apiHost:"identitytoolkit.googleapis.com",tokenApiHost:"securetoken.googleapis.com",apiScheme:"https",sdkClientVersion:_getClientVersion(o)},c=new AuthImpl(r,i,n,l);return function(e,t){let r=t?.persistence||[],i=(Array.isArray(r)?r:[r]).map(_getInstance);t?.errorMap&&e._updateErrorMap(t.errorMap),e._initializeWithPersistence(i,t?.popupRedirectResolver)}(c,t),c},"PUBLIC").setInstantiationMode("EXPLICIT").setInstanceCreatedCallback((e,t,r)=>{let i=e.getProvider("auth-internal");i.initialize()})),_registerComponent(new Component("auth-internal",e=>{let t=index_esm_getModularInstance(e.getProvider("auth").getImmediate());return new AuthInterop(t)},"PRIVATE").setInstantiationMode("EXPLICIT")),registerVersion(ep,ef,/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e){switch(e){case"Node":return"node";case"ReactNative":return"rn";case"Worker":return"webworker";case"Cordova":return"cordova";case"WebExtension":return"web-extension";default:return}}(o)),registerVersion(ep,ef,"esm2020");let e_=Array.from(R.values()).length?getApp():initializeApp({apiKey:"AIzaSyDummyKeyForBlinkitAppDevelopment",authDomain:"blinkit-clone-app.firebaseapp.com",projectId:"blinkit-clone-app",storageBucket:"blinkit-clone-app.appspot.com",messagingSenderId:"123456789012",appId:"1:123456789012:web:abcdef123456"}),ev=function(e=getApp()){let t=_getProvider(e,"auth");if(t.isInitialized())return t.getImmediate();let r=/**
 * @license
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */function(e,t){let r=_getProvider(e,"auth");if(r.isInitialized()){let e=r.getImmediate(),i=r.getOptions();if(deepEqual(i,t??{}))return e;_fail(e,"already-initialized")}let i=r.initialize({options:t});return i}(e,{popupRedirectResolver:eh,persistence:[IndexedDBLocalPersistence,BrowserLocalPersistence,BrowserSessionPersistence]}),i=getExperimentalSetting("authTokenSyncURL");if(i&&"boolean"==typeof isSecureContext&&isSecureContext){let e=new URL(i,location.origin);if(location.origin===e.origin){let t=mintCookieFactory(e.toString());index_esm_getModularInstance(r).beforeAuthStateChanged(t,()=>t(r.currentUser)),index_esm_getModularInstance(r).onIdTokenChanged(e=>t(e),void 0,void 0)}}let n=getDefaultEmulatorHost("auth");return n&&function(e,t,r){let i=index_esm_getModularInstance(e);_assert(/^https?:\/\//.test(t),i,"invalid-emulator-scheme");let n=extractProtocol(t),{host:s,port:a}=function(e){let t=extractProtocol(e),r=/(\/\/)?([^?#/]+)/.exec(e.substr(t.length));if(!r)return{host:"",port:null};let i=r[2].split("@").pop()||"",n=/^(\[[^\]]+\])(:|$)/.exec(i);if(n){let e=n[1];return{host:e,port:parsePort(i.substr(e.length+1))}}{let[e,t]=i.split(":");return{host:e,port:parsePort(t)}}}(t),o=null===a?"":`:${a}`,l={url:`${n}//${s}${o}/`},c=Object.freeze({host:s,port:a,protocol:n.replace(":",""),options:Object.freeze({disableWarnings:!1})});if(!i._canInitEmulator){_assert(i.config.emulator&&i.emulatorConfig,i,"emulator-config-failed"),_assert(deepEqual(l,i.config.emulator)&&deepEqual(c,i.emulatorConfig),i,"emulator-config-failed");return}i.config.emulator=l,i.emulatorConfig=c,i.settings.appVerificationDisabledForTesting=!0,isCloudWorkstation(s)?pingServer(`${n}//${s}${o}`):function(){function attachBanner(){let e=document.createElement("p"),t=e.style;e.innerText="Running in emulator mode. Do not use with production credentials.",t.position="fixed",t.width="100%",t.backgroundColor="#ffffff",t.border=".1em solid #000000",t.color="#b50000",t.bottom="0px",t.left="0px",t.margin="0px",t.zIndex="10000",t.textAlign="center",e.classList.add("firebase-emulator-warning"),document.body.appendChild(e)}"undefined"!=typeof console&&"function"==typeof console.info&&console.info("WARNING: You are using the Auth Emulator, which is intended for local testing only.  Do not use with production credentials."),"undefined"!=typeof window&&"undefined"!=typeof document&&("loading"===document.readyState?window.addEventListener("DOMContentLoaded",attachBanner):attachBanner())}()}(r,`http://${n}`),r}(e_),ey=new GoogleAuthProvider;async function signInWithGooglePopup(){try{let e=await signInWithPopup(ev,ey),t=e.user;return{uid:t.uid,email:t.email,name:t.displayName||"Google User",photoURL:t.photoURL,phoneNumber:t.phoneNumber}}catch(e){throw console.error("Firebase Google sign in error:",e),e}}ey.setCustomParameters({prompt:"select_account"});let eb=(0,d.createContext)({});function AuthProvider(e){let{children:t}=e,[r,i]=(0,d.useState)(null),[n,s]=(0,d.useState)(null),[a,o]=(0,d.useState)(!0);async function fetchUserWithToken(e){try{let t=await fetch("".concat("","/api/auth/me"),{headers:{Authorization:"Bearer ".concat(e)}});if(t.ok){let e=await t.json();i({id:e._id,name:e.name,email:e.email,phone:e.phone,roles:e.roles,addresses:e.addresses})}else localStorage.removeItem("blinkit_token"),s(null)}catch(e){}o(!1)}async function fetchUser(){n&&await fetchUserWithToken(n)}async function login(e,t){let r=await fetch("".concat("","/api/auth/login"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e,password:t})}),n=await r.json();if(!r.ok)throw Error(n.message||"Login failed");i(n.user),s(n.token),localStorage.setItem("blinkit_token",n.token)}async function register(e,t,r,n){let a=await fetch("".concat("","/api/auth/register"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name:e,email:t,phone:r,password:n})}),o=await a.json();if(!a.ok)throw Error(o.message||"Registration failed");i(o.user),s(o.token),localStorage.setItem("blinkit_token",o.token)}async function loginWithGoogle(){let e=null;try{e=await signInWithGooglePopup()}catch(t){if((null==t?void 0:t.code)==="auth/configuration-not-found"||(null==t?void 0:t.code)==="auth/invalid-api-key"||(null==t?void 0:t.code)==="auth/api-key-not-valid"||(null==t?void 0:t.code)==="auth/internal-error"){let t=prompt("Firebase Google Auth is active!\nTo test Google Sign-in immediately, enter your Google email:","google.user@gmail.com");if(!t)throw Error("Google sign-in cancelled");e={email:t,name:t.split("@")[0].replace(/[._]/g," "),photoURL:""}}else if((null==t?void 0:t.code)==="auth/popup-closed-by-user")throw Error("Google Sign-In popup was closed");else throw Error((null==t?void 0:t.message)||"Google sign-in failed")}if(!e||!e.email)return;let t=await fetch("".concat("","/api/auth/google"),{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:e.email,name:e.name,photoURL:e.photoURL,googleId:e.uid})}),r=await t.json();if(!t.ok)throw Error(r.message||"Failed to authenticate with backend");return i(r.user),s(r.token),localStorage.setItem("blinkit_token",r.token),r.user}async function updateUser(e){if(!n)return;let t=await fetch("".concat("","/api/auth/profile"),{method:"PUT",headers:{"Content-Type":"application/json",Authorization:"Bearer ".concat(n)},body:JSON.stringify(e)});if(t.ok){let e=await t.json();i({id:e._id,name:e.name,email:e.email,phone:e.phone,roles:e.roles,addresses:e.addresses})}}return(0,d.useEffect)(()=>{let e=localStorage.getItem("blinkit_token");e?(s(e),fetchUserWithToken(e)):o(!1)},[]),(0,c.jsx)(eb.Provider,{value:{user:r,token:n,loading:a,login,register,loginWithGoogle,logout:function(){i(null),s(null),localStorage.removeItem("blinkit_token")},updateUser,fetchUser},children:t})}function useAuth(){return(0,d.useContext)(eb)}},319:function(e,t,r){"use strict";r.d(t,{Z:function(){return CartProvider},j:function(){return useCart}});var i=r(5893),n=r(7294);let s=(0,n.createContext)({});function CartProvider(e){let{children:t}=e,[r,a]=(0,n.useState)([]),[o,l]=(0,n.useState)(!1);(0,n.useEffect)(()=>{try{let e=localStorage.getItem("blinkit_cart");e&&a(JSON.parse(e))}catch(e){}},[]),(0,n.useEffect)(()=>{localStorage.setItem("blinkit_cart",JSON.stringify(r))},[r]);let c=r.reduce((e,t)=>e+t.qty,0),d=r.reduce((e,t)=>e+t.price*t.qty,0),u=r.reduce((e,t)=>e+Math.max(0,t.mrp-t.price)*t.qty,0),h=(0,n.useCallback)(e=>{var t;return(null===(t=r.find(t=>t.productId===e))||void 0===t?void 0:t.qty)||0},[r]);return(0,i.jsx)(s.Provider,{value:{items:r,totalItems:c,totalPrice:d,totalSavings:u,addItem:function(e){a(t=>{var r,i;let n=t.find(t=>t.productId===(e._id||e.productId));return n?t.map(t=>t.productId===(e._id||e.productId)?{...t,qty:t.qty+1}:t):[...t,{productId:e._id||e.productId,name:e.title||e.name,price:e.price,mrp:e.mrp||e.price,unit:e.unit||"",image:(null===(i=e.images)||void 0===i?void 0:null===(r=i[0])||void 0===r?void 0:r.url)||e.image||"",qty:1}]})},removeItem:function(e){a(t=>{let r=t.find(t=>t.productId===e);return r&&r.qty>1?t.map(t=>t.productId===e?{...t,qty:t.qty-1}:t):t.filter(t=>t.productId!==e)})},updateQty:function(e,t){t<=0?a(t=>t.filter(t=>t.productId!==e)):a(r=>r.map(r=>r.productId===e?{...r,qty:t}:r))},clearCart:function(){a([])},getQty:h,isOpen:o,setIsOpen:l},children:t})}function useCart(){return(0,n.useContext)(s)}},6547:function(e,t,r){"use strict";r.d(t,{V:function(){return ToastProvider},p:function(){return useToast}});var i=r(5893),n=r(7294);let s=(0,n.createContext)({});function ToastProvider(e){let{children:t}=e,[r,a]=(0,n.useState)(null),o=(0,n.useCallback)(function(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};a({message:e,...t});let r=t.duration||2200;window.setTimeout(()=>a(null),r)},[]),l=(0,n.useCallback)(()=>a(null),[]);return(0,i.jsx)(s.Provider,{value:{toast:r,showToast:o,hideToast:l},children:t})}function useToast(){return(0,n.useContext)(s)}},7498:function(e,t){"use strict";var r,i;Object.defineProperty(t,"__esModule",{value:!0}),function(e,t){for(var r in t)Object.defineProperty(e,r,{enumerable:!0,get:t[r]})}(t,{PrefetchKind:function(){return r},ACTION_REFRESH:function(){return n},ACTION_NAVIGATE:function(){return s},ACTION_RESTORE:function(){return a},ACTION_SERVER_PATCH:function(){return o},ACTION_PREFETCH:function(){return l},ACTION_FAST_REFRESH:function(){return c},ACTION_SERVER_ACTION:function(){return d}});let n="refresh",s="navigate",a="restore",o="server-patch",l="prefetch",c="fast-refresh",d="server-action";(i=r||(r={})).AUTO="auto",i.FULL="full",i.TEMPORARY="temporary",("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},30:function(e,t,r){"use strict";function getDomainLocale(e,t,r,i){return!1}Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"getDomainLocale",{enumerable:!0,get:function(){return getDomainLocale}}),r(2866),("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},5170:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"default",{enumerable:!0,get:function(){return v}});let i=r(8754),n=i._(r(7294)),s=r(4450),a=r(2227),o=r(4364),l=r(109),c=r(3607),d=r(1823),u=r(9031),h=r(920),p=r(30),f=r(7192),m=r(7498),g=new Set;function prefetch(e,t,r,i,n,s){if(!s&&!(0,a.isLocalURL)(t))return;if(!i.bypassPrefetchedCheck){let n=void 0!==i.locale?i.locale:"locale"in e?e.locale:void 0,s=t+"%"+r+"%"+n;if(g.has(s))return;g.add(s)}let o=s?e.prefetch(t,n):e.prefetch(t,r,i);Promise.resolve(o).catch(e=>{})}function formatStringOrUrl(e){return"string"==typeof e?e:(0,o.formatUrl)(e)}let _=n.default.forwardRef(function(e,t){let r,i;let{href:o,as:g,children:_,prefetch:v=null,passHref:y,replace:b,shallow:x,scroll:w,locale:I,onClick:E,onMouseEnter:C,onTouchStart:k,legacyBehavior:S=!1,...T}=e;r=_,S&&("string"==typeof r||"number"==typeof r)&&(r=n.default.createElement("a",null,r));let P=n.default.useContext(d.RouterContext),N=n.default.useContext(u.AppRouterContext),A=null!=P?P:N,R=!P,j=!1!==v,O=null===v?m.PrefetchKind.AUTO:m.PrefetchKind.FULL,{href:D,as:L}=n.default.useMemo(()=>{if(!P){let e=formatStringOrUrl(o);return{href:e,as:g?formatStringOrUrl(g):e}}let[e,t]=(0,s.resolveHref)(P,o,!0);return{href:e,as:g?(0,s.resolveHref)(P,g):t||e}},[P,o,g]),M=n.default.useRef(D),F=n.default.useRef(L);S&&(i=n.default.Children.only(r));let U=S?i&&"object"==typeof i&&i.ref:t,[B,V,W]=(0,h.useIntersection)({rootMargin:"200px"}),H=n.default.useCallback(e=>{(F.current!==L||M.current!==D)&&(W(),F.current=L,M.current=D),B(e),U&&("function"==typeof U?U(e):"object"==typeof U&&(U.current=e))},[L,U,D,W,B]);n.default.useEffect(()=>{A&&V&&j&&prefetch(A,D,L,{locale:I},{kind:O},R)},[L,D,V,I,j,null==P?void 0:P.locale,A,R,O]);let z={ref:H,onClick(e){S||"function"!=typeof E||E(e),S&&i.props&&"function"==typeof i.props.onClick&&i.props.onClick(e),A&&!e.defaultPrevented&&function(e,t,r,i,s,o,l,c,d,u){let{nodeName:h}=e.currentTarget,p="A"===h.toUpperCase();if(p&&(function(e){let t=e.currentTarget,r=t.getAttribute("target");return r&&"_self"!==r||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey||e.nativeEvent&&2===e.nativeEvent.which}(e)||!d&&!(0,a.isLocalURL)(r)))return;e.preventDefault();let navigate=()=>{let e=null==l||l;"beforePopState"in t?t[s?"replace":"push"](r,i,{shallow:o,locale:c,scroll:e}):t[s?"replace":"push"](i||r,{forceOptimisticNavigation:!u,scroll:e})};d?n.default.startTransition(navigate):navigate()}(e,A,D,L,b,x,w,I,R,j)},onMouseEnter(e){S||"function"!=typeof C||C(e),S&&i.props&&"function"==typeof i.props.onMouseEnter&&i.props.onMouseEnter(e),A&&(j||!R)&&prefetch(A,D,L,{locale:I,priority:!0,bypassPrefetchedCheck:!0},{kind:O},R)},onTouchStart(e){S||"function"!=typeof k||k(e),S&&i.props&&"function"==typeof i.props.onTouchStart&&i.props.onTouchStart(e),A&&(j||!R)&&prefetch(A,D,L,{locale:I,priority:!0,bypassPrefetchedCheck:!0},{kind:O},R)}};if((0,l.isAbsoluteUrl)(L))z.href=L;else if(!S||y||"a"===i.type&&!("href"in i.props)){let e=void 0!==I?I:null==P?void 0:P.locale,t=(null==P?void 0:P.isLocaleDomain)&&(0,p.getDomainLocale)(L,e,null==P?void 0:P.locales,null==P?void 0:P.domainLocales);z.href=t||(0,f.addBasePath)((0,c.addLocale)(L,e,null==P?void 0:P.defaultLocale))}return S?n.default.cloneElement(i,z):n.default.createElement("a",{...T,...z},r)}),v=_;("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},920:function(e,t,r){"use strict";Object.defineProperty(t,"__esModule",{value:!0}),Object.defineProperty(t,"useIntersection",{enumerable:!0,get:function(){return useIntersection}});let i=r(7294),n=r(3436),s="function"==typeof IntersectionObserver,a=new Map,o=[];function useIntersection(e){let{rootRef:t,rootMargin:r,disabled:l}=e,c=l||!s,[d,u]=(0,i.useState)(!1),h=(0,i.useRef)(null),p=(0,i.useCallback)(e=>{h.current=e},[]);(0,i.useEffect)(()=>{if(s){if(c||d)return;let e=h.current;if(e&&e.tagName){let i=function(e,t,r){let{id:i,observer:n,elements:s}=function(e){let t;let r={root:e.root||null,margin:e.rootMargin||""},i=o.find(e=>e.root===r.root&&e.margin===r.margin);if(i&&(t=a.get(i)))return t;let n=new Map,s=new IntersectionObserver(e=>{e.forEach(e=>{let t=n.get(e.target),r=e.isIntersecting||e.intersectionRatio>0;t&&r&&t(r)})},e);return t={id:r,observer:s,elements:n},o.push(r),a.set(r,t),t}(r);return s.set(e,t),n.observe(e),function(){if(s.delete(e),n.unobserve(e),0===s.size){n.disconnect(),a.delete(i);let e=o.findIndex(e=>e.root===i.root&&e.margin===i.margin);e>-1&&o.splice(e,1)}}}(e,e=>e&&u(e),{root:null==t?void 0:t.current,rootMargin:r});return i}}else if(!d){let e=(0,n.requestIdleCallback)(()=>u(!0));return()=>(0,n.cancelIdleCallback)(e)}},[c,r,t,d,h.current]);let f=(0,i.useCallback)(()=>{u(!1)},[]);return[p,d,f]}("function"==typeof t.default||"object"==typeof t.default&&null!==t.default)&&void 0===t.default.__esModule&&(Object.defineProperty(t.default,"__esModule",{value:!0}),Object.assign(t.default,t),e.exports=t.default)},3585:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return App}});var i=r(5893);r(415);var n=r(18),s=r(319),a=r(6547),o=r(7294),l=r(1664),c=r.n(l),d=r(1163);function CartDrawer(){let{items:e,totalItems:t,totalPrice:r,totalSavings:a,removeItem:o,addItem:l,isOpen:c,setIsOpen:u}=(0,s.j)(),{user:h}=(0,n.a)(),p=(0,d.useRouter)();if(!c)return null;let f=r>=199||0===r?0:25,m=r>0?4:0,g=r+f+m,_=Math.max(0,199-r),v=Math.min(100,Math.round(r/199*100));return(0,i.jsxs)(i.Fragment,{children:[(0,i.jsx)("div",{className:"fixed inset-0 bg-black/60 z-50 backdrop-blur-xs transition-opacity animate-fade-in",onClick:()=>u(!1)}),(0,i.jsxs)("div",{className:"fixed top-0 right-0 bottom-0 w-full max-w-md bg-[#F4F6FB] z-50 shadow-2xl animate-slide-in flex flex-col",children:[(0,i.jsxs)("div",{className:"bg-white px-5 py-4 flex items-center justify-between border-b border-gray-200 shrink-0",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("h2",{className:"text-base font-black text-gray-900",children:"My Cart"}),(0,i.jsxs)("p",{className:"text-xs text-gray-500 font-medium",children:[t," item",1!==t?"s":""]})]}),(0,i.jsx)("button",{onClick:()=>u(!1),className:"p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-xl transition-colors font-bold text-lg","aria-label":"Close cart",children:"✕"})]}),0===t?(0,i.jsxs)("div",{className:"flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-4 rounded-2xl border border-gray-100",children:[(0,i.jsx)("img",{src:"/images/empty_cart.webp",alt:"Empty cart",className:"w-48 h-48 object-contain mb-4",onError:e=>{e.currentTarget.style.display="none"}}),(0,i.jsx)("h3",{className:"text-lg font-bold text-gray-900 mb-1",children:"You haven't added any items yet!"}),(0,i.jsx)("p",{className:"text-xs text-gray-500 max-w-xs mb-6",children:"Browse from fresh fruits, veggies, dairy, snacks, and daily essentials with delivery in 8 minutes."}),(0,i.jsx)("button",{onClick:()=>u(!1),className:"bg-[#0C831F] hover:bg-[#0a701b] text-white px-6 py-2.5 rounded-xl font-bold text-sm shadow-md active:scale-95 transition-all",children:"Start Shopping"})]}):(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("div",{className:"flex-1 overflow-y-auto p-4 space-y-3",children:[(0,i.jsxs)("div",{className:"bg-white rounded-2xl p-4 border border-gray-100 shadow-xs flex items-center gap-3",children:[(0,i.jsx)("div",{className:"w-10 h-10 rounded-xl bg-emerald-50 text-[#0C831F] flex items-center justify-center text-xl shrink-0",children:"⚡"}),(0,i.jsxs)("div",{className:"flex-1",children:[(0,i.jsx)("div",{className:"text-xs font-black text-gray-900",children:"Delivery in 8 minutes"}),(0,i.jsx)("div",{className:"text-[11px] text-gray-500 font-medium",children:"Order will be prepared at your nearest dark store"})]})]}),(0,i.jsx)("div",{className:"bg-white rounded-2xl p-4 border border-gray-100 shadow-xs",children:_>0?(0,i.jsxs)(i.Fragment,{children:[(0,i.jsxs)("div",{className:"flex items-center justify-between text-xs font-bold mb-1.5",children:[(0,i.jsxs)("span",{className:"text-gray-800",children:["Add ₹",_," more for ",(0,i.jsx)("span",{className:"text-[#0C831F]",children:"FREE Delivery"})]}),(0,i.jsxs)("span",{className:"text-gray-400 font-medium",children:[v,"%"]})]}),(0,i.jsx)("div",{className:"w-full bg-gray-100 h-2 rounded-full overflow-hidden",children:(0,i.jsx)("div",{className:"bg-[#0C831F] h-full rounded-full transition-all duration-300",style:{width:"".concat(v,"%")}})})]}):(0,i.jsxs)("div",{className:"flex items-center gap-2 text-xs font-bold text-[#0C831F]",children:[(0,i.jsx)("span",{children:"\uD83C\uDF89"}),(0,i.jsx)("span",{children:"Yay! You've unlocked FREE Delivery on this order."})]})}),(0,i.jsx)("div",{className:"bg-white rounded-2xl p-4 border border-gray-100 shadow-xs divide-y divide-gray-100",children:e.map(e=>{var t,r;return(0,i.jsxs)("div",{className:"py-3 first:pt-0 last:pb-0 flex items-center gap-3",children:[(0,i.jsx)("img",{src:(null===(r=e.product.images)||void 0===r?void 0:null===(t=r[0])||void 0===t?void 0:t.url)||"https://placehold.co/60x60/f0f0f0/666?text=Zippin",alt:e.product.title,className:"w-12 h-12 object-contain rounded-xl bg-gray-50 p-1 shrink-0"}),(0,i.jsxs)("div",{className:"flex-1 min-w-0",children:[(0,i.jsx)("h4",{className:"text-xs font-bold text-gray-900 truncate",children:e.product.title}),(0,i.jsx)("p",{className:"text-[11px] text-gray-500",children:e.product.unit||"1 unit"}),(0,i.jsxs)("div",{className:"text-xs font-black text-gray-900 mt-1",children:["₹",e.product.price*e.quantity,e.quantity>1&&(0,i.jsxs)("span",{className:"text-[10px] text-gray-400 font-normal ml-1",children:["(₹",e.product.price," each)"]})]})]}),(0,i.jsxs)("div",{className:"flex items-center bg-[#0C831F] text-white rounded-lg overflow-hidden shrink-0 shadow-2xs",children:[(0,i.jsx)("button",{onClick:()=>o(e.product._id),className:"w-6 h-6 flex items-center justify-center hover:bg-[#0a6b19] font-black text-xs transition-colors","aria-label":"Decrease",children:"−"}),(0,i.jsx)("span",{className:"w-5 text-center text-xs font-black select-none",children:e.quantity}),(0,i.jsx)("button",{onClick:()=>l(e.product),className:"w-6 h-6 flex items-center justify-center hover:bg-[#0a6b19] font-black text-xs transition-colors","aria-label":"Increase",children:"+"})]})]},e.product._id)})}),(0,i.jsxs)("div",{className:"bg-white rounded-2xl p-4 border border-gray-100 shadow-xs space-y-2",children:[(0,i.jsx)("h4",{className:"text-xs font-black text-gray-900 uppercase tracking-wider mb-2",children:"Bill Details"}),(0,i.jsxs)("div",{className:"flex justify-between text-xs text-gray-600",children:[(0,i.jsx)("span",{children:"Items Total"}),(0,i.jsxs)("span",{className:"font-semibold text-gray-900",children:["₹",r]})]}),(0,i.jsxs)("div",{className:"flex justify-between text-xs text-gray-600",children:[(0,i.jsx)("span",{children:"Delivery Charge"}),(0,i.jsx)("span",{children:0===f?(0,i.jsx)("span",{className:"text-[#0C831F] font-bold",children:"FREE"}):(0,i.jsxs)("span",{className:"font-semibold text-gray-900",children:["₹",f]})})]}),(0,i.jsxs)("div",{className:"flex justify-between text-xs text-gray-600",children:[(0,i.jsx)("span",{children:"Handling Charge"}),(0,i.jsxs)("span",{className:"font-semibold text-gray-900",children:["₹",m]})]}),a>0&&(0,i.jsxs)("div",{className:"flex justify-between text-xs text-[#0C831F] font-bold bg-emerald-50/70 p-2 rounded-xl",children:[(0,i.jsx)("span",{children:"Your Total Savings"}),(0,i.jsxs)("span",{children:["₹",a]})]}),(0,i.jsxs)("div",{className:"pt-2 border-t border-gray-100 flex justify-between text-sm font-black text-gray-900",children:[(0,i.jsx)("span",{children:"Grand Total"}),(0,i.jsxs)("span",{children:["₹",g]})]})]}),(0,i.jsxs)("div",{className:"bg-gray-100/70 p-3 rounded-xl text-[11px] text-gray-500 leading-tight",children:[(0,i.jsx)("span",{className:"font-bold text-gray-700",children:"Cancellation Policy: "}),"Orders cannot be cancelled once packed for delivery. In case of unexpected delay, refund will be provided."]})]}),(0,i.jsx)("div",{className:"bg-white p-4 border-t border-gray-200 shrink-0",children:(0,i.jsxs)("button",{onClick:function(){u(!1),h?p.push("/checkout"):p.push("/auth/login?redirect=/checkout")},className:"w-full bg-[#0C831F] hover:bg-[#0a701b] text-white py-3.5 px-5 rounded-2xl font-black text-sm flex items-center justify-between shadow-lg active:scale-98 transition-all",children:[(0,i.jsxs)("div",{className:"text-left leading-tight",children:[(0,i.jsxs)("div",{className:"text-xs opacity-80 uppercase tracking-wide",children:[t," item",t>1?"s":""]}),(0,i.jsxs)("div",{className:"text-base font-black",children:["₹",g]})]}),(0,i.jsxs)("div",{className:"flex items-center gap-2",children:[(0,i.jsx)("span",{children:"Proceed to Pay"}),(0,i.jsx)("span",{className:"text-lg",children:"→"})]})]})})]})]})]})}let u=['Search "milk"','Search "bread"','Search "chips"','Search "curd"','Search "butter"','Search "ice cream"','Search "atta"','Search "eggs"','Search "cold drinks"','Search "chocolate"','Search "tomato"','Search "onion"'];function SearchTypeahead(e){let{mobile:t=!1,onClose:r,className:n=""}=e,l=(0,d.useRouter)(),{addItem:c}=(0,s.j)(),{showToast:h}=(0,a.p)(),[p,f]=(0,o.useState)(""),[m,g]=(0,o.useState)(!1),[_,v]=(0,o.useState)([]),[y,b]=(0,o.useState)([]),[x,w]=(0,o.useState)(!1),[I,E]=(0,o.useState)(-1),[C,k]=(0,o.useState)(0),S=(0,o.useRef)(null),T=(0,o.useRef)(null),P=(0,o.useRef)(null);function submitSearch(e){let t=e||p;t&&""!==t.trim()&&(w(!1),r&&r(),l.push("/search?q=".concat(encodeURIComponent(t.trim()))))}return(0,o.useEffect)(()=>{let e=setInterval(()=>{k(e=>(e+1)%u.length)},2800);return()=>clearInterval(e)},[]),(0,o.useEffect)(()=>{function onDocClick(e){S.current&&!S.current.contains(e.target)&&w(!1)}return document.addEventListener("mousedown",onDocClick),()=>document.removeEventListener("mousedown",onDocClick)},[]),(0,o.useEffect)(()=>{if(!p||0===p.trim().length){v([]),b([]),g(!1);return}return g(!0),T.current&&clearTimeout(T.current),P.current&&P.current.abort(),T.current=setTimeout(async()=>{let e=encodeURIComponent(p.trim());P.current=new AbortController;try{let[t,r]=await Promise.all([fetch("/api/products?q=".concat(e,"&limit=6"),{signal:P.current.signal}),fetch("/api/categories?q=".concat(e,"&limit=6"),{signal:P.current.signal})]);t.ok?v(await t.json()):v([]),r.ok?b(await r.json()):b([])}catch(e){"AbortError"!==e.name&&console.error("Typeahead fetch failed",e),v([]),b([])}g(!1),w(!0),E(-1)},220),()=>{T.current&&clearTimeout(T.current),P.current&&P.current.abort()}},[p]),(0,i.jsxs)("div",{ref:S,className:"relative w-full ".concat(n),children:[(0,i.jsxs)("div",{className:"relative w-full flex items-center",children:[(0,i.jsx)("svg",{className:"absolute left-3.5 w-4 h-4 text-gray-500 pointer-events-none",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2.3,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),(0,i.jsx)("input",{type:"text",placeholder:u[C],value:p,onChange:e=>{f(e.target.value),w(!0)},onKeyDown:function(e){if(x){if("ArrowDown"===e.key)e.preventDefault(),E(e=>Math.min(e+1,_.length+y.length-1));else if("ArrowUp"===e.key)e.preventDefault(),E(e=>Math.max(e-1,0));else if("Enter"===e.key){e.preventDefault();let t=[..._.map(e=>({type:"product",item:e})),...y.map(e=>({type:"category",item:e}))];if(I>=0&&I<t.length){let e=t[I];"category"===e.type?(w(!1),r&&r(),l.push("/category/".concat(e.item.slug))):submitSearch(e.item.title||e.item.name||p)}else submitSearch()}else"Escape"===e.key&&w(!1)}},className:"w-full py-2.5 pl-10 pr-9 rounded-xl bg-[#F4F6FB] border border-gray-200/80 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:bg-white focus:border-[#0C831F] focus:ring-1 focus:ring-[#0C831F] transition-all",autoFocus:t}),p&&(0,i.jsx)("button",{onClick:()=>{f(""),w(!1)},className:"absolute right-3 text-gray-400 hover:text-gray-600 text-sm font-bold",children:"✕"})]}),x&&(_.length>0||y.length>0||m)&&(0,i.jsxs)("div",{className:"absolute left-0 right-0 mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 p-2 z-50 max-h-80 overflow-y-auto animate-fade-in",children:[m&&(0,i.jsx)("div",{className:"px-3 py-2 text-xs text-gray-500 font-medium",children:"Searching grocery shelves…"}),y.length>0&&(0,i.jsxs)("div",{className:"pb-1",children:[(0,i.jsx)("div",{className:"text-[11px] px-3 py-1 text-gray-400 font-bold uppercase tracking-wider",children:"Categories"}),y.map((e,t)=>(0,i.jsxs)("button",{onClick:()=>{w(!1),r&&r(),l.push("/category/".concat(e.slug))},className:"w-full text-left px-3 py-2 rounded-xl hover:bg-gray-50 text-sm flex items-center gap-3 transition-colors ".concat(I===t?"bg-gray-100":""),children:[e.image?(0,i.jsx)("img",{src:e.image,alt:e.name,className:"w-8 h-8 object-contain rounded-lg shrink-0"}):(0,i.jsx)("span",{className:"text-xl shrink-0",children:e.icon||"\uD83D\uDCE6"}),(0,i.jsx)("div",{children:(0,i.jsx)("div",{className:"font-semibold text-gray-800",children:e.name})})]},e._id))]}),_.length>0&&(0,i.jsxs)("div",{className:"pt-1 border-t border-gray-100",children:[(0,i.jsx)("div",{className:"text-[11px] px-3 py-1 text-gray-400 font-bold uppercase tracking-wider",children:"Products"}),_.map((e,t)=>{var r,n;let s=t+y.length;return(0,i.jsxs)("div",{className:"px-3 py-2 flex items-center gap-3 hover:bg-gray-50 rounded-xl transition-colors ".concat(I===s?"bg-gray-100":""),children:[(0,i.jsx)("img",{src:(null===(n=e.images)||void 0===n?void 0:null===(r=n[0])||void 0===r?void 0:r.url)||"https://placehold.co/48x48/f0f0f0/666?text=Zippin",alt:e.title,className:"w-10 h-10 object-contain rounded-lg bg-gray-50 p-1 shrink-0"}),(0,i.jsxs)("div",{className:"flex-1 min-w-0 cursor-pointer",onClick:()=>submitSearch(e.title),children:[(0,i.jsx)("div",{className:"text-xs font-bold text-gray-800 truncate",children:e.title}),(0,i.jsxs)("div",{className:"text-[11px] text-gray-400",children:["₹",e.price," ",e.unit&&(0,i.jsxs)("span",{children:["• ",e.unit]})]})]}),(0,i.jsx)("button",{onClick:()=>{c(e),h&&h("Added to cart — ".concat(e.title))},className:"text-xs bg-[#0C831F] hover:bg-[#0a701b] text-white px-3 py-1 rounded-lg font-bold transition-transform active:scale-95",children:"ADD"})]},e._id)})]}),!m&&0===_.length&&0===y.length&&(0,i.jsxs)("div",{className:"px-4 py-4 text-xs text-gray-500 text-center font-medium",children:['No results found for "',p,'". Press Enter to search all.']})]})]})}function Layout(e){var t;let{children:r}=e,{totalItems:a,totalPrice:l,totalSavings:u,isOpen:h,setIsOpen:p}=(0,s.j)(),{user:f,logout:m}=(0,n.a)(),[g,_]=(0,o.useState)(!1),[v,y]=(0,o.useState)(!1),[b,x]=(0,o.useState)("Gurugram, Sector 43, Haryana, India"),[w,I]=(0,o.useState)(!1),[E,C]=(0,o.useState)(null),[k,S]=(0,o.useState)(""),[T,P]=(0,o.useState)(!1);(0,d.useRouter)();let N=(0,o.useRef)(null);async function detectUserLocation(){if(!navigator.geolocation){C({type:"error",message:"GPS not supported on this browser"});return}I(!0),C({type:"loading",message:"Acquiring GPS satellite fix..."}),navigator.geolocation.getCurrentPosition(async e=>{try{let{latitude:t,longitude:r}=e.coords;C({type:"loading",message:"Resolving street & dark store zone..."});let i=await fetch("https://nominatim.openstreetmap.org/reverse?lat=".concat(t,"&lon=").concat(r,"&format=jsonv2&addressdetails=1"),{headers:{"Accept-Language":"en"}});if(i.ok){let e=await i.json(),n=e.address||{},s=n.neighbourhood||n.suburb||n.residential||n.road||n.commercial||n.village||"",a=n.city||n.town||n.state_district||n.county||"",o=n.state||"",l=n.postcode||"",c=[s,a,o,l].filter(Boolean),d=c.length>0?c.join(", "):e.display_name?e.display_name.split(",").slice(0,3).join(", "):"Detected Location";x(d),localStorage.setItem("zippin_user_location",d),a&&localStorage.setItem("zippin_user_city",a),l&&localStorage.setItem("zippin_user_pincode",l),localStorage.setItem("zippin_user_coords",JSON.stringify({lat:t,lng:r})),C({type:"success",message:"Location detected successfully! ⚡ 8-min delivery"}),setTimeout(()=>{y(!1),C(null)},800)}else throw Error("Geocoding failed")}catch(e){console.warn("Reverse geocode fallback to IP:",e);try{let e=await fetch("https://ipapi.co/json/");if(e.ok){let t=await e.json(),r="".concat(t.city||"Gurugram",", ").concat(t.region||"Haryana",", ").concat(t.postal||"122001");x(r),localStorage.setItem("zippin_user_location",r),C({type:"success",message:"Pinpointed to ".concat(t.city||"your city")}),setTimeout(()=>{y(!1),C(null)},800)}else C({type:"error",message:"Unable to detect exact address. Please pick below."})}catch(e){C({type:"error",message:"Unable to detect GPS. Please pick below."})}}finally{I(!1)}},e=>{I(!1),1===e.code?C({type:"error",message:"Location permission denied. Please allow GPS access or choose a city below."}):C({type:"error",message:"GPS signal timed out. Please select your neighborhood below."})},{enableHighAccuracy:!0,timeout:1e4,maximumAge:6e4})}return(0,o.useEffect)(()=>{{let e=localStorage.getItem("zippin_user_location");e&&x(e)}},[]),(0,o.useEffect)(()=>{function handleClickOutside(e){N.current&&!N.current.contains(e.target)&&_(!1)}return document.addEventListener("mousedown",handleClickOutside),()=>document.removeEventListener("mousedown",handleClickOutside)},[]),(0,i.jsxs)("div",{className:"min-h-screen bg-[#F4F6FB] flex flex-col font-sans",children:[(0,i.jsxs)("div",{className:"bg-[#F8CB46] text-[#1C1C1C] text-center py-1.5 px-4 text-xs font-bold tracking-wide flex items-center justify-center gap-2 border-b border-yellow-400",children:[(0,i.jsx)("span",{className:"bg-white/80 text-[#0C831F] text-[10px] uppercase font-black px-2 py-0.5 rounded-full shadow-xs",children:"FASTEST"}),(0,i.jsx)("span",{children:"⚡ Superfast Delivery in 8-10 Minutes | Free Delivery on orders above ₹199"})]}),(0,i.jsxs)("header",{className:"bg-white sticky top-0 z-50 border-b border-gray-200/80 shadow-[0_2px_8px_rgba(0,0,0,0.04)]",children:[(0,i.jsxs)("div",{className:"max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3 md:gap-6",children:[(0,i.jsxs)("div",{className:"flex items-center gap-3 shrink-0",children:[(0,i.jsx)(c(),{href:"/",className:"flex items-center group shrink-0",children:(0,i.jsx)("img",{src:"/images/zippin_logo_blinkit_colours.png",alt:"Zippin",className:"h-9 md:h-11 w-auto object-contain transition-transform group-hover:scale-105"})}),(0,i.jsx)("div",{className:"hidden lg:block h-8 w-[1px] bg-gray-200 mx-1"}),(0,i.jsxs)("button",{onClick:()=>y(!0),className:"hidden sm:flex items-center gap-2 text-left px-2.5 py-1.5 rounded-xl hover:bg-gray-100 transition-colors",children:[(0,i.jsx)("div",{className:"w-7 h-7 rounded-full bg-emerald-50 text-[#0C831F] flex items-center justify-center shrink-0",children:(0,i.jsx)("svg",{className:"w-4 h-4",fill:"currentColor",viewBox:"0 0 20 20",children:(0,i.jsx)("path",{fillRule:"evenodd",d:"M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",clipRule:"evenodd"})})}),(0,i.jsxs)("div",{className:"leading-tight",children:[(0,i.jsx)("div",{className:"text-xs font-black text-gray-900 flex items-center gap-1",children:"Delivery in 8 minutes"}),(0,i.jsx)("div",{className:"text-[11px] text-gray-500 font-medium truncate max-w-[140px] md:max-w-[200px]",children:b})]}),(0,i.jsx)("svg",{className:"w-3.5 h-3.5 text-gray-400 ml-0.5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2.5,d:"M19 9l-7 7-7-7"})})]})]}),(0,i.jsx)("div",{className:"hidden md:flex flex-1 max-w-2xl",children:(0,i.jsx)(SearchTypeahead,{className:"w-full",onNavigate:()=>P(!1)})}),(0,i.jsxs)("div",{className:"flex items-center gap-2 md:gap-4 shrink-0",children:[(0,i.jsx)("button",{onClick:()=>P(!T),className:"md:hidden p-2 text-gray-600 hover:text-gray-900 rounded-lg hover:bg-gray-100","aria-label":"Search",children:(0,i.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})})}),(0,i.jsxs)("div",{className:"relative",ref:N,children:[f?(0,i.jsxs)("button",{onClick:()=>_(!g),className:"flex items-center gap-2 px-3 py-2 rounded-xl text-gray-800 hover:bg-gray-100 font-semibold text-sm transition-colors",children:[(0,i.jsx)("div",{className:"w-7 h-7 rounded-full bg-[#0C831F] text-white flex items-center justify-center text-xs font-bold",children:f.name?f.name.charAt(0).toUpperCase():"U"}),(0,i.jsx)("span",{className:"hidden lg:inline text-sm",children:(null===(t=f.name)||void 0===t?void 0:t.split(" ")[0])||"Account"}),(0,i.jsx)("svg",{className:"w-3 h-3 text-gray-400",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2,d:"M19 9l-7 7-7-7"})})]}):(0,i.jsx)(c(),{href:"/auth/login",className:"text-sm font-bold text-gray-800 hover:text-[#0C831F] px-3 py-2 rounded-xl hover:bg-gray-100 transition-colors",children:"Login"}),g&&f&&(0,i.jsxs)("div",{className:"absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 animate-fade-in z-50",children:[(0,i.jsxs)("div",{className:"px-4 py-2 border-b border-gray-100",children:[(0,i.jsx)("p",{className:"text-sm font-bold text-gray-800",children:f.name}),(0,i.jsx)("p",{className:"text-xs text-gray-500 truncate",children:f.email})]}),(0,i.jsxs)(c(),{href:"/account",className:"flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#0C831F] transition-colors",onClick:()=>_(!1),children:[(0,i.jsx)("span",{children:"\uD83D\uDC64"})," My Profile & Addresses"]}),(0,i.jsxs)(c(),{href:"/orders",className:"flex items-center gap-2.5 px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#0C831F] transition-colors",onClick:()=>_(!1),children:[(0,i.jsx)("span",{children:"\uD83D\uDCE6"})," My Orders"]}),(0,i.jsxs)("button",{onClick:()=>{m(),_(!1)},className:"flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left transition-colors border-t border-gray-100 mt-1",children:[(0,i.jsx)("span",{children:"\uD83D\uDEAA"})," Logout"]})]})]}),(0,i.jsxs)("button",{onClick:()=>p(!0),className:"flex items-center gap-2.5 bg-[#0C831F] hover:bg-[#0a701b] text-white rounded-xl px-4 py-2.5 font-bold text-sm shadow-sm transition-all active:scale-95 shrink-0",children:[(0,i.jsx)("svg",{className:"w-5 h-5",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2.2,d:"M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z"})}),a>0?(0,i.jsxs)("div",{className:"flex items-center gap-1.5 text-left leading-tight",children:[(0,i.jsxs)("span",{children:[a," item",a>1?"s":""]}),(0,i.jsx)("span",{className:"opacity-70",children:"•"}),(0,i.jsxs)("span",{children:["₹",l]})]}):(0,i.jsx)("span",{children:"My Cart"})]})]})]}),T&&(0,i.jsx)("div",{className:"md:hidden px-4 pb-3 pt-1 border-t border-gray-100 bg-white animate-slide-up",children:(0,i.jsx)(SearchTypeahead,{mobile:!0,onClose:()=>P(!1)})})]}),v&&(0,i.jsx)("div",{className:"fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in",children:(0,i.jsxs)("div",{className:"bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl relative animate-slide-up border border-gray-100 max-h-[90vh] overflow-y-auto",children:[(0,i.jsx)("button",{onClick:()=>{y(!1),C(null)},className:"w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-900 absolute top-5 right-5 flex items-center justify-center font-bold text-sm transition-colors",children:"✕"}),(0,i.jsxs)("div",{className:"flex items-center gap-3 mb-5",children:[(0,i.jsx)("div",{className:"w-12 h-12 rounded-2xl bg-emerald-50 text-[#0C831F] flex items-center justify-center shadow-inner shrink-0",children:(0,i.jsx)("svg",{className:"w-6 h-6",fill:"currentColor",viewBox:"0 0 20 20",children:(0,i.jsx)("path",{fillRule:"evenodd",d:"M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z",clipRule:"evenodd"})})}),(0,i.jsxs)("div",{children:[(0,i.jsx)("h3",{className:"font-black text-gray-900 text-lg tracking-tight",children:"Select Delivery Location"}),(0,i.jsx)("p",{className:"text-xs text-gray-500 mt-0.5",children:"Instant 8-minute delivery enabled in your neighborhood"})]})]}),(0,i.jsxs)("div",{className:"mb-4",children:[(0,i.jsxs)("button",{onClick:detectUserLocation,disabled:w,className:"w-full p-3.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-[#0C831F] hover:from-emerald-600 hover:to-[#0a731b] text-white flex items-center justify-between shadow-md shadow-emerald-900/20 active:scale-[0.99] transition-all group",children:[(0,i.jsxs)("div",{className:"flex items-center gap-3",children:[(0,i.jsx)("div",{className:"w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center text-white",children:w?(0,i.jsxs)("svg",{className:"w-5 h-5 animate-spin",fill:"none",viewBox:"0 0 24 24",children:[(0,i.jsx)("circle",{className:"opacity-25",cx:"12",cy:"12",r:"10",stroke:"currentColor",strokeWidth:"4"}),(0,i.jsx)("path",{className:"opacity-75",fill:"currentColor",d:"M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"})]}):(0,i.jsxs)("svg",{className:"w-5 h-5 group-hover:scale-110 transition-transform",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:[(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2.5",d:"M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"}),(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2.5",d:"M15 11a3 3 0 11-6 0 3 3 0 016 0z"})]})}),(0,i.jsxs)("div",{className:"text-left",children:[(0,i.jsxs)("div",{className:"text-xs font-black tracking-wide flex items-center gap-1.5",children:[(0,i.jsx)("span",{children:"Detect My Current Location"}),(0,i.jsx)("span",{className:"text-[10px] bg-white/20 px-1.5 py-0.5 rounded font-bold uppercase",children:"GPS"})]}),(0,i.jsx)("div",{className:"text-[11px] text-emerald-100 font-medium",children:w?"Locating doorstep via satellite...":"Automatically fetch address via browser GPS"})]})]}),(0,i.jsx)("div",{className:"text-xs font-bold bg-white text-[#0C831F] px-2.5 py-1 rounded-xl shadow-xs",children:w?"Locating...":"Auto Fetch"})]}),E&&(0,i.jsxs)("div",{className:"mt-2 p-2.5 rounded-xl text-xs font-medium flex items-center gap-2 ".concat("success"===E.type?"bg-emerald-50 text-emerald-800 border border-emerald-200":"loading"===E.type?"bg-blue-50 text-blue-800 border border-blue-200":"bg-rose-50 text-rose-700 border border-rose-200"),children:[(0,i.jsx)("span",{children:"success"===E.type?"✅":"loading"===E.type?"\uD83D\uDEF0️":"⚠️"}),(0,i.jsx)("span",{children:E.message})]})]}),(0,i.jsxs)("div",{className:"relative mb-3",children:[(0,i.jsx)("input",{type:"text",value:k,onChange:e=>S(e.target.value),placeholder:"Search area, landmark or pincode...",className:"w-full pl-9 pr-8 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#0C831F]"}),(0,i.jsx)("svg",{className:"w-4 h-4 text-gray-400 absolute left-3 top-3",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:"2",d:"M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"})}),k&&(0,i.jsx)("button",{onClick:()=>S(""),className:"absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 font-bold",children:"✕"})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("div",{className:"text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-2",children:"Fast Delivery Available In:"}),(0,i.jsx)("div",{className:"space-y-1.5 max-h-56 overflow-y-auto pr-1",children:[{name:"Gurugram, Sector 43, Haryana, India",hub:"Cyber City Hub #101",city:"Gurugram",pin:"122002"},{name:"Gurugram, DLF Phase 2, Haryana, India",hub:"Golf Course Hub #102",city:"Gurugram",pin:"122008"},{name:"New Delhi, Connaught Place, Delhi, India",hub:"CP Central Hub #201",city:"New Delhi",pin:"110001"},{name:"New Delhi, Saket / South Delhi, Delhi, India",hub:"Saket Metro Hub #202",city:"New Delhi",pin:"110017"},{name:"Noida, Sector 62, Uttar Pradesh, India",hub:"Electronic City Hub #301",city:"Noida",pin:"201309"},{name:"Noida, Sector 18, Uttar Pradesh, India",hub:"Atta Market Hub #302",city:"Noida",pin:"201301"},{name:"Bengaluru, Indiranagar, Karnataka, India",hub:"100ft Road Hub #401",city:"Bengaluru",pin:"560038"},{name:"Bengaluru, Koramangala, Karnataka, India",hub:"Sony Signal Hub #402",city:"Bengaluru",pin:"560034"},{name:"Mumbai, Bandra West, Maharashtra, India",hub:"Hill Road Hub #501",city:"Mumbai",pin:"400050"},{name:"Mumbai, Andheri East, Maharashtra, India",hub:"MIDC Tech Hub #502",city:"Mumbai",pin:"400093"}].filter(e=>!k||e.name.toLowerCase().includes(k.toLowerCase())||e.pin.includes(k)||e.hub.toLowerCase().includes(k.toLowerCase())).map((e,t)=>{let r=b===e.name;return(0,i.jsxs)("button",{onClick:()=>{x(e.name),localStorage.setItem("zippin_user_location",e.name),localStorage.setItem("zippin_user_city",e.city),localStorage.setItem("zippin_user_pincode",e.pin),y(!1),C(null)},className:"w-full text-left p-3 rounded-2xl border text-xs font-medium transition-all flex items-center justify-between ".concat(r?"border-[#0C831F] bg-emerald-50/70 text-[#0C831F] font-bold shadow-xs":"border-gray-100 hover:border-gray-300 text-gray-700 hover:bg-gray-50"),children:[(0,i.jsxs)("div",{className:"flex items-center gap-2.5 min-w-0",children:[(0,i.jsx)("span",{className:"text-base shrink-0",children:r?"\uD83D\uDCCD":"\uD83C\uDFE2"}),(0,i.jsxs)("div",{className:"truncate",children:[(0,i.jsx)("div",{className:"truncate font-bold text-gray-900",children:e.name}),(0,i.jsxs)("div",{className:"text-[10px] text-gray-400 font-mono mt-0.5",children:[e.hub," • PIN: ",e.pin]})]})]}),(0,i.jsxs)("div",{className:"flex items-center gap-2 shrink-0",children:[(0,i.jsx)("span",{className:"text-[10px] font-bold text-[#0C831F] bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200",children:"⚡ 8 min"}),r&&(0,i.jsx)("span",{className:"text-xs font-black text-[#0C831F]",children:"✓"})]})]},t)})})]})]})}),(0,i.jsx)("main",{className:"flex-1 max-w-7xl mx-auto w-full",children:r}),(0,i.jsx)(CartDrawer,{}),a>0&&(0,i.jsx)("div",{className:"md:hidden fixed bottom-0 left-0 right-0 z-40 p-3 bg-gradient-to-t from-white via-white to-transparent",children:(0,i.jsxs)("button",{onClick:()=>p(!0),className:"w-full bg-[#0C831F] hover:bg-[#0a701b] text-white py-3 px-4 rounded-xl flex items-center justify-between font-bold text-sm shadow-xl active:scale-98 transition-all",children:[(0,i.jsxs)("div",{className:"flex items-center gap-2.5",children:[(0,i.jsxs)("span",{className:"bg-white/20 px-2.5 py-1 rounded-lg text-xs",children:[a," item",a>1?"s":""]}),(0,i.jsxs)("span",{children:["₹",l]}),u>0&&(0,i.jsxs)("span",{className:"text-yellow-300 text-xs font-semibold",children:["SAVED ₹",u]})]}),(0,i.jsxs)("div",{className:"flex items-center gap-1.5",children:[(0,i.jsx)("span",{children:"View Cart"}),(0,i.jsx)("svg",{className:"w-4 h-4",fill:"none",stroke:"currentColor",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{strokeLinecap:"round",strokeLinejoin:"round",strokeWidth:2.5,d:"M9 5l7 7-7 7"})})]})]})}),(0,i.jsx)("footer",{className:"bg-white border-t border-gray-200 mt-16 pt-12 pb-8",children:(0,i.jsxs)("div",{className:"max-w-7xl mx-auto px-4",children:[(0,i.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 border-b border-gray-100",children:[(0,i.jsxs)("div",{className:"flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]",children:[(0,i.jsx)("img",{src:"/images/minute_delivery.png",alt:"10 minute delivery",className:"w-14 h-14 object-contain shrink-0",onError:e=>{e.currentTarget.style.display="none"}}),(0,i.jsxs)("div",{children:[(0,i.jsx)("h4",{className:"font-bold text-gray-900 text-sm",children:"Superfast 10-Min Delivery"}),(0,i.jsx)("p",{className:"text-xs text-gray-500 mt-0.5",children:"Get your order delivered to your doorstep in minutes from dark stores nearby."})]})]}),(0,i.jsxs)("div",{className:"flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]",children:[(0,i.jsx)("img",{src:"/images/Best_Prices_Offers.png",alt:"Best Prices & Offers",className:"w-14 h-14 object-contain shrink-0",onError:e=>{e.currentTarget.style.display="none"}}),(0,i.jsxs)("div",{children:[(0,i.jsx)("h4",{className:"font-bold text-gray-900 text-sm",children:"Best Prices & Offers"}),(0,i.jsx)("p",{className:"text-xs text-gray-500 mt-0.5",children:"Best price with direct manufacturer deals, bulk savings, and daily discounts."})]})]}),(0,i.jsxs)("div",{className:"flex items-center gap-4 p-4 rounded-2xl bg-[#F7F9FC]",children:[(0,i.jsx)("img",{src:"/images/Wide_Assortment.png",alt:"Wide Assortment",className:"w-14 h-14 object-contain shrink-0",onError:e=>{e.currentTarget.style.display="none"}}),(0,i.jsxs)("div",{children:[(0,i.jsx)("h4",{className:"font-bold text-gray-900 text-sm",children:"Wide Assortment"}),(0,i.jsx)("p",{className:"text-xs text-gray-500 mt-0.5",children:"Choose from 10,000+ items across groceries, snacks, beverages, home & pet care."})]})]})]}),(0,i.jsxs)("div",{className:"grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-8 py-10",children:[(0,i.jsxs)("div",{children:[(0,i.jsx)("h5",{className:"font-black text-gray-900 text-xs tracking-wider uppercase mb-4",children:"Popular Categories"}),(0,i.jsxs)("ul",{className:"space-y-2 text-xs text-gray-600 font-medium",children:[(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/vegetables-fruits",className:"hover:text-[#0C831F]",children:"Vegetables & Fruits"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/dairy-breakfast",className:"hover:text-[#0C831F]",children:"Dairy & Breakfast"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/munchies",className:"hover:text-[#0C831F]",children:"Munchies & Chips"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/cold-drinks-juices",className:"hover:text-[#0C831F]",children:"Cold Drinks & Juices"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/instant-frozen-food",className:"hover:text-[#0C831F]",children:"Instant & Frozen Food"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/tea-coffee-health",className:"hover:text-[#0C831F]",children:"Tea, Coffee & Health"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/bakery-biscuits",className:"hover:text-[#0C831F]",children:"Bakery & Biscuits"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/sweet-tooth",className:"hover:text-[#0C831F]",children:"Sweet Tooth & Ice Cream"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/atta-rice-dal",className:"hover:text-[#0C831F]",children:"Atta, Rice & Dal"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/pharma-wellness",className:"hover:text-[#0C831F]",children:"Pharma & Wellness"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/pet-care",className:"hover:text-[#0C831F]",children:"Pet Care Store"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/baby-care",className:"hover:text-[#0C831F]",children:"Baby Care Essentials"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/category/paan-corner",className:"hover:text-[#0C831F] font-bold text-emerald-800",children:"\uD83C\uDF43 Paan Corner"})})]})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("h5",{className:"font-black text-gray-900 text-xs tracking-wider uppercase mb-4",children:"Useful Links"}),(0,i.jsxs)("ul",{className:"space-y-2 text-xs text-gray-600 font-medium",children:[(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/about",className:"hover:text-[#0C831F]",children:"About Us"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/careers",className:"hover:text-[#0C831F]",children:"Careers"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/blog",className:"hover:text-[#0C831F]",children:"Zippin Blog"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/press",className:"hover:text-[#0C831F]",children:"Press & Media"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/lead",className:"hover:text-[#0C831F]",children:"Lead"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/support",className:"hover:text-[#0C831F]",children:"Customer Support"})})]})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("h5",{className:"font-black text-gray-900 text-xs tracking-wider uppercase mb-4",children:"Partner with us"}),(0,i.jsxs)("ul",{className:"space-y-2 text-xs text-gray-600 font-medium",children:[(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/partner/franchise",className:"hover:text-[#0C831F]",children:"Franchise Opportunities"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/partner/seller",className:"hover:text-[#0C831F]",children:"Seller Central"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/partner/warehouse",className:"hover:text-[#0C831F]",children:"Warehouse Partner"})}),(0,i.jsx)("li",{children:(0,i.jsx)(c(),{href:"/partner/delivery",className:"hover:text-[#0C831F]",children:"Deliver with Zippin"})})]})]}),(0,i.jsxs)("div",{children:[(0,i.jsx)("h5",{className:"font-black text-gray-900 text-xs tracking-wider uppercase mb-4",children:"Download Zippin App"}),(0,i.jsx)("p",{className:"text-xs text-gray-500 mb-3",children:"Experience lightning-fast grocery delivery on your mobile phone."}),(0,i.jsxs)("div",{className:"space-y-2.5",children:[(0,i.jsxs)(c(),{href:"/download",className:"flex items-center gap-3 bg-black hover:bg-neutral-900 border border-neutral-800 text-white px-3.5 py-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm","aria-label":"Download on the App Store",children:[(0,i.jsx)("svg",{className:"w-6 h-6 fill-current text-white shrink-0",viewBox:"0 0 24 24",children:(0,i.jsx)("path",{d:"M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.38c.62-.75 1.04-1.8 1.01-2.85-.92.04-2.07.62-2.73 1.39-.58.67-1.09 1.74-1.03 2.78 1.02.08 2.12-.57 2.75-1.32z"})}),(0,i.jsxs)("div",{className:"text-left leading-tight",children:[(0,i.jsx)("div",{className:"text-[10px] uppercase tracking-wide opacity-80 font-normal",children:"Download on the"}),(0,i.jsx)("div",{className:"text-sm font-semibold tracking-tight",children:"App Store"})]})]}),(0,i.jsxs)(c(),{href:"/download",className:"flex items-center gap-3 bg-black hover:bg-neutral-900 border border-neutral-800 text-white px-3.5 py-2.5 rounded-xl cursor-pointer transition-all hover:scale-[1.02] shadow-sm","aria-label":"Get it on Google Play",children:[(0,i.jsxs)("svg",{className:"w-5 h-5 shrink-0",viewBox:"0 0 24 24",children:[(0,i.jsx)("path",{fill:"#4285F4",d:"M3.609 1.814L13.792 12 3.61 22.186A2.257 2.257 0 0 1 3 20.6V3.4A2.257 2.257 0 0 1 3.609 1.814z"}),(0,i.jsx)("path",{fill:"#34A853",d:"M17.18 8.613l-3.388 3.388 3.388 3.387 3.824-2.173a1.444 1.444 0 0 0 0-2.43l-3.824-2.172z"}),(0,i.jsx)("path",{fill:"#EA4335",d:"M13.792 12L3.61 22.186c.642.68 1.62.83 2.476.344l11.094-6.303L13.792 12z"}),(0,i.jsx)("path",{fill:"#FBBC05",d:"M17.18 8.613L6.086 2.31A2.183 2.183 0 0 0 3.61 1.814L13.792 12l3.388-3.387z"})]}),(0,i.jsxs)("div",{className:"text-left leading-tight",children:[(0,i.jsx)("div",{className:"text-[9px] uppercase tracking-wider opacity-80 font-medium",children:"Get it on"}),(0,i.jsx)("div",{className:"text-sm font-semibold tracking-tight",children:"Google Play"})]})]})]})]})]}),(0,i.jsxs)("div",{className:"pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-400 gap-3",children:[(0,i.jsxs)("p",{children:["\xa9 ",new Date().getFullYear()," Zippin Technologies. All rights reserved."]}),(0,i.jsx)("p",{className:"text-center sm:text-right",children:"“Zippin” is India's ultrafast 10-minute grocery delivery app."})]})]})})]})}var h=r(9008),p=r.n(h);function Toast(){let{toast:e}=(0,a.p)();return e?(0,i.jsx)("div",{className:"fixed left-1/2 -translate-x-1/2 bottom-8 z-50 animate-slide-up pointer-events-none",children:(0,i.jsxs)("div",{className:"bg-[#0C831F] text-white px-5 py-2.5 rounded-full shadow-2xl flex items-center gap-2 text-xs font-black border border-emerald-400/40 tracking-wide",children:[(0,i.jsx)("span",{className:"w-4 h-4 rounded-full bg-white text-[#0C831F] flex items-center justify-center text-[10px] font-black",children:"✓"}),(0,i.jsx)("span",{children:e.message})]})}):null}function App(e){let{Component:t,pageProps:r}=e;return(0,i.jsx)(n.H,{children:(0,i.jsx)(s.Z,{children:(0,i.jsxs)(a.V,{children:[(0,i.jsxs)(p(),{children:[(0,i.jsx)("title",{children:"Zippin - Everything delivered in 8-10 minutes"}),(0,i.jsx)("meta",{name:"description",content:"India's fastest delivery app. Buy milk, bread, butter, fresh fruits & vegetables, snacks, and daily groceries online with superfast 10-minute delivery."}),(0,i.jsx)("meta",{name:"viewport",content:"width=device-width, initial-scale=1, maximum-scale=1"}),(0,i.jsx)("meta",{name:"theme-color",content:"#FFFFFF"}),(0,i.jsx)("link",{rel:"icon",type:"image/svg+xml",href:"/favicon.svg"}),(0,i.jsx)("link",{rel:"icon",type:"image/png",sizes:"32x32",href:"/favicon-32x32.png"}),(0,i.jsx)("link",{rel:"icon",type:"image/png",sizes:"16x16",href:"/favicon-16x16.png"}),(0,i.jsx)("link",{rel:"shortcut icon",href:"/favicon.ico"}),(0,i.jsx)("link",{rel:"apple-touch-icon",href:"/images/apple-touch-icon.png"})]}),(0,i.jsx)(Layout,{children:(0,i.jsx)(t,{...r})}),(0,i.jsx)(Toast,{})]})})})}},415:function(){},7663:function(e){!function(){var t={229:function(e){var t,r,i,n=e.exports={};function defaultSetTimout(){throw Error("setTimeout has not been defined")}function defaultClearTimeout(){throw Error("clearTimeout has not been defined")}function runTimeout(e){if(t===setTimeout)return setTimeout(e,0);if((t===defaultSetTimout||!t)&&setTimeout)return t=setTimeout,setTimeout(e,0);try{return t(e,0)}catch(r){try{return t.call(null,e,0)}catch(r){return t.call(this,e,0)}}}!function(){try{t="function"==typeof setTimeout?setTimeout:defaultSetTimout}catch(e){t=defaultSetTimout}try{r="function"==typeof clearTimeout?clearTimeout:defaultClearTimeout}catch(e){r=defaultClearTimeout}}();var s=[],a=!1,o=-1;function cleanUpNextTick(){a&&i&&(a=!1,i.length?s=i.concat(s):o=-1,s.length&&drainQueue())}function drainQueue(){if(!a){var e=runTimeout(cleanUpNextTick);a=!0;for(var t=s.length;t;){for(i=s,s=[];++o<t;)i&&i[o].run();o=-1,t=s.length}i=null,a=!1,function(e){if(r===clearTimeout)return clearTimeout(e);if((r===defaultClearTimeout||!r)&&clearTimeout)return r=clearTimeout,clearTimeout(e);try{r(e)}catch(t){try{return r.call(null,e)}catch(t){return r.call(this,e)}}}(e)}}function Item(e,t){this.fun=e,this.array=t}function noop(){}n.nextTick=function(e){var t=Array(arguments.length-1);if(arguments.length>1)for(var r=1;r<arguments.length;r++)t[r-1]=arguments[r];s.push(new Item(e,t)),1!==s.length||a||runTimeout(drainQueue)},Item.prototype.run=function(){this.fun.apply(null,this.array)},n.title="browser",n.browser=!0,n.env={},n.argv=[],n.version="",n.versions={},n.on=noop,n.addListener=noop,n.once=noop,n.off=noop,n.removeListener=noop,n.removeAllListeners=noop,n.emit=noop,n.prependListener=noop,n.prependOnceListener=noop,n.listeners=function(e){return[]},n.binding=function(e){throw Error("process.binding is not supported")},n.cwd=function(){return"/"},n.chdir=function(e){throw Error("process.chdir is not supported")},n.umask=function(){return 0}}},r={};function __nccwpck_require__(e){var i=r[e];if(void 0!==i)return i.exports;var n=r[e]={exports:{}},s=!0;try{t[e](n,n.exports,__nccwpck_require__),s=!1}finally{s&&delete r[e]}return n.exports}__nccwpck_require__.ab="//";var i=__nccwpck_require__(229);e.exports=i}()},9008:function(e,t,r){e.exports=r(9201)},1664:function(e,t,r){e.exports=r(5170)},1163:function(e,t,r){e.exports=r(9974)}},function(e){var __webpack_exec__=function(t){return e(e.s=t)};e.O(0,[774,179],function(){return __webpack_exec__(3837),__webpack_exec__(9974)}),_N_E=e.O()}]);