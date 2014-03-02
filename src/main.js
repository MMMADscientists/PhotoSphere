$(document).ready(function () {
    var property = Property.fromJSON("test_property.json");

    $("body").append(property.renderer.domElement);

    property.bind();

    var render = function () {
        requestAnimationFrame(render);

        property.render();
    };

    render();
});
