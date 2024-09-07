/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

export class Material {

    constructor(u_light_color, u_shininess, u_light_pos, u_ka, u_kd, u_ks) {
        this.u_light_color = u_light_color;
        this.u_shininess = u_shininess;
        this.u_light_pos = u_light_pos;
        this.u_ka = u_ka;
        this.u_kd = u_kd;
        this.u_ks = u_ks;
    }
}
