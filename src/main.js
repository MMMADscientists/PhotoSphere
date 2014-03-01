$(document).ready(function () {
    var property = new Property();

    $("body").append(property.renderer.domElement);

    $(".texture").each(function () {
        var sphere = new Room(THREE.ImageUtils.loadTexture(this.src));

        property.scene.add(sphere);
    });

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
