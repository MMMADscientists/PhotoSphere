$(document).ready(function () {
    /*
    $.ajax({
        url: "test_property.json",

        type: "GET",

        dataType: "json",

        success: function (result) {
            console.log("Success!!");
            console.log(result);
        },

        error: function (request, textStatus, errorThrown) {
            console.log("Error!!");
            console.log(textStatus);
        },

        complete: function (request, textStatus) {
            console.log("Complete!!");
            console.log(request.responseText);
            console.log(textStatus);
        },
    });
    */

    /*
    $.getJSON("test_property.json", function (data) {
        console.log("Kappa");
    });
    */

    var property = Property.fromJSON("test_property.json");

    $("body").append(property.renderer.domElement);

    /*
    $(".texture").each(function () {
        property.addRoom(new Room(THREE.ImageUtils.loadTexture(this.src)));
    });

    property.setCurrentRoom(0);
    */

    var DOOR_ROUNDED_TEXTURE = THREE.ImageUtils.loadTexture($("#door")[0].src);
    /*
        connection = new Connection(new THREE.Vector3(0, 0, -10), 0, DOOR_ROUNDED_TEXTURE);

    sphere.add(connection);
    */

    property.bind();

    var render = function () {
        requestAnimationFrame(render);

        property.render();
    };

    render();
});
