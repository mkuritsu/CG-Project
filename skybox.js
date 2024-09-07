/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

import * as twgl from "./twgl/twgl-full.module.js"
import * as utils from "./utils.js"

export class Skybox {

    constructor(gl, skyboxProgramInfo) {
        this.gl = gl;
        this.skyboxProgramInfo = skyboxProgramInfo
        this.quadBufferInfo = twgl.primitives.createXYQuadBufferInfo(gl);
        this.texture = twgl.createTexture(gl, {
            target: gl.TEXTURE_CUBE_MAP,
            src: [
                'textures/bkg1_right.png',
                'textures/bkg1_left.png',
                'textures/bkg1_top.png',
                'textures/bkg1_bot.png',
                'textures/bkg1_front.png',
                'textures/bkg1_back.png',
            ],
            min: gl.LINEAR_MIPMAP_LINEAR,
        });
    }

    draw(camera) {
        const projectionMatrix = camera.projection;
        const viewMatrix = camera.view;
        const viewDirectionMatrix = twgl.m4.copy(viewMatrix);
        viewDirectionMatrix[12] = 0;
        viewDirectionMatrix[13] = 0;
        viewDirectionMatrix[14] = 0;
        const viewDirectionProjectionMatrix = twgl.m4.multiply(projectionMatrix, viewDirectionMatrix);
        const viewDirectionProjectionInverseMatrix = twgl.m4.inverse(viewDirectionProjectionMatrix);
        this.gl.depthFunc(this.gl.LEQUAL);
        const uniforms = {
            u_viewDirectionProjectionInverse: viewDirectionProjectionInverseMatrix,
            u_skybox: this.texture
        }
        utils.drawBufferWithUniforms(this.gl, this.quadBufferInfo, this.skyboxProgramInfo, uniforms);
        this.gl.depthFunc(this.gl.LESS);
    };
}