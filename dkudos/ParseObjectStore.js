Parse.initialize(
    "R4itZTuvbWZ1PHI5RCu2LKkqMaMl5QFVZLzPyeYM", 
    "52jAgPNq3iHJitnsqkfB8atmhXOZ5aqFTQPZKF39"
);

define(
    ["dojo/_base/declare", "dojo/Stateful", "dojo/Deferred"], 
    function(declare, Stateful, Deferred){

        return declare(null, {

            get: function(url, params) {

                // we are going to return a promise, lets create one
                // whenever we have data we can .resolve() it.

                var promise = new Deferred();

                // if you do not know how parse works, ignore this line.

                var Kudo = Parse.Object.extend("Kudos");


                var stateful_obj = new Stateful();

                stateful_obj.set("url", url);
                stateful_obj.set("kudoed", params.initialKudo);

                // this is when we make a get requst to fetch data from parse
                // HTTP(s) server. the request .first() is asynchrounous, and
                // our success callback is called when the result is ready.
                // ideally we should pass an error callback too and call 
                // promise.reject() to be good citizens of promise world.

                new Parse.Query(Kudo).equalTo("url", url).first({

                    success: function(result) {

                        // we are here when the we have received the response
                        // from parse. 

                        // apologies for score vs count confusion
                        // in parse i have number of kudos scored as score
                        // where as in our widget we are using the term count

                        if (result) 
                        {

                            // at this point we set the "count" on the stateful
                            // object so anybody how is bound to count can 
                            // update themselves. 

                            stateful_obj.set("count", result.get("score"));
                            stateful_obj.set("kudo", result);

                        }
                        else 
                        {

                            // this means there is no record for this "url" on 
                            // parse. no problem, we will care it. it should 
                            // only happen the first time a page is ever loaded

                            stateful_obj.set("count", 0);

                            var kudo = new Kudo();
                            kudo.set("url", url);
                            kudo.set("score", 0);
                            kudo.save(); // happens in background
                            stateful_obj.set("kudo", kudo);

                        }

                        stateful_obj.watch(
                            "kudoed", function(name, oldValue, newValue){

                                // this is a bit of ideosyncracy, even tho the
                                // value has not changed, its been updated. we
                                // ignore it. 

                                if (oldValue == newValue) return;

                                // kudo is our object returned by Parse

                                var kudo = stateful_obj.get("kudo");

                                // somebody changed the value of "kudoed", if
                                // the new value is true, we must increment the 
                                // score, else decrement it. we are going to use 
                                // parse specific api for that.

                                if (newValue) 
                                {
                                    kudo.increment("score");
                                } 
                                else
                                {
                                    kudo.increment("score", -1);  
                                }

                                kudo.save({
                                    success: function(savedKudo) {

                                        // we could have just done a count += 1
                                        // but this is more accurate as its 
                                        // getting latest count from server

                                        stateful_obj.set(
                                            "count", savedKudo.get("score")
                                        );
                                    }
                                });
                            }
                        );

                        // this is how we tell anyone who is waiting for data
                        // from promise that data is available, stateful_obj
                        // is the data they will recieve for the original 
                        // .get() call.

                        promise.resolve(stateful_obj);

                    }
                });

                return promise;
            }

        });
    }
);
