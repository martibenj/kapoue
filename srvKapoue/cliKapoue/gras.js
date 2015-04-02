function Gras($scope, $http)
{
	$scope.get = function() {
		console.log('Activation du bouton');
		$http.get("./kapoue/truc")
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
		$http.get("./photo/kapoue")
			.success(
			function(data)
			{


				$scope.images = data;

			})
			.error(
			function(data, status)
			{
				alert("Erreur lors de la recuperation de l'image");
			});
	}
}
