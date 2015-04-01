function Gras($scope, $http)
{
	$scope.get = function()
	{
		console.log('Activation du bouton');
		$http.get("http://localhost:3000/kapoue/truc")
		.success(
			function(data) {
				$scope.petiteKapoue = data.petiteKapoue;
			}
		)
		.error(function(data, status)
		{
		      alert("Erreur : status = " + status);
		});
	}
}
