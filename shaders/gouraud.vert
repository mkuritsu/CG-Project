//Grupo 00
//Rodrigo Correia - 58180
//Laura Cunha     - 58188
//João Pereira    - 58189

attribute vec3 position;
attribute vec2 texcoord;
attribute vec3 normal;

varying vec2 v_texcoord;
varying vec4 v_light;
varying vec4 v_specular;

uniform mat4 u_mvp;

uniform float u_ka;
uniform vec3 u_light_color;

uniform float u_kd;
uniform vec3 u_light_pos;
uniform mat4 u_model;
uniform mat4 u_model_transpose_inverse;

uniform float u_ks;
uniform float u_shininess;
uniform mat4 u_view_inverse;

void main()
{
    gl_Position = u_mvp * vec4(position, 1.0);
    v_texcoord = texcoord;

    vec4 world_pos = u_model * vec4(position, 1);
    vec3 light_dir = normalize(u_light_pos - world_pos.xyz);
    vec3 norm = normalize((u_model_transpose_inverse * vec4(normal, 0)).xyz);
    float light_angle = max(dot(norm, light_dir), 0.0);
    vec3 view_dir = normalize((u_view_inverse[3] - world_pos).xyz);
    vec3 half_vector = normalize(light_dir + view_dir);
    float view_angle = max(dot(norm, half_vector), 0.0);
    float specular_reflection = light_angle > 0.0 ? pow(view_angle, u_shininess) : 0.0;

    vec3 ambient = u_ka * u_light_color;
    vec3 diffuse = u_kd * u_light_color * light_angle;
    vec3 specular = u_ks * u_light_color * specular_reflection;
    v_light = vec4(ambient + diffuse, 1.0);
    v_specular = vec4(specular, 0);
}