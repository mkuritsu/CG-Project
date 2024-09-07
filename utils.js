/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

import * as twgl from "./twgl/twgl-full.module.js"

export function drawBufferWithUniforms(gl, bufferInfo, programInfo, uniforms) {
    gl.useProgram(programInfo.program);
    twgl.setBuffersAndAttributes(gl, programInfo, bufferInfo);
    twgl.setUniforms(programInfo, uniforms);
    twgl.drawBufferInfo(gl, bufferInfo);
}

export function degToRad(angleDeg) {
    return angleDeg * Math.PI / 180;
}

export function uniformScale(value) {
    return twgl.v3.create(value, value, value);
}

export function randomBounded(min, max) {
    return Math.random() * (max - min) + min;
}
