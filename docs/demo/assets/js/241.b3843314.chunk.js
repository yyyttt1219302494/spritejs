(window.webpackJsonp=window.webpackJsonp||[]).push([[241],{755:function(n,e,t){"use strict";t.r(e),e.default="const vertex = `\n  attribute vec3 a_vertexPosition;\n  // attribute vec4 a_color;\n  // varying vec4 vColor;\n\n  uniform mat3 viewMatrix;\n  uniform mat3 projectionMatrix;\n\n  void main() {\n    gl_PointSize = 1.0;\n    vec3 pos = projectionMatrix * viewMatrix * vec3(a_vertexPosition.xy, 1.0);\n    gl_Position = vec4(pos.xy, 1.0, 1.0);\n    // vColor = a_color;\n  }\n`;\n\nconst fragment = `\nprecision mediump float;\n\nhighp float random(vec2 co)\n{\n    highp float a = 12.9898;\n    highp float b = 78.233;\n    highp float c = 43758.5453;\n    highp float dt= dot(co.xy ,vec2(a,b));\n    highp float sn= mod(dt,3.14);\n    return fract(sin(sn) * c);\n}\n\n// Value Noise by Inigo Quilez - iq/2013\n// https://www.shadertoy.com/view/lsf3WH\nhighp float noise(vec2 st) {\n    vec2 i = floor(st);\n    vec2 f = fract(st);\n    vec2 u = f * f * (3.0 - 2.0 * f);\n    return mix( mix( random( i + vec2(0.0,0.0) ),\n                    random( i + vec2(1.0,0.0) ), u.x),\n                mix( random( i + vec2(0.0,1.0) ),\n                    random( i + vec2(1.0,1.0) ), u.x), u.y);\n}\n\n#ifndef OCTAVES\n#define OCTAVES 6\n#endif\nfloat mist(vec2 st) {\n  //Initial values\n  float value = 0.0;\n  float amplitude = 0.5;\n  float frequency = 0.0;\n\n  // Loop of octaves\n  for(int i = 0; i < OCTAVES; i++) {\n    value += amplitude * noise(st);\n    st *= 2.0;\n    amplitude *= 0.5;\n  }\n  return value;\n}\n\n//  Function from I\xf1igo Quiles\n//  https://www.shadertoy.com/view/MsS3Wc\nvec3 hsb2rgb(vec3 c){\n  vec3 rgb = clamp(abs(mod(c.x*6.0+vec3(0.0,4.0,2.0), 6.0)-3.0)-1.0, 0.0, 1.0);\n  rgb = rgb * rgb * (3.0 - 2.0 * rgb);\n  return c.z * mix(vec3(1.0), rgb, c.y);\n}\n\nuniform float u_time;\nuniform vec2 u_resolution;\n\nvoid main() {\n  vec2 st = gl_FragCoord.xy / u_resolution;\n  st.x += 0.1 * u_time; \n  gl_FragColor = vec4(hsb2rgb(vec3(mist(st), 1.0, 1.0)),1.0);\n}\n`;\n\nconst birdsJsonUrl = 'https://s5.ssl.qhres.com/static/5f6911b7b91c88da.json';\nconst birdsRes = 'https://p.ssl.qhimg.com/d/inn/c886d09f/birds.png';\n\n(async function () {\n  const container = document.getElementById('stage');\n  const scene = new spritejs.Scene({\n    container,\n    // displayRatio: 2,\n    width: 600,\n    height: 600,\n    // mode: 'stickyHeight',\n    // contextType: '2d',\n  });\n\n  const fglayer = scene.layer('fglayer', {autoRender: false});\n  await scene.preload([birdsRes, birdsJsonUrl]);\n\n  const program = fglayer.renderer.createProgram({vertex, fragment});\n\n  const sky = new spritejs.Block();\n  sky.attr({\n    size: [600, 600],\n  });\n  sky.setProgram(program);\n  const {width, height} = fglayer.getResolution();\n  sky.setUniforms({\n    u_time: 0,\n    u_resolution: [width, height],\n  });\n  sky.setShaderAttribute('a_pp', () => {\n    return [Math.random(), Math.random(), Math.random()];\n  });\n  fglayer.append(sky);\n\n  const bird = new spritejs.Sprite('bird1.png');\n  bird.attr({\n    anchor: 0.5,\n    pos: [300, 300],\n    scale: 0.5,\n  });\n  fglayer.append(bird);\n\n  let idx = 0;\n  setInterval(() => {\n    // bird.forceUpdate();\n    bird.attributes.texture = `bird${++idx % 3 + 1}.png`;\n  }, 100);\n\n  requestAnimationFrame(function update(t) {\n    sky.setUniforms({\n      u_time: t / 1000,\n    });\n    fglayer.render();\n    requestAnimationFrame(update);\n  });\n}());"}}]);