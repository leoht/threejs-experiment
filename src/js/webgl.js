var INTERSECTED, theta = 0, radius = 100;

var INITIAL_ALTITUDE = 5000;

var Webgl = (function(){

    function Webgl(width, height){
        // Basic three.js setup
        this.scene = new THREE.Scene();

        this.scene._main = this;

        this.score = 0;
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 100000);
        this.camera.position.y = INITIAL_ALTITUDE ;
        this.camera.position.z = -1200;
        this.camera.position.x = 700;

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0xdddddd, 0);

        this.sky = new Sky(this);
        this.scene.add(this.sky);

        this.sceneLoaded = false;
        this.started = false;

        this.playingWindSound = false;

        this.loadMainScene();
    }

    Webgl.prototype.loadMainScene = function() {

        this.sceneLoaded = true;

        this.ship = new Ship(this.camera);
        this.ship.position.set(0, INITIAL_ALTITUDE - 1000, 0);
        this.ship.enterScene();

        this.otherShips = [];

        var ship2 = new Ship(null, 2, this);
        ship2.position.set(-3000, INITIAL_ALTITUDE + 2000, 5000);
        ship2.autoMoveVector = new THREE.Vector3(0, -0.1, 2.5);
        this.scene.add(ship2);
        this.otherShips.push(ship2);

        var ship3 = new Ship(null, 3, this);
        ship3.position.set(1000, INITIAL_ALTITUDE - 2000, 5000);
        ship3.autoMoveVector = new THREE.Vector3(-0.5, 0.1, 1);
        this.scene.add(ship3);
        this.otherShips.push(ship3);

        var ship4 = new Ship(null, 4, this);
        ship4.position.set(-2000, INITIAL_ALTITUDE + 2000, -1000);
        ship4.autoMoveVector = new THREE.Vector3(-0.2, -0.2, 4);
        this.scene.add(ship4);
        this.otherShips.push(ship4);

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
        // this.scene.add( axisHelper );

        var light = new THREE.PointLight( 0xf0e8a4, 1.5, 100000 ); light.position.set( -10000, INITIAL_ALTITUDE + 3000, 0 ); this.scene.add( light );
        this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.5 );  this.scene.add(this.hemiLight);

        var sphereSize = 20;
        var pointLightHelper = new THREE.PointLightHelper( light, sphereSize );
        this.scene.add( pointLightHelper );

        this.wind = new Wind(0.5, new THREE.Vector3(8, 0, 0), 0.2);
        this.wind.blowOnScene(this.scene);

        var windSound = document.getElementById('wind-sound');
        windSound.volume = 0.5;
        windSound.addEventListener('ended', function(){
            this.load();
        }, false);


    };

    Webgl.prototype.start = function() {
        this.started = true;

        $('.splash').fadeOut(400);
        $('.controls').fadeIn(400);

        this.sky.startDroppingCoins();

        window.addEventListener('keydown', function (e) {
            if (e.which == 37 || e.which == 39) {
                var audio = document.getElementById('wind-blow-sound');

                if (!this.playingWindSound) {
                    audio.load();
                    audio.play();
                    this.playingWindSound = true;
                    var gl = this;
                    audio.addEventListener('ended', function () {
                        gl.playingWindSound = false;
                    });
                }

                var x = e.which == 37 ? 10 : -10;

                if (e.which == 37) { $('.controls .left-arrow').css('opacity', 1); }
                if (e.which == 39) { $('.controls .right-arrow').css('opacity', 1); }

                setTimeout(function () {
                    this.wind.applyWindBlow(new THREE.Vector3(x, 0, 0), 1);
                }.bind(this), 100);
            }

            if (e.which == 38) {
                $('.controls .up-arrow').css('opacity', 1);
                this.ship.applyAscendingForce(5);
            }

            if (e.which == 40) {
                $('.controls .down-arrow').css('opacity', 1);
                this.ship.applyDescendingForce(5);
            }
        }.bind(this));

        window.addEventListener('keyup', function (e) {
            if (e.which == 37) { $('.controls .left-arrow').css('opacity', 0.7); }
            if (e.which == 39) { $('.controls .right-arrow').css('opacity', 0.7); }
            if (e.which == 38) { $('.controls .up-arrow').css('opacity', 0.7); }
            if (e.which == 40) { $('.controls .down-arrow').css('opacity', 0.7); }
        })
    };

    Webgl.prototype.incrementScore = function(inc) {
        this.previousScore = this.score;

        var game = this;

        this.scoreIncrementTimer = setInterval(function () {
            game.score += 1;
            var pad = "0000"
            pad = pad.substring(0, pad.length - String(game.score).length) + String(game.score);
            $('.controls .score span').text(pad);

            if (game.previousScore + inc == game.score) {
                clearInterval(game.scoreIncrementTimer);
            }
        }, 5);
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

            for (var i = 0 ; i < this.otherShips.length ; i++) {
                this.otherShips[i].update();
            }
        }

        if (this.started) {
            this.ship.position.z += 2;
            this.ship.position.y -= 0.1;
            this.camera.position.z += 2;
        }

    };

    return Webgl;

})();