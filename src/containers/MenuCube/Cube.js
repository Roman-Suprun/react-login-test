import React, {useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {FontLoader} from "three/examples/jsm/loaders/FontLoader";
import * as routePath from "../../consts/routePath";
import {useNavigate} from "react-router-dom";
import {componentData} from "./menuData";
import getCubeFrame from "./components/CubeFrame";
import getMainScene from "./components/Scene";
import getTextPlateComponentList from "./components/TextPlate";
import * as projectTypes from "../../consts/projectTypes";
import config from "../../config/config";

const Cube = ({isVariantsVisible}) => {
    const canvasRef = useRef(null);
    const [font, setFont] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const [textPlateComponentList, setTextPlateComponentList] = useState(null);
    const [cubeFrameComponent, setCubeFrameComponent] = useState(null);
    const [testScene, setTestScene] = useState(null);
    const {scene, camera, renderer, canvas} = testScene || {};
    const [previousMousePosition, setPreviousMousePosition] = useState({
        x: 0,
        y: 0,
    });
    const [previousRotation, setPreviousRotation] = useState({x: 0, y: 0});
    const fontLoader = new FontLoader();
    const navigate = useNavigate();

    useEffect(() => {
        fontLoader.load(config.threeJsFontUrl, (res) => setFont(res));
    }, []);

    const on3dComponentsLoad = () => {
        setTextPlateComponentList(getTextPlateComponentList(font, componentData))
        setCubeFrameComponent(getCubeFrame({isVariantsVisible}));
    }

    useEffect(() => {
        if (font) {
            on3dComponentsLoad();
        }
    }, [font]);

    useEffect(() => {
        if (textPlateComponentList && cubeFrameComponent) {

            if (isVariantsVisible) {
                textPlateComponentList.forEach((text3DItem) => {
                    cubeFrameComponent.add(text3DItem);
                })
            }

            setTestScene(getMainScene(canvasRef, [cubeFrameComponent]));
        }
    }, [textPlateComponentList, cubeFrameComponent]);

    const getIntersects = ({event, onIntersectSuccess, onIntersectFalse}) => {
        if (!camera) return;

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        mouse.x = (event.clientX / canvas?.clientWidth) * 2 - 1;
        mouse.y = -(event.clientY / canvas?.clientHeight) * 2 + 1;
        raycaster.setFromCamera(mouse, camera);

        const intersects = raycaster.intersectObjects([...textPlateComponentList], false);

        if (intersects.length > 0) {
            onIntersectSuccess(intersects[0]);
        } else {
            if (typeof onIntersectFalse === 'function') {
                onIntersectFalse()
            }
        }
    }

    const onMouseMove = (event) => {
        getIntersects({
            event, onIntersectSuccess: (intersects) => {
                intersects.object.material = new THREE.MeshBasicMaterial({color: 0xffffff});
                intersects.object.children[0].material = new THREE.MeshBasicMaterial({color: 0x000000});
                intersects.object.checked = true;
            }, onIntersectFalse: () => {
                cubeFrameComponent.children.forEach((textPlateItem) => {
                    textPlateItem.material = new THREE.MeshBasicMaterial({color: '#282c34'});
                    textPlateItem.children[0].material = new THREE.MeshBasicMaterial({
                        color: 0xffffff,
                        side: THREE.DoubleSide
                    });
                    textPlateItem.children[0].checked = false;
                })
            }
        });
    }

    const handleMouseDown = (event) => {
        const {clientX, clientY} = event.touches ? event.touches[0] : event;

        setIsDragging(true);
        setPreviousMousePosition({x: clientX, y: clientY});
        setPreviousRotation({x: cubeFrameComponent.rotation.x, y: cubeFrameComponent.rotation.y});
    };

    const handleMouseMove = (event) => {
        onMouseMove(event)

        if (isDragging) {
            const {clientX, clientY} = event.touches ? event.touches[0] : event;

            positionCalculate({x: clientX, y: clientY})
        }
    };

    const handleMouseUp = (event) => {
        setIsDragging(false);

        getIntersects({
            event, onIntersectSuccess: (intersects) => {
                switch (intersects.object.customType) {
                    case projectTypes.TO_DO_LIST :
                        navigate(routePath.TO_DO_LIST_PAGE);
                        break;
                    case projectTypes.ADDAX_CALENDAR :
                        navigate(routePath.ADDAX_CALENDAR);
                        break;
                }
            }
        });

        cubeFrameComponent.children.forEach((text3DItem) => {
            text3DItem.material = new THREE.MeshBasicMaterial({color: '#282c34'});
            text3DItem.children[0].material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                side: THREE.DoubleSide
            });
            text3DItem.children[0].checked = false;
        })
    };

    const positionCalculate = ({x, y}) => {
        const deltaMove = {
            x: x - previousMousePosition.x,
            y: y - previousMousePosition.y,
        };

        cubeFrameComponent.rotation.y = previousRotation.y + deltaMove.x * 0.01;
        cubeFrameComponent.rotation.x = previousRotation.x + deltaMove.y * 0.01;
    }

    useEffect(() => {
        if (testScene) {
            const animate = () => {
                requestAnimationFrame(animate);

                renderer.render(scene, camera);
            };

            animate();
        }
    }, [testScene]);

    return (
        <canvas
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            onTouchMove={handleMouseMove}
            ref={canvasRef}
            className='touch-none w-screen h-screen absolute'
            onContextMenu={(e) => e.preventDefault()}
        />
    );
};

export default Cube;