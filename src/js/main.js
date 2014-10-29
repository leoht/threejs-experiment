var webgl, gui;

var parameters = {
	cloudsCount: 200
};

$(document).ready(init);

function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

    // gui = new dat.GUI();
    // gui.close();

    // gui.add(parameters, 'cloudsCount').min(10).max(1000).step(1);

    $(window).on('resize', resizeHandler);

    animate();
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
}