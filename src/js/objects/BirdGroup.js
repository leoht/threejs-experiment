var BirdGroup = (function(){

    function BirdGroup(directionVector){
        THREE.Object3D.call(this);

        this.particleCount = 180;
        this.particles = new THREE.Geometry();
        this.vector = directionVector;

        this.delta = 0;

        this.pMaterialA = new THREE.PointCloudMaterial({
          color: 0x000000,
          transparent: true,
          side: THREE.DoubleSide,
          map: THREE.ImageUtils.loadTexture('assets/img/bird.png'),
          size: 50
        });

        this.pMaterialB = new THREE.PointCloudMaterial({
          color: 0x000000,
          transparent: true,
          side: THREE.DoubleSide,
          map: THREE.ImageUtils.loadTexture('assets/img/bird2.png'),
          size: 50
        });

        this.pMaterialC = new THREE.PointCloudMaterial({
          color: 0x000000,
          transparent: true,
          side: THREE.DoubleSide,
          map: THREE.ImageUtils.loadTexture('assets/img/bird3.png'),
          size: 50
        });

        this.pMaterialD = new THREE.PointCloudMaterial({
          color: 0x000000,
          transparent: true,
          side: THREE.DoubleSide,
          map: THREE.ImageUtils.loadTexture('assets/img/bird4.png'),
          size: 50
        });

        // now create the individual particles
        for (var p = 0; p < this.particleCount; p++) {

          var pX = Math.random() * 1400,
              pY = Math.random() * 200,
              pZ = Math.random() * 800 ,

              particle = new THREE.Vector3(pX, pY, pZ);
              particle.velocity = Math.floor(Math.random() * 4) + 2;

          // add it to the geometry
          this.particles.vertices.push(particle);
        }

        // create the particle system
        this.particleSystem = new THREE.PointCloud( this.particles, this.pMaterialA);

        this.particleSystem.position.y = 5000 ;
        this.particleSystem.position.z = 0;

        // add it to the scene
        this.add(this.particleSystem);

    
    }

    BirdGroup.prototype = new THREE.Object3D;
    BirdGroup.prototype.constructor = BirdGroup;

    BirdGroup.prototype.update = function() {

        this.delta++;

        for (var i = 0 ; i < this.particleCount ; i++) {
          this.particles.vertices[i].x += this.vector.x * (this.particles.vertices[i].velocity * 0.1);
          this.particles.vertices[i].y += this.vector.y * (this.particles.vertices[i].velocity * 0.1);
          this.particles.vertices[i].z += this.vector.z * (this.particles.vertices[i].velocity * 0.1);
          
        }

        if (this.delta > 0 && this.delta < 10) {
          this.particleSystem.material = this.pMaterialB;
        } else if (this.delta >= 10 && this.delta < 20) {
          this.particleSystem.material = this.pMaterialB;
        } else if (this.delta >= 20 && this.delta < 30) {
          this.particleSystem.material = this.pMaterialC;
        } else if (this.delta >= 30 && this.delta < 40) {
          this.particleSystem.material = this.pMaterialD;
        } else if (this.delta >= 40 && this.delta < 50) {
          this.particleSystem.material = this.pMaterialC;
        } else if (this.delta >= 50 && this.delta < 60) {
          this.particleSystem.material = this.pMaterialB;
        } else if (this.delta >= 60 && this.delta < 70) {
          this.particleSystem.material = this.pMaterialA;
        }

        if (this.delta == 80) this.delta = 0;

        this.particleSystem.geometry.verticesNeedUpdate = true;
        this.particleSystem.material.needsUpdate = true;

        // U-turn handling

        // if (this.particles.vertices[0].x >= 7000 || this.particles.vertices[0].x < -7000) this.vector.x = -this.vector.x;
        // if (this.particles.vertices[0].y >= 7000 || this.particles.vertices[0].y < -7000) this.vector.y = -this.vector.y;
        // if (this.particles.vertices[0].z >= 7000 || this.particles.vertices[0].z < -7000) this.vector.z = -this.vector.z;
    };

    return BirdGroup;
})();