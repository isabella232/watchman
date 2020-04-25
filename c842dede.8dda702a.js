(window.webpackJsonp=window.webpackJsonp||[]).push([[48],{188:function(e,t,n){"use strict";n.r(t),n.d(t,"frontMatter",(function(){return r})),n.d(t,"metadata",(function(){return c})),n.d(t,"rightToc",(function(){return o})),n.d(t,"default",(function(){return s}));var i=n(1),a=(n(0),n(209));const r={id:"watchman-replicate-subscription",title:"watchman-replicate-subscription"},c={id:"watchman-replicate-subscription",title:"watchman-replicate-subscription",description:"_Since 5.0_",source:"@site/docs/watchman-replicate-subscription.md",permalink:"/watchman/docs/watchman-replicate-subscription",editUrl:"https://github.com/facebook/watchman/edit/master/website/docs/watchman-replicate-subscription.md",sidebar:"sidebar",previous:{title:"watchman-wait",permalink:"/watchman/docs/watchman-wait"},next:{title:"C++ Client",permalink:"/watchman/docs/cppclient"}},o=[{value:"Source subscription",id:"source-subscription",children:[]},{value:"Controlling lifetime",id:"controlling-lifetime",children:[]},{value:"Controlling output",id:"controlling-output",children:[]},{value:"Exit Status",id:"exit-status",children:[]}],l={rightToc:o};function s({components:e,...t}){return Object(a.b)("wrapper",Object(i.a)({},l,t,{components:e,mdxType:"MDXLayout"}),Object(a.b)("p",null,Object(a.b)("em",{parentName:"p"},"Since 5.0")),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"watchman-replicate-subscription")," can replicate an existing watchman\nsubscription. It queries watchman for a list of subscriptions, identifies the\nsource subscription (the subscription to replicate) and subscribes to watchman\nusing the same query."),Object(a.b)("p",null,"Integrators can use this client to validate the watchman notifications their\nclient is receiving to localize anomalous behavior."),Object(a.b)("p",null,"The source subscription is identified using any combination of the 'name',\n'pid', and 'client' arguments. The provided combination must uniquely identify\na subscription. Source subscription details for a watched root can be\nretrieved by running the command 'watchman-replicate-subscription --list\nPATH'."),Object(a.b)("p",null,"By default, the replicated subscription will take the source subscription name\nand prepend the substring 'replicate: ' to it. The 'qname' option can be used\nto specify the replicated subscription name."),Object(a.b)("p",null,"The subscription can stop after a configurable number of events are observed.\nThe default is a single event. You may also remove the limit and allow it to\nexecute continuously."),Object(a.b)("p",null,"watchman-replicate-subscription will print one event per line. The event\ninformation is determined by the fields in the identified subscription, with\neach field separated by a space (or your choice of --separator)."),Object(a.b)("p",null,"Subscription state-enter and state-leave PDUs will be interleaved with other\nevents. Known subscription PDUs (currently only those generated by the\nmercurial fsmonitor extension) will be enclosed in square brackets. All others\nwill be output in JSON format."),Object(a.b)("p",null,"Events are consolidated and settled by the watchman server before they are\ndispatched to watchman-replicate-subscription."),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"watchman-replicate-subscription")," requires pywatchman (and thus requires\npython) as well as watchman."),Object(a.b)("h3",{id:"source-subscription"},"Source subscription"),Object(a.b)("pre",null,Object(a.b)("code",Object(i.a)({parentName:"pre"},{className:"language-bash"}),"$ watchman-replicate-subscription PATH -n NAME\n")),Object(a.b)("p",null,"The source subscription must be an existing subscription for the provided\npath. Any combination of the 'name', 'pid', and 'client' arguments can be used\nprovided they uniquely identify a subscription. Source subscription details\nfor a watched root can be retrieved as follows:"),Object(a.b)("pre",null,Object(a.b)("code",Object(i.a)({parentName:"pre"},{className:"language-bash"}),"$ watchman-replicate-subscriptions PATH --list\n")),Object(a.b)("p",null,"The subscription name, pid and client can then used to replicate the\nsubscription."),Object(a.b)("pre",null,Object(a.b)("code",Object(i.a)({parentName:"pre"},{className:"language-bash"}),"$ watchman-replicate-subscription PATH -n NAME -c CLIENT -p PID\n")),Object(a.b)("h3",{id:"controlling-lifetime"},"Controlling lifetime"),Object(a.b)("p",null,"There are two primary controls for how long ",Object(a.b)("inlineCode",{parentName:"p"},"watchman-replicate-subscription"),"\nwill run:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"-t")," or ",Object(a.b)("inlineCode",{parentName:"li"},"--timeout")," places a time limit on execution"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"-m")," or ",Object(a.b)("inlineCode",{parentName:"li"},"--max-events")," places a limit on the number of events to process")),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"watchman-replicate-subscription")," will terminate when either the timeout is\nhit or the max events limit is hit."),Object(a.b)("p",null,"By default there is no time limit, but there is a default limit of a single\nevent."),Object(a.b)("p",null,"You may specify ",Object(a.b)("inlineCode",{parentName:"p"},"--max-events 0")," to disable the event limit."),Object(a.b)("h3",{id:"controlling-output"},"Controlling output"),Object(a.b)("p",null,Object(a.b)("inlineCode",{parentName:"p"},"watchman-replicate-subscription")," will output one line per event. The\nfollowing options influence the output:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"--separator STRING")," - if you specified multiple fields, the separator\nstring will be used when printing them. The default is ",Object(a.b)("inlineCode",{parentName:"li"},'--separator " "'),"\nwhich will print the fields with spaces between them.")),Object(a.b)("h3",{id:"exit-status"},"Exit Status"),Object(a.b)("p",null,"The following exit status codes can be used to determine what caused\n",Object(a.b)("inlineCode",{parentName:"p"},"watchman-replicate-subscription")," to exit:"),Object(a.b)("ul",null,Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"0")," is returned after successfully waiting for event(s) or listing matching\nsubscriptions"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"1")," in case of a runtime error of some kind"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"2")," the ",Object(a.b)("inlineCode",{parentName:"li"},"-t"),"/",Object(a.b)("inlineCode",{parentName:"li"},"--timeout")," option was used and that amount of time passed\nbefore an event was received"),Object(a.b)("li",{parentName:"ul"},Object(a.b)("inlineCode",{parentName:"li"},"3")," if execution was interrupted (Ctrl-C)")))}s.isMDXComponent=!0},209:function(e,t,n){"use strict";n.d(t,"a",(function(){return u})),n.d(t,"b",(function(){return d}));var i=n(0),a=n.n(i);function r(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function c(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);t&&(i=i.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),n.push.apply(n,i)}return n}function o(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?c(Object(n),!0).forEach((function(t){r(e,t,n[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):c(Object(n)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))}))}return e}function l(e,t){if(null==e)return{};var n,i,a=function(e,t){if(null==e)return{};var n,i,a={},r=Object.keys(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||(a[n]=e[n]);return a}(e,t);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);for(i=0;i<r.length;i++)n=r[i],t.indexOf(n)>=0||Object.prototype.propertyIsEnumerable.call(e,n)&&(a[n]=e[n])}return a}var s=a.a.createContext({}),p=function(e){var t=a.a.useContext(s),n=t;return e&&(n="function"==typeof e?e(t):o({},t,{},e)),n},u=function(e){var t=p(e.components);return a.a.createElement(s.Provider,{value:t},e.children)},b={inlineCode:"code",wrapper:function(e){var t=e.children;return a.a.createElement(a.a.Fragment,{},t)}},m=Object(i.forwardRef)((function(e,t){var n=e.components,i=e.mdxType,r=e.originalType,c=e.parentName,s=l(e,["components","mdxType","originalType","parentName"]),u=p(n),m=i,d=u["".concat(c,".").concat(m)]||u[m]||b[m]||r;return n?a.a.createElement(d,o({ref:t},s,{components:n})):a.a.createElement(d,o({ref:t},s))}));function d(e,t){var n=arguments,i=t&&t.mdxType;if("string"==typeof e||i){var r=n.length,c=new Array(r);c[0]=m;var o={};for(var l in t)hasOwnProperty.call(t,l)&&(o[l]=t[l]);o.originalType=e,o.mdxType="string"==typeof e?e:i,c[1]=o;for(var s=2;s<r;s++)c[s]=n[s];return a.a.createElement.apply(null,c)}return a.a.createElement.apply(null,n)}m.displayName="MDXCreateElement"}}]);