define(
    [
        "dojo/parser", "dkudos/KudosLocalStorage", "dijit/registry",
        "dojox/mvc/sync", "dkudos/ParseObjectStore", "dojo/domReady!", 
        "dkudos/KudosWidget"
    ], function (parser, KudosLocalStorage, registry, sync, ParseObjectStore) {

        parser.parse();
        var key = document.location.pathname;
        var widget = registry.byId("kudos");
        var ls_data = new KudosLocalStorage().get(key);

        widget.set("kudoed", ls_data.get("kudoed"));

        sync(widget, "kudoed", ls_data, "kudoed", {bindDirection: sync.from});

        new ParseObjectStore().get(
            key, {initialKudo: ls_data.get("kudoed")}
        ).then(function(data){

            widget.set("count", data.get("count"));

            sync(data, "count", widget, "count", {bindDirection: sync.from});
            sync(widget, "kudoed", data, "kudoed", {bindDirection: sync.from});
            
        });
    }
);
