#version 300 es

//Grupo 00
//Rodrigo Correia - 58180
//Laura Cunha     - 58188
//João Pereira    - 58189

in vec4 position;
out vec4 v_position;

void main() {
    v_position = position;
    gl_Position = position;
    gl_Position.z = 1.0f;
}