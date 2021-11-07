const modalClose = document.querySelector('[data-modal="close"]');
const modalWrapper = document.querySelector('[data-modal="wrapper"]');

const diameterInput = document.querySelector("#sphere-diameter");
const regenerateButton = document.querySelector("#regenerate-button");

const speedInput = document.querySelector("#speedInput");

const checkX = document.querySelector("#checkX");
const checkY = document.querySelector("#checkY");
const checkZ = document.querySelector("#checkZ");

const relTargetXYZ = document.querySelector("#rel_targetXYZ");
const absTargetXYZ = document.querySelector("#abs_targetXYZ");
const relSelectedXYZ = document.querySelector("#rel_selectedXYZ");
const absSelectedXYZ = document.querySelector("#abs_selectedXYZ");

const cordX = document.querySelector("#absolute_x");
const cordY = document.querySelector("#absolute_y");
const cordZ = document.querySelector("#absolute_z");

let cordXvalue = Number(cordX.value);
let cordYvalue = Number(cordY.value);
let cordZvalue = Number(cordZ.value);

cordX.addEventListener("input", () => {
    cordXvalue = isNaN(cordX.value) ? 0 : Number(cordX.value);
});
cordY.addEventListener("input", () => {
    cordYvalue = isNaN(cordY.value) ? 0 : Number(cordY.value);
});
cordZ.addEventListener("input", () => {
    cordZvalue = isNaN(cordZ.value) ? 0 : Number(cordZ.value);
});

if (!localStorage.popUp) {
    popUp();
    localStorage.popUp = "pop";
}

modalClose.addEventListener("click", popDown);

function popUp(e) {
    modalWrapper.classList.add("modal-opened");
}

function popDown(e) {
    modalWrapper.classList.remove("modal-opened");
}

let speed = Number(speedInput.value);

speedInput.addEventListener("input", () => { speed = Number(speedInput.value); });

//-------------------GAME------------------
let camera, scene, renderer, controls;
let boxMaterial, boxGeometry;

let objects = [];

let raycaster;

let base;
let target; //block
let selected;

let moveForward = false;
let moveBackward = false;
let moveLeft = false;
let moveRight = false;
let moveUp = false;
let moveDown = false;

// let singleGeometry = new THREE.Geometry();
let mouse = new THREE.Vector2();

let prevTime = performance.now();
const velocity = new THREE.Vector3();
const direction = new THREE.Vector3();
const vertex = new THREE.Vector3();
const color = new THREE.Color();

let stats = new Stats();
stats.showPanel(0);
stats.domElement.style.cssText = 'position:absolute;top:0px;right:0px;';
document.body.appendChild(stats.dom);

let cords = [
    [0, 0, 0]
]

const width = 8
const height = 8

let data = makeTexture(height, width, [100, 100, 100], [250, 250, 250]); //normal
const normalTexture = new THREE.DataTexture(Uint8Array.from(data), width, height, THREE.RGBFormat, );
const normalBoxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, map: normalTexture });
data = makeTexture(height, width, [50, 150, 100], [250, 250, 250]); //green
const greenTexture = new THREE.DataTexture(Uint8Array.from(data), width, height, THREE.RGBFormat);
const greenBoxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, map: greenTexture });
data = makeTexture(height, width, [50, 100, 150], [250, 250, 250]); //blue
const blueTexture = new THREE.DataTexture(Uint8Array.from(data), width, height, THREE.RGBFormat);
const blueBoxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, map: blueTexture });
data = makeTexture(height, width, [150, 50, 50], [250, 250, 250]); //blue
const redTexture = new THREE.DataTexture(Uint8Array.from(data), width, height, THREE.RGBFormat);
const redBoxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, map: redTexture });
const transBoxMaterial = new THREE.MeshBasicMaterial({ color: 0xDDDDDD, opacity: 0.3, transparent: true });

init();
animate();

function init() {

    renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("canvas"), antialias: true });

    camera = new THREE.PerspectiveCamera(75, 2, 1, 2000);
    camera.position.y = 10;

    generateNewScene();

    const onKeyDown = function(event) {

        // console.log(event.code);
        switch (event.code) {


            case 'ArrowUp':
            case 'KeyW':
                moveForward = true;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = true;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = true;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = true;
                break;

            case 'Space':
                moveUp = true;
                break;

            case 'ShiftLeft':
                moveDown = true;
                break;
        }
    };

    const onKeyUp = function(event) {

        switch (event.code) {

            case 'ArrowUp':
            case 'KeyW':
                moveForward = false;
                break;

            case 'ArrowLeft':
            case 'KeyA':
                moveLeft = false;
                break;

            case 'ArrowDown':
            case 'KeyS':
                moveBackward = false;
                break;

            case 'ArrowRight':
            case 'KeyD':
                moveRight = false;
                break;

            case 'Space':
                moveUp = false;
                break;

            case 'ShiftLeft':
                moveDown = false;
                break;
        }
    };

    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);

    raycaster = new THREE.Raycaster();


    boxGeometry = new THREE.BoxGeometry(10, 10, 10).toNonIndexed();

    generateObjects();

    window.addEventListener('resize', resizeCanvasToDisplaySize);
    regenerateButton.addEventListener("click", () => {
        removeObjects();
        generateObjects();
    });
    window.addEventListener('mousedown', selectObject, false);


    checkX.addEventListener("click", selectOnly);
    checkY.addEventListener("click", selectOnly);
    checkZ.addEventListener("click", selectOnly);

}

