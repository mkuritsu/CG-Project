//Grupo 00
//Rodrigo Correia - 58180
//Laura Cunha     - 58188
//João Pereira    - 58189

precision mediump float;

varying vec2 v_texcoord;
varying vec4 v_light;
varying vec4 v_specular;

uniform sampler2D u_texture;

void main() 
{
    gl_FragColor = v_light * texture2D(u_texture, v_texcoord) + v_specular;
}