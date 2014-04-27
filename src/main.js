$(document).ready(function () {
    THREE.ImageUtils.crossOrigin = "anonymous";

    var property = Property.fromWebpage();

    property.bind();

    var render = function () {
        requestAnimationFrame(render);

        property.render();
    };

    render();
});