function generateNewScene() {
    // console.log("gen new screen");
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x7ba0c0);



    // scene = new THREE.Scene();
    // scene.background = new THREE.Color(0x7ba0c0);
    // scene.fog = new THREE.Fog(0xffffff, 0, 900);

    const light = new THREE.HemisphereLight(0xeeeeff, 0x777788, 0.75);
    light.position.set(0.5, 1, 0.75);
    scene.add(light);

    controls = new PointerLockControls(camera, document.body);

    const blocker = document.getElementById('blocker');
    const instructions = document.getElementById('instructions');

    instructions.addEventListener('click', function() {

        controls.lock();

    });

    controls.addEventListener('lock', function() {

        instructions.style.display = 'none';
        blocker.style.display = 'none';

    });

    controls.addEventListener('unlock', function() {

        blocker.style.display = 'inline-block';
        instructions.style.display = '';

    });

    scene.add(controls.getObject());

    resizeCanvasToDisplaySize();
    generateFloor();
}


function selectOnly() {
    if (selected) {
        const cords = getCordsObj(selected);
        if (checkX.checked && checkY.checked && checkZ.checked) {
            objects.forEach(o => {
                o.material = o.position.x == cords[0] * 10 || o.position.y == cords[1] * 10 + 30 || o.position.z == cords[2] * 10 ? normalBoxMaterial : transBoxMaterial;
                o.transparent = o.position.x == cords[0] * 10 || o.position.y == cords[1] * 10 + 30 || o.position.z == cords[2] * 10 ? false : true;
            })
        } else if (checkX.checked && checkY.checked) {
            objects.forEach(o => {
                o.material = o.position.x == cords[0] * 10 || o.position.y == cords[1] * 10 + 30 ? normalBoxMaterial : transBoxMaterial;
                o.transparent = o.position.x == cords[0] * 10 || o.position.y == cords[1] * 10 + 30 ? false : true;
            })
        } else if (checkX.checked && checkZ.checked) {
            objects.forEach(o => {
                o.material = o.position.x == cords[0] * 10 || o.position.z == cords[2] * 10 ? normalBoxMaterial : transBoxMaterial;
                o.transparent = o.position.x == cords[0] * 10 || o.position.z == cords[2] * 10 ? false : true;
            })
        } else if (checkY.checked && checkZ.checked) {
            objects.forEach(o => {
                o.material = o.position.y == cords[1] * 10 + 30 || o.position.z == cords[2] * 10 ? normalBoxMaterial : transBoxMaterial;
                o.transparent = o.position.y == cords[1] * 10 + 30 || o.position.z == cords[2] * 10 ? false : true;
            })
        } else if (checkX.checked) {
            objects.forEach(o => {
                o.material = o.position.x == cords[0] * 10 ? normalBoxMaterial : transBoxMaterial;
                o.transparent = o.position.x == cords[0] * 10 ? false : true;
            })
        } else if (checkY.checked) {
            objects.forEach(o => {
                o.material = o.position.y == cords[1] * 10 + 30 ? normalBoxMaterial : transBoxMaterial;
                o.transparent = o.position.y == cords[1] * 10 + 30 ? false : true;
            })
        } else if (checkZ.checked) {
            objects.forEach(o => {
                o.material = o.position.z == cords[2] * 10 ? normalBoxMaterial : transBoxMaterial;
                o.transparent = o.position.z == cords[2] * 10 ? false : true;
            })
        } else {
            objects.forEach(o => {
                o.material = normalBoxMaterial;
                o.transparent = false;
            })
        }
    }
}

