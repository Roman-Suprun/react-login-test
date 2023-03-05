import * as THREE from "three";

const getCubeFrame = ({isVariantsVisible}) => {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const edges = new THREE.EdgesGeometry(geometry);
    const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({color: 0xffffff}));
    line.position.set(0, isVariantsVisible ? .7 : 1.5, 0);
    line.rotation.x = .7;
    line.rotation.y = -.5;
    line.highlightable = true;

    return line;
}

export default  getCubeFrame;