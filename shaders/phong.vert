//Grupo 00
//Rodrigo Correia - 58180
//Laura Cunha     - 58188
//João Pereira    - 58189

attribute vec3 position;
attribute vec2 texcoord;
attribute vec3 normal;

varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_light_dir;
varying vec3 v_view_dir;

uniform mat4 u_mvp;
uniform mat4 u_model;
uniform mat4 u_model_transpose_inverse;
uniform mat4 u_view_inverse;

uniform vec3 u_light_pos;

void main()
{
    gl_Position = u_mvp * vec4(position, 1);
    v_texcoord = texcoord;
    v_normal = (u_model_transpose_inverse * vec4(normal, 0)).xyz;

    vec4 world_pos = u_model * vec4(position, 1);
    v_light_dir = u_light_pos - world_pos.xyz;
    v_view_dir = (u_view_inverse[3] - world_pos).xyz;
}