function generateFloor() {
    // floor
    // console.log("flori");

    let floorGeometry = new THREE.PlaneGeometry(2000, 2000, 1, 1);
    floorGeometry.rotateX(-Math.PI / 2);

    // vertex displacement

    let position = floorGeometry.attributes.position;

    for (let i = 0, l = position.count; i < l; i++) {

        vertex.fromBufferAttribute(position, i);

        vertex.x += 20;
        vertex.y += 0;
        vertex.z += 20;

        position.setXYZ(i, vertex.x, vertex.y, vertex.z);

    }

    floorGeometry = floorGeometry.toNonIndexed(); // ensure each face has unique vertices

    // position = floorGeometry.attributes.position;
    // const colorsFloor = [];

    // for (let i = 0, l = position.count / 2; i < l; i++) {

    //     // color.set(0.75, 0.75, 0.75);
    //     // colorsFloor.push(0.5, 0.9, 0.9);
    //     // color.set(0.5, 0.5, 0.5);
    //     colorsFloor.push(1, 0.5, 1);
    //     colorsFloor.push(1, 1, 0.3);

    // }

    // floorGeometry.setAttribute('color', new THREE.Float32BufferAttribute(colorsFloor, 3));

    const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x357a38 });

    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    // console.log(scene);
    scene.add(floor);
}


function selectObject(e) {
    // console.log("select");
    if (e.button === 0) {
        if (target) {
            if (selected) {
                selected.material = selected.transparent ? transBoxMaterial : normalBoxMaterial;
            }
            // console.log(target);
            selected = target;
            selectOnly();

        }
    }

}

function removeObjects() { // or new scene
    // console.log('1');
    // singleGeometry
    // console.log(objects.length);
    // for (let o of objects) {
    //     scene.remove(o);
    // }
    // console.log('2');
    // console.log("rim rum");
    generateNewScene();

    objects = [];
    target = null;
    selected = null;
    base = null;
    // console.log('3');

}

function generateObjects() {
    // removeObjects();
    // console.log("removed");
    let num = Number(diameterInput.value);
    if (!num || num < 7 || num > 200) {
        num = 10;
        diameterInput.value = 10;
    }

    cords = getCords(num);
    // console.log("corded");
    for (const cord of cords) {

        const box = new THREE.Mesh(boxGeometry, normalBoxMaterial);
        box.position.x = cord[0] * 10; //Math.floor(Math.random() * 20 - 10) * 20;
        box.position.y = cord[1] * 10 + 30; //Math.floor(Math.random() * 20) * 20 + 10;
        box.position.z = cord[2] * 10; //Math.floor(Math.random() * 20 - 10) * 20;

        if (cord[0] == 0 && cord[1] == 0 && cord[2] == 0) {
            base = box;
        }

        scene.add(box);
        objects.push(box);

    }
    selectOnly();
    console.log(objects.length);
    console.log("added");

    // for (let i = 0; i < cords.length; i++) {

    //     boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, flatShading: true, vertexColors: true });
    //     boxMaterial.color.setHSL(Math.random() * 0.2 + 0.5, 0.75, Math.random() * 0.25 + 0.75);

    //     const box = new THREE.Mesh(boxGeometry, boxMaterial);
    //     box.position.x = cords[i][0] * 10; //Math.floor(Math.random() * 20 - 10) * 20;
    //     box.position.y = cords[i][1] * 10 + 10; //Math.floor(Math.random() * 20) * 20 + 10;
    //     box.position.z = cords[i][2] * 10; //Math.floor(Math.random() * 20 - 10) * 20;

    //     scene.add(box);
    //     objects.push(box);

    // }
}

function makeTexture(height, width, c1, c2) {
    let data = [];

    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            const c = y === 0 || x === 0 || y === height - 1 || x === width - 1 ? c1 : c2;
            data.push(c[0]);
            data.push(c[1]);
            data.push(c[2]);
        }
    }

    return data;
}

function selectTarget() {
    //let rect = renderer.domElement.getBoundingClientRect();
    mouse.x = 0;
    mouse.y = 0;
    raycaster.setFromCamera(mouse, camera);
    let intersects = raycaster.intersectObjects(objects);
    // console.log(intersects);
    if (intersects.length > 0) {
        let intersect = intersects[0];
        // rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
        if (intersect.distance < 1000) {
            // objects = objects.filter(e => e.uuid != intersect.object.uuid) //+ selected == uuid, nem kell mindig nezni, +mozgasra is kell
            for (const e of objects) {
                if (e.uuid == intersect.object.uuid) {
                    if (target) {
                        target.material = target.transparent ? transBoxMaterial : normalBoxMaterial;
                    }
                    target = e;
                    e.material = greenBoxMaterial;

                    // intersect.material.map.needsUpdate = true;
                    // normalBoxMaterial.map = greenTexture;
                    break;
                }
            }
        }
    } else {
        if (target) {
            target.material = normalBoxMaterial;
        }
        target = null;
    }
    if (selected) {
        selected.material = blueBoxMaterial;
    }
    if (base) {
        base.material = redBoxMaterial;
    }


}

function getCordsObj(obj) {
    // console.log(obj.position);
    return [obj.position.x / 10, obj.position.y / 10 - 3, obj.position.z / 10]

}

