ws.controller('firstCtrl', function(model){
	model.messageHeader = "Hello World";
	model.messageBody = "lorem ipsum";
	model.inputValue = "value";

	model.items = [1, 2, 3, 4];

	model.someFunction = function(){
		return "from function";
	};
	
	model.onFuckingClick = function(){
		model.messageHeader = "Changes after Click";
	};

	model.onDelProperty = function(){
		delete model.inputValue;
	}
	
	model.buttonName = "press me!";

	setTimeout(function(){
		model.buttonName = "wow, will you press it or not ???";
	}, 1000)
})