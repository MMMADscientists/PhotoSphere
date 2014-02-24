$(document).ready(function () {
    var property = new Property();

    $("body").append(property.renderer.domElement);

    var sphere = new PhotoSphere(THREE.ImageUtils.loadTexture($(".texture")[0].src));

    property.scene.add(sphere);

    var DOOR_ROUNDED_TEXTURE = THREE.ImageUtils.loadTexture($("#door")[0].src),
        connection = new Connection(new THREE.Vector3(0, 0, -10), 0, DOOR_ROUNDED_TEXTURE);

    sphere.add(connection);

    $(property.renderer.domElement).mousedown($.proxy(property.onMouseDown, property));

    $(property.renderer.domElement).mousemove($.proxy(property.onMouseMove, property));

    $(property.renderer.domElement).mouseup($.proxy(property.onMouseUp, property));

    $(property.renderer.domElement).mousewheel($.proxy(property.onMouseWheel, property));

    var render = function () {
        requestAnimationFrame(render);

        property.render();
    };

    render();
});
