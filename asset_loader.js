/* ------ Grupo 00 -------
 * Rodrigo Correia - 58180
 * Laura Cunha     - 58188
 * João Pereira    - 58189
 * -----------------------
 */

export async function load_shader(path) {
    const res = await fetch(path);
    return await res.text();
}
