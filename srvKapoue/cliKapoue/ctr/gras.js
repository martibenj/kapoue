var myKap = angular.module('myKap',['angularFileUpload']);


myKap.controller('Gras', ['$scope', '$http', function($scope, $http)
{
	$scope.get = function() {
		console.log('Activation du bouton');
		$http.get("./kapoue/1")
			.success(
			function (data) {
				$scope.petiteKapoue = data.petiteKapoue;
			}
		)
			.error(function (data, status) {
				alert("Erreur : status = " + status);
			});
	};

	// recuperation de toutes les images
	$scope.getImgs = function()
	{
		console.log ('recuperation de l image');
		$http.get("./photos")
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

	// recuperation d'une image
	$scope.getImg = function()
	{
		console.log ('recuperation de l image ' + $scope.index);
		$http.get("./photo/" + $scope.index)
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
	};

	$scope.uploadFile = function(fichier) {
		var fd = new FormData();
		//Take the first selected file
		console.log(fichier);
		fd.append("file", fichier);

		$http.post("./upload", fd, {
			withCredentials: true,
			headers: {'Content-Type': image/jpeg },
			transformRequest: angular.identity
		}).success().error();

	};
}]);