(window.webpackJsonp=window.webpackJsonp||[]).push([[42],{181:function(e,t,r){"use strict";r.r(t),r.d(t,"frontMatter",(function(){return i})),r.d(t,"metadata",(function(){return a})),r.d(t,"rightToc",(function(){return c})),r.d(t,"default",(function(){return l}));var n=r(1),o=(r(0),r(209));const i={id:"trigger-list",title:"trigger-list"},a={id:"trigger-list",title:"trigger-list",description:"Returns the set of registered triggers associated with a root directory.",source:"@site/docs/trigger-list.md",permalink:"/watchman/docs/trigger-list",editUrl:"https://github.com/facebook/watchman/edit/master/website/docs/trigger-list.md",sidebar:"sidebar",previous:{title:"trigger-del",permalink:"/watchman/docs/trigger-del"},next:{title:"unsubscribe",permalink:"/watchman/docs/unsubscribe"}},c=[],s={rightToc:c};function l({components:e,...t}){return Object(o.b)("wrapper",Object(n.a)({},s,t,{components:e,mdxType:"MDXLayout"}),Object(o.b)("p",null,"Returns the set of registered triggers associated with a root directory."),Object(o.b)("pre",null,Object(o.b)("code",Object(n.a)({parentName:"pre"},{className:"language-bash"}),"$ watchman trigger-list /root\n")),Object(o.b)("p",null,"Note that the format of the output from ",Object(o.b)("inlineCode",{parentName:"p"},"trigger-list")," changed in Watchman\nversion 2.9.7. It will now output a list of trigger objects as defined by the\n",Object(o.b)("inlineCode",{parentName:"p"},"trigger")," command."))}l.isMDXComponent=!0},209:function(e,t,r){"use strict";r.d(t,"a",(function(){return p})),r.d(t,"b",(function(){return g}));var n=r(0),o=r.n(n);function i(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function a(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function c(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?a(Object(r),!0).forEach((function(t){i(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):a(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function s(e,t){if(null==e)return{};var r,n,o=function(e,t){if(null==e)return{};var r,n,o={},i=Object.keys(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||(o[r]=e[r]);return o}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(n=0;n<i.length;n++)r=i[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(o[r]=e[r])}return o}var l=o.a.createContext({}),u=function(e){var t=o.a.useContext(l),r=t;return e&&(r="function"==typeof e?e(t):c({},t,{},e)),r},p=function(e){var t=u(e.components);return o.a.createElement(l.Provider,{value:t},e.children)},f={inlineCode:"code",wrapper:function(e){var t=e.children;return o.a.createElement(o.a.Fragment,{},t)}},b=Object(n.forwardRef)((function(e,t){var r=e.components,n=e.mdxType,i=e.originalType,a=e.parentName,l=s(e,["components","mdxType","originalType","parentName"]),p=u(r),b=n,g=p["".concat(a,".").concat(b)]||p[b]||f[b]||i;return r?o.a.createElement(g,c({ref:t},l,{components:r})):o.a.createElement(g,c({ref:t},l))}));function g(e,t){var r=arguments,n=t&&t.mdxType;if("string"==typeof e||n){var i=r.length,a=new Array(i);a[0]=b;var c={};for(var s in t)hasOwnProperty.call(t,s)&&(c[s]=t[s]);c.originalType=e,c.mdxType="string"==typeof e?e:n,a[1]=c;for(var l=2;l<i;l++)a[l]=r[l];return o.a.createElement.apply(null,a)}return o.a.createElement.apply(null,r)}b.displayName="MDXCreateElement"}}]);