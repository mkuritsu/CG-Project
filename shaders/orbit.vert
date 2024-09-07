//Grupo 00
//Rodrigo Correia - 58180
//Laura Cunha     - 58188
//João Pereira    - 58189

attribute vec3 position;

uniform mat4 u_modelViewProjection;
uniform vec3 u_color;

varying vec4 v_color;

void main() {
    gl_Position = u_modelViewProjection * vec4(position, 1);
    v_color = vec4(u_color, 1);
}