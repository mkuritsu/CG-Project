//Grupo 00
//Rodrigo Correia - 58180
//Laura Cunha     - 58188
//João Pereira    - 58189

precision mediump float;

varying vec2 v_texcoord;
varying vec3 v_normal;
varying vec3 v_light_dir;
varying vec3 v_view_dir;

uniform sampler2D u_texture;

uniform vec3 u_light_color;
uniform float u_ka;

uniform float u_kd;

uniform float u_ks;
uniform float u_shininess;

void main()
{
    vec3 norm = normalize(v_normal);
    vec3 light_dir = normalize(v_light_dir);
    vec3 view_dir = normalize(v_view_dir);

    vec3 half_vector = normalize(light_dir + view_dir);

    float light_angle = max(dot(norm, light_dir), 0.0);
    float view_angle = max(dot(norm, half_vector), 0.0);
    float specular_reflection = light_angle > 0.0 ? pow(view_angle, u_shininess) : 0.0;

    vec3 ambient = u_ka * u_light_color;
    vec3 diffuse = u_kd * u_light_color * light_angle;
    vec3 specular = u_ks * u_light_color * specular_reflection;
    gl_FragColor = vec4(ambient + diffuse, 1) * texture2D(u_texture, v_texcoord) + vec4(specular, 0);
}