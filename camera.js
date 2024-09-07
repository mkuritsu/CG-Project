/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

import * as utils from "./utils.js"
import * as twgl from "./twgl/twgl-full.module.js"

export class Camera {

    constructor() {
        this.fov = utils.degToRad(45);
        this.frontClipping = 0.1;
        this.backClipping = 10000;
        this.position = twgl.v3.create(0, 0, -30);
        this.direction = twgl.v3.create(0, -2, -1);
        twgl.v3.normalize(this.direction, this.direction);
        this.up = twgl.v3.create(0, 1, 0);
        this.target = twgl.v3.add(this.position, this.direction);
    }

    update(gl) {
        this.aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    }

    moveForward(speed) {
        twgl.v3.add(twgl.v3.mulScalar(this.direction, speed), this.position, this.position);
    }

    moveBackward(speed) {
        this.moveForward(-speed);
    }

    moveRight(speed) {
        const cross = twgl.v3.cross(this.direction, this.up);
        twgl.v3.normalize(cross, cross);
        twgl.v3.add(twgl.v3.mulScalar(cross, speed), this.position, this.position);
    }

    moveLeft(speed) {
        this.moveRight(-speed);
    }

    moveUp(speed) {
        twgl.v3.add(twgl.v3.mulScalar(this.up, speed), this.position, this.position);
    }

    moveDown(speed) {
        this.moveUp(-speed);
    }

    rotateVertical(angle) {
        const cross = twgl.v3.cross(this.direction, this.up);
        const result = twgl.m4.transformPoint(twgl.m4.axisRotation(cross, angle), this.direction);
        twgl.v3.normalize(result, result);
        const angleBetween = Math.acos(twgl.v3.dot(result, this.up));
        if (Math.abs(angleBetween - Math.PI/2) < utils.degToRad(85)) {
            this.direction = result;
        }
    }

    rotateHorizontal(angle) {
        twgl.m4.transformPoint(twgl.m4.axisRotation(this.up, angle), this.direction, this.direction);
    }

    get projection() {
        return twgl.m4.perspective(this.fov, this.aspect, this.frontClipping, this.backClipping);
    }

    get view() {
        twgl.v3.add(this.direction, this.position, this.target);
        return twgl.m4.inverse(twgl.m4.lookAt(this.position, this.target, this.up));
    }

    setTarget(pos) {
        twgl.v3.subtract(pos, this.position, this.direction);
        twgl.v3.normalize(this.direction, this.direction);
    }
}
