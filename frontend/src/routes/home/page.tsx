import React, { useEffect } from 'react';
import styles from './page.module.css';
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

const FOV = 75; // Camera frustum vertical field of view. Default 50.
const ASPECT = window.innerWidth / window.innerHeight; // Camera frustum aspect ratio. Default 1.
const NEAR = 0.1; // Camera frustum near plane. Default 0.1.
const FAR = 1000; // Camera frustum far plane. Default 2000.

function Home(){
    useEffect(() => {
        // Three.js 초기화
        const scene = new THREE.Scene(); // 3D 장면 생성
        const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR); // 카메라 생성
        const renderer = new THREE.WebGLRenderer({antialias: true}); // 렌더러 생성 antialias로 계단 현상 줄임

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true; // WebXR 활성화
        document.body.appendChild(renderer.domElement);
        document.body.appendChild(VRButton.createButton(renderer)); // VR Button

        // 간단한 큐브 추가
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const cube = new THREE.Mesh(geometry, material);
        scene.add(cube);

        camera.position.z = 5;
        
        // animation loop
        renderer.setAnimationLoop(() => {
            cube.rotation.x += 0.01;
            cube.rotation.y += 0.01;
            renderer.render(scene, camera);
        });

        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            document.body.removeChild(document.querySelector("#VRButton") as Node);
        }
    })

    return (
        <main className={styles.main}></main>
    )
}

export default Home;