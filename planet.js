/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

import * as twgl from "./twgl/twgl-full.module.js"
import * as utils from "./utils.js"
import { degToRad } from "./utils.js";
import { Orbit } from "./orbit.js";

export class Planet {

    constructor(gl, segments, texture) {
        this.gl = gl;
        this.bufferInfo = twgl.primitives.createSphereBufferInfo(gl, 1, segments, segments);
        this.color = twgl.v3.create(1, 1, 1);
        this.scale = utils.uniformScale(1);

        const orbitCenterOffset = twgl.v3.create(-20, 0, 0);
        this.orbitCenter = twgl.v3.add(twgl.v3.create(0, 0, 0), orbitCenterOffset);

        this.position = twgl.v3.create(0, 0, 0);
        this.orbitSpeed = (Math.random() * 2 - 1) / 10000;
        this.rotationSpeed = 1;
        this.texture = twgl.createTexture(gl, { src: texture });
        this.axialTilt = 0;
    }

    update(time) {
        let model = twgl.m4.identity();
        const scaling = twgl.m4.scaling(this.scale);
        twgl.m4.multiply(scaling, model, model);

        twgl.m4.multiply(twgl.m4.rotationY(time * this.rotationSpeed), model, model);
        let axisTiltRot = twgl.m4.rotationZ((this.axialTilt * Math.PI) / 180);
        twgl.m4.multiply(axisTiltRot, model, model);

        if (this.orbit !== undefined)
            this.orbit.update(time, this.orbitSpeed, this.orbitCenter, model)

        this.model = model;
        let positionPlanetInit = twgl.v3.create(0, 0, 0);
        this.position = twgl.m4.transformPoint(model, positionPlanetInit);
    }

    draw(programInfo, camera, material) {
        const uniforms = {
            u_seed: this.seed,
            u_texture: this.texture,
            u_model: this.model,
            u_view_inverse: twgl.m4.inverse(camera.view),
            u_model_transpose_inverse: twgl.m4.transpose(twgl.m4.inverse(this.model)),
            u_mvp: twgl.m4.multiply(twgl.m4.multiply(camera.projection, camera.view), this.model)
        };
        Object.assign(uniforms, material);
        utils.drawBufferWithUniforms(this.gl, this.bufferInfo, programInfo, uniforms);
    }
}

