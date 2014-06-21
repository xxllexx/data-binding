var obj = {
	first: 123,
	second: 'abc'
};

var callback = function(event){
	event.forEach(function(ev){
		console.log('event: ', ev);
	});
}

optAcceptList = ['delete'];

Object.observe(obj, callback);


//create new object property
obj.third = 'cba';

//delete object property
delete obj.second;

//change object property
obj.first = 321;


var model = {
	a: {}
}

var _b = 2;

Object.defineProperty(model.a, 'b', {
    get: function () {
        return _b;
    },
    set: function (b) {
        
        Object.getNotifier(this).notify({
            type: 'testType',
            name: 'b',
            oldValue: _b
        });

        _b = b;
    }
});


var callback2 = function(event){
	console.log(event);
};

Object.observe(model.a, callback2, ['testType']);

model.a.b = 10;


Object.unobserve(model.a, callback2);

model.a.b = 12;


var model = ['123', '432', '645'];
var count = 0;

Array.observe(model, function(changeRecords) {
  count++;
  console.log(changeRecords, count);
});

model[0] = 'qwe';
model[1] = 'vcz';





