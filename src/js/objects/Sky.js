var Sky = (function(){

    function Sky(){
        THREE.Object3D.call(this);

        var urlPrefix = "assets/img/sky/";
        var urls = [
            urlPrefix + "posx.jpg", urlPrefix + "negx.jpg",
            urlPrefix + "posy.jpg", urlPrefix + "negy.jpg",
            urlPrefix + "posz.jpg", urlPrefix + "negz.jpg" ];
        var textureCube = THREE.ImageUtils.loadTextureCube( urls );

        var shader = THREE.ShaderLib["cube"];
        var uniforms = THREE.UniformsUtils.clone( shader.uniforms );
        uniforms['tCube'].value = textureCube;   // textureCube has been init before
        var material = new THREE.ShaderMaterial({
            fragmentShader    : shader.fragmentShader,
            vertexShader  : shader.vertexShader,
            uniforms  : uniforms,
            side: THREE.BackSide
        });

        skyboxMesh    = new THREE.Mesh( new THREE.BoxGeometry( 100000, 100000, 100000, 1, 1, 1, null, true ), material );

        this.mesh = skyboxMesh;

        this.add(skyboxMesh);
    }

    Sky.prototype = new THREE.Object3D;
    Sky.prototype.constructor = Sky;

    Sky.prototype.update = function() {
        this.position.z += 0;
    };

    return Sky;
})();