function Gras($scope, $http)
{
	$scope.get = function() {
		console.log('Activation du bouton');
		$http.get("http://localhost:3000/kapoue/truc")
			.success(
			function (data) {
				$scope.petiteKapoue = data.petiteKapoue;
			}
		)
			.error(function (data, status) {
				alert("Erreur : status = " + status);
			});
	};

	$scope.getImg = function()
	{
		console.log ('recuperation de l image');
		$http.get("http://localhost:3000/photo/kapoue")
			.success(
			function(data)
			{


				$scope.imageKapoue = data;

			})
			.error(
			function(data, status)
			{
				alert("Erreur lors de la recuperation de l'image");
			});
	}
}
