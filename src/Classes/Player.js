class Player {
    constructor(mesh, camera, controls) {
        this.mesh = mesh;
        this.camera = camera;
        this.controls = controls;
        this.flags = {
            moveForward: false,
            moveBackward: false,
            moveLeft: false,
            moveRight: false,
            canJump: false,
        }

        this.raycaster = new THREE.Raycaster( new THREE.Vector3(), new THREE.Vector3( 0, - 1, 0 ), 0, 15 );

        this.velocity = new THREE.Vector3();
        this.direction = new THREE.Vector3();

        this.mesh.position.y = 2;

        document.addEventListener( 'keydown', (event) => {
            switch ( event.keyCode ) {

                case 38: // up
                case 87: // w
                    this.flags.moveForward = true;
                    break;
        
                case 37: // left
                case 65: // a
                    this.flags.moveLeft = true; 
                    break;
        
                case 40: // down
                case 83: // s
                    this.flags.moveBackward = true;
                    break;
        
                case 39: // right
                case 68: // d
                    this.flags.moveRight = true;
                    break;
        
                case 32: // space
                    if ( this.flags.canJump === true ) this.velocity.y += 180;
                    this.flags.canJump = false;
                    break;
            }
        }, false );

        document.addEventListener( 'keyup', (event) => {
            switch( event.keyCode ) {

                case 38: // up
                case 87: // w
                    this.flags.moveForward = false;
                    break;
        
                case 37: // left
                case 65: // a
                    this.flags.moveLeft = false;
                    break;
        
                case 40: // down
                case 83: // s
                    this.flags.moveBackward = false;
                    break;
        
                case 39: // right
                case 68: // d
                    this.flags.moveRight = false;
                    break;
        
            }
        }, false );
    }

    update(delta, scene) {
        // console.log('update not defined', delta);
        if ( this.controls.isLocked === true ) {

            // console.log("posicion: ",      this.controls.getObject().position);
            // console.log("posicion rayo: ", this.raycaster.ray.origin);
    
            this.raycaster.ray.origin.copy( this.controls.getObject().position );
            this.raycaster.ray.origin.y -= 10;
    
            let intersections = this.raycaster.intersectObjects( scene.children );
            let onObject = intersections.length > 0;
    
            this.velocity.x -= this.velocity.x * 10.0 * delta;
            this.velocity.z -= this.velocity.z * 10.0 * delta;
            this.velocity.y -= 9.8 * 50.0 * delta; // 100.0 = mass
    
            this.direction.z = Number( this.flags.moveForward ) - Number( this.flags.moveBackward );
            this.direction.x = Number( this.flags.moveRight ) - Number( this.flags.moveLeft );
    
            this.direction.normalize(); // this ensures consistent movements in all directions
            if ( this.flags.moveForward || this.flags.moveBackward ) this.velocity.z -= this.direction.z * 400.0 * delta;
            if ( this.flags.moveLeft || this.flags.moveRight ) this.velocity.x -= this.direction.x * 400.0 * delta;
            if ( onObject === true ) {
                this.velocity.y = Math.max( 0, this.velocity.y );
                this.flags.canJump = true;
            }
    
            this.controls.moveRight( - this.velocity.x * delta );
            this.controls.moveForward( - this.velocity.z * delta );
            this.controls.getObject().position.y += ( this.velocity.y * delta ); // new behavior
    
            if ( this.controls.getObject().position.y < 10 ) {
                this.velocity.y = 0;
                this.controls.getObject().position.y = 10;
                this.flags.canJump = true;
            }

            // this.mesh.position.x = this.controls.getObject().position.x + 4;
            // this.mesh.position.y = this.controls.getObject().position.y + 2;
            // this.mesh.position.z = this.controls.getObject().position.z;

            // this.mesh.position.set(
            //     this.camera.position.x - Math.sin(this.camera.rotation.y + Math.PI / 6) * 0.75,
            //     this.camera.position.y - 0.5 + Math.sin(delta * 4 + this.camera.position.x + this.camera.position.z)*0.01,
            //     this.camera.position.z + Math.cos(this.camera.rotation.y + Math.PI/6) * 0.75
            // );

            let dir = controls.getDirection(new THREE.Vector3());

            // this.mesh.position.set(
            //     (this.camera.position.x - Math.sin(this.camera.rotation.y + Math.PI / 6)) * 1.5,
            //     this.camera.position.y,
            //     (this.camera.position.z + Math.cos(this.camera.rotation.y + Math.PI / 6)) * 1.5
            // );
            // this.mesh.rotation.set(
            //     this.camera.rotation.x,
            //     this.camera.rotation.y - Math.PI,
            //     this.camera.rotation.z
            // );

            // this.mesh.rotation.set(
            //     dir.y * Math.PI,
            //     -dir.x * Math.PI,
            //     this.mesh.rotation.z
            // );

            // console.log(dir);
        }

    }

    animate() {
        console.log('animate not defined', delta);
    }
}