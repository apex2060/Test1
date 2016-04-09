app.lazy.controller('MapsCtrl', function($scope, $http, config){
    $http.post(config.parse.root+'/functions/multiCurrent').success(function(r){
        $scope.trucks = r.result
    })
    it.MapsCtrl = $scope;
});