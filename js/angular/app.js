angular.module("myapp", [])
.controller("HelloController", function($scope) {
    var m = 0,
        iter = [];
    
    (function(){
        while(m <= 10) iter.push(m++);
    })();

    $scope.digestMessage = "Hello World";
    
    $scope.iter = function(){
        return iter;
    };

    $scope.iter2 = iter;
    
    $scope.changeSomething = function(){
        iter[0] = m++;
        iter.push(m++);     
        iter.push(m++);
        $scope.digestMessage = "Changed Message!!";
    };

}).controller("SecondController", function($scope) {
	$scope.items = [1,2,3,4,5,6,7,8];
    $scope.changeSomething = function(){
    	$scope.items.push(9);	
    };
});