export function createPlanets(gl) {

    const sun = new Planet(gl, 64, "textures/sun.jpg");
    sun.orbitCenter = twgl.v3.create(0, 0, 0);
    sun.isLight = true;
    sun.axialTilt = 7.25;
    sun.scale = utils.uniformScale(9.52 * 11);
    sun.orbit = undefined;
    sun.rotationSpeed = 0.00043; //27 dias
    sun.orbitSpeed = 0;

    const sunRadius = sun.scale[0];

    const mercury = new Planet(gl, 64, "textures/mercury.jpg");
    mercury.axialTilt = 0.03;
    mercury.scale = utils.uniformScale(0.65);
    mercury.orbit = new Orbit(gl, sunRadius + 17, sunRadius * 2 + 1, 0, 90);
    mercury.rotationSpeed = 0.0005; //58 dias 16h
    mercury.orbitSpeed = 0.00100; //87.97 days

    const venus = new Planet(gl, 64, "textures/venus.jpg");
    venus.axialTilt = 177.4;
    venus.scale = utils.uniformScale(1.2);
    venus.orbit = new Orbit(gl, sunRadius + 35, sunRadius * 2 + 25, 0, 90);
    venus.rotationSpeed = 0.0006;//243 dias 26m
    venus.orbitSpeed = 0.00075; //224.7 days

    const earth = new Planet(gl, 64, "textures/earth.png");
    earth.axialTilt = 23.44;
    earth.scale = utils.uniformScale(1.5);
    earth.orbit = new Orbit(gl, sunRadius + 50, sunRadius * 2 + 52, 0, 90);
    earth.rotationSpeed = 0.002356; //23h56m
    earth.orbitSpeed = 0.00065; //365.256365 days

    const mars = new Planet(gl, 64, "textures/mars.png");
    mars.axialTilt = 25.19;
    mars.scale = utils.uniformScale(0.75);
    mars.orbit = new Orbit(gl, sunRadius + 70, sunRadius * 2 + 90, 0, 90);
    mars.rotationSpeed = 0.002436; //24h36m
    mars.orbitSpeed = 0.0006; //686.93 days

    const jupiter = new Planet(gl, 64, "textures/jupiter.png");
    jupiter.axialTilt = 3.13;
    jupiter.scale = utils.uniformScale(9.52);
    jupiter.orbit = new Orbit(gl, sunRadius + 170, sunRadius * 2 + 200, 0, 90);
    jupiter.rotationSpeed = 0.00855; //9h55m
    jupiter.orbitSpeed = 0.0005; //11.86 years

    const saturn = new Planet(gl, 64, "textures/saturn.jpg");
    saturn.axialTilt = 26.93;
    saturn.scale = utils.uniformScale(7.76);
    saturn.orbit = new Orbit(gl, sunRadius + 340, sunRadius * 2 + 400, 0, 90);
    saturn.rotationSpeed = 0.008; //10h33m
    saturn.orbitSpeed = 0.0004; //29.42 years

    const uranus = new Planet(gl, 64, "textures/uranus.png");
    uranus.axialTilt = 98;
    uranus.scale = utils.uniformScale(3.38);
    uranus.orbit = new Orbit(gl, sunRadius + 520, sunRadius * 2 + 650, 0, 90);
    uranus.rotationSpeed = 0.00714; //17h14m
    uranus.orbitSpeed = 0.000298; //83.75 years

    const neptune = new Planet(gl, 64, "textures/neptune.jpg");
    neptune.axialTilt = 28.52;
    neptune.scale = utils.uniformScale(3.28);
    neptune.orbit = new Orbit(gl, sunRadius + 653, sunRadius * 2 + 720, 0, 90);
    neptune.rotationSpeed = 0.006; //16h
    neptune.orbitSpeed = 0.000198; //163.72 years

    const pluto = new Planet(gl, 64, "textures/pluto.png");
    pluto.axialTilt = 122.7;
    pluto.scale = utils.uniformScale(0.4);
    pluto.orbit = new Orbit(gl, sunRadius + 790, sunRadius * 2 + 800, 0, 90);
    pluto.rotationSpeed = 0.0004; //153h
    pluto.orbitSpeed = 0.00009998; //247.92 years

    //---------------------------------MOONS-----------------------------------------------------------------------
    //EARTH
    const moon = new Planet(gl, 64, "textures/moon.jpg");
    moon.orbitCenter = earth.position;
    moon.axialTilt = 6.68;
    moon.scale = utils.uniformScale(0.43);
    moon.orbit = new Orbit(gl, earth.scale[0] + 0.7, earth.scale[0] * 2 + 2, 0, 90);
    moon.orbitSpeed = 0.003;
    moon.orbit.tiltV = degToRad(25);
    moon.rotationSpeed = 0.00043; //27 days

    //JUPITER
    const calisto = new Planet(gl, 64, "textures/calisto_jupiter_moon.jpg");
    calisto.orbitCenter = earth.orbitCenter;
    calisto.axialTilt = 0;
    calisto.scale = utils.uniformScale(0.55);
    calisto.orbit = new Orbit(gl, jupiter.scale[0] * 2 + 6, jupiter.scale[0] * 2 + 10, 0, 90);
    calisto.orbitSpeed = 0.001;
    calisto.orbit.tiltV = degToRad(2);
    calisto.rotationSpeed = 0.00033; //16 days

    const europe = new Planet(gl, 64, "textures/europe_jupiter_moon.png");
    europe.orbitCenter = jupiter.orbitCenter;
    europe.axialTilt = 0.1;
    europe.scale = utils.uniformScale(0.47);
    europe.orbit = new Orbit(gl, jupiter.scale[0] + 5, jupiter.scale[0] * 2 + 3.2, 0, 90);
    europe.orbitSpeed = 0.002;
    europe.orbit.tiltV = degToRad(1.7);
    europe.rotationSpeed = 0.00053;

    const io = new Planet(gl, 64, "textures/io_jupiter_moon.jpg");
    io.orbitCenter = jupiter.orbitCenter;
    io.axialTilt = 0.1;
    io.scale = utils.uniformScale(0.5);
    io.orbit = new Orbit(gl, jupiter.scale[0] + 1.2, jupiter.scale[0] + 2.3, 0, 90);
    io.orbitSpeed = 0.003;
    io.orbit.tiltV = degToRad(35);
    io.rotationSpeed = 0.00043;

    //SATURN
    const titan = new Planet(gl, 64, "textures/titan_saturn_moon.jpg");
    titan.orbitCenter = saturn.orbitCenter;
    titan.axialTilt = 27;
    titan.scale = utils.uniformScale(0.7);
    titan.orbit = new Orbit(gl, saturn.scale[0] * 2 + 38, saturn.scale[0] * 2 + 45, 0, 90);
    titan.orbitSpeed = 0.001;
    titan.orbit.tiltV = degToRad(1);
    titan.rotationSpeed = 0.00083; //16 dias

    const enceladus = new Planet(gl, 64, "textures/enceladus_saturn_moon.png");
    enceladus.orbitCenter = saturn.orbitCenter;
    enceladus.axialTilt = 0;
    enceladus.scale = utils.uniformScale(0.3);
    enceladus.orbit = new Orbit(gl, saturn.scale[0] * 2 + 15, saturn.scale[0] * 2 + 22, 0, 90);
    enceladus.orbitSpeed = 0.003;
    enceladus.orbit.tiltV = degToRad(0);
    enceladus.rotationSpeed = 0.002256; //1 dia

    //---------------------------------------------------------------------------------------------------
    const planets = [sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto]
    const moons = [moon, calisto, europe, io, titan, enceladus]
    return {
        planets: planets,
        moons: moons,
        astro: { sun, mercury, venus, earth, mars, jupiter, saturn, uranus, neptune, pluto, moon, calisto, europe, io, titan, enceladus }
    };
}

