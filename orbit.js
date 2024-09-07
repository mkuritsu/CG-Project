/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

import * as twgl from "./twgl/twgl-full.module.js";
import * as utils from "./utils.js";

export class Orbit {

    constructor(gl, rx, rz, tiltV = 0, tiltH = 0, thickness = 0.05, colorRing = undefined) {
        this.gl = gl;
        this.tiltV = tiltV;
        this.tiltH = tiltH;
        this.rx = rx;
        this.rz = rz;
        this.torus = twgl.primitives.createTorusBufferInfo(gl, this.rx, thickness, 128, 128);
        this.color = colorRing ===  undefined ? [0.5, 0.5, 0.5] : colorRing;
        let color = colorRing === undefined ? [127, 127, 127, 255] : [colorRing[0] * 255, colorRing[1] * 255, colorRing[2] * 255, 255];
        this.texture = twgl.createTexture(gl, {src: color});
    }

    update(time, speed, orbitCenter, model){
        time *= speed;
        const rx = this.rx * Math.cos(time) * Math.cos(this.tiltH) - this.rz * Math.sin(time) * Math.sin(this.tiltH);
        const rz = this.rx * Math.cos(time) * Math.sin(this.tiltH) + this.rz * Math.sin(time) * Math.cos(this.tiltH);
        twgl.m4.multiply(twgl.m4.translation(twgl.v3.create(rx, 0, rz)), model, model);
        twgl.m4.multiply(twgl.m4.rotationZ(this.tiltV), model, model);
        twgl.m4.multiply(twgl.m4.translation(twgl.v3.create(orbitCenter[0], orbitCenter[1], orbitCenter[2])), model, model);
    }

    draw(shaderProgram, camera, orbitCenter, material=undefined, scaleY = 1) {
        const model = twgl.m4.identity();
        twgl.m4.multiply(twgl.m4.scaling(twgl.v3.create(1, scaleY, this.rz/this.rx)), model, model);
        twgl.m4.multiply(twgl.m4.rotationY(-this.tiltH), model, model);
        twgl.m4.multiply(twgl.m4.rotationZ(this.tiltV), model, model);
        twgl.m4.multiply(twgl.m4.translation(twgl.v3.create(orbitCenter[0], orbitCenter[1], orbitCenter[2])), model, model);

        const uniforms = {
            u_texture: this.texture,
            u_model: model,
            u_view_inverse: twgl.m4.inverse(camera.view),
            u_model_transpose_inverse: twgl.m4.transpose(twgl.m4.inverse(model)),
            u_mvp: twgl.m4.multiply(twgl.m4.multiply(camera.projection, camera.view), model)
        };
        if (material !== undefined) {
            Object.assign(uniforms, material);
            uniforms.u_lightColor = material.u_lightColor,
            uniforms.u_ambient = material.u_ambient,
            uniforms.u_diffuse = this.texture,
            uniforms.u_specular = material.u_specular,
            uniforms.u_shininess = material.u_shininess,
            uniforms.u_specularFactor = material.u_specularFactor,
            uniforms.u_lightModelPos = material.u_lightModelPos,
            uniforms.u_viewMatrix = camera.view;
            uniforms.u_projectionMatrix = camera.projection;
            uniforms.u_modelMatrix = model;
    
            uniforms.u_viewInverse = twgl.m4.inverse(camera.view);
            uniforms.u_modelInverseTranspose = twgl.m4.transpose(twgl.m4.inverse(model));
        }
        const viewProjection = twgl.m4.multiply(camera.projection, camera.view);
        uniforms.u_modelViewProjection = twgl.m4.multiply(viewProjection, model);
        uniforms.u_color = this.color;

        utils.drawBufferWithUniforms(this.gl, this.torus, shaderProgram, uniforms);
    }
}
