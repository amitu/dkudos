define(
    [
        "dojo/_base/declare", "dojo-local-storage/LocalStorage", "dojo/Stateful"
    ], 
    function(
        declare, LocalStorage, Stateful
    ){
        return declare(LocalStorage, {

            idProperty: "url",

            // luckily for us we have to only update .get()
            get: function() {

                // first we get the actual data from our parent class
                var obj = this.inherited(arguments);

                if (!obj) {
                    obj = {"url": arguments[0], "kudoed": false};
                }

                // then we wrap it and make it Stateful
                var stateful_obj = new Stateful(obj);

                var store = this; // we can also hitch

                // now we want to watch for changes in property "kudoed"
                stateful_obj.watch("kudoed", function(name, oldValue, newValue){
                    store.put(
                        {"url": stateful_obj.get("url"), "kudoed": newValue}
                    );
                });

                // we return stateful object instead of "naked" one
                return stateful_obj;
            }

        });
    }
);
