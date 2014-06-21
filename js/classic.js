var Model = function(data){
    this.data = data || {};
};

Model.prototype = Object.create({
    setDataProperty: function(property, value){
        var oldValue = undefined;

        if(this.data[property]) oldValue = this.data[property];
        this.data[property] = value;

        this.fireEvent('dataChanged', {
            newValue: value,
            oldValue: oldValue
        });
    },
    getDataProperty: function(property){
        return this.data[property] || null;
    },
    $events: null,
    addEvent: function(eventName, callback){
        if(this.eventsFilter && this.eventsFilter.length && !~this.eventsFilter.indexOf(eventName)) throw 'Class does not support this Event';
        this.$events = this.$events || {};
        this.$events[eventName] = this.$events[eventName] || [];

        this.$events[eventName].push(callback);
        return this;
    },
    fireEvent: function(eventName){
        if (!this.$events) return this;
        var args = [].slice.call(arguments, 1);

        var events = this.$events[eventName];
        if (events) {
            for(var i = 0, l = events.length; i < l; i++){
                events[i].apply(this, args);
            }
        }
        return this;
    }
});

//view
(function(){
    document.addEventListener('DOMContentLoaded', function(){
        var someModel = new Model(),
            viewInput = document.querySelector('input'),
            viewButton = document.querySelector('button');  


        someModel.addEvent('dataChanged', function(data){
            console.log(data);
            viewInput.value = data.newValue;
        });

        someModel.setDataProperty('value', 123);
        

        viewInput.addEventListener('change', function(){
            someModel.setDataProperty('value', this.value);
        });

        viewButton.addEventListener('click', function(){
            someModel.setDataProperty('value', 'test data');
        }); 
        
    });
})();