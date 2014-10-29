var Sky = (function(){

    function Sky(main){
        THREE.Object3D.call(this);

        this._main = main;

        this.coins = [];

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


        this.particleCount = 100;
        this.particles = new THREE.Geometry();

        var pMaterial = new THREE.PointCloudMaterial({
          color: 0xededed,
          transparent: true,
          map: THREE.ImageUtils.loadTexture('assets/img/cloud.png'),
          size: 2000
        });

        // now create the individual particles
        for (var p = 0; p < this.particleCount; p++) {

            var factor = Math.random() < 0.5 ? -1 : 1;

          var pX = Math.random() * 50000 * factor,
              pY = Math.random() * 50000,
              pZ = Math.random() * 50000 * factor ,

              particle = new THREE.Vector3(pX, pY, pZ);
              particle.velocity = Math.random() * 10;

          // add it to the geometry
          this.particles.vertices.push(particle);
        }

        // create the particle system
        this.particleSystem = new THREE.PointCloud( this.particles, pMaterial);

        this.particleSystem.position.y = 5000 ;
        this.particleSystem.position.z = 0;

        // add it to the scene
        this.add(this.particleSystem);

        this.birdFlocks = [];

        var birds = new BirdGroup(new THREE.Vector3(2, 0, 8));
        birds.position.set(1000, -500, 2500);
        this.birdFlocks.push(birds);
        this.add(birds);

        var birds = new BirdGroup(new THREE.Vector3(6, 2, 2));
        birds.position.set(-1000, -1000, 1000);
        this.birdFlocks.push(birds);
        this.add(birds);

        var birds = new BirdGroup(new THREE.Vector3(-4, 3, 1));
        birds.position.set(-2000, 3000, 4000);
        this.birdFlocks.push(birds);
        this.add(birds);

        // for (var i = 0 ; i < 4 ; i++) {
        //     var birds = new BirdGroup(new THREE.Vector3(
        //         Math.floor(Math.random() * 8) - 2, 
        //         Math.floor(Math.random() * 8) - 2,
        //         Math.floor(Math.random() * 8) - 2
        //     ));

        //     var factor = Math.random() < 0.5 ? 1 : -1;

        //     birds.position.set(
        //         (Math.floor(Math.random() * 5) - 2) * 1000 * factor,
        //         (Math.floor(Math.random() * 5) - 2) * 1000 * factor,
        //         (Math.floor(Math.random() * 5) - 2) * 1000 * factor
        //     );

        //     this.add(birds);
        //     this.birdFlocks.push(birds);
        // }

        setInterval(function () {
            this.dropCoin(new THREE.Vector3(0, 7000, this._main.ship.position.z + 1500));
        }.bind(this), 5000);

    };

    

    Sky.prototype = new THREE.Object3D;
    Sky.prototype.constructor = Sky;

    Sky.prototype.dropCoin = function(start) {
        var coin = new Coin();
        coin.position.x = start.x;
        coin.position.y = start.y;
        coin.position.z = start.z;
        coin.target = this._main.ship;

        coin.startFalling();
        this.coins.push(coin);
        this.add(coin);
    };

    Sky.prototype.update = function() {
        this.position.z += 0;
        
        for (var i = 0 ; i < this.birdFlocks.length ; i++) {
            this.birdFlocks[i].update();
        }

        for (var i = 0 ; i < this.coins.length ; i++) {
            this.coins[i].update();
        }
    };

    return Sky;
})();