//-----------------------------------------------RINGS------------------------------------------------------------------
export function createRings(gl, astros, planet, planetScale, colors) {
    let numRings = colors.length;
    let rx = 0;
    let rz = 0;
    let tilt = 0;
    let thickness = 0.6;
    if (planet === astros.saturn) {
        thickness = 0.9;
        rx = [1.8, 4.4, 6.3, 8.9, 10.8];
        rz = [0.2, 2.8, 4.7, 7.3, 9.2];
        tilt = degToRad(26.7);
    }
    if (planet === astros.uranus) {
        thickness = 0.4;
        rx = [2.6, 4.4];
        rz = [1, 2.8];
        tilt = degToRad(97.77);
    }
    if (planet === astros.neptune) {
        thickness = 0.2;
        rx = [2.6, 4, 5.2];
        rz = [1.1, 2.9, 4.1];
        tilt = degToRad(28.52);
    }
    let ringCollection = []
    for (let i = 0; i < numRings; i++) {
        let ring = new Orbit(gl, planetScale[0] * 2 + rx[i], planetScale[0] * 2 + rz[i], tilt, 90, thickness, colors[i]);
        ringCollection.push(ring);
    }
    return ringCollection;
}


//--------------------------------------------------ASTEROIDS-----------------------------------------------------------
const MIN_ASTEROID_SCALE = 0.1;
const MAX_ASTEROID_SCALE = 1.4;

export function asteroidBelt(gl, sunRadius, orbitCenter, axialTilt, orbitSpeed, rotationSpeedMin, rotationSpeedMax, rx, rz, numberAsteroids) {
    const asteroidSet = new Set();

    for (let i = 0; i < numberAsteroids; i++) {
        const asteroid = new Planet(gl, 64, "textures/asteroid.png");
        asteroid.orbit = new Orbit(gl, sunRadius + rx, sunRadius * 2 + rz, 0, 90);

        const scaleX = utils.randomBounded(MIN_ASTEROID_SCALE, MAX_ASTEROID_SCALE);
        const scaleZ = utils.randomBounded(MIN_ASTEROID_SCALE, MAX_ASTEROID_SCALE);
        const angle = utils.randomBounded(-10, 10);

        asteroid.orbitCenter = orbitCenter;
        asteroid.axialTilt = axialTilt;
        asteroid.scale = twgl.v3.create(scaleX, Math.min(scaleX, scaleZ), scaleZ);
        asteroid.orbitSpeed = orbitSpeed;
        asteroid.orbit.tiltV = degToRad(angle);
        asteroid.rotationSpeed = utils.randomBounded(rotationSpeedMin, rotationSpeedMax);
        asteroid.seed = utils.randomBounded(-3, 3);
        asteroidSet.add(asteroid);
    }
    return asteroidSet;
}
