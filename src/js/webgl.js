var INTERSECTED, theta = 0, radius = 100;

var INITIAL_ALTITUDE = 5000;

var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 100000);
        this.camera.position.y = INITIAL_ALTITUDE ;
        this.camera.position.z = - 1000;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xdddddd, 0);

        // Or create container classes for them to simplify your code
        this.ship = new Ship();
        this.ship.position.set(0, INITIAL_ALTITUDE, 0);
        this.scene.add(this.ship);

        this.controls = new THREE.TrackballControls( this.camera );

        this.controls.rotateSpeed = 1.0;
        this.controls.zoomSpeed = 1.2;
        this.controls.panSpeed = 0.8;

        this.controls.noZoom = false;
        this.controls.noPan = false;

        this.controls.staticMoving = true;
        this.controls.dynamicDampingFactor = 0.3;

        this.controls.keys = [ 65, 83, 68 ];

        var geometry = new THREE.PlaneBufferGeometry( 10000, 10000, 10000 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00 } );
        var texture = THREE.ImageUtils.loadTexture("assets/img/ground.jpg");
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        // texture.repeat.set( 4, 4 );
        texture.needsUpdate = true;

        material.map = texture;
        var plane = new THREE.Mesh( geometry, material );
        plane.position.set(0, 0, 0);
        // this.scene.add( plane );

        this.sky = new Sky();
        this.scene.add(this.sky);
        
        this.mouseVector = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        window.addEventListener( 'mousemove', function (e) {
            this.mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
            this.mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );

        }.bind(this), false );

       var axisHelper = new THREE.AxisHelper( 10000 );
        this.scene.add( axisHelper );

        var light = new THREE.PointLight( 0xffffff, 2, 100000 ); light.position.set( -5000, INITIAL_ALTITUDE + 3000, 0 ); this.scene.add( light );
        this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );  this.scene.add(this.hemiLight);

        var sphereSize = 20;
        var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
        this.scene.add( pointLightHelper );
        // var light = new THREE.PointLight( 0xffffff, 2, 100000 ); light.position.set( 0, 800, 50 ); this.scene.add( light );

        this.wind = new Wind(0.5, new THREE.Vector3(8, 0, 0), 0.2);
        this.wind.blowOnScene(this.scene);
    }

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {

        this.camera.lookAt( this.ship.position );
        // find intersections

        // var vector = new THREE.Vector3( this.mouseVector.x, this.mouseVector.y, 1 ).unproject( this.camera );

        // this.raycaster.set( this.camera.position, vector.sub( this.camera.position ).normalize() );

        // var intersects = this.raycaster.intersectObjects( this.ship.spheres, true);

        // if (intersects.length > 0) {
        //     intersects[0].object.parent.scaling = true
        // }

        this.renderer.render(this.scene, this.camera);
        // this.composer.render();
        this.controls.update();
        this.ship.update();
        this.sky.update();
        this.wind.update();

        // this.camera.position.z += 2;
    };

    return Webgl;

})();