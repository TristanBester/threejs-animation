import * as THREE from 'three';
import fragment from './shaders/fragment.glsl';
import vertex from './shaders/vertex.glsl';
import fragment2 from './shaders/fragment2.glsl';
import vertex2 from './shaders/vertex2.glsl';
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
        this.cubeRenderTarget = new THREE.WebGLCubeRenderTarget(
            256,
            {
                format: THREE.RGBAFormat,
                generateMipmaps: true,
                minFilter: THREE.LinearMipMapLinearFilter,
                encoding: THREE.sRGBEncoding
            }
        )
        
        this.cubeCamera = new THREE.CubeCamera(0.1, 10, this.cubeRenderTarget)
        
        
        
        this.geometry = new THREE.SphereGeometry( 3, 32, 32 );
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
        
        let geo = new THREE.SphereGeometry(1.15, 32, 32);
        
        geo.translate(0.75, 0.7, 0)
        this.cubeCamera.translateX(0.75);
        this.cubeCamera.translateY(0.7);

        this.mat = new THREE.ShaderMaterial({
            fragmentShader: fragment2,
            vertexShader: vertex2,
            uniforms: {
                time: { value: 0},
                tCube: { value: 0}
            },
            side: THREE.DoubleSide

        })

        this.smallSphere = new THREE.Mesh(geo, this.mat);
        this.scene.add(this.smallSphere);
    }

    render(){
        this.time += 0.0025
        this.material.uniforms.time.value = this.time;

        // Hide sphere while rendering from within to prevent feedback loop.
        this.smallSphere.visible = false;
        this.cubeCamera.update(this.renderer, this.scene)
        this.smallSphere.visible = true;
        this.mat.uniforms.tCube.value = this.cubeRenderTarget.texture;

        this.renderer.render( this.scene, this.camera );
        window.requestAnimationFrame(this.render.bind(this))
    }
}

new Sketch();
