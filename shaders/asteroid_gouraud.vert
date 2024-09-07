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

uniform float u_seed;

//https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
vec4 mod289(vec4 x){return x - floor(x * (1.0 / 289.0)) * 289.0;}

vec4 perm(vec4 x){return mod289(((x * 34.0) + 1.0) * x);}

float noise(vec3 p){
    vec3 a = floor(p);
    vec3 d = p - a;
    d = d * d * (3.0 - 2.0 * d);

    vec4 b = a.xxyy + vec4(0.0, 1.0, 0.0, 1.0);
    vec4 k1 = perm(b.xyxy);
    vec4 k2 = perm(k1.xyxy + b.zzww);

    vec4 c = k2 + a.zzzz;
    vec4 k3 = perm(c);
    vec4 k4 = perm(c + 1.0);

    vec4 o1 = fract(k3 * (1.0 / 41.0));
    vec4 o2 = fract(k4 * (1.0 / 41.0));

    vec4 o3 = o2 * d.z + o1 * (1.0 - d.z);
    vec2 o4 = o3.yw * d.x + o3.xz * (1.0 - d.x);

    return o4.y * d.y + o4.x * (1.0 - d.y);
}

void main()
{
    vec3 pos = position + normal * noise(normal * u_seed);
    gl_Position = u_mvp * vec4(pos, 1.0);
    v_texcoord = texcoord;

    vec4 world_pos = u_model * vec4(pos, 1);
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