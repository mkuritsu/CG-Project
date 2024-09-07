/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

import * as input from "./input.js"

import { asteroidBelt, createPlanets, createRings } from "./planet.js"
import { Camera } from "./camera.js"
import * as twgl from "./twgl/twgl-full.module.js"
import * as asset_loader from "./asset_loader.js"
import { Material } from "./material.js"

import { Skybox } from "./skybox.js"
//---------------------------HTML ELEMENTS----------------------------------------------
const canvas = document.querySelector("canvas");
const loading_screen = document.querySelector(".loading-screen");
const progress = document.querySelector("progress");
const overlay = document.querySelector(".overlay");
const loading_text = document.getElementById("loading-text");
const fpsCounter = document.getElementById("fps-counter");
const shaderSelect = document.getElementById("shader-select");
const specularSlider = document.getElementById("specular-slider");
const specularSliderValueLabel = document.getElementById("specular-slider-value-label");
const stopPlanetsBox = document.getElementById("stop-planets");
const diffuseLightCheck = document.getElementById("diffuse-light");
const ambientLightCheck = document.getElementById("ambient-light");

//---------------------INIT WEBGL and SYSTEMS--------------------------------------------
const gl = canvas.getContext("webgl2");
gl.clearColor(0, 0, 0, 1);
gl.enable(gl.DEPTH_TEST);
gl.enable(gl.CULL_FACE);
input.init(canvas);

//---------------------------LOAD PLANETS-------------------------------------------------
const { planets, moons, astro } = createPlanets(gl);

const saturnRings = createRings(gl, astro, astro.saturn, astro.saturn.scale, [twgl.v3.create(0.3686274509803922, 0.34509803921568627, 0.2549019607843137), twgl.v3.create(0.5725490196078431, 0.5333333333333333, 0.39215686274509803), twgl.v3.create(0.7254901960784313, 0.6705882352941176, 0.5333333333333333), twgl.v3.create(0.27450980392156865, 0.2549019607843137, 0.18823529411764706), twgl.v3.create(0.23921568627450981, 0.2235294117647059, 0.16470588235294117)]);
const uranusRings = createRings(gl, astro, astro.uranus, astro.uranus.scale, [twgl.v3.create(0.3843137254901961, 0.396078431372549, 0.42745098039215684), twgl.v3.create(0.5764705882352941, 0.592156862745098, 0.6431372549019608)]);
const neptuneRings = createRings(gl, astro, astro.neptune, astro.neptune.scale, [twgl.v3.create(0.8745098039215686, 0.4235294117647059, 0.4235294117647059), twgl.v3.create(0.6980392156862745, 0.25882352941176473, 0.25882352941176473), twgl.v3.create(0.5764705882352941, 0.2823529411764706, 0.2823529411764706)]);

const rings = { saturn: saturnRings, uranus: uranusRings, neptune: neptuneRings };

const asteroids = asteroidBelt(gl, astro.sun.scale[0], astro.earth.orbitCenter, 0, 0.001, 0.0002, 0.0009, 110, 170, 100);
const kuiperAsteroids = asteroidBelt(gl, astro.sun.scale[0], astro.earth.orbitCenter, 0, 0.0004, 0.0002, 0.0009, 900, 1050, 200);

let id = 0;
asteroids.forEach(a => {
    a.id = id;
    id++;
});
kuiperAsteroids.forEach(a => {
    a.id = id;
    id++;
});

//---------------------------SHADERS--------------------------------------------------
progress.value = 50;
loading_text.innerText = "Loading Shaders"

const phongVertex = await asset_loader.load_shader("shaders/phong.vert");
const phongFragment = await asset_loader.load_shader("shaders/phong.frag");
const gouraudVertex = await asset_loader.load_shader("shaders/gouraud.vert");
const gouraudFragment = await asset_loader.load_shader("shaders/gouraud.frag");
const orbitVertex = await asset_loader.load_shader("shaders/orbit.vert");
const orbitFragment = await asset_loader.load_shader("shaders/orbit.frag");
const asteroidVertexPhong = await asset_loader.load_shader("shaders/asteroid_phong.vert");
const asteroidVertexGouraud = await asset_loader.load_shader("shaders/asteroid_gouraud.vert");

const skyboxVertex = await asset_loader.load_shader("shaders/skybox.vert");
const skyboxFragment = await asset_loader.load_shader("shaders/skybox.frag");

