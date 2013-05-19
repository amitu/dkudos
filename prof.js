// prof.js content, this is stored directly inside dkudos-application folder 

// we have a variable "profile" that contains build related settings

var profile = {

    // basePath tell dojo build system where is everything, in our case
    // we are going to store prof.js as well as everything else in our 
    // dkudos-application foder, so it points to ".". 

    // note that this path is relative to prof.js file.

    basePath: '.',

    // for us, action is going to always be release

    action: 'release',

    // dojo by default tries to optimize the generated javascript files using
    // clojure compiler or (older) shrinksafe library that comes with dojo. 
    // we are going to switch the optimization off to iterate quickly, as 
    // those optimizations take a lot of time. i tend to prefer to call clojure
    // after dojo build is done. 

    optimize: '',

    // same as optimize, we will discuss layers later on

    layerOptimize: '',

    // this is a working directory in which dojo build system will create files
    // note that this path is relative to basePath.

    releaseDir: 'dist',

    // dojo build system understand .js as well as .css files, in case of css
    // it can optimize a css by removing comments, inlining any css file that
    // was @import-ed into a given css file. setting it to "comments" does both
    // if we do not want that we can set it to ""

    // in our case we are not inlining anything, but if we have more than one
    // widgets, the best practice is to have a separate css file for each widget
    // and one css for for the entire application that simply @import-s each of
    // them, and use cssOptimize below to optimize it into one css file.

    cssOptimize: "comments",

    // dojo has more than one selector engine. "lite" and "acme", "acme" is the
    // acme supports a lot of different queries, while lite is a much simple, 
    // and much smaller selector engine. lite only supports css2 queries, and is
    // 2kb or so, where as acme supports supports full css3, but is 12kb or so

    selectorEngine: 'lite',

    // now we see a new concept of "packages". a package is just a folder 
    // containing js, css, html README etc files. in order to a proper 
    // "package", we should also add a "package.json" file in the package folder, 
    // containing name, description etc for the package. as you see it is 
    // optional, we have not created one for ourselves. a package may also want 
    // to have "package.js" file, this package.js file is linked from 
    // package.json using eg by putting {"dojoBuild": "package.js"}. so what is 
    // in package.js file? a package may have some files that need not be built 
    // into baked dojo, eg it may have test files, or it may have demo files 
    // etc. package.js can be used to properly "tag" the files so build system 
    // handles the content of the file intelligently. anyways, we are not going 
    // to use that either as we only have .js files which happens to be proper 
    // dojo AMD modules, and css and html files. when we add tests we might
    // want to create our own package.json and package.js files.

    // the purpose of "packages" setting is two fold, one is to give a list of 
    // packages to dojo, and also to specify the path on disc where to find them
    // in our case we have simply cloned dojo in the current directory, but if
    // we had many projects we may not want to do that and keep dojo in a common
    // location. since in our case package name is same as the name of the
    // folder in which we can find them we can just pass a string containing
    // the name, if name and package were not same we would have passed 
    // {name: "dojo", location: "path of dojo relative to basePath"}. we can 
    // mix string and object in case some package are in current folder and some
    // others are in a separate location.

    packages: ["dojo", "dijit", "dojox", "dkudos", "dojo-local-storage"],

    // now comes layers. the motivation behind layers is this: in some projects
    // the code could be quite complex, and different part of code may be needed
    // for different portions of the site. eg gmail. gmail has a bunch of code
    // that is used when page is loaded, but then there is also "contacts" 
    // feature in gmail, which need not be loaded when main gmail application 
    // starts, and should be loaded only when use clicks on the contacts link.
    // similarly for tasks, which is also not always loaded, and only loaded 
    // when user clicks on tasks.

    // in general a layer only needs a name of the layer and the include list.
    // based on modules in include list dojo will create a javascript file that
    // contains all the modules in it. 

    // a layer can also use exclude: ["amd1", "amd2"], in case amd1/amd2 are 
    // required by the AMDs specified in include list, but we want to force them
    // to be not included, this we may do when we want to a build a separate 
    // layer only containing amd1/amd2 for example.

    // finally at least one of the layers must include boot: true. if boot is 
    // true then the code for **require** and **define** methods themselves will
    // be included in that layer. 

    layers: {
        'dojo/dojo': {include: ["dkudos/main"], boot: true} 
    }, 

    // finally we can move dojo configuration from HTML to our baked build

    defaultConfig: {
        async: true, 
        deps:['dkudos/main']
    }
};