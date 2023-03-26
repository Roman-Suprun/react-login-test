import * as THREE from 'three';

const getMainScene = (ref, objectsToAddArray = []) => {
    const canvas = ref.current;
    const scene = new THREE.Scene();

    scene.background = new THREE.Color('#282c34');

    const camera = new THREE.PerspectiveCamera(75, canvas?.clientWidth / canvas?.clientHeight, 1, 1000);

    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({canvas});

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(canvas?.clientWidth, canvas?.clientHeight);

    objectsToAddArray.forEach((item) => {
        scene.add(item);
    });

    return {scene, camera, renderer, canvas};
};

export default getMainScene;
