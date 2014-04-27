$(document).ready(function () {
    THREE.ImageUtils.crossOrigin = "anonymous";

/*
    $(".texture").each(function () {
        console.log(this.crossOrigin);
        this.crossOrigin = "";
    });
*/

    var property = Property.fromWebpage();

    /*
    var property = Property.fromWebpage();

    var property = Property.fromJSON("test_property.json");
    */


    property.bind();

    var render = function () {
        requestAnimationFrame(render);

        property.render();
    };

    render();
});
