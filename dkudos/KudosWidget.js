define(
    [
        "dojo/_base/declare", "dijit/_WidgetBase", "dijit/_TemplatedMixin",
        "dojo/text!dkudos/KudosWidget.html", "dojo/dom-class", 
        "dojo/_base/lang", "dojo/on"
    ], 
    function(
        declare, _WidgetBase, _TemplatedMixin, template, domClass, lang, on
    ){

        return declare([_WidgetBase, _TemplatedMixin], {

            templateString: template,

            // two new member variables

            kudoed: false,
            count: 0,

            // this is special form, it is called when someone calls
            // widget.set("kudoes", value);

            _setKudoedAttr: function(value) {

                // this._set is how to set things without calling events                

                this._set("kudoed", value);

                if (value)
                    this.markDone();
                else 
                    this.markNotDone();
            },

            // same for count

            _setCountAttr: function(value) {
                this._set("count", value);
                this.setCount(value);
            },

            isKudoable: function() {
                return domClass.contains(this.domNode, "kudoable");
            },

            isKudod: function() {
                return domClass.contains(this.domNode, "complete");   
            },

            complete: function() {
                this.end();
                domClass.add(this.domNode, 'complete');
                this.set("kudoed", true);
            },

            unkudo: function(event) {
                event.preventDefault();
                if (this.isKudod()) {
                    domClass.remove(this.domNode, 'complete');
                    domClass.remove(this.domNode, 'complete');
                    this.set("kudoed", false);
                }
            }, 

            setCount: function(count) {
                return this.counter.innerHTML = count;
            },

            start: function(evt) {
                if (this.isKudoable() && !this.isKudod()) {
                    domClass.add(this.domNode, 'active');
                    this.timer = setTimeout(
                        lang.hitch(this, this.complete), 700
                    );
                }            
            }, 

            end: function() {
                if (this.isKudoable() && !this.isKudod()) {
                    domClass.remove(this.domNode, 'active');
                    if (this.timer != null) {
                        clearTimeout(this.timer);
                    }
                }
            },

            markNotDone: function() {
                domClass.add(this.domNode, "animate");
                domClass.remove(this.domNode, "complete");
            },

            markDone: function() {
                domClass.remove(this.domNode, "animate");
                domClass.add(this.domNode, "complete");
            },

            postCreate: function() {
                on(this.domNode, "click", lang.hitch(this, this.unkudo));
            }
        });
    }
);