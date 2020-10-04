attribute vec2 aVertexPosition;

uniform mat3 uProjectionMat;
uniform mat3 uModelMat;

void main() {
    vec3 pos = uProjectionMat * vec3(aVertexPosition, 1);
    gl_Position = vec4(pos, 1);
}