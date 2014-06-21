(function(){
    'use strict';

    var updateIU = function(changes){
        if(changes.oldValue !== changes.newValue){
            var attachedElement = document.querySelectorAll('[data-ws-model="'+ changes['key'] +'"]');
            
            if(attachedElement && attachedElement.length){
                [].forEach.call(attachedElement, function(element){
                    //get element type and apply chages. 
                    element.value = changes.newValue;
                })
            }   
        }
    };

    var createModel = function(obj){
        
        var model = {
            setters: Object.create({}),
            _currentValues: Object.create({})
        };

        for(var i in obj){
            if(obj.hasOwnProperty(i)){
                (function(ind){
                    
                    Object.defineProperty(model.setters, ind, {
                        get: function(){
                            return model._currentValues[ind];
                        },
                        set: function(val){
                            var oldValue = this[ind];
                            if(oldValue === val) return;
                            model._currentValues[ind] = val;

                            updateIU({
                                key: ind,
                                oldValue: oldValue,
                                newValue: val,
                                obj: this
                            });
                            console.log(val)
                        }
                    });

                    model.setters[ind] = obj[ind];
                })(i);
            }
        }
        return model.setters;
    };

    var testModel = createModel({
        test: 123,
        some: 321
    });

    document.addEventListener('DOMContentLoaded', function(){
        
        var inputs = document.querySelectorAll('[data-ws-model]');
        
        [].forEach.call(inputs, function(inp){
            
            inp.value = testModel[inp.dataset['wsModel']] || "";

            inp.addEventListener('change', function(){
                if(testModel[this.dataset['wsModel']]) testModel[this.dataset['wsModel']] = this.value;
            }, false);

        });

        document.querySelector('button').addEventListener('click', function(){
            testModel['some'] = 'test';

        });

    });

})();