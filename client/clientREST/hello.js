function Hello($scope, $http)
{
	$scope.get = function()
	{
		console.log('Activation du bouton');
		$http.get('http://127.0.0.1:3000/kapoue').success(function(data)
			{
				console.log('test2');
				$scope.objet = data;
			})
		 .error(function(data, status)
		{
                alert("erreur : status = " + status);
        });
	}
}