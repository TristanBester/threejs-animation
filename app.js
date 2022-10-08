import * as THREE from 'three';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default class Sketch{
    constructor(){
        this.time = 0;

        this.renderer = new THREE.WebGLRenderer( { antialias: true } );
        this.renderer.setSize( window.innerWidth, window.innerHeight );
        document.getElementById('container').appendChild(this.renderer.domElement);
        
        this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
        this.camera.position.set(0,0,1.3);
        this.scene = new THREE.Scene();
        
        this.controls = new OrbitControls(this.camera, this.renderer.domElement)

        this.addMesh();
        this.render();
    }

    addMesh(){
        this.geometry = new THREE.SphereGeometry( 1.5, 32, 32 );
        this.material = new THREE.MeshNormalMaterial({side: THREE.DoubleSide});
        this.material = new THREE.ShaderMaterial({
            fragmentShader: fragment,
            vertexShader: vertex,
            uniforms: {
                time: { value: 0},
            },
            side: THREE.DoubleSide

        })

        this.mesh = new THREE.Mesh( this.geometry, this.material );
        this.scene.add( this.mesh );
    }

    render(){
        this.time += 0.005
        this.material.uniforms.time.value = this.time;

        this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(this.render.bind(this))
    }
}

new Sketch();
