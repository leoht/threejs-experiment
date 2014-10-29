var INTERSECTED, theta = 0, radius = 100;

var INITIAL_ALTITUDE = 5000;

var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();

        this.scene._main = this;
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 100000);
        this.camera.position.y = INITIAL_ALTITUDE ;
        this.camera.position.z = -1000;
        this.camera.position.x = 300;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xdddddd, 0);

        this.sky = new Sky(this);
        this.scene.add(this.sky);

        this.sceneLoaded = false;
        this.started = false;

        this.loadMainScene();
    }

    Webgl.prototype.loadMainScene = function() {

        this.sceneLoaded = true;

        this.ship = new Ship(this.camera);
        this.ship.position.set(0, INITIAL_ALTITUDE - 1000, 0);
        this.ship.enterScene();

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
        
        this.mouseVector = new THREE.Vector2();
        this.raycaster = new THREE.Raycaster();

        window.addEventListener( 'mousemove', function (e) {
            this.mouseVector.x = 2 * (e.clientX / window.innerWidth) - 1;
            this.mouseVector.y = 1 - 2 * ( e.clientY / window.innerHeight );

        }.bind(this), false );

       var axisHelper = new THREE.AxisHelper( 10000 );
        this.scene.add( axisHelper );

        var light = new THREE.PointLight( 0xf0e8a4, 1.5, 100000 ); light.position.set( -10000, INITIAL_ALTITUDE + 3000, 0 ); this.scene.add( light );
        this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );  this.scene.add(this.hemiLight);

        var sphereSize = 20;
        var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
        this.scene.add( pointLightHelper );

        this.wind = new Wind(0.5, new THREE.Vector3(8, 0, 0), 0.2);
        this.wind.blowOnScene(this.scene);

        document.getElementById('wind-sound').addEventListener('ended', function(){
            this.currentTime = 0;
        }, false);
    };

    Webgl.prototype.start = function() {
        this.started = true;

        $('.splash').fadeOut(400);

        window.addEventListener('keydown', function (e) {
            if (e.which == 37 || e.which == 39) {
                var audio = document.getElementById('wind-blow-sound');
                audio.load();
                audio.play();
                var x = e.which == 37 ? 10 : -10;
                setTimeout(function () {
                    this.wind.applyWindBlow(new THREE.Vector3(x, 0, 0), 1);
                }.bind(this), 100);
            }

            if (e.which == 38) {
                this.ship.applyAscendingForce(5);
            }

            if (e.which == 40) {
                this.ship.applyDescendingForce(5);
            }
        }.bind(this));
    };

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {

        this.renderer.render(this.scene, this.camera);
        
        if (this.sceneLoaded) {
            this.sky.update();
            this.controls.update();
            
            this.wind.update();

            this.camera.lookAt( this.ship.position );
            this.ship.update();
        }

        if (this.started) {
            this.ship.position.z += 2;
            this.ship.position.y -= 0.1;
            this.camera.position.z += 2;
        }

    };

    return Webgl;

})();