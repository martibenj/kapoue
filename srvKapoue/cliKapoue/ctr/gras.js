var myKap = angular.module('myKap', ['angularFileUpload', 'ngAnimate', 'ngTouch']);


myKap.controller('Gras', ['$scope', '$http', function ($scope, $http) {
    $scope.get = function () {
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
    $scope.getImgs = function () {
        console.log('recuperation de l image');
        $http.get("./photos")
            .success(
            function (data) {
                $scope.images = data;
            })
            .error(
            function (data, status) {
                alert("Erreur lors de la recuperation de l'image");
            });
    }

    // recuperation d'une image
    $scope.getImg = function () {
        console.log('recuperation de l image ' + $scope.index);
        $http.get("./photo/" + $scope.index)
            .success(
            function (data) {
                $scope.images = data;
            })
            .error(
            function (data, status) {
                alert("Erreur lors de la recuperation de l'image");
            });
    };

    $scope.uploadFile = function (fichier) {
        var fd = new FormData();
        //Take the first selected file
        console.log(fichier);
        fd.append("file", fichier);

        $http.post("./upload", fd, {
            withCredentials: true,
            headers: {'Content-Type': image / jpeg},
            transformRequest: angular.identity
        }).success().error();

    };

    // Set of Photos
    $scope.images = [
        {url: 'http://farm9.staticflickr.com/8042/7918423710_e6dd168d7c_b.jpg', description: 'Image 01'},
        {url: 'http://farm9.staticflickr.com/8449/7918424278_4835c85e7a_b.jpg', description: 'Image 02'},
        {url: 'http://farm9.staticflickr.com/8457/7918424412_bb641455c7_b.jpg', description: 'Image 03'},
        {url: 'http://farm9.staticflickr.com/8179/7918424842_c79f7e345c_b.jpg', description: 'Image 04'},
        {url: 'http://farm9.staticflickr.com/8315/7918425138_b739f0df53_b.jpg', description: 'Image 05'},
        {url: 'http://farm9.staticflickr.com/8461/7918425364_fe6753aa75_b.jpg', description: 'Image 06'}
    ];

    // initial image index
    $scope._Index = 0;

    // if a current image is the same as requested image
    $scope.isActive = function (index) {
        return $scope._Index === index;
    };

    // show prev image
    $scope.showPrev = function () {
        $scope._Index = ($scope._Index > 0) ? --$scope._Index : $scope.images.length - 1;
    };

    // show next image
    $scope.showNext = function () {
        $scope._Index = ($scope._Index < $scope.images.length - 1) ? ++$scope._Index : 0;
    };

    // show a certain image
    $scope.showPhoto = function (index) {
        $scope._Index = index;
    };
}]);