const phongShader = twgl.createProgramInfo(gl, [phongVertex, phongFragment]);
const gouraudShader = twgl.createProgramInfo(gl, [gouraudVertex, gouraudFragment]);
const orbitShaderProgram = twgl.createProgramInfo(gl, [orbitVertex, orbitFragment]);
const asteroidPhongShader = twgl.createProgramInfo(gl, [asteroidVertexPhong, phongFragment]);
const asteroidGouraudShader = twgl.createProgramInfo(gl, [asteroidVertexGouraud, gouraudFragment]);


const skyboxShader = twgl.createProgramInfo(gl, [skyboxVertex, skyboxFragment]);

//------------------------------- SKYBOX--------------------------------------------------//
const skybox = new Skybox(gl, skyboxShader);
// -------------------------------CAMERA--------------------------------------------------
const camera = new Camera();
camera.position = twgl.v3.create(0, 500, 300);

// -------------------------------STATE---------------------------------------------------
let showPlanetOrbits = false;
let followingEarth = false;
let stopPlanets = false;
let shaderType = "phong";
let sensitivity = 0.2;
let cameraSpeed = 100.0;
let cameraSpeedMultiplier = 2.5;

//----------------------------FINISH LOADING--------------------------------------------
canvas.classList.remove("hidden");
overlay.classList.remove("hidden");
loading_screen.style.opacity = 0;

//--------------------------MATERIAL-----------------------------------------------------
let astroCorpMaterial = new Material(twgl.v3.create(1, 1, 1), 50, twgl.v3.create(0, 0, 0), 0.1, 1, 1);
let ringsMaterial = new Material(twgl.v3.create(1, 1, 1), 50, twgl.v3.create(0, 0, 0), 0.25, 1, 1);
let sunMaterial = new Material(twgl.v3.create(1, 1, 1), 0, twgl.v3.create(0, 0, 0), 1, 0, 0);


//-----------------------EVENT LISTENERS------------------------------------------------
loading_screen.addEventListener("transitionend", e => {
    loading_screen.remove();
});

shaderSelect.addEventListener("change", e => {
    if (e.currentTarget === shaderSelect && e.type === "change") {
        shaderType = shaderSelect.value;
    }
});


specularSlider.addEventListener("change", e => {
    const value = specularSlider.value;
    const specular = value / 10;
    specularSliderValueLabel.innerText = specular;
    astroCorpMaterial.u_ks = specular;
    ringsMaterial.u_ks = specular;
});

stopPlanetsBox.addEventListener("change", e => {
    stopPlanets = !stopPlanets;
});

const astroCorpMaterialKd = astroCorpMaterial.u_kd;
const ringsMaterialKd = ringsMaterial.u_kd;
diffuseLightCheck.addEventListener("change", e => {
    if (diffuseLightCheck.checked) {
        astroCorpMaterial.u_kd = astroCorpMaterialKd;
        ringsMaterial.u_kd = ringsMaterialKd;
    } else {
        astroCorpMaterial.u_kd = 0;
        ringsMaterial.u_kd = 0;
    }
});

const astroCorpMaterialKa = astroCorpMaterial.u_ka;
const ringsMaterialKa = ringsMaterial.u_ka;
ambientLightCheck.addEventListener("change", e => {
    if (ambientLightCheck.checked) {
        astroCorpMaterial.u_ka = astroCorpMaterialKa;
        ringsMaterial.u_ka = ringsMaterialKa;
    } else {
        astroCorpMaterial.u_ka = 0;
        ringsMaterial.u_ka = 0;
    }
});

//------------------------------RENDER LOOP----------------------------------------------
let lastTime = 0;
let planetUpdateTime = 0;
function render(time) {
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    camera.update(gl);
    const delta = (time - lastTime) / 1000;

    //----------------------------INPUT--------------------------------------------
    fpsCounter.innerText = `FPS: ${Math.round(1 / delta)}`

    const mouseMovement = input.getMouseMovement();
    const rotSpeedH = -mouseMovement.x * delta * sensitivity;
    const rotSpeedV = -mouseMovement.y * delta * sensitivity;
    if (rotSpeedH !== 0) {
        camera.rotateHorizontal(rotSpeedH);
    }
    if (rotSpeedV !== 0) {
        camera.rotateVertical(rotSpeedV);
    }

    const shaderProgram = shaderType === "phong" ? phongShader : gouraudShader;
    const asteroidShaderProgram = shaderType === "phong" ? asteroidPhongShader : asteroidGouraudShader;

    let speed = cameraSpeed * delta;

    if (input.isKeyDown("Shift"))
        speed *= cameraSpeedMultiplier;

    if (input.isKeyDown("w") || input.isKeyDown("arrowup")) {
        camera.moveForward(speed);
        followingEarth = false;
    }
    if (input.isKeyDown("s") || input.isKeyDown("arrowdown")) {
        camera.moveBackward(speed);
        followingEarth = false;
    }
    if (input.isKeyDown("d") || input.isKeyDown("arrowright")) {
        camera.moveRight(speed);
        followingEarth = false;
    }
    if (input.isKeyDown("a") || input.isKeyDown("arrowleft")) {
        camera.moveLeft(speed);
        followingEarth = false;
    }
    if (input.isKeyDown(" ")) {
        camera.moveUp(speed);
        followingEarth = false;
    }
    if (input.isKeyDown("control")) {
        camera.moveDown(speed);
        followingEarth = false;
    }
    if (input.isKeyPressed("o"))
        showPlanetOrbits = !showPlanetOrbits;
    if (input.isKeyDown("2")) {
        followingEarth = false;
        const pos = astro.sun.position
        const scale = astro.sun.scale[0];
        camera.setTarget(astro.earth.position);
        camera.position = twgl.v3.create(pos[0], pos[1] + scale * 1.5, pos[2]);
    }

    //----------------------------UPDATE--------------------------------------------
    if (!stopPlanets) {
        planetUpdateTime += delta * 1000;
        planets.forEach(p => {
            p.update(planetUpdateTime);
        });
        astro.moon.orbitCenter = astro.earth.position;
        astro.calisto.orbitCenter = astro.jupiter.position;
        astro.europe.orbitCenter = astro.jupiter.position;
        astro.io.orbitCenter = astro.jupiter.position;
        astro.titan.orbitCenter = astro.saturn.position;
        astro.enceladus.orbitCenter = astro.saturn.position;
    }
    moons.forEach(m => {
        m.update(time);
    });

    if (input.isKeyPressed("1")) {
        followingEarth = !followingEarth;
        const pos = astro.earth.position
        const scale = astro.earth.scale[0];
        camera.position = twgl.v3.create(pos[0] + scale * 4, pos[1] + scale * 4, pos[2] + scale * 4);
        camera.setTarget(astro.earth.position);
    }

    if (followingEarth) {
        const pos = astro.earth.position
        const scale = astro.earth.scale[0];
        camera.position = twgl.v3.create(pos[0] + scale * 4, pos[1] + scale * 4, pos[2] + scale * 4);
    }
    //----------------------------DRAW--------------------------------------------

    planets.forEach(p => {
        if (p === astro.sun)
            p.draw(shaderProgram, camera, sunMaterial);
        else
            p.draw(shaderProgram, camera, astroCorpMaterial);
    });
    moons.forEach(m => {
        m.draw(shaderProgram, camera, astroCorpMaterial);
    });

    asteroids.forEach(a => {
        if (!stopPlanets)
            a.update(planetUpdateTime + 100 * a.id);
        a.draw(asteroidShaderProgram, camera, astroCorpMaterial);
    });
    kuiperAsteroids.forEach(a => {
        if (!stopPlanets)
            a.update(planetUpdateTime + 100 * a.id);
        a.draw(asteroidShaderProgram, camera, astroCorpMaterial);
    });

    if (showPlanetOrbits) {
        planets.forEach(p => {
            if (p.orbit !== undefined)
                p.orbit.draw(orbitShaderProgram, camera, p.orbitCenter, sunMaterial);
        });
        moons.forEach(m => {
            m.orbit.draw(orbitShaderProgram, camera, m.orbitCenter, sunMaterial);
        });
    }
    let indexPlanet = 0;
    Object.values(rings).forEach(p => {
        p.forEach(r => {
            if (indexPlanet === 0)
                r.draw(shaderProgram, camera, astro.saturn.position, ringsMaterial, 0.2);
            if (indexPlanet === 1)
                r.draw(shaderProgram, camera, astro.uranus.position, ringsMaterial, 0.2);
            if (indexPlanet === 2)
                r.draw(shaderProgram, camera, astro.neptune.position, ringsMaterial, 0.2);
        });
        indexPlanet++;
    });
    skybox.draw(camera);

    //-----------------------------------------------------------------------
    input.update();
    lastTime = time;
    requestAnimationFrame(render);
}

requestAnimationFrame(render);