function updatePanel() {
    if (target) {
        const cords = getCordsObj(target)
        relTargetXYZ.innerHTML = `${cords[0]}/${cords[1]}/${cords[2]}`;
        absTargetXYZ.innerHTML = `${cords[0] + cordXvalue}/${cords[1] + cordYvalue}/${cords[2] + cordZvalue}`;
    } else {
        relTargetXYZ.innerHTML = `${0}/${0}/${0}`;
        absTargetXYZ.innerHTML = `${0}/${0}/${0}`;
    }
    if (selected) {
        const cords = getCordsObj(selected)
        relSelectedXYZ.innerHTML = `${cords[0]}/${cords[1]}/${cords[2]}`;
        absSelectedXYZ.innerHTML = `${cords[0] + cordXvalue}/${cords[1] + cordYvalue}/${cords[2] + cordZvalue}`;
    } else {
        relSelectedXYZ.innerHTML = `${0}/${0}/${0}`;
        absSelectedXYZ.innerHTML = `${0}/${0}/${0}`;
    }
}
// ata = makeTexture(height, width, [150, 50, 50], [250, 250, 250]); //blue
// const redTexture = new THREE.DataTexture(Uint8Array.from(data), width, height, THREE.RGBFormat);

// boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, map: normalTexture });

function resizeCanvasToDisplaySize() {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();

}

// function onWindowResize() {

//     camera.aspect = window.innerWidth / window.innerHeight;
//     camera.updateProjectionMatrix();

//     renderer.setSize(window.innerWidth, window.innerHeight);

// }

function animate() {
    stats.begin();
    requestAnimationFrame(animate);



    const time = performance.now();

    if (controls.isLocked === true) {

        raycaster.ray.origin.copy(controls.getObject().position);
        raycaster.ray.origin.y -= 10;

        updatePanel();
        selectTarget();
        // const intersections = raycaster.intersectObjects(objects, false); // no gravity

        // const onObject = intersections.length > 0;

        const delta = (time - prevTime) / 1000;

        velocity.x -= velocity.x * 10.0 * delta;
        velocity.z -= velocity.z * 10.0 * delta;
        velocity.y -= velocity.y * 10.0 * delta;

        // velocity.y -= 9.8 * 100.0 * delta; // 100.0 = mass

        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.y = Number(moveUp) - Number(moveDown);
        direction.normalize(); // consistent movements in all directions

        if (moveForward || moveBackward) velocity.z -= direction.z * 1000.0 * delta * speed;
        if (moveLeft || moveRight) velocity.x -= direction.x * 1000.0 * delta * speed;
        if (moveUp || moveDown) velocity.y -= direction.y * 1000.0 * delta * speed;

        // if (onObject === true) {

        //     velocity.y = Math.max(0, velocity.y);
        //     canJump = true;

        // }

        controls.moveRight(-velocity.x * delta);
        controls.moveForward(-velocity.z * delta);

        controls.getObject().position.y += (-velocity.y * delta); // new behavior

        // controls.getObject().position.y += (velocity.y * delta); // new behavior

        if (controls.getObject().position.y < 10) { //  #ne menj lentebb

            // velocity.y = 0;
            controls.getObject().position.y = 10;

            // canJump = true;

        }

    }

    prevTime = time;

    renderer.render(scene, camera);
    stats.end();

}

// const editorElem = document.querySelector("#editor");
// document.querySelectorAll('button').forEach(elem => {
//     elem.addEventListener('click', () => {
//         editorElem.style.flexBasis = elem.dataset.size;
//     });
// });


const resizeObserver = new ResizeObserver(resizeCanvasToDisplaySize);
resizeObserver.observe(renderer.domElement, { box: 'content-box' });




// wtf texure
// const width = 16
// const height = 16

// const data = [];

// for (let y = 0; y < height; ++y) {
//     for (let x = 0; x < width; ++x) {
//         const a = y < (height / 2) ? 50 : 255;
//         const r = x < (width / 2) ? 255 : 100;
//         data.push(r, 0, 0, a);
//     }
// }


// // let arr1d = [].concat(...data);

// const texture = new THREE.DataTexture(Uint8Array.from(data), width, height, THREE.RGBFormat);

// // let texture = THREE.ImageUtils.generateDataTexture(inputW, inputH, initColor);
// boxMaterial = new THREE.MeshPhongMaterial({ specular: 0xffffff, map: texture });


// const width = 8
//     const height = 8

//     const data = [];

//     for (let y = 0; y < height; ++y) {
//         for (let x = 0; x < width; ++x) {
//             const a = y < (height / 2) ? 50 : 255;
//             const r = x < (width / 2) ? 255 : 100;
//             data.push(200, 200, 200, 100);
//         }
//     }