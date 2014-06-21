(function(window, document){
    var ws = window.ws || (window.ws = {}),
    
    controllersCollection = {},
    
    directiveCollection = {},

    parseViewData = function(html){
        var nodes = [];
        (function tree(element){
            var nodesTags = ['input', 'textarea', 'select']
            if (element.childNodes.length > 0) {
                for (var i = 0; i < element.childNodes.length; i++) {
                    tree(element.childNodes[i]);
                }
            }
            if (
                (element.nodeType == Node.TEXT_NODE 
                    && element.nodeValue.trim() != '') 
                    || (element.tagName 
                    && !!~nodesTags.indexOf(element.tagName.toLowerCase())
                    && element.attributes
                    && element.attributes['value']
                    )
                ) {

                nodes.push(
                    (element.attributes && element.attributes['value']) 
                    ? element.attributes['value'] 
                    : element
                    );
            }
        })(html);
        
        var readyToModel = {};

        nodes.forEach(function(node){
            var text = node.value ? node.value : node.nodeValue;
            var reg = /\{\{([^}]+)}}/gim,
                m,
                i,
                textArray = text.split(reg),
                textNodesArray = [];
            
            for(i = 0; i < textArray.length; i++){
                var tn = document.createTextNode(textArray[i]);
                textNodesArray.push(tn);
            }

            while((m = reg.exec(text)) !== null){
                var key = m[1], params;
                
                if(key.indexOf('(') !== -1){
                    _key = key.split('(');
                    var _params;
                    if((_params = _key[1].replace(')', '')) !== ""){
                        params = _params.split(',');    
                    }
                    
                    key = _key[0]; 
                }

                if(m[1] && !readyToModel[key]) readyToModel[key] = [];

                for(i = 0; i < textNodesArray.length; i++){
                    if(textNodesArray[i].nodeValue === m[1]){
                        readyToModel[key].push({
                            type: 'text',
                            node: textNodesArray[i],
                            params: params || []
                        });     
                    }
                }
            }
            if(node.value) node.value = "";
            else node.nodeValue = "";

            textNodesArray.forEach(function(textNode){
                if(!node.parentNode) node.appendChild(textNode);
                else node.parentNode.insertBefore(textNode, node);
            });

        });

        return readyToModel;
    },

    getCorrectString = function(dataLine, node){
        if(typeof dataLine === 'function'){
            dataLine = dataLine.apply(null, node.params);
        }
        return dataLine;
    },

    replaceWithData = function(name, data, itemsToModel){
        var n = name;
        if(itemsToModel[n]){
            var tpl;

            itemsToModel[n].forEach(function(item){
                if(item.type === 'text'){
                    var val = getCorrectString(data, item);
                    item.node.nodeValue = val;
                } else if(item.type === 'element'){
                    if(item.node.getAttribute('ws-model') === n){
                        item.node.value = data;
                    }   
                }
            }); 
        }
    },

    appendDataToView = function(controllerName, controllerElement){
        var ctrl = controllersCollection[controllerName];

        ctrl.template = controllerElement;

        var model = ctrl.fn();

        var itemsToModel = parseViewData(controllerElement);

        Object.keys(directiveCollection).forEach(function(dName){
            [].forEach.call(controllerElement.querySelectorAll("["+ dName +"]"), function(el){
                directiveCollection[dName].fn(model, el)
            });
        });

        Object.observe(model, function(dataEvt){
            dataEvt.forEach(function(changes){
                if(changes.type === 'init' || changes.type === 'add'){
                    var data = changes['object'];
                    for(var i in data){
                        replaceWithData(i, data[i], itemsToModel);
                    }
                } else if(changes.type === 'update'){                    
                    replaceWithData(changes.name, changes['object'][changes.name], itemsToModel);
                } else if(changes.type === 'delete'){
                    itemsToModel[changes.name].forEach(function(node){
                        node.node.nodeValue = "";
                    });
                }
            });

        }, ['init', 'update', 'add', 'delete']);

        Object.getNotifier(model).notify({
            type: 'init',
            name: 'model'
        });
    },

    directives = {
        'ws-controller': function(model, element){
            var ctrl = element.getAttribute('ws-controller');
            if(controllersCollection[ctrl]){
                appendDataToView(ctrl, element);
            }
        }, 
        'ws-model': function(model, element){
            element.addEventListener('keyup', function(){
                model[this.getAttribute('ws-model')] = this.value;
            }, false);

            if(!element.getAttribute('value')){
                element.setAttribute('value', model[element.getAttribute('ws-model')]);
            }
            Object.observe(model, function(dataEvt){
                dataEvt.forEach(function(changes){
                    if(changes.name === element.getAttribute('ws-model')){
                        element.value = "";
                    }
                });

            }, ['delete']);
        },
        'ws-click': function(model, element){
            element.addEventListener('click', function(e){
                if(typeof model[this.getAttribute('ws-click')] === 'function'){
                    model[this.getAttribute('ws-click')](e);
                }
            }, false);
        }
    };

    ws.controller = function(name, func){
        if(!name) throw new Error('controller name is required');
        controllersCollection[name] = {};
        controllersCollection[name].fn = function(){
            var model = Object.create({});
            func(model);
            return model;
        }
        return ws;
    };

    ws.directive = function(name, func){
        if(!name) throw new Error('directive name is required');
        directiveCollection[name] = {};
        directiveCollection[name].fn = function(model, element){
            return func.call(null, model, element);
        }
        return ws;
    };

    Object.keys(directives).forEach(function(dName){
        ws.directive(dName, directives[dName]);
    });

    document.addEventListener('DOMContentLoaded', function(){
        [].forEach.call(document.querySelectorAll("[ws-controller]"), function(el){
            directiveCollection['ws-controller'].fn(null, el)
        });
    });
})(window, document);