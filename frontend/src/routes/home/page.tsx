import React, { useEffect } from 'react';
import styles from './page.module.css';
import * as THREE from 'three';
import { VRButton } from 'three/addons/webxr/VRButton.js';

// 로컬 이미지 파일 import
import dataBuilding from '../../assets/data_building_2.jpg';
import graphic1 from '../../assets/section_3_graphic_1.png';
import ainewLogo from '../../assets/section_1_graphic_ainewt_logo_mobile_size.png';

const items = [
    {
        id: 1,
        title: '나는 문어 1',
        description: '꿈을 꾸는 문어 1',
        image: dataBuilding
    },
    {
        id: 2,
        title: '가나다라마바사 2',
        description: '꿈을 꾸는 문어 2',
        image: graphic1
    },
    {
        id: 3,
        title: '오늘은 문어 3',
        description: '꿈을 꾸는 문어 3',
        image: ainewLogo
    }
]

const FOV = 75; // Camera frustum vertical field of view. Default 50.
const ASPECT = window.innerWidth / window.innerHeight; // Camera frustum aspect ratio. Default 1.
const NEAR = 0.1; // Camera frustum near plane. Default 0.1.
const FAR = 1000; // Camera frustum far plane. Default 2000.

function Home(){
    useEffect(() => {
        // Three.js 초기화
        const scene = new THREE.Scene(); // 3D 장면 생성
        scene.background = new THREE.Color(0xf0f0f0); // 배경색 설정

        const camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR); // 카메라 생성
        const renderer = new THREE.WebGLRenderer({antialias: true}); // 렌더러 생성 antialias로 계단 현상 줄임

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.xr.enabled = true; // WebXR 활성화
        document.body.appendChild(renderer.domElement);
        document.body.appendChild(VRButton.createButton(renderer)); // VR Button

        // 조명 추가
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(0, 10, 10);
        scene.add(directionalLight);

        // 디버깅용 그리드 헬퍼 추가
        const gridHelper = new THREE.GridHelper(10, 10);
        scene.add(gridHelper);

        // 좌표축 헬퍼 추가
        const axesHelper = new THREE.AxesHelper(5);
        scene.add(axesHelper);

        console.log("요소 생성 시작");

        // Web XR list
        items.forEach((item, index: number) => {
            console.log(`요소 ${index} 생성 중`);
            
            // 평평한 사각형 요소 컨테이너 생성
            const elemenetContainerGeometry = new THREE.PlaneGeometry(4, 3);

            // 텍스처 로더를 통해 이미지 로드
            const textureLoader = new THREE.TextureLoader();
            
            const imageTexture = textureLoader.load(
                item.image,
                // 성공 콜백
                function(texture) {
                    console.log(`이미지 ${index} 로드 성공`);
                },
                // 진행 콜백
                undefined,
                // 에러 콜백
                function(err) {
                    console.error(`이미지 ${index} 로드 실패:`, err);
                    // 이미지 로드 실패 시 기본 색상으로 대체
                    elementContainerMaterial.map = null;
                    elementContainerMaterial.color.set(0xff9900);
                    elementContainerMaterial.needsUpdate = true;
                }
            );

            // 요소 컨테이너 메터리얼 생성
            const elementContainerMaterial = new THREE.MeshBasicMaterial({
                map: imageTexture,
                side: THREE.DoubleSide,
                transparent: true,
                color: 0xffffff // 기본 색상 설정
            });

            // 요소 컨테이너 메시 생성
            const elementContainer = new THREE.Mesh(elemenetContainerGeometry, elementContainerMaterial);

            // 요소 컨테이너 위치 설정
            elementContainer.position.x = (index - 1) * 5; // 간격 늘림
            elementContainer.position.y = 1.5; // 높이를 올려서 그리드 위에 표시
            elementContainer.position.z = -3;

            // 요소 컨테이너가 카메라를 향하게 설정
            elementContainer.lookAt(0, 1.5, 0);

            console.log(`요소 ${index} 위치:`, elementContainer.position);

            // title, description 텍스트 메시 생성
            const textCanvas = document.createElement('canvas');
            const textContext = textCanvas.getContext('2d');
            textCanvas.width = 512;
            textCanvas.height = 256;

            if (textContext) {
                textContext.fillStyle = '#ffffff';
                textContext.fillRect(0, 0, textCanvas.width, textCanvas.height);

                // title text
                textContext.font = 'Bold 40px Arial';
                textContext.fillStyle = '#000000';
                textContext.textAlign = 'center';
                textContext.fillText(item.title, textCanvas.width / 2, 80);

                // description text
                textContext.font = '30px Arial';
                textContext.fillStyle = '#4d4d4d';
                textContext.textAlign = 'center';
                textContext.fillText(item.description, textCanvas.width / 2, 150);

                // canvas를 텍스쳐로 변환
                const textTexture = new THREE.CanvasTexture(textCanvas);
                const textMaterial = new THREE.MeshBasicMaterial({
                    map: textTexture,
                    transparent: true,
                    side: THREE.DoubleSide
                });
                const textGeometry = new THREE.PlaneGeometry(3, 1.5);
                const textPanel = new THREE.Mesh(textGeometry, textMaterial);
                
                // 텍스트 패널 위치 조정
                textPanel.position.y = -2; // 이미지 아래에 위치
                textPanel.position.z = 0.01; // 약간 앞으로 배치하여 보이게 함

                // 요소 컨테이너에 텍스트 패널 추가
                elementContainer.add(textPanel);

                // 장면에 요소 컨테이너 추가
                scene.add(elementContainer);
                console.log(`요소 ${index} 추가 완료`);
            }
        });
        
        // 카메라 위치 조정
        camera.position.x = 0; // 중앙
        camera.position.y = 1.6; // 일반적인 사람 눈 높이
        camera.position.z = 3; // 앞쪽에서 바라보도록

        // 카메라가 요소를 바라보도록 조정
        camera.lookAt(0, 1.5, -3); // 중앙 요소 위치를 바라봄

        console.log("카메라 위치:", camera.position);

        // 화면 크기 변경 이벤트 처리
        window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        });

        // 애니메이션 루프 시작
        renderer.setAnimationLoop(() => {
            renderer.render(scene, camera);
        });

        return () => {
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
            const vrButton = document.querySelector("#VRButton");
            if (vrButton) {
                document.body.removeChild(vrButton as Node);
            }
            window.removeEventListener('resize', () => {});
        }
    }, []); // 의존성 배열 추가

    return (
        <main className={styles.main}></main>
    )
}

export default Home;