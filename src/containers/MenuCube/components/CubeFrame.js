import * as THREE from 'three';

const getCubeFrame = ({isVariantsVisible}) => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xffffff}));

    line.position.set(0, isVariantsVisible ? 0.7 : 1.5, 0);
    line.rotation.x = 0.7;
    line.rotation.y = -0.5;
    line.highlightable = true;

    return line;
};

export default getCubeFrame;
