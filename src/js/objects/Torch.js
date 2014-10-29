var Torch = (function(){

    function Torch(){
        THREE.Object3D.call(this);

        // create the particle variables
        this.particleCount = 1800;
        this.particles = new THREE.Geometry();
            // create the particle variables
        var pMaterial = new THREE.ParticleBasicMaterial({
          color: 0xFFFFFF,
          size: 20,
          map: THREE.ImageUtils.loadTexture(
            "assets/img/particle.png"
          ),
          blending: THREE.AdditiveBlending,
          transparent: true
        });

        

        // now create the individual particles
        for (var p = 0; p < this.particleCount; p++) {

          // create a particle with random
          // position values, -250 -> 250
           var pX = 0,
                pY = 80,
                pZ = 0,
                particle = new THREE.Vector3(pX, pY, pZ);

          // add it to the geometry
          this.particles.vertices.push(particle);
        }

        // create the particle system
        this.particleSystem = new THREE.ParticleSystem(
            this.particles,
            pMaterial);

        // also update the particle system to
        // sort the particles which enables
        // the behaviour we want
        this.particleSystem.sortParticles = true;


        this.add(this.particleSystem);
    }

    Torch.prototype = new THREE.Object3D;
    Torch.prototype.constructor = Torch;

    Torch.prototype.update = function() {
        // add some rotation to the system
          this.particleSystem.rotation.y += 0.01;

          var pCount = this.particleCount;
          
          for (var i = 0 ; i < this.particleCount ; i++) {
            this.particles.vertices[i].y += 0.1;
          }

          // flag to the particle system
          // that we've changed its vertices.
          this.particleSystem.
            geometry.
            __dirtyVertices = true;
    };

    return Torch;
})();