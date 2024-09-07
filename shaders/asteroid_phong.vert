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
    gl_Position = u_mvp * vec4(pos, 1);
    v_texcoord = texcoord;
    v_normal = (u_model_transpose_inverse * vec4(normal, 0)).xyz;

    vec4 world_pos = u_model * vec4(pos, 1);
    v_light_dir = u_light_pos - world_pos.xyz;
    v_view_dir = (u_view_inverse[3] - world_pos).xyz;
}