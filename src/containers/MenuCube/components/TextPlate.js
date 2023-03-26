import * as THREE from 'three';
import {TextGeometry} from 'three/addons/geometries/TextGeometry';

const createText = (font, text) => {
    if (!font) return;

    const textGeometry = new TextGeometry(text, {
        height: 0,
        size: 0.2,
        font,
    });
    const textMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    textGeometry.computeBoundingBox();
    textMesh.position.x = 0;
    textMesh.position.y = 0;
    textMesh.position.z = 0.001;
    textMesh.geometry.center();

    return textMesh;
};
const createPlate = (coordinates) => {
    const {x, y, z, rx, ry, rz} = coordinates || {x: 0, y: 0, z: 0, rx: 0, ry: 0, rz: 0};
    const geometry = new THREE.PlaneGeometry(1.95, 0.5);
    const material = new THREE.MeshBasicMaterial({
        color: '#282c34',
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
        side: THREE.DoubleSide,
    });
    const plane = new THREE.Mesh(geometry, material);

    plane.position.x = x;
    plane.position.y = y;
    plane.position.z = z;
    plane.rotation.x = rx;
    plane.rotation.y = ry;
    plane.rotation.z = rz;
    plane.geometry.center();

    return plane;
};
const create3DText = (font, data) => {
    const {coordinates, text, type} = data || {};
    const text3D = createText(font, text);
    const plate = createPlate(coordinates);

    plate.add(text3D);
    plate.customType = type;

    return plate;
};
const getTextPlateComponentList = (font, componentData) => {
    if (!componentData) return [];

    const text3DListComponent = [];

    componentData.forEach((data) => {
        text3DListComponent.push(create3DText(font, data));
    });

    return text3DListComponent;
};

export default getTextPlateComponentList;
