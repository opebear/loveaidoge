declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
    aidogeRespectCount?: bigint;
  }
}

export function initApp() {
  const navbar = document.getElementById("navbar");

  if (navbar) {
    const checkScroll = () => {
      if (window.scrollY > 20) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    };

    // Check initial position on load
    checkScroll();

    // Add scroll event listener
    window.addEventListener("scroll", checkScroll);
  }

  // Dynamic active navbar link highlighter based on current path
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    link.classList.remove("active");
    const href = link.getAttribute("href");

    // Normalize path and href by stripping leading dot-slash or slash and index.html
    const normalize = (path: string) => {
      if (!path) return "";
      const p = path.replace(/^\.?\//, "");
      if (p === "" || p === "/" || p === "index.html") {
        return "index.html";
      }
      return p;
    };

    const normPath = normalize(currentPath);
    const normHref = normalize(href ?? "");

    if (
      normPath === normHref ||
      (normHref !== "index.html" && currentPath.endsWith(normHref))
    ) {
      link.classList.add("active");
    }
  });

  // Initialize Click Particle Explosion (bursting AIDOGE_Logo.png)
  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    rotation: number;
    vRotation: number;
    opacity: number;
    element: HTMLElement;
  }
  const activeParticles: Particle[] = [];

  function animateParticles() {
    if (activeParticles.length === 0) return;

    const gravity = 0.35;
    const friction = 0.98;

    for (let i = activeParticles.length - 1; i >= 0; i--) {
      const p = activeParticles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += gravity; // Gravity pull down
      p.vx *= friction;
      p.vy *= friction;
      p.rotation += p.vRotation;
      p.opacity -= 0.015; // Smooth fading

      if (p.opacity <= 0) {
        p.element.remove();
        activeParticles.splice(i, 1);
      } else {
        p.element.style.transform = `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0) rotate(${p.rotation}deg) scale(${p.opacity})`;
        p.element.style.opacity = `${p.opacity}`;
      }
    }

    if (activeParticles.length > 0) {
      requestAnimationFrame(animateParticles);
    }
  }

  function spawnParticles(x: number, y: number) {
    const count = 10 + Math.floor(Math.random() * 8); // 10 to 18 particles
    const isFirstActive = activeParticles.length === 0;

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      el.className = "click-particle";
      el.style.backgroundImage = 'url("./img/AIDOGE_Logo.png")';

      const size = 18 + Math.random() * 22; // 18px to 40px
      el.style.width = `${size}px`;
      el.style.height = `${size}px`;

      document.body.appendChild(el);

      // Burst direction & velocity
      const angle = Math.random() * Math.PI * 2;
      const speed = 3 + Math.random() * 7;

      const p = {
        element: el,
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - (1 + Math.random() * 3), // Initial upward boost
        rotation: Math.random() * 360,
        vRotation: (Math.random() - 0.5) * 12,
        opacity: 1,
        size: size,
      };

      el.style.transform = `translate3d(${p.x - p.size / 2}px, ${p.y - p.size / 2}px, 0) rotate(${p.rotation}deg)`;
      el.style.opacity = "1";

      activeParticles.push(p);
    }

    if (isFirstActive) {
      requestAnimationFrame(animateParticles);
    }
  }

  // Handle click events on window
  window.addEventListener("mousedown", (e) => {
    spawnParticles(e.clientX, e.clientY);
  });

  window.addEventListener("touchstart", (e) => {
    if (e.touches && e.touches.length > 0) {
      spawnParticles(e.touches[0].clientX, e.touches[0].clientY);
    }
  });

  // Initialize WebGL Fluid Cursor background effect
  try {
    initFluidCursor();
  } catch (err) {
    console.warn("Could not load fluid cursor:", err);
  }

  // --- AIDOGE Live Terminal Dashboard Logic ---
  const terminalContainer = document.querySelector(".terminal-container");
  if (terminalContainer) {
    // 1. Copy Contract Address handler
    const copyBtn = document.getElementById("copy-btn");
    const contractCode = document.getElementById("contract-address");
    if (copyBtn && contractCode) {
      copyBtn.addEventListener("click", () => {
        const text = contractCode.textContent?.trim() ?? "";

        const fallbackCopy = (text: string) => {
          const textarea = document.createElement("textarea");
          textarea.value = text;
          textarea.style.position = "fixed";
          textarea.style.opacity = "0";
          document.body.appendChild(textarea);
          textarea.select();
          try {
            document.execCommand("copy");
            showCopiedFeedback();
          } catch (err) {
            console.error("Fallback copy failed:", err);
          } finally {
            document.body.removeChild(textarea);
          }
        };

        const showCopiedFeedback = () => {
          const btnLabel = copyBtn.querySelector(".btn-label");
          if (btnLabel) {
            const originalText = btnLabel.textContent;
            btnLabel.textContent = "COPIED!";
            copyBtn.classList.add("copied");
            setTimeout(() => {
              btnLabel.textContent = originalText;
              copyBtn.classList.remove("copied");
            }, 2000);
          }
        };

        if (navigator.clipboard && window.isSecureContext) {
          navigator.clipboard
            .writeText(text)
            .then(showCopiedFeedback)
            .catch((err) => {
              console.error("Failed to copy address:", err);
              fallbackCopy(text);
            });
        } else {
          fallbackCopy(text);
        }
      });
    }

    // 2. Tab switching logic
    const tabBtns = document.querySelectorAll(".tab-btn");
    const tabContents = document.querySelectorAll(".tab-content");
    tabBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const targetTab = btn.getAttribute("data-tab");

        tabBtns.forEach((b) => b.classList.remove("active"));
        tabContents.forEach((c) => c.classList.remove("active"));

        btn.classList.add("active");
        const activeContent = document.getElementById(`tab-${targetTab}`);
        if (activeContent) activeContent.classList.add("active");
      });
    });
  }

  // 3. Memorial Board Initialization
  try {
    initMemorialBoard();
  } catch (err) {
    console.warn("Could not load memorial board:", err);
  }

  // 4. Quantum Scroll & HUD Engine Initialization
  try {
    initQuantumScrollEngine();
  } catch (err) {
    console.warn("Could not load quantum scroll engine:", err);
  }

  // 5. Initialize Luxury Enhancements
  try {
    initCyberLoader();
  } catch (err) {
    console.warn("Could not initialize cyber loader:", err);
  }

  try {
    initSynthPlayer();
  } catch (err) {
    console.warn("Could not initialize synth player:", err);
  }

  try {
    initLuxuryEffects();
  } catch (err) {
    console.warn("Could not initialize spotlight/tilt effects:", err);
  }

  try {
    initCosmicStardust();
  } catch (err) {
    console.warn("Could not initialize background stardust:", err);
  }
  initAppSecondBlock();
}

function initFluidCursor() {
  if (document.getElementById("fluid")) return;
  const canvas = document.createElement("canvas");
  canvas.id = "fluid";
  document.body.appendChild(canvas);

  const config = {
    SIM_RESOLUTION: 128,
    DYE_RESOLUTION: 1440,
    CAPTURE_RESOLUTION: 512,
    DENSITY_DISSIPATION: 3.5,
    VELOCITY_DISSIPATION: 2,
    PRESSURE: 0.1,
    PRESSURE_ITERATIONS: 20,
    CURL: 3,
    SPLAT_RADIUS: 0.2,
    SPLAT_FORCE: 6000,
    SHADING: true,
    COLOR_UPDATE_SPEED: 10,
    PAUSED: false,
    BACK_COLOR: { r: 0.5, g: 0, b: 0 },
    TRANSPARENT: true,
  };

  interface RGBColor {
    r: number;
    g: number;
    b: number;
  }

  interface FBO {
    texture: WebGLTexture | null;
    fbo: WebGLFramebuffer | null;
    width: number;
    height: number;
    texelSizeX: number;
    texelSizeY: number;
    attach(id: number): number;
  }

  interface DoubleFBO {
    width: number;
    height: number;
    texelSizeX: number;
    texelSizeY: number;
    read: FBO;
    write: FBO;
    swap(): void;
  }

  interface FormatInfo {
    internalFormat: number;
    format: number;
  }

  class PointerPrototype {
    id: number = -1;
    texcoordX: number = 0;
    texcoordY: number = 0;
    prevTexcoordX: number = 0;
    prevTexcoordY: number = 0;
    deltaX: number = 0;
    deltaY: number = 0;
    down: boolean = false;
    moved: boolean = false;
    color: RGBColor;
    constructor() {
      this.color = generateColor();
    }
  }

  const pointers: PointerPrototype[] = [];
  pointers.push(new PointerPrototype());

  // Safe WebGL context initialization
  const params: WebGLContextAttributes = {
    alpha: true,
    depth: false,
    stencil: false,
    antialias: false,
    preserveDrawingBuffer: false,
  };
  let glContext: WebGL2RenderingContext | WebGLRenderingContext | null =
    canvas.getContext("webgl2", params);
  const isWebGL2 = !!glContext;
  if (!isWebGL2) {
    glContext =
      (canvas.getContext("webgl", params) as WebGLRenderingContext | null) ||
      (canvas.getContext(
        "experimental-webgl",
        params,
      ) as WebGLRenderingContext | null);
  }
  if (!glContext) {
    console.warn("WebGL not supported on this device.");
    return;
  }
  const gl: WebGL2RenderingContext | WebGLRenderingContext = glContext;

  let halfFloat: { HALF_FLOAT_OES: number } | null = null;
  let supportLinearFiltering: unknown;
  if (isWebGL2) {
    const gl2 = gl as WebGL2RenderingContext;
    gl2.getExtension("EXT_color_buffer_float");
    supportLinearFiltering = gl2.getExtension("OES_texture_float_linear");
  } else {
    halfFloat = gl.getExtension("OES_texture_half_float") as {
      HALF_FLOAT_OES: number;
    } | null;
    supportLinearFiltering = gl.getExtension("OES_texture_half_float_linear");
  }
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  const halfFloatTexType = isWebGL2
    ? (gl as WebGL2RenderingContext).HALF_FLOAT
    : (halfFloat as { HALF_FLOAT_OES: number }).HALF_FLOAT_OES;
  let formatRGBA: FormatInfo | null;
  let formatRG: FormatInfo | null;
  let formatR: FormatInfo | null;
  if (isWebGL2) {
    const gl2 = gl as WebGL2RenderingContext;
    formatRGBA = getSupportedFormat(
      gl2,
      gl2.RGBA16F,
      gl2.RGBA,
      halfFloatTexType,
    );
    formatRG = getSupportedFormat(gl2, gl2.RG16F, gl2.RG, halfFloatTexType);
    formatR = getSupportedFormat(gl2, gl2.R16F, gl2.RED, halfFloatTexType);
  } else {
    formatRGBA = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatRG = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
    formatR = getSupportedFormat(gl, gl.RGBA, gl.RGBA, halfFloatTexType);
  }

  const ext = {
    formatRGBA,
    formatRG,
    formatR,
    halfFloatTexType,
    supportLinearFiltering,
  };

  if (!ext.supportLinearFiltering) {
    config.DYE_RESOLUTION = 256;
    config.SHADING = false;
  }

  resizeCanvas();

  function getSupportedFormat(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): FormatInfo | null {
    if (!supportRenderTextureFormat(gl, internalFormat, format, type)) {
      const gl2 = gl as WebGL2RenderingContext;
      switch (internalFormat) {
        case gl2.R16F:
          return getSupportedFormat(gl, gl2.RG16F, gl2.RG, type);
        case gl2.RG16F:
          return getSupportedFormat(gl, gl2.RGBA16F, gl2.RGBA, type);
        default:
          return null;
      }
    }
    return { internalFormat, format };
  }

  function supportRenderTextureFormat(
    gl: WebGLRenderingContext | WebGL2RenderingContext,
    internalFormat: number,
    format: number,
    type: number,
  ): boolean {
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      4,
      4,
      0,
      format,
      type,
      null,
    );

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    const status = gl.checkFramebufferStatus(gl.FRAMEBUFFER);
    return status === gl.FRAMEBUFFER_COMPLETE;
  }

  type UniformMap = Record<string, WebGLUniformLocation | null>;

  class Material {
    vertexShader: WebGLShader;
    fragmentShaderSource: string;
    programs: WebGLProgram[];
    activeProgram: WebGLProgram | null;
    uniforms: UniformMap;
    constructor(vertexShader: WebGLShader, fragmentShaderSource: string) {
      this.vertexShader = vertexShader;
      this.fragmentShaderSource = fragmentShaderSource;
      this.programs = [];
      this.activeProgram = null;
      this.uniforms = {};
    }
    setKeywords(keywords: string[]) {
      let hash = 0;
      for (let i = 0; i < keywords.length; i++) hash += hashCode(keywords[i]);
      let program = this.programs[hash];
      if (program == null) {
        const fragmentShader = compileShader(
          gl.FRAGMENT_SHADER,
          this.fragmentShaderSource,
          keywords,
        );
        program = createProgram(this.vertexShader, fragmentShader);
        this.programs[hash] = program;
      }
      if (program === this.activeProgram) return;
      this.uniforms = getUniforms(program);
      this.activeProgram = program;
    }
    bind() {
      gl.useProgram(this.activeProgram);
    }
  }

  class Program {
    uniforms: UniformMap;
    program: WebGLProgram;
    constructor(vertexShader: WebGLShader, fragmentShader: WebGLShader) {
      this.uniforms = {};
      this.program = createProgram(vertexShader, fragmentShader);
      this.uniforms = getUniforms(this.program);
    }
    bind() {
      gl.useProgram(this.program);
    }
  }

  function createProgram(
    vertexShader: WebGLShader,
    fragmentShader: WebGLShader,
  ): WebGLProgram {
    const program = gl.createProgram() as WebGLProgram;
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.trace(gl.getProgramInfoLog(program));
    }
    return program;
  }

  function getUniforms(program: WebGLProgram): UniformMap {
    const uniforms: UniformMap = {};
    const uniformCount = gl.getProgramParameter(program, gl.ACTIVE_UNIFORMS);
    for (let i = 0; i < uniformCount; i++) {
      const activeUniform = gl.getActiveUniform(program, i) as WebGLActiveInfo;
      const uniformName = activeUniform.name;
      uniforms[uniformName] = gl.getUniformLocation(program, uniformName);
    }
    return uniforms;
  }

  function compileShader(
    type: number,
    source: string,
    keywords?: string[],
  ): WebGLShader {
    source = addKeywords(source, keywords);
    const shader = gl.createShader(type) as WebGLShader;
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.trace(gl.getShaderInfoLog(shader));
    }
    return shader;
  }

  function addKeywords(source: string, keywords?: string[]): string {
    if (keywords == null) return source;
    let keywordsString = "";
    keywords.forEach((keyword: string) => {
      keywordsString += "#define " + keyword + "\n";
    });
    return keywordsString + source;
  }

  const baseVertexShader = compileShader(
    gl.VERTEX_SHADER,
    `
       precision highp float;
       attribute vec2 aPosition;
       varying vec2 vUv;
       varying vec2 vL;
       varying vec2 vR;
       varying vec2 vT;
       varying vec2 vB;
       uniform vec2 texelSize;
       void main () {
           vUv = aPosition * 0.5 + 0.5;
           vL = vUv - vec2(texelSize.x, 0.0);
           vR = vUv + vec2(texelSize.x, 0.0);
           vT = vUv + vec2(0.0, texelSize.y);
           vB = vUv - vec2(0.0, texelSize.y);
           gl_Position = vec4(aPosition, 0.0, 1.0);
       }
   `,
  );

  const copyShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision mediump float;
       precision mediump sampler2D;
       varying highp vec2 vUv;
       uniform sampler2D uTexture;
       void main () {
           gl_FragColor = texture2D(uTexture, vUv);
       }
   `,
  );

  const clearShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision mediump float;
       precision mediump sampler2D;
       varying highp vec2 vUv;
       uniform sampler2D uTexture;
       uniform float value;
       void main () {
           gl_FragColor = value * texture2D(uTexture, vUv);
       }
   `,
  );

  const displayShaderSource = `
       precision highp float;
       precision highp sampler2D;
       varying vec2 vUv;
       varying vec2 vL;
       varying vec2 vR;
       varying vec2 vT;
       varying vec2 vB;
       uniform sampler2D uTexture;
       uniform sampler2D uDithering;
       uniform vec2 ditherScale;
       uniform vec2 texelSize;
       vec3 linearToGamma (vec3 color) {
           color = max(color, vec3(0));
           return max(1.055 * pow(color, vec3(0.416666667)) - 0.055, vec3(0));
       }
       void main () {
           vec3 c = texture2D(uTexture, vUv).rgb;
       #ifdef SHADING
           vec3 lc = texture2D(uTexture, vL).rgb;
           vec3 rc = texture2D(uTexture, vR).rgb;
           vec3 tc = texture2D(uTexture, vT).rgb;
           vec3 bc = texture2D(uTexture, vB).rgb;
           float dx = length(rc) - length(lc);
           float dy = length(tc) - length(bc);
           vec3 n = normalize(vec3(dx, dy, length(texelSize)));
           vec3 l = vec3(0.0, 0.0, 1.0);
           float diffuse = clamp(dot(n, l) + 0.7, 0.7, 1.0);
           c *= diffuse;
       #endif
           float a = max(c.r, max(c.g, c.b));
           gl_FragColor = vec4(c, a);
       }
   `;

  const splatShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision highp float;
       precision highp sampler2D;
       varying vec2 vUv;
       uniform sampler2D uTarget;
       uniform float aspectRatio;
       uniform vec3 color;
       uniform vec2 point;
       uniform float radius;
       void main () {
           vec2 p = vUv - point.xy;
           p.x *= aspectRatio;
           vec3 splat = exp(-dot(p, p) / radius) * color;
           vec3 base = texture2D(uTarget, vUv).xyz;
           gl_FragColor = vec4(base + splat, 1.0);
       }
   `,
  );

  const advectionShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision highp float;
       precision highp sampler2D;
       varying vec2 vUv;
       uniform sampler2D uVelocity;
       uniform sampler2D uSource;
       uniform vec2 texelSize;
       uniform vec2 dyeTexelSize;
       uniform float dt;
       uniform float dissipation;
       vec4 bilerp (sampler2D sam, vec2 uv, vec2 tsize) {
           vec2 st = uv / tsize - 0.5;
           vec2 iuv = floor(st);
           vec2 fuv = fract(st);
           vec4 a = texture2D(sam, (iuv + vec2(0.5, 0.5)) * tsize);
           vec4 b = texture2D(sam, (iuv + vec2(1.5, 0.5)) * tsize);
           vec4 c = texture2D(sam, (iuv + vec2(0.5, 1.5)) * tsize);
           vec4 d = texture2D(sam, (iuv + vec2(1.5, 1.5)) * tsize);
           return mix(mix(a, b, fuv.x), mix(c, d, fuv.x), fuv.y);
       }
       void main () {
       #ifdef MANUAL_FILTERING
           vec2 coord = vUv - dt * bilerp(uVelocity, vUv, texelSize).xy * texelSize;
           vec4 result = bilerp(uSource, coord, dyeTexelSize);
       #else
           vec2 coord = vUv - dt * texture2D(uVelocity, vUv).xy * texelSize;
           vec4 result = texture2D(uSource, coord);
       #endif
           float decay = 1.0 + dissipation * dt;
           gl_FragColor = result / decay;
       }`,
    ext.supportLinearFiltering ? undefined : ["MANUAL_FILTERING"],
  );

  const divergenceShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision mediump float;
       precision mediump sampler2D;
       varying highp vec2 vUv;
       varying highp vec2 vL;
       varying highp vec2 vR;
       varying highp vec2 vT;
       varying highp vec2 vB;
       uniform sampler2D uVelocity;
       void main () {
           float L = texture2D(uVelocity, vL).x;
           float R = texture2D(uVelocity, vR).x;
           float T = texture2D(uVelocity, vT).y;
           float B = texture2D(uVelocity, vB).y;
           vec2 C = texture2D(uVelocity, vUv).xy;
           if (vL.x < 0.0) { L = -C.x; }
           if (vR.x > 1.0) { R = -C.x; }
           if (vT.y > 1.0) { T = -C.y; }
           if (vB.y < 0.0) { B = -C.y; }
           float div = 0.5 * (R - L + T - B);
           gl_FragColor = vec4(div, 0.0, 0.0, 1.0);
       }
   `,
  );

  const curlShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision mediump float;
       precision mediump sampler2D;
       varying highp vec2 vUv;
       varying highp vec2 vL;
       varying highp vec2 vR;
       varying highp vec2 vT;
       varying highp vec2 vB;
       uniform sampler2D uVelocity;
       void main () {
           float L = texture2D(uVelocity, vL).y;
           float R = texture2D(uVelocity, vR).y;
           float T = texture2D(uVelocity, vT).x;
           float B = texture2D(uVelocity, vB).x;
           float vorticity = R - L - T + B;
           gl_FragColor = vec4(0.5 * vorticity, 0.0, 0.0, 1.0);
       }
   `,
  );

  const vorticityShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision highp float;
       precision highp sampler2D;
       varying vec2 vUv;
       varying vec2 vL;
       varying vec2 vR;
       varying vec2 vT;
       varying vec2 vB;
       uniform sampler2D uVelocity;
       uniform sampler2D uCurl;
       uniform float curl;
       uniform float dt;
       void main () {
           float L = texture2D(uCurl, vL).x;
           float R = texture2D(uCurl, vR).x;
           float T = texture2D(uCurl, vT).x;
           float B = texture2D(uCurl, vB).x;
           float C = texture2D(uCurl, vUv).x;
           vec2 force = 0.5 * vec2(abs(T) - abs(B), abs(R) - abs(L));
           force /= length(force) + 0.0001;
           force *= curl * C;
           force.y *= -1.0;
           vec2 velocity = texture2D(uVelocity, vUv).xy;
           velocity += force * dt;
           velocity = min(max(velocity, -1000.0), 1000.0);
           gl_FragColor = vec4(velocity, 0.0, 1.0);
       }
   `,
  );

  const pressureShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision mediump float;
       precision mediump sampler2D;
       varying highp vec2 vUv;
       varying highp vec2 vL;
       varying highp vec2 vR;
       varying highp vec2 vT;
       varying highp vec2 vB;
       uniform sampler2D uPressure;
       uniform sampler2D uDivergence;
       void main () {
           float L = texture2D(uPressure, vL).x;
           float R = texture2D(uPressure, vR).x;
           float T = texture2D(uPressure, vT).x;
           float B = texture2D(uPressure, vB).x;
           float C = texture2D(uPressure, vUv).x;
           float divergence = texture2D(uDivergence, vUv).x;
           float pressure = (L + R + B + T - divergence) * 0.25;
           gl_FragColor = vec4(pressure, 0.0, 0.0, 1.0);
       }
   `,
  );

  const gradientSubtractShader = compileShader(
    gl.FRAGMENT_SHADER,
    `
       precision mediump float;
       precision mediump sampler2D;
       varying highp vec2 vUv;
       varying highp vec2 vL;
       varying highp vec2 vR;
       varying highp vec2 vT;
       varying highp vec2 vB;
       uniform sampler2D uPressure;
       uniform sampler2D uVelocity;
       void main () {
           float L = texture2D(uPressure, vL).x;
           float R = texture2D(uPressure, vR).x;
           float T = texture2D(uPressure, vT).x;
           float B = texture2D(uPressure, vB).x;
           vec2 velocity = texture2D(uVelocity, vUv).xy;
           velocity.xy -= vec2(R - L, T - B);
           gl_FragColor = vec4(velocity, 0.0, 1.0);
       }
   `,
  );

  const blit = (() => {
    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, -1, 1, 1, 1, 1, -1]),
      gl.STATIC_DRAW,
    );
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array([0, 1, 2, 0, 2, 3]),
      gl.STATIC_DRAW,
    );
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(0);
    return (target: FBO | null, clear = false) => {
      if (target == null) {
        gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      } else {
        gl.viewport(0, 0, target.width, target.height);
        gl.bindFramebuffer(gl.FRAMEBUFFER, target.fbo);
      }
      if (clear) {
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT);
      }
      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);
    };
  })();

  let dye!: DoubleFBO;
  let velocity!: DoubleFBO;
  let divergence!: FBO;
  let curl!: FBO;
  let pressure!: DoubleFBO;

  const copyProgram = new Program(baseVertexShader, copyShader);
  const clearProgram = new Program(baseVertexShader, clearShader);
  const splatProgram = new Program(baseVertexShader, splatShader);
  const advectionProgram = new Program(baseVertexShader, advectionShader);
  const divergenceProgram = new Program(baseVertexShader, divergenceShader);
  const curlProgram = new Program(baseVertexShader, curlShader);
  const vorticityProgram = new Program(baseVertexShader, vorticityShader);
  const pressureProgram = new Program(baseVertexShader, pressureShader);
  const gradienSubtractProgram = new Program(
    baseVertexShader,
    gradientSubtractShader,
  );
  const displayMaterial = new Material(baseVertexShader, displayShaderSource);

  function initFramebuffers() {
    const simRes = getResolution(config.SIM_RESOLUTION);
    const dyeRes = getResolution(config.DYE_RESOLUTION);
    const texType = ext.halfFloatTexType;
    const rgba = ext.formatRGBA!;
    const rg = ext.formatRG!;
    const r = ext.formatR!;
    const filtering = ext.supportLinearFiltering ? gl.LINEAR : gl.NEAREST;

    gl.disable(gl.BLEND);

    if (dye == null) {
      dye = createDoubleFBO(
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      );
    } else {
      dye = resizeDoubleFBO(
        dye,
        dyeRes.width,
        dyeRes.height,
        rgba.internalFormat,
        rgba.format,
        texType,
        filtering,
      );
    }

    if (velocity == null) {
      velocity = createDoubleFBO(
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering,
      );
    } else {
      velocity = resizeDoubleFBO(
        velocity,
        simRes.width,
        simRes.height,
        rg.internalFormat,
        rg.format,
        texType,
        filtering,
      );
    }

    divergence = createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    );
    curl = createFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    );
    pressure = createDoubleFBO(
      simRes.width,
      simRes.height,
      r.internalFormat,
      r.format,
      texType,
      gl.NEAREST,
    );
  }

  function createFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): FBO {
    gl.activeTexture(gl.TEXTURE0);
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, param);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      internalFormat,
      w,
      h,
      0,
      format,
      type,
      null,
    );

    const fbo = gl.createFramebuffer();
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0,
    );
    gl.viewport(0, 0, w, h);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const texelSizeX = 1.0 / w;
    const texelSizeY = 1.0 / h;
    return {
      texture,
      fbo,
      width: w,
      height: h,
      texelSizeX,
      texelSizeY,
      attach(id: number) {
        gl.activeTexture(gl.TEXTURE0 + id);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        return id;
      },
    };
  }

  function createDoubleFBO(
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): DoubleFBO {
    let fbo1 = createFBO(w, h, internalFormat, format, type, param);
    let fbo2 = createFBO(w, h, internalFormat, format, type, param);
    return {
      width: w,
      height: h,
      texelSizeX: fbo1.texelSizeX,
      texelSizeY: fbo1.texelSizeY,
      get read() {
        return fbo1;
      },
      set read(value) {
        fbo1 = value;
      },
      get write() {
        return fbo2;
      },
      set write(value) {
        fbo2 = value;
      },
      swap() {
        const temp = fbo1;
        fbo1 = fbo2;
        fbo2 = temp;
      },
    };
  }

  function resizeFBO(
    target: FBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): FBO {
    const newFBO = createFBO(w, h, internalFormat, format, type, param);
    copyProgram.bind();
    gl.uniform1i(copyProgram.uniforms.uTexture, target.attach(0));
    blit(newFBO);
    return newFBO;
  }

  function resizeDoubleFBO(
    target: DoubleFBO,
    w: number,
    h: number,
    internalFormat: number,
    format: number,
    type: number,
    param: number,
  ): DoubleFBO {
    if (target.width === w && target.height === h) return target;
    target.read = resizeFBO(
      target.read,
      w,
      h,
      internalFormat,
      format,
      type,
      param,
    );
    target.write = createFBO(w, h, internalFormat, format, type, param);
    target.width = w;
    target.height = h;
    target.texelSizeX = 1.0 / w;
    target.texelSizeY = 1.0 / h;
    return target;
  }

  function updateKeywords() {
    const displayKeywords = [];
    if (config.SHADING) displayKeywords.push("SHADING");
    displayMaterial.setKeywords(displayKeywords);
  }

  updateKeywords();
  initFramebuffers();

  let lastUpdateTime = Date.now();
  let colorUpdateTimer = 0.0;
  let isLoopRunning = false;

  function update() {
    const dt = calcDeltaTime();
    if (resizeCanvas()) initFramebuffers();
    updateColors(dt);
    applyInputs();
    step(dt);
    render(null);
    requestAnimationFrame(update);
  }

  function calcDeltaTime() {
    const now = Date.now();
    let dt = (now - lastUpdateTime) / 1000;
    dt = Math.min(dt, 0.016666);
    lastUpdateTime = now;
    return dt;
  }

  function resizeCanvas() {
    const width = scaleByPixelRatio(canvas.clientWidth);
    const height = scaleByPixelRatio(canvas.clientHeight);
    if (canvas.width !== width || canvas.height !== height) {
      canvas.width = width;
      canvas.height = height;
      return true;
    }
    return false;
  }

  function updateColors(dt: number) {
    colorUpdateTimer += dt * config.COLOR_UPDATE_SPEED;
    if (colorUpdateTimer >= 1) {
      colorUpdateTimer = wrap(colorUpdateTimer, 0, 1);
      pointers.forEach((p) => {
        p.color = generateColor();
      });
    }
  }

  function applyInputs() {
    pointers.forEach((p) => {
      if (p.moved) {
        p.moved = false;
        splatPointer(p);
      }
    });
  }

  function step(dt: number) {
    gl.disable(gl.BLEND);
    curlProgram.bind();
    gl.uniform2f(
      curlProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(curlProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(curl);

    vorticityProgram.bind();
    gl.uniform2f(
      vorticityProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(vorticityProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(vorticityProgram.uniforms.uCurl, curl.attach(1));
    gl.uniform1f(vorticityProgram.uniforms.curl, config.CURL);
    gl.uniform1f(vorticityProgram.uniforms.dt, dt);
    blit(velocity.write);
    velocity.swap();

    divergenceProgram.bind();
    gl.uniform2f(
      divergenceProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(divergenceProgram.uniforms.uVelocity, velocity.read.attach(0));
    blit(divergence);

    clearProgram.bind();
    gl.uniform1i(clearProgram.uniforms.uTexture, pressure.read.attach(0));
    gl.uniform1f(clearProgram.uniforms.value, config.PRESSURE);
    blit(pressure.write);
    pressure.swap();

    pressureProgram.bind();
    gl.uniform2f(
      pressureProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(pressureProgram.uniforms.uDivergence, divergence.attach(0));
    for (let i = 0; i < config.PRESSURE_ITERATIONS; i++) {
      gl.uniform1i(pressureProgram.uniforms.uPressure, pressure.read.attach(1));
      blit(pressure.write);
      pressure.swap();
    }

    gradienSubtractProgram.bind();
    gl.uniform2f(
      gradienSubtractProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    gl.uniform1i(
      gradienSubtractProgram.uniforms.uPressure,
      pressure.read.attach(0),
    );
    gl.uniform1i(
      gradienSubtractProgram.uniforms.uVelocity,
      velocity.read.attach(1),
    );
    blit(velocity.write);
    velocity.swap();

    advectionProgram.bind();
    gl.uniform2f(
      advectionProgram.uniforms.texelSize,
      velocity.texelSizeX,
      velocity.texelSizeY,
    );
    if (!ext.supportLinearFiltering) {
      gl.uniform2f(
        advectionProgram.uniforms.dyeTexelSize,
        velocity.texelSizeX,
        velocity.texelSizeY,
      );
    }
    const velocityId = velocity.read.attach(0);
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocityId);
    gl.uniform1i(advectionProgram.uniforms.uSource, velocityId);
    gl.uniform1f(advectionProgram.uniforms.dt, dt);
    gl.uniform1f(
      advectionProgram.uniforms.dissipation,
      config.VELOCITY_DISSIPATION,
    );
    blit(velocity.write);
    velocity.swap();

    if (!ext.supportLinearFiltering) {
      gl.uniform2f(
        advectionProgram.uniforms.dyeTexelSize,
        dye.texelSizeX,
        dye.texelSizeY,
      );
    }
    gl.uniform1i(advectionProgram.uniforms.uVelocity, velocity.read.attach(0));
    gl.uniform1i(advectionProgram.uniforms.uSource, dye.read.attach(1));
    gl.uniform1f(
      advectionProgram.uniforms.dissipation,
      config.DENSITY_DISSIPATION,
    );
    blit(dye.write);
    dye.swap();
  }

  function render(target: FBO | null) {
    gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
    gl.enable(gl.BLEND);
    drawDisplay(target);
  }

  function drawDisplay(target: FBO | null) {
    const width = target == null ? gl.drawingBufferWidth : target.width;
    const height = target == null ? gl.drawingBufferHeight : target.height;
    displayMaterial.bind();
    if (config.SHADING) {
      gl.uniform2f(
        displayMaterial.uniforms.texelSize,
        1.0 / width,
        1.0 / height,
      );
    }
    gl.uniform1i(displayMaterial.uniforms.uTexture, dye.read.attach(0));
    blit(target);
  }

  function splatPointer(pointer: PointerPrototype) {
    const dx = pointer.deltaX * config.SPLAT_FORCE;
    const dy = pointer.deltaY * config.SPLAT_FORCE;
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, pointer.color);
  }

  function clickSplat(pointer: PointerPrototype) {
    const color = generateColor();
    color.r *= 10.0;
    color.g *= 10.0;
    color.b *= 10.0;
    const dx = 10 * (Math.random() - 0.5);
    const dy = 30 * (Math.random() - 0.5);
    splat(pointer.texcoordX, pointer.texcoordY, dx, dy, color);
  }

  function splat(
    x: number,
    y: number,
    dx: number,
    dy: number,
    color: RGBColor,
  ) {
    splatProgram.bind();
    gl.uniform1i(splatProgram.uniforms.uTarget, velocity.read.attach(0));
    gl.uniform1f(
      splatProgram.uniforms.aspectRatio,
      canvas.width / canvas.height,
    );
    gl.uniform2f(splatProgram.uniforms.point, x, y);
    gl.uniform3f(splatProgram.uniforms.color, dx, dy, 0.0);
    gl.uniform1f(
      splatProgram.uniforms.radius,
      correctRadius(config.SPLAT_RADIUS / 100.0),
    );
    blit(velocity.write);
    velocity.swap();

    gl.uniform1i(splatProgram.uniforms.uTarget, dye.read.attach(0));
    gl.uniform3f(splatProgram.uniforms.color, color.r, color.g, color.b);
    blit(dye.write);
    dye.swap();
  }

  function correctRadius(radius: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) radius *= aspectRatio;
    return radius;
  }

  function startLoopIfNeeded() {
    if (!isLoopRunning) {
      isLoopRunning = true;
      lastUpdateTime = Date.now();
      update();
    }
  }

  window.addEventListener("mousedown", (e) => {
    const pointer = pointers[0];
    const posX = scaleByPixelRatio(e.clientX);
    const posY = scaleByPixelRatio(e.clientY);
    updatePointerDownData(pointer, -1, posX, posY);
    clickSplat(pointer);
    startLoopIfNeeded();
  });

  window.addEventListener("mousemove", (e) => {
    const pointer = pointers[0];
    const posX = scaleByPixelRatio(e.clientX);
    const posY = scaleByPixelRatio(e.clientY);
    const color = pointer.color;
    updatePointerMoveData(pointer, posX, posY, color);
    startLoopIfNeeded();
  });

  window.addEventListener("touchstart", (e) => {
    const touches = e.targetTouches;
    const pointer = pointers[0];
    for (let i = 0; i < touches.length; i++) {
      const posX = scaleByPixelRatio(touches[i].clientX);
      const posY = scaleByPixelRatio(touches[i].clientY);
      updatePointerDownData(pointer, touches[i].identifier, posX, posY);
    }
    startLoopIfNeeded();
  });

  window.addEventListener(
    "touchmove",
    (e) => {
      const touches = e.targetTouches;
      const pointer = pointers[0];
      for (let i = 0; i < touches.length; i++) {
        const posX = scaleByPixelRatio(touches[i].clientX);
        const posY = scaleByPixelRatio(touches[i].clientY);
        updatePointerMoveData(pointer, posX, posY, pointer.color);
      }
      startLoopIfNeeded();
    },
    false,
  );

  window.addEventListener("touchend", (e) => {
    const pointer = pointers[0];
    updatePointerUpData(pointer);
  });

  function updatePointerDownData(
    pointer: PointerPrototype,
    id: number,
    posX: number,
    posY: number,
  ) {
    pointer.id = id;
    pointer.down = true;
    pointer.moved = false;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.deltaX = 0;
    pointer.deltaY = 0;
    pointer.color = generateColor();
  }

  function updatePointerMoveData(
    pointer: PointerPrototype,
    posX: number,
    posY: number,
    color: RGBColor,
  ) {
    pointer.prevTexcoordX = pointer.texcoordX;
    pointer.prevTexcoordY = pointer.texcoordY;
    pointer.texcoordX = posX / canvas.width;
    pointer.texcoordY = 1.0 - posY / canvas.height;
    pointer.deltaX = correctDeltaX(pointer.texcoordX - pointer.prevTexcoordX);
    pointer.deltaY = correctDeltaY(pointer.texcoordY - pointer.prevTexcoordY);
    pointer.moved =
      Math.abs(pointer.deltaX) > 0 || Math.abs(pointer.deltaY) > 0;
    pointer.color = color;
  }

  function updatePointerUpData(pointer: PointerPrototype) {
    pointer.down = false;
  }

  function correctDeltaX(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio < 1) delta *= aspectRatio;
    return delta;
  }

  function correctDeltaY(delta: number) {
    const aspectRatio = canvas.width / canvas.height;
    if (aspectRatio > 1) delta /= aspectRatio;
    return delta;
  }

  function generateColor(): RGBColor {
    const c = HSVtoRGB(Math.random(), 1.0, 1.0);
    // Bright neon-glowing color (perfectly visible over the dark layout)
    c.r *= 0.1;
    c.g *= 0.1;
    c.b *= 0.1;
    return c;
  }

  function HSVtoRGB(h: number, s: number, v: number): RGBColor {
    let r: number, g: number, b: number;
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    switch (i % 6) {
      case 0:
        r = v;
        g = t;
        b = p;
        break;
      case 1:
        r = q;
        g = v;
        b = p;
        break;
      case 2:
        r = p;
        g = v;
        b = t;
        break;
      case 3:
        r = p;
        g = q;
        b = v;
        break;
      case 4:
        r = t;
        g = p;
        b = v;
        break;
      case 5:
        r = v;
        g = p;
        b = q;
        break;
      default:
        r = 0;
        g = 0;
        b = 0;
        break;
    }
    return { r, g, b };
  }

  function wrap(value: number, min: number, max: number): number {
    const range = max - min;
    if (range === 0) return min;
    return ((value - min) % range) + min;
  }

  function getResolution(resolution: number): {
    width: number;
    height: number;
  } {
    let aspectRatio = gl.drawingBufferWidth / gl.drawingBufferHeight;
    if (aspectRatio < 1) aspectRatio = 1.0 / aspectRatio;
    const min = Math.round(resolution);
    const max = Math.round(resolution * aspectRatio);
    if (gl.drawingBufferWidth > gl.drawingBufferHeight) {
      return { width: max, height: min };
    } else {
      return { width: min, height: max };
    }
  }

  function scaleByPixelRatio(input: number): number {
    const pixelRatio = window.devicePixelRatio || 1;
    return Math.floor(input * pixelRatio);
  }

  function hashCode(s: string): number {
    if (s.length === 0) return 0;
    let hash = 0;
    for (let i = 0; i < s.length; i++) {
      hash = (hash << 5) - hash + s.charCodeAt(i);
      hash |= 0;
    }
    return hash;
  }
}

function initMemorialBoard() {
  const memorialBoard = document.getElementById("memorial-board");
  if (!memorialBoard) return;

  // Sound Config
  let isSoundOn = true;
  const soundToggle = document.getElementById("respects-sound-toggle");
  if (soundToggle) {
    soundToggle.addEventListener("click", () => {
      isSoundOn = !isSoundOn;
      if (isSoundOn) {
        soundToggle.textContent = "🔊 SOUND ON";
        soundToggle.classList.remove("muted");
        playTone(600, "sine", 0.1); // friendly beep
      } else {
        soundToggle.textContent = "🔇 MUTED";
        soundToggle.classList.add("muted");
      }
    });
  }

  // Web Audio Synth Function
  let audioCtx: AudioContext | null = null;
  function getAudioContext(): AudioContext {
    if (!audioCtx) {
      const AudioContextClass =
        window.AudioContext || window.webkitAudioContext!;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === "suspended") {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(
    freq: number,
    type: OscillatorType = "sine",
    duration = 0.3,
    vol = 0.15,
  ) {
    if (!isSoundOn) return;
    try {
      const ctx = getAudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, ctx.currentTime);

      gain.gain.setValueAtTime(vol, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(
        0.00001,
        ctx.currentTime + duration,
      );

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (err) {
      console.warn("Audio synthesis error:", err);
    }
  }

  function playBurnSound() {
    if (!isSoundOn) return;
    try {
      const ctx = getAudioContext();
      // Generate fire crackle white noise
      const bufferSize = ctx.sampleRate * 0.4; // 0.4 seconds
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      // Filter the noise for a rumble/sizzle sound
      const filter = ctx.createBiquadFilter();
      filter.type = "bandpass";
      filter.frequency.value = 1000;
      filter.Q.value = 1.0;

      // Gain node for fade
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();

      // Add a rapid pitch slider sweep for coin burn
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.3);

      oscGain.gain.setValueAtTime(0.08, ctx.currentTime);
      oscGain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + 0.3);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch (e) {
      // Fallback simple beep
      playTone(150, "triangle", 0.4, 0.25);
    }
  }

  // Log Archive Data
  const archiveData = {
    genesis: {
      title: "THE GENESIS AIRDROP (FAIR LAUNCH)",
      date: "LOG_DATE: 2023-04-15",
      ascii: `► SYSTEM PROTOCOL: GENESIS_DISTRIBUTION_LAUNCH
► TARGET ALLOCATION: 95.0% TOKENS DIRECT DROP + 5% REFERRAL REWARDS
► CLAIM RECIPIENTS: 400,000+ COMPLETED WALLETS
► RECALL VERDICT: COMMUNITY-FIRST MILESTONE`,
      desc: "April 2023. ArbDoge AI launched with a 100% free airdrop. 95% supply drop + 5% referral rewards were distributed directly to Arbitrum users. This fair, grass-roots launch kicked off a legendary meme wave, proving community-first tokenomics can reshape an entire network. Over 400,000 wallets claimed their shares in an unprecedented frenzy.",
      stat1: "100% COMMUNITY DROP!",
      stat2: "400K+ WALLETS",
      freq: 330,
    },
    lucky: {
      title: "THE ALGORITHMIC LUCKY DROP",
      date: "LOG_DATE: 2023-05-01",
      ascii: `► SYSTEM PROTOCOL: LUCKY_DROP_ALGORITHM
► MECHANISM: 3.0% TRANSACTION POOL ACCUMULATOR
► TOTAL REWARDS: 38.2M+ ARB DISTRIBUTED TO USERS
► INTEGRITY: 100% SECURE ON-CHAIN DRAW`,
      desc: "An innovative game built purely on smart contracts. For every transaction of AIDOGE, 3% was pooled into a Lucky Draw. A secure on-chain randomized algorithm drew tickets on every transaction, awarding lucky winners with real ARB! Millions of dollars worth of ARB were distributed to community players daily.",
      stat1: "38.2M+ ARB PAYOUTS",
      stat2: "100% SECURE DRAW",
      freq: 440,
    },
    aicode: {
      title: "THE AICODE DEFLATION ENGINE",
      date: "LOG_DATE: 2023-05-18",
      ascii: `► SYSTEM PROTOCOL: DEFLATIONARY_BURN_STAKING
► CORE UTILITY: $AIDOGE SUPPLY SCARCITY GENERATOR
► TOTAL TOKENS DESTROYED: 22,973T+ PERMANENTLY BURNED
► MINT ALGORITHM: ALGORITHMIC CROSS-TOKEN STAKING`,
      desc: "AICODE is the master utility token of the ArbDoge AI ecosystem. It could only be minted by burning $AIDOGE or staking it. Burning AIDOGE permanently reduced the meme supply, accelerating hyper-deflation while producing highly valuable AICODE. This unique cross-token tie-in was a masterpiece of scarcity engineering.",
      stat1: "22,973T+ SUPPLY BURNED",
      stat2: "100% ALGORITHMIC",
      freq: 220,
    },
    nfts: {
      title: "THE TRUTH AIDOGE NFT SERIES",
      date: "LOG_DATE: 2023-06-10",
      ascii: `► SYSTEM PROTOCOL: METAVERSE_DIGITAL_ART_SERIES
► COLLECTION QUANTITY: 10,000 UNIQUE CYBER DOGES
► mint STATUS: 100% SOLD OUT INSTANTLY AT LAUNCH
► SMART CONTRACT: ARBITRUM ONE MAINNET VERIFIED`,
      desc: "Truth AIDoge was the official generative digital art collection representing stylized community avatars in the ArbDoge AI metaverse. These 10,000 unique cyber-themed Doge collectibles unlocked exclusive ecosystem access, future yield staking pools, and a proud visual badge of membership. Sold out immediately.",
      stat1: "10,000 UNIQUE ITEMS",
      stat2: "100% SOLD OUT",
      freq: 554,
    },
  };

  // Tab switching logic for Memorial Viewer
  const chipBtns = document.querySelectorAll(".chip-btn");
  const asciiEl = document.getElementById("viewer-ascii");
  const titleEl = document.getElementById("archive-title");
  const dateEl = document.getElementById("archive-date");
  const descEl = document.getElementById("archive-desc");
  const indicatorEl = document.getElementById("retrieval-indicator");
  const statVal1El = document.getElementById("stat-val-1");
  const statVal2El = document.getElementById("stat-val-2");

  let currentTypewriterTimeout: ReturnType<typeof setTimeout> | null = null;

  function typeWriterText(text: string, element: HTMLElement, speed = 10) {
    if (currentTypewriterTimeout) {
      clearTimeout(currentTypewriterTimeout);
    }
    element.innerHTML = "";
    let i = 0;
    function type() {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
        currentTypewriterTimeout = setTimeout(type, speed);
      } else {
        currentTypewriterTimeout = null;
      }
    }
    type();
  }

  chipBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const key = btn.getAttribute("data-archive");
      if (!key) return;
      const data = (
        archiveData as Record<
          string,
          (typeof archiveData)[keyof typeof archiveData]
        >
      )[key];
      if (!data) return;

      // Update active state
      chipBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Audio feedback
      playTone(data.freq, "sine", 0.25, 0.12);
      // Spark/chime chord effect
      setTimeout(() => {
        playTone(data.freq * 1.5, "triangle", 0.15, 0.05);
      }, 80);

      // Retrieval status indicator
      if (indicatorEl) {
        indicatorEl.textContent = "RETRIEVING...";
        indicatorEl.style.color = "var(--primary)";
        setTimeout(() => {
          indicatorEl.textContent = "ACTIVE_LOADED";
          indicatorEl.style.color = "var(--secondary)";
        }, 300);
      }

      // Update Text Content with animations
      if (asciiEl) asciiEl.textContent = data.ascii;
      if (titleEl) titleEl.textContent = data.title;
      if (dateEl) dateEl.textContent = data.date;
      if (descEl) typeWriterText(data.desc, descEl, 8);
      if (statVal1El) statVal1El.textContent = data.stat1;
      if (statVal2El) statVal2El.textContent = data.stat2;
    });
  });

  // Pay Respects Virtual Burning system
  const burnBtn = document.getElementById("burn-respects-btn");
  const burnValEl = document.getElementById("tribute-burn-val");
  const burnTickerEl = document.getElementById("burn-ticker");

  // Load persistence respects count
  let respectCount: bigint;
  try {
    const saved = localStorage.getItem("aidoge_respects_burned_v2");
    respectCount = saved ? BigInt(saved) : BigInt("22974464256141700");
  } catch (err) {
    respectCount = BigInt("22974464256141700");
  }
  if (respectCount < BigInt("22974464256141700")) {
    respectCount = BigInt("22974464256141700");
  }

  // Set global variable for chart synchronization
  window.aidogeRespectCount = respectCount;

  if (burnValEl) {
    burnValEl.textContent = respectCount.toLocaleString();
  }

  const burnSlogans = [
    "🔥 R.I.P LUCKY DROP — WE RECEIVED MILLIONS IN ARB!",
    "🔥 NEVER GO BACK TO MY OLD LIFE!",
    "🔥 $AIDOGE COIN VIRTUAL INCINERATION SUCCESSFUL!",
    "🔥 DEFLATION SPEED ACCELERATED! SALUTE THE DEV!",
    "🔥 HODL IN PEACE, MEME SOLDIERS!",
    "🔥 AICODE MINT COMPLETED! RESPECT PAID!",
    "🔥 PRESS F AGAIN TO PAY MORE RESPECTS!",
    "🔥 WE ARE THE TRUTH COMMUNITY — ALWAYS IMMORTAL!",
    "🔥 ARBITRUM SEASON 1 MEMORIES LOADED.",
  ];

  function performRespectBurn() {
    // Increment respects count by a random large amount of tokens in the trillion range
    const increment = BigInt(
      Math.floor(Math.random() * 4000000000000) + 1000000000000,
    ); // 1T to 5T tokens
    respectCount += increment;
    window.aidogeRespectCount = respectCount;
    localStorage.setItem("aidoge_respects_burned_v2", respectCount.toString());

    // Audio Feedback
    playBurnSound();

    // Spawn sparks in Canvas
    spawnAshesSparks(25);

    // Update Counter with pop effect
    if (burnValEl) {
      burnValEl.textContent = respectCount.toLocaleString();
      burnValEl.style.transform = "scale(1.08)";
      burnValEl.style.color = "var(--secondary)";
      setTimeout(() => {
        burnValEl.style.transform = "scale(1)";
        burnValEl.style.color = "var(--primary)";
      }, 150);
    }

    // Update ticker with random memorial quote
    if (burnTickerEl) {
      const slogan =
        burnSlogans[Math.floor(Math.random() * burnSlogans.length)];
      burnTickerEl.textContent = slogan;
      burnTickerEl.style.color = "var(--secondary)";
      setTimeout(() => {
        burnTickerEl.style.color = "#71717a";
      }, 1500);
    }
  }

  if (burnBtn) {
    burnBtn.addEventListener("click", (e) => {
      e.stopPropagation(); // don't spawn standard AIDOGE particle bursts on window click
      performRespectBurn();
    });
  }

  // Keyboard shortcut: Press "F" or "f" to pay respects
  window.addEventListener("keydown", (e) => {
    if (e.key === "f" || e.key === "F") {
      // Ignore if user is inside form inputs
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      ) {
        return;
      }
      performRespectBurn();
    }
  });

  // --- Dynamic Canvas Burn Ashes Engine ---
  const ashesCanvasEl = document.getElementById(
    "burner-ashes",
  ) as HTMLCanvasElement | null;
  if (!ashesCanvasEl) return;
  const canvas: HTMLCanvasElement = ashesCanvasEl;
  const ashesCtx = canvas.getContext("2d");
  if (!ashesCtx) return;
  const ctx: CanvasRenderingContext2D = ashesCtx;

  class AshParticle {
    x = 0;
    y = 0;
    size = 0;
    vy = 0;
    vx = 0;
    alpha = 0;
    fade = 0;
    hue = 0;
    constructor() {
      this.reset();
      this.y = Math.random() * canvas.height; // scatter initially
    }
    reset(burst = false) {
      this.x = Math.random() * canvas.width;
      this.y = burst ? canvas.height : canvas.height + 10;
      this.size = Math.random() * 2.5 + 0.5;
      this.vy = -(Math.random() * 1.5 + 0.5); // rise up
      this.vx = (Math.random() - 0.5) * 0.6; // drift slightly sideways
      this.alpha = Math.random() * 0.5 + 0.5;
      this.fade = Math.random() * 0.008 + 0.003;
      // Hot embers are hot-pink or orange/gold
      this.hue = Math.random() > 0.4 ? 345 : 30; // 345 is hot pink, 30 is gold
    }
    update() {
      this.y += this.vy;
      this.x += this.vx;
      this.alpha -= this.fade;
      if (this.alpha <= 0 || this.x < 0 || this.x > canvas.width) {
        this.reset();
      }
    }
    draw() {
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.shadowBlur = this.size * 2;
      ctx.shadowColor = `hsla(${this.hue}, 100%, 60%, 0.8)`;
      ctx.fillStyle = `hsla(${this.hue}, 100%, 70%, 1)`;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  const ashes: AshParticle[] = [];

  function resizeCanvas() {
    if (!canvas.parentElement) return;
    canvas.width = canvas.parentElement.clientWidth;
    canvas.height = canvas.parentElement.clientHeight;
  }

  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  // Pre-populate particles
  for (let i = 0; i < 35; i++) {
    ashes.push(new AshParticle());
  }

  function spawnAshesSparks(count: number) {
    for (let i = 0; i < count; i++) {
      const p = new AshParticle();
      p.reset(true);
      // Give burst particles a higher vertical speed
      p.vy = -(Math.random() * 4 + 2);
      p.vx = (Math.random() - 0.5) * 3;
      p.alpha = 1.0;
      ashes.push(p);
    }
    // Limit total particles to prevent performance hit
    if (ashes.length > 120) {
      ashes.splice(0, ashes.length - 120);
    }
  }

  function animateAshes() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Draw subtle glowing vapor background at bottom
    const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
    grad.addColorStop(0, "rgba(255, 42, 95, 0.08)");
    grad.addColorStop(1, "rgba(0, 0, 0, 0)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let i = ashes.length - 1; i >= 0; i--) {
      const p = ashes[i];
      p.update();
      p.draw();
    }
    requestAnimationFrame(animateAshes);
  }

  animateAshes();

  // --- Dynamic 8% Tax Burn Interactive Chamber ---
  const taxData = [
    {
      name: "System Burn",
      pct: "1.0%",
      val: 1.0,
      color: "#ff5f1f",
      gradient: "url(#grad-gold)",
      caption: "HYPER-DEFLATION SYSTEM",
      desc: "Instantly and permanently incinerated, sent directly to the Dead address on Arbitrum. This ensures a persistent supply squeeze, increasing rarity of all remaining $AIDOGE tokens in circulation.",
      velocity: "IMMEDIATE DESTROY",
      multiplier: "12.5% OF TAX POOL",
    },
    {
      name: "AIDOGE Stakers",
      pct: "0.7%",
      val: 0.7,
      color: "#9933ff",
      gradient: "url(#grad-purple)",
      caption: "BELIEVER DIVIDENDS RECOMPENSE",
      desc: "Distributed continuously as premium dividends to dedicated stakers of $AIDOGE, offering sustainable high yields and rewarding long-term holders for securing the ecosystem's economic foundations.",
      velocity: "EPOCH-BASED YIELD",
      multiplier: "8.75% OF TAX POOL",
    },
    {
      name: "Lucky Drop",
      pct: "3.0%",
      val: 3.0,
      color: "#ffcc00",
      gradient: "url(#grad-lucky)",
      caption: "GAMIFIED DISTRIBUTION ENGINE",
      desc: "Earmarked directly for the iconic Lucky Drop protocol. Every trade has a chance to win a portion of this pool, incentivizing high trading volumes, organic engagement, and platform gamification.",
      velocity: "ALGORITHMIC DISPATCH",
      multiplier: "37.5% OF TAX POOL",
    },
    {
      name: "Camelot LP",
      pct: "1.0%",
      val: 1.0,
      color: "#00ffff",
      gradient: "url(#grad-lp)",
      caption: "DEX LIQUIDITY SECURITY",
      desc: "Automatically injected back into the Camelot V2 and V3 liquidity pools on Arbitrum to deepen market depth, reduce trading slippage, and maintain high capital efficiency for all traders.",
      velocity: "AUTO-COMPOUNDING",
      multiplier: "12.5% OF TAX POOL",
    },
    {
      name: "Flexible Funds",
      pct: "0.8%",
      val: 0.8,
      color: "#00cc44",
      gradient: "url(#grad-flex)",
      caption: "STRATEGIC EMERGENCY RESERVES",
      desc: "Reserved for emergency market stabilization, liquidity injections, developer operations under extreme volatility, and funding high-impact strategic proposals from the AIDOGE community council.",
      velocity: "ON-CHAIN LOCK",
      multiplier: "10.0% OF TAX POOL",
    },
    {
      name: "Development",
      pct: "1.5%",
      val: 1.5,
      color: "#0066ff",
      gradient: "url(#grad-dev)",
      caption: "PLATFORM R&D ENGINE",
      desc: "Allocated directly to secure ongoing protocol upgrades, system auditing, high-performance infrastructure, global marketing campaigns, and core developer team compensation to ensure the immortal status of AIDOGE.",
      velocity: "REAL-TIME SECURE",
      multiplier: "18.75% OF TAX POOL",
    },
  ];

  const donutGroup = document.getElementById("donut-segments-group");
  const legendCards = document.querySelectorAll(".legend-card");

  // Telemetry elements
  const telBadge = document.getElementById("telemetry-badge-color");
  const telCaption = document.getElementById("telemetry-item-caption");
  const telTitle = document.getElementById("telemetry-item-title");
  const telPct = document.getElementById("telemetry-item-pct");
  const telBar = document.getElementById("telemetry-item-bar");
  const telDesc = document.getElementById("telemetry-item-desc");
  const paramVelocity = document.getElementById("param-val-velocity");
  const paramMultiplier = document.getElementById("param-val-multiplier");
  const centerPct = document.getElementById("core-center-pct");
  const centerLbl = document.getElementById("core-center-lbl");
  const ringGlow = document.getElementById("ring-glow-effect");

  if (donutGroup) {
    const cx = 230;
    const cy = 230;
    const r = 130; // radius is perfect with larger SVG viewBox (460x460) and center (230,230)

    // Total sum is 8.0
    const totalTax = 8.0;
    let currentAngle = 0;

    interface DonutSegmentEntry {
      element: SVGPathElement;
      trigger: SVGPathElement;
      tx: number;
      ty: number;
      data: (typeof taxData)[number];
      index: number;
    }

    const segmentElements: DonutSegmentEntry[] = [];
    let lockedIndex: number | null = null;

    // polarToCartesian and describeArc helpers
    const polarToCartesian = (
      centerX: number,
      centerY: number,
      radius: number,
      angleInDegrees: number,
    ) => {
      const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;
      return {
        x: centerX + radius * Math.cos(angleInRadians),
        y: centerY + radius * Math.sin(angleInRadians),
      };
    };

    const describeArcClockwise = (
      centerX: number,
      centerY: number,
      radius: number,
      startAngle: number,
      endAngle: number,
    ) => {
      const start = polarToCartesian(centerX, centerY, radius, startAngle);
      const end = polarToCartesian(centerX, centerY, radius, endAngle);
      const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
      return [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        1,
        end.x,
        end.y,
      ].join(" ");
    };

    // Render paths
    taxData.forEach((data, index) => {
      const arcAngle = (data.val / totalTax) * 360;
      const startAngle = currentAngle;
      const endAngle = currentAngle + arcAngle;
      currentAngle = endAngle;

      // Calculate bisector angle for translate offset on hover
      const midAngle = (startAngle + endAngle) / 2;
      const rad = ((midAngle - 90) * Math.PI) / 180;
      const offsetDistance = 12; // px to push outward
      const tx = Math.cos(rad) * offsetDistance;
      const ty = Math.sin(rad) * offsetDistance;

      const dPath = describeArcClockwise(cx, cy, r, startAngle, endAngle);

      // Create a static invisible Trigger Path (larger stroke-width for easier hover, never moves)
      const triggerPath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      triggerPath.setAttribute("d", dPath);
      triggerPath.setAttribute("fill", "none");
      triggerPath.setAttribute("stroke", "transparent");
      triggerPath.setAttribute("stroke-width", "38");
      triggerPath.setAttribute("pointer-events", "stroke");
      triggerPath.style.cursor = "pointer";

      // Create the Visible Path (moves gracefully, does not capture pointers)
      const visiblePath = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "path",
      );
      visiblePath.setAttribute("d", dPath);
      visiblePath.setAttribute("class", "donut-segment");
      visiblePath.setAttribute("stroke", data.gradient);
      visiblePath.setAttribute("pointer-events", "none");
      visiblePath.style.setProperty("--hover-shadow", data.color + "a0"); // glow color

      // Store references for interactive triggers
      segmentElements.push({
        element: visiblePath,
        trigger: triggerPath,
        tx,
        ty,
        data,
        index,
      });

      // Append visible path first, then the invisible trigger on top of it
      donutGroup.appendChild(visiblePath);
      donutGroup.appendChild(triggerPath);
    });

    // Function to set high-end active element focus
    const activateSegment = (index: number) => {
      segmentElements.forEach((seg, idx) => {
        if (idx === index) {
          // Highlight and offset hovered segment
          seg.element.classList.add("active");
          seg.element.style.opacity = "1.0";
          seg.element.style.filter = "url(#neon-glow)";
        } else {
          // Dim others slightly
          seg.element.classList.remove("active");
          seg.element.style.opacity = "0.35";
          seg.element.style.filter = "none";
        }
      });

      // Highlight correspond legend card
      legendCards.forEach((card, idx) => {
        if (idx === index) {
          card.classList.add("active");
        } else {
          card.classList.remove("active");
        }
      });

      // Update telemetry reading with type-writer feel or quick update
      const activeData = taxData[index];
      if (activeData) {
        // Update central ring display text
        if (centerPct) {
          centerPct.textContent = activeData.pct;
          centerPct.style.color = activeData.color;
          centerPct.style.textShadow = `0 0 15px ${activeData.color}`;
        }
        if (centerLbl) centerLbl.textContent = activeData.name;

        // Update visualizer ring backglow color matching the active piece
        if (ringGlow) {
          ringGlow.style.background = `radial-gradient(circle, ${activeData.color}25 0%, transparent 75%)`;
          ringGlow.style.filter = "blur(35px)";
        }

        // Update telemetry card parameters
        if (telBadge) {
          telBadge.style.backgroundColor = activeData.color;
          telBadge.style.boxShadow = `0 0 15px ${activeData.color}`;
        }
        if (telCaption) telCaption.textContent = activeData.caption;
        if (telTitle) {
          telTitle.textContent = activeData.name + " Protocol";
          telTitle.style.color = activeData.color;
        }
        if (telPct) {
          telPct.textContent = activeData.pct;
          telPct.style.color = activeData.color;
          telPct.style.textShadow = `0 0 15px ${activeData.color}80`;
        }
        if (telBar) {
          telBar.style.width = `${(activeData.val / 8.0) * 100}%`; // scale relative to total tax (8%)
          telBar.style.background = `linear-gradient(90deg, ${activeData.color}, #ffffff)`;
          telBar.style.setProperty("--secondary-glow", activeData.color + "a0");
        }
        if (telDesc) {
          telDesc.textContent = activeData.desc;
        }
        if (paramVelocity) paramVelocity.textContent = activeData.velocity;
        if (paramMultiplier) {
          paramMultiplier.textContent = activeData.multiplier;
          paramMultiplier.style.color = activeData.color;
        }

        // Custom sound feedback matching color frequencies
        const frequencies = [261.63, 293.66, 329.63, 349.23, 392.0, 440.0]; // high tech ascending chord scale
        if (typeof playTone === "function") {
          playTone(frequencies[index % frequencies.length], "sine", 0.08, 0.05);
        }
      }
    };

    const resetSegments = () => {
      segmentElements.forEach((seg) => {
        seg.element.classList.remove("active");
        seg.element.style.opacity = "1.0";
        seg.element.style.filter = "none";
      });

      legendCards.forEach((card) => card.classList.remove("active"));

      // Restore total view in center
      if (centerPct) {
        centerPct.textContent = "8.0%";
        centerPct.style.color = "#ffffff";
        centerPct.style.textShadow = "0 0 10px rgba(255, 255, 255, 0.4)";
      }
      if (centerLbl) centerLbl.textContent = "TOTAL TAX";

      if (ringGlow) {
        ringGlow.style.background =
          "radial-gradient(circle, rgba(0, 240, 255, 0.15) 0%, transparent 75%)";
        ringGlow.style.filter = "blur(25px)";
      }

      // Keep last selected in telemetry so there is no ugly blank space, or restore generic
      if (telCaption) telCaption.textContent = "DEFLATION CORE ACTIVE";
      if (telTitle) {
        telTitle.textContent = "Ecosystem Deflation Engine";
        telTitle.style.color = "#ffffff";
      }
      if (telPct) {
        telPct.textContent = "8.0%";
        telPct.style.color = "var(--secondary)";
        telPct.style.textShadow = "0 0 12px var(--secondary-glow)";
      }
      if (telBar) {
        telBar.style.width = "100%";
        telBar.style.background =
          "linear-gradient(90deg, var(--secondary), var(--primary))";
      }
      if (telDesc) {
        telDesc.textContent =
          "Hover over any colored segment of the cybernetic tax ring to inspect and decode its operational profile, ecosystem allocation parameters, and economic impact.";
      }
      if (paramVelocity) paramVelocity.textContent = "REAL-TIME";
      if (paramMultiplier) {
        paramMultiplier.textContent = "HIGH-FREQUENCY";
        paramMultiplier.style.color = "var(--secondary)";
      }
      if (telBadge) {
        telBadge.style.backgroundColor = "var(--secondary)";
        telBadge.style.boxShadow = "0 0 10px var(--secondary-glow)";
      }
    };

    // Toggle lock state
    const toggleLock = (index: number) => {
      if (lockedIndex === index) {
        lockedIndex = null;
        legendCards.forEach((card) => card.classList.remove("locked"));
        activateSegment(index);
      } else {
        lockedIndex = index;
        legendCards.forEach((card, idx) => {
          if (idx === index) {
            card.classList.add("locked");
          } else {
            card.classList.remove("locked");
          }
        });
        activateSegment(index);
      }
    };

    // Attach segment mouse listeners on the static trigger path
    segmentElements.forEach((seg) => {
      seg.trigger.addEventListener("mouseenter", () => {
        activateSegment(seg.index);
      });
      seg.trigger.addEventListener("mouseleave", () => {
        if (lockedIndex !== null) {
          activateSegment(lockedIndex);
        } else {
          resetSegments();
        }
      });
      seg.trigger.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleLock(seg.index);
      });
    });

    // Attach legend card mouse listeners
    legendCards.forEach((card) => {
      const index = parseInt(card.getAttribute("data-index") ?? "0", 10);
      card.addEventListener("mouseenter", () => {
        activateSegment(index);
      });
      card.addEventListener("mouseleave", () => {
        if (lockedIndex !== null) {
          activateSegment(lockedIndex);
        } else {
          resetSegments();
        }
      });
      card.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleLock(index);
      });
    });

    // Reset lock when clicking anywhere else on the document
    document.addEventListener("click", () => {
      if (lockedIndex !== null) {
        lockedIndex = null;
        legendCards.forEach((card) => card.classList.remove("locked"));
        resetSegments();
      }
    });
  }

  // Trigger first archive load to pop up details initially
  setTimeout(() => {
    const firstTab = document.querySelector<HTMLElement>(
      ".chip-btn[data-archive='genesis']",
    );
    if (firstTab) firstTab.click();
  }, 100);
}

// ==========================================================================
// NEURAL SCROLL-WARP & QUANTUM HUD ENGINE SCRIPT
// ==========================================================================

// Scrambler class for cyberpunk decoding text effect
interface ScrambleQueueItem {
  from: string;
  to: string;
  start: number;
  end: number;
  char: string;
}

class TextScrambler {
  el: HTMLElement;
  chars: string;
  queue: ScrambleQueueItem[] = [];
  frame = 0;
  frameRequest = 0;
  resolve: () => void = () => {};

  constructor(el: HTMLElement) {
    this.el = el;
    this.chars = "!<>-_\\/[]{}—=+*^?#________";
    this.update = this.update.bind(this);
  }
  setText(newText: string) {
    const oldText = this.el.innerText || "";
    const length = Math.max(oldText.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 20);
      const end = start + Math.floor(Math.random() * 20);
      this.queue.push({ from, to, start, end, char: "" });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }
  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += to;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.25) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span class="scramble-char">${char}</span>`;
      } else {
        output += from;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Fallback high-tech synthesizer beeper
function playQuantumBeep(
  frequency: number,
  type: OscillatorType = "sine",
  duration = 0.08,
  volume = 0.02,
) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + duration);
  } catch (e) {
    // Audio context may be blocked by user gesture settings, ignore safely
  }
}

function initQuantumScrollEngine() {
  // 1. Define candidate sections on the page with their configurations
  const candidateSections = [
    {
      id: "memorial-board",
      label: "01_MEMORIAL",
      headingSelector: ".header-logo-group h2",
    },
    {
      id: "memory-timeline-section",
      label: "02_TIMELINE",
      headingSelector: "#memory-timeline-section .header-logo-group h2",
    },
    {
      id: "token-terminal",
      label: "03_TERMINAL",
      headingSelector: ".terminal-title",
    },
    {
      id: "tax-dashboard",
      label: "04_TAX_RING",
      headingSelector: ".tax-dashboard-title",
    },
    { id: "community-box", label: "01_COMMUNITY", headingSelector: "h2" },
  ];

  // Filter sections that actually exist on current page
  const activePageSections = candidateSections.filter(
    (sec) => document.getElementById(sec.id) !== null,
  );

  if (activePageSections.length === 0) return; // No targets to manage

  // 2. Generate Section list HTML for bottom-left HUD panel
  let sectionListHTML = "";
  activePageSections.forEach((sec) => {
    sectionListHTML += `
      <div class="hud-section-item" id="hud-sec-item-${sec.id}" data-target-id="${sec.id}">
        <span class="sec-dot"></span>
        <span>${sec.label}</span>
      </div>
    `;
  });

  // 3. Inject Bottom-Left Navigation HUD Markup
  const hudContainer = document.createElement("div");
  hudContainer.className = "cyber-hud-nav font-mono";
  hudContainer.innerHTML = `
    <div class="hud-section-header">
      <span>INDEX</span>
      <span class="hud-index-count">0${activePageSections.length}</span>
    </div>
    <div class="hud-section-list">
      ${sectionListHTML}
    </div>
  `;
  document.body.appendChild(hudContainer);

  // 4. Inject Dynamic Top Progress Tracker
  const trackerContainer = document.createElement("div");
  trackerContainer.className = "quantum-scroll-tracker";
  trackerContainer.innerHTML = `<div class="quantum-scroll-bar" id="quantum-scroll-bar"></div>`;
  document.body.appendChild(trackerContainer);

  // Inject sleek, premium Back-to-Top Button
  const backToTopBtn = document.createElement("button");
  backToTopBtn.className = "cyber-back-to-top";
  backToTopBtn.setAttribute("id", "cyber-back-to-top");
  backToTopBtn.setAttribute("aria-label", "Scroll to Top");
  backToTopBtn.innerHTML = `
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  document.body.appendChild(backToTopBtn);

  // 5. Inject sweep laser scanlines and wireframe blueprint grids inside targets
  activePageSections.forEach((sec) => {
    const el = document.getElementById(sec.id);
    if (el) {
      el.classList.add("holo-scroll-target");

      // Inject fine grid blueprint element if not exists
      if (!el.querySelector(".holo-grid-blueprint")) {
        const blueprint = document.createElement("div");
        blueprint.className = "holo-grid-blueprint";
        el.appendChild(blueprint);
      }

      // Inject laser sweep line element if not exists
      if (!el.querySelector(".holo-sweep-beam")) {
        const beam = document.createElement("div");
        beam.className = "holo-sweep-beam";
        el.appendChild(beam);
      }
    }
  });

  // Store original heading text values for scrambling
  const scrambledElements = new Map();
  activePageSections.forEach((sec) => {
    const cardEl = document.getElementById(sec.id);
    if (cardEl) {
      const headingEl = cardEl.querySelector<HTMLElement>(sec.headingSelector);
      if (headingEl) {
        scrambledElements.set(sec.id, {
          element: headingEl,
          originalText: headingEl.innerText,
          scrambled: false,
        });
      }
    }
  });

  // 6. Real-time Scroll Progress Bar Update
  const updateScrollProgress = () => {
    const scrollTop = window.scrollY;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? scrollTop / docHeight : 0;

    const fillBar = document.getElementById("quantum-scroll-bar");
    if (fillBar) {
      fillBar.style.width = `${pct * 100}%`;
    }

    // Toggle Back-to-Top button visibility
    const topBtn = document.getElementById("cyber-back-to-top");
    if (topBtn) {
      if (scrollTop > 350) {
        topBtn.classList.add("visible");
      } else {
        topBtn.classList.remove("visible");
      }
    }
  };

  // Click listener for Back-to-Top button with cool synthesizer audio tone
  const topBtn = document.getElementById("cyber-back-to-top");
  if (topBtn) {
    topBtn.addEventListener("click", () => {
      // High-frequency synth system ascending tones
      playQuantumBeep(1200, "sine", 0.04, 0.02);
      setTimeout(() => playQuantumBeep(1800, "sine", 0.05, 0.02), 40);

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // 7. Interactive scrolling to sections when clicking HUD links
  const hudItems = hudContainer.querySelectorAll(".hud-section-item");
  hudItems.forEach((item) => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-target-id");
      if (!targetId) return;
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        // High-frequency digital system compile tones
        playQuantumBeep(1100, "sine", 0.05, 0.02);
        setTimeout(() => playQuantumBeep(1500, "sine", 0.04, 0.02), 40);

        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    });
  });

  // 8. Intersection Observer for Materialization and Scrambling
  const observerOptions = {
    root: null,
    rootMargin: "-20px 0px -20px 0px", // Trigger slightly offset from boundaries
    threshold: 0.12, // Trigger when 12% of card is visible
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const targetId = entry.target.id;
      const navItem = document.getElementById(`hud-sec-item-${targetId}`);

      if (entry.isIntersecting) {
        // Materialize card with smooth slide-up
        entry.target.classList.add("holo-materialized");

        if (navItem) {
          navItem.classList.add("active");
        }

        // Trigger scramble decrypt text on first entry
        const scramInfo = scrambledElements.get(targetId);
        if (scramInfo && !scramInfo.scrambled) {
          scramInfo.scrambled = true;
          const scrambler = new TextScrambler(scramInfo.element);
          scrambler.setText(scramInfo.originalText);

          // Audio synthesis stream trigger
          playQuantumBeep(920, "triangle", 0.04, 0.015);
          setTimeout(() => playQuantumBeep(1350, "sine", 0.03, 0.015), 50);
        }
      } else {
        if (navItem) {
          navItem.classList.remove("active");
        }
      }
    });
  }, observerOptions);

  // Bind observer to all active containers
  activePageSections.forEach((sec) => {
    const el = document.getElementById(sec.id);
    if (el) {
      observer.observe(el);
    }
  });

  // Attach window scroll listeners
  window.addEventListener("scroll", updateScrollProgress);

  // Initial trigger
  updateScrollProgress();
}

// ==========================================================================
// NEW ULTRA-PREMIUM INTERACTIVE DESIGN UPGRADES
// ==========================================================================

// 1. High-Tech Cyber Loader with Real Logs & Smooth Decrypt Sequence
function initCyberLoader() {
  const loader = document.getElementById("cyber-loader");
  const fill = document.getElementById("loader-progress");
  const pct = document.getElementById("loader-pct");
  const logs = document.getElementById("loader-logs");

  if (!loader) return;

  // Check if loader has been shown during this session to avoid annoyance during page navigation
  if (sessionStorage.getItem("cyberLoaderShown") === "true") {
    loader.style.transition = "none";
    loader.style.display = "none";
    loader.classList.add("loaded");
    return;
  }

  const logSteps = [
    {
      progress: 10,
      text: "> ESTABLISHING SECURE MEMORY CONNECTION (PORT_3000)...",
    },
    { progress: 25, text: "> TUNING FREQUENCIES OF DEFLATION CONSOLE LOGS..." },
    { progress: 40, text: "> RE-RENDERING THE 8% TRANSACTION TAX CHAMBER..." },
    { progress: 55, text: "> GENERATING CYBER CHORD AUDIO SYNTH BEATS..." },
    { progress: 70, text: "> INJECTING MOUSE SPOTLIGHT FLASHLIGHT CORES..." },
    { progress: 85, text: "> COMPILING 3D TILT TRIBUTE ALTAR SHADERS..." },
    {
      progress: 98,
      text: "> SYS_NOMINAL. LAUNCHING AIDOGE MEMORIAM SYSTEM...",
    },
  ];

  let currentProgress = 0;
  let logIndex = 0;

  const typeLog = (text: string) => {
    if (!logs) return;
    const div = document.createElement("div");
    div.textContent = text;
    logs.appendChild(div);
    logs.scrollTop = logs.scrollHeight;
  };

  const timer = setInterval(() => {
    if (currentProgress >= 100) {
      clearInterval(timer);
      setTimeout(() => {
        // Sweep out loaders
        loader.classList.add("loaded");
        // Save that we have loaded the screen once in this session
        sessionStorage.setItem("cyberLoaderShown", "true");

        // Play futuristic system chime tone
        playQuantumBeep(523.25, "sine", 0.15, 0.04); // C5
        setTimeout(() => playQuantumBeep(659.25, "sine", 0.15, 0.04), 100); // E5
        setTimeout(() => playQuantumBeep(783.99, "sine", 0.15, 0.04), 200); // G5
        setTimeout(() => playQuantumBeep(1046.5, "sine", 0.35, 0.05), 300); // C6
      }, 400);
      return;
    }

    currentProgress += Math.floor(Math.random() * 4) + 1;
    if (currentProgress > 100) currentProgress = 100;

    if (fill) fill.style.width = `${currentProgress}%`;
    if (pct)
      pct.textContent = `${currentProgress.toString().padStart(2, "0")}%`;

    // Add log lines if progress threshold crossed
    if (
      logIndex < logSteps.length &&
      currentProgress >= logSteps[logIndex].progress
    ) {
      typeLog(logSteps[logIndex].text);
      logIndex++;
      // Subtle ticking beep
      playQuantumBeep(1200, "triangle", 0.02, 0.01);
    }
  }, 35);
}

// 2. Synthesizer beat player using purely browser Web Audio API (Zero external bytes)
let synthCtx: AudioContext | null = null;
let synthGain: GainNode | null = null;
let synthPlaying = false;
let arpInterval: ReturnType<typeof setInterval> | null = null;
let currentAnalyser: AnalyserNode | null = null;
let visualizerAnimationFrame: number | null = null;

function initSynthPlayer() {
  const synthPlayBtn = document.getElementById("synth-play-btn");
  const synthPlayerWidget = document.getElementById("navbar-synth-player");
  const visualizerBars = document.querySelectorAll<HTMLElement>(
    ".mini-visualizer .v-bar",
  );

  if (!synthPlayBtn) return;
  if (!synthPlayerWidget) return;

  const updateVisualizer = () => {
    if (!synthPlaying || !currentAnalyser) {
      visualizerBars.forEach((bar) => {
        bar.style.height = "3px";
        bar.style.backgroundColor = "#52525b";
      });
      return;
    }

    const dataArray = new Uint8Array(currentAnalyser.frequencyBinCount);
    currentAnalyser.getByteFrequencyData(dataArray);

    visualizerBars.forEach((bar, idx) => {
      const dataVal = dataArray[idx % dataArray.length] || 0;
      const height = Math.max(3, Math.min(12, (dataVal / 255) * 15));
      bar.style.height = `${height}px`;
      // Dynamic shift of bar colors from cyan to pink on frequency peaks
      if (dataVal > 150) {
        bar.style.backgroundColor = "var(--primary)";
      } else {
        bar.style.backgroundColor = "var(--secondary)";
      }
    });

    visualizerAnimationFrame = requestAnimationFrame(updateVisualizer);
  };

  const toggleSynth = () => {
    const playIcon = synthPlayBtn.querySelector<HTMLElement>(".play-icon");
    const trackLabel =
      synthPlayBtn.querySelector<HTMLElement>(".synth-track-label");

    if (synthPlaying) {
      // Pause Synthesizer
      synthPlaying = false;
      if (synthGain && synthCtx) {
        synthGain.gain.exponentialRampToValueAtTime(
          0.0001,
          synthCtx.currentTime + 0.2,
        );
      }
      setTimeout(() => {
        if (synthCtx) synthCtx.suspend();
        if (arpInterval) clearInterval(arpInterval);
      }, 200);

      if (playIcon) playIcon.textContent = "▶";
      if (trackLabel) trackLabel.textContent = "CYBER BEAT";
      synthPlayerWidget.classList.remove("playing");
      if (visualizerAnimationFrame) {
        cancelAnimationFrame(visualizerAnimationFrame);
      }
      updateVisualizer();
    } else {
      // Play / Boot Synthesizer
      synthPlaying = true;
      synthPlayerWidget.classList.add("playing");
      if (playIcon) playIcon.textContent = "■";
      if (trackLabel) trackLabel.textContent = "BEAT: ON";

      if (!synthCtx || !synthGain) {
        startSynthesizerBeat();
      } else {
        synthCtx.resume();
        synthGain.gain.setValueAtTime(0, synthCtx.currentTime);
        synthGain.gain.exponentialRampToValueAtTime(
          0.08,
          synthCtx.currentTime + 0.3,
        );
        startSequencerLoop();
      }

      updateVisualizer();
    }
  };

  synthPlayBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    toggleSynth();
  });
}

function startSynthesizerBeat() {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;
  synthCtx = new AudioContext();

  const compressor = synthCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-15, synthCtx.currentTime);
  compressor.knee.setValueAtTime(30, synthCtx.currentTime);
  compressor.ratio.setValueAtTime(12, synthCtx.currentTime);
  compressor.connect(synthCtx.destination);

  currentAnalyser = synthCtx.createAnalyser();
  currentAnalyser.fftSize = 32;
  currentAnalyser.connect(compressor);

  synthGain = synthCtx.createGain();
  synthGain.gain.setValueAtTime(0, synthCtx.currentTime);
  synthGain.gain.exponentialRampToValueAtTime(0.08, synthCtx.currentTime + 0.4);
  synthGain.connect(currentAnalyser);

  startSequencerLoop();
}

function startSequencerLoop() {
  if (arpInterval) clearInterval(arpInterval);

  const tempo = 120;
  const beatDuration = 60 / tempo; // 0.5s per beat
  let step = 0;

  // Fm -> Gm -> Bbm -> Fm Space chords
  const progression = [
    { root: 87.31, notes: [174.61, 207.65, 261.63, 349.23] }, // F2 root, F3-Ab3-C4-F4 notes
    { root: 98.0, notes: [196.0, 233.08, 293.66, 392.0] }, // G2 root, G3-Bb3-D4-G4 notes
    { root: 116.54, notes: [233.08, 277.18, 349.23, 466.16] }, // Bb2 root, Bb3-Db4-F4-Bb4 notes
    { root: 87.31, notes: [174.61, 207.65, 261.63, 349.23] },
  ];

  const runSeqStep = () => {
    if (
      !synthPlaying ||
      !synthCtx ||
      !synthGain ||
      synthCtx.state === "suspended"
    )
      return;

    // Capture as locals so TypeScript can narrow them to non-null
    // inside nested closures (e.g. the forEach below).
    const ctx = synthCtx;
    const gain = synthGain;
    const time = ctx.currentTime;
    const chordIndex = Math.floor(step / 8) % progression.length;
    const chord = progression[chordIndex];
    const subStep = step % 8;

    // Trigger Bass and Chord drone on beat 0
    if (subStep === 0) {
      // 1. Sub Bass synth drone
      const bOsc = ctx.createOscillator();
      const bGain = ctx.createGain();
      const bFilter = ctx.createBiquadFilter();

      bOsc.type = "sawtooth";
      bOsc.frequency.setValueAtTime(chord.root / 2, time);

      bFilter.type = "lowpass";
      bFilter.frequency.setValueAtTime(130, time);

      bGain.gain.setValueAtTime(0, time);
      bGain.gain.linearRampToValueAtTime(0.55, time + 0.15);
      bGain.gain.exponentialRampToValueAtTime(
        0.0001,
        time + beatDuration * 7.5,
      );

      bOsc.connect(bFilter);
      bFilter.connect(bGain);
      bGain.connect(gain);

      bOsc.start(time);
      bOsc.stop(time + beatDuration * 8);

      // 2. Beautiful drifting pads
      chord.notes.forEach((freq) => {
        const cOsc = ctx.createOscillator();
        const cGain = ctx.createGain();
        const cFilter = ctx.createBiquadFilter();

        cOsc.type = "triangle";
        cOsc.frequency.setValueAtTime(freq, time);

        cFilter.type = "lowpass";
        cFilter.frequency.setValueAtTime(300, time);
        cFilter.frequency.exponentialRampToValueAtTime(
          750,
          time + beatDuration * 5,
        );

        cGain.gain.setValueAtTime(0, time);
        cGain.gain.linearRampToValueAtTime(0.12, time + 0.6);
        cGain.gain.exponentialRampToValueAtTime(
          0.0001,
          time + beatDuration * 7.8,
        );

        cOsc.connect(cFilter);
        cFilter.connect(cGain);
        cGain.connect(gain);

        cOsc.start(time);
        cOsc.stop(time + beatDuration * 8);
      });
    }

    // 3. Arpeggiator melodic sparkles on sub-steps
    if (subStep % 2 === 0) {
      const noteFreq = chord.notes[(subStep / 2) % chord.notes.length] * 2; // Arp an octave higher
      const aOsc = ctx.createOscillator();
      const aGain = ctx.createGain();

      aOsc.type = "sine";
      aOsc.frequency.setValueAtTime(noteFreq, time);

      aGain.gain.setValueAtTime(0, time);
      aGain.gain.linearRampToValueAtTime(0.2, time + 0.01);
      aGain.gain.exponentialRampToValueAtTime(
        0.0001,
        time + beatDuration * 1.5,
      );

      aOsc.connect(aGain);
      aGain.connect(gain);

      aOsc.start(time);
      aOsc.stop(time + beatDuration * 2);
    }

    step++;
  };

  runSeqStep();
  // 8th notes trigger step interval (0.25 seconds)
  arpInterval = setInterval(runSeqStep, (60 / tempo) * 500);
}

// 3. 3D Parallax Tilt Effects and Cursor Spotlight Border Glows
function initLuxuryEffects() {
  const targetEls = document.querySelectorAll<HTMLElement>(
    ".altar-card, .viewer-screen, .social-card, .stat-card, .legend-card, .terminal-container, .tax-dashboard-container",
  );

  targetEls.forEach((el) => {
    // Dynamically inject spotlight overlays if they aren't written in HTML
    if (!el.querySelector(".spotlight-glow")) {
      const glow = document.createElement("div");
      glow.className = "spotlight-glow";
      // Insert glow as first child so it sits as a background element
      el.insertBefore(glow, el.firstChild);
    }
    if (!el.querySelector(".spotlight-border")) {
      const border = document.createElement("div");
      border.className = "spotlight-border";
      el.appendChild(border);
    }

    el.addEventListener("mousemove", (e) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      el.style.setProperty("--mouse-x", `${x}px`);
      el.style.setProperty("--mouse-y", `${y}px`);

      // 3D Card Tilt coordinate scaling (max 6 degrees tilt)
      const width = rect.width;
      const height = rect.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const rotateX = ((y - centerY) / centerY) * -6;
      const rotateY = ((x - centerX) / centerX) * 6;

      el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.015, 1.015, 1.015)`;
    });

    el.addEventListener("mouseleave", () => {
      el.style.transform =
        "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    });
  });
}

// 4. Background Stardust Twinkle Canvas Overlay for Section containers
function initCosmicStardust() {
  // Target the overlay/inner content containers which are on top of solid background images
  const targets = document.querySelectorAll<HTMLElement>(
    ".memorial-overlay, .community-content",
  );

  targets.forEach((container) => {
    if (container.querySelector(".cosmic-stardust-canvas")) return;
    const canvas = document.createElement("canvas");
    canvas.className = "cosmic-stardust-canvas";
    container.insertBefore(canvas, container.firstChild);

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const stars: Star[] = [];

    const resize = () => {
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    class Star {
      x!: number;
      y!: number;
      size!: number;
      vy!: number;
      phase!: number;
      waveSpeed!: number;
      alpha!: number;
      maxAlpha!: number;
      glowColor!: string;

      constructor() {
        this.reset();
        this.y = Math.random() * canvas.height; // scatter initially
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = canvas.height + Math.random() * 20;
        this.size = Math.random() * 2.8 + 1.0; // Larger glowing stars (1.0px to 3.8px)
        this.vy = -(Math.random() * 0.45 + 0.15); // gentle floating upwards drift
        this.phase = Math.random() * Math.PI * 2; // custom wave phase offset
        this.waveSpeed = Math.random() * 0.015 + 0.005; // wave speed for sin drift
        this.alpha = Math.random() * 0.5 + 0.3; // minimum opacity start
        this.maxAlpha = Math.random() * 0.4 + 0.6; // up to 1.0 maximum
        // Glow is randomly gold or pink matches AIDOGE colors
        this.glowColor = Math.random() > 0.45 ? "345" : "30"; // pink (345) / gold (30)
      }
      update() {
        this.y += this.vy;

        // Beautiful drifting floating wave using trigonometry sine math
        this.phase += this.waveSpeed;
        this.x += Math.sin(this.phase) * 0.35;

        // Soft twinkle cycle with more vibrant amplitude
        this.alpha += (Math.random() - 0.5) * 0.04;
        if (this.alpha < 0.2) this.alpha = 0.2;
        if (this.alpha > this.maxAlpha) this.alpha = this.maxAlpha;

        if (this.y < -15 || this.x < -15 || this.x > canvas.width + 15) {
          this.reset();
        }
      }
      draw() {
        // Non-null assertion: `ctx` was already checked once above, but
        // TypeScript can't carry that narrowing into a class method body.
        ctx!.save();
        ctx!.globalAlpha = this.alpha;
        ctx!.shadowBlur = 14; // Increase shadow glow radius from 6 to 14
        ctx!.shadowColor = `hsla(${this.glowColor}, 100%, 65%, 0.85)`; // Brighter glow shadows
        ctx!.fillStyle = `hsla(${this.glowColor}, 100%, 85%, 1)`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
        ctx!.restore();
      }
    }

    // Dynamic density scaling
    const starCount = Math.floor((canvas.width * canvas.height) / 7500) + 20;
    for (let i = 0; i < starCount; i++) {
      stars.push(new Star());
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      stars.forEach((s) => {
        s.update();
        s.draw();
      });
      requestAnimationFrame(animate);
    };
    animate();
  });
}

// ============================================================================
// --- SPECIAL PREMIUM UPGRADES INITIALIZATION BLOCK ---
// ============================================================================
function initAppSecondBlock() {
  try {
    initSpatialUISound();
  } catch (err) {
    console.warn("Could not load spatial sound design:", err);
  }

  try {
    initQuantumCursor();
  } catch (err) {
    console.warn("Could not load quantum cursor:", err);
  }

  try {
    initLuminousAnalytics();
  } catch (err) {
    console.warn("Could not load burning analytics chart:", err);
  }

  try {
    initHolographicTimeline();
  } catch (err) {
    console.warn("Could not load holographic timeline:", err);
  }

  try {
    initDynamicHUDAndShadows();
  } catch (err) {
    console.warn("Could not load dynamic HUD and shadow casting:", err);
  }
}

/* ============================================================================
   FEATURE 6: SPATIAL UI SOUND DESIGN (SOUND BACKBONE)
   ============================================================================ */
let spatialAudioCtx: AudioContext | null = null;
function getSpatialAudioContext(): AudioContext {
  if (!spatialAudioCtx) {
    const AudioContextCtor = window.AudioContext || window.webkitAudioContext;
    spatialAudioCtx = new AudioContextCtor!();
  }
  if (spatialAudioCtx.state === "suspended") {
    spatialAudioCtx.resume();
  }
  return spatialAudioCtx;
}

// Helper to synthesize luxurious micro-interaction sound effects
function playSpatialUISound(type: string) {
  // Check if sound toggle is muted on the page (supports existing respect count audio config)
  const soundToggle = document.getElementById("respects-sound-toggle");
  if (soundToggle && soundToggle.classList.contains("muted")) return;

  try {
    const ctx = getSpatialAudioContext();
    const now = ctx.currentTime;

    if (type === "hover") {
      // Ultra-soft mechanical tick/zip beep
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(1400, now);
      osc.frequency.exponentialRampToValueAtTime(1900, now + 0.04);

      gain.gain.setValueAtTime(0.012, now); // extremely low volume
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } else if (type === "click") {
      // High-end mechanical key click click
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(1600, now);
      osc.frequency.setValueAtTime(400, now + 0.01);

      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.035);
    } else if (type === "tab") {
      // Beautiful spatial synthetic energy hum
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(329.63, now); // E4
      osc1.frequency.exponentialRampToValueAtTime(493.88, now + 0.18); // B4

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(164.81, now); // E3

      filter.type = "lowpass";
      filter.frequency.value = 800;

      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.22);
      osc2.stop(now + 0.22);
    }
  } catch (err) {
    // Fail silently on security restriction block
  }
}

function initSpatialUISound() {
  const attachSounds = () => {
    // Attach high-tech audio triggers to every meaningful interactive element on page
    const elements = document.querySelectorAll<HTMLElement>(
      "button, .nav-link, .social-card-btn, .table-action-btn, .chip-btn, .legend-card",
    );
    elements.forEach((el) => {
      // Guard to prevent multiple duplicate attachments
      if (el.dataset.soundBound === "true") return;
      el.dataset.soundBound = "true";

      el.addEventListener("mouseenter", () => {
        playSpatialUISound("hover");
      });

      el.addEventListener("click", () => {
        if (
          el.classList.contains("tab-btn") ||
          el.classList.contains("chip-btn") ||
          el.classList.contains("nav-link")
        ) {
          playSpatialUISound("tab");
        } else {
          playSpatialUISound("click");
        }
      });
    });
  };

  attachSounds();

  // Re-run periodically to cover dynamically spawned tables or items
  setInterval(attachSounds, 2000);
}

/* ============================================================================
   FEATURE 9: QUANTUM TARGET CURSOR RETICLE & SPARKLE TRAILS
   ============================================================================ */
function initQuantumCursor() {
  const cursor = document.getElementById("quantum-cursor");
  if (!cursor) return;

  let mouseX = 0;
  let mouseY = 0;
  const cursorX = 0;
  const cursorY = 0;
  let isMoving = false;
  let moveTimeout: ReturnType<typeof setTimeout> | undefined;

  // Track position
  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    cursor.classList.add("active");
    isMoving = true;

    // Reset moving indicator on silence
    if (moveTimeout) clearTimeout(moveTimeout);
    moveTimeout = setTimeout(() => {
      isMoving = false;
    }, 150);

    // Spawn tiny space stardust sparkles on drift
    if (Math.random() > 0.6) {
      spawnCursorSparkle(mouseX, mouseY);
    }
  });

  // Position tracking: follow the mouse coordinates instantly for 100% pixel-perfect click accuracy
  const updateCursorPosition = () => {
    cursor.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    requestAnimationFrame(updateCursorPosition);
  };
  updateCursorPosition();

  // Scale animation on click and ripple trigger
  window.addEventListener("mousedown", (e) => {
    cursor.classList.add("clicked");
    spawnClickRipple(e.clientX, e.clientY);
  });
  window.addEventListener("mouseup", () => {
    cursor.classList.remove("clicked");
  });

  // Mobile support: hide reticle on touch
  window.addEventListener("touchstart", () => {
    cursor.classList.remove("active");
  });

  function spawnCursorSparkle(x: number, y: number) {
    const sparkle = document.createElement("div");
    sparkle.className = "quantum-sparkle";

    // Randomize colors (cyan or pink matches AIDoge)
    const isPink = Math.random() > 0.5;
    sparkle.style.color = isPink ? "#ff2a5f" : "#00f0ff";
    sparkle.style.backgroundColor = isPink
      ? "rgba(255, 42, 95, 0.85)"
      : "rgba(0, 240, 255, 0.85)";

    const size = Math.random() * 3 + 2; // 2px to 5px
    sparkle.style.width = `${size}px`;
    sparkle.style.height = `${size}px`;
    sparkle.style.left = `${x}px`;
    sparkle.style.top = `${y}px`;

    // Drift direction
    const dx = (Math.random() - 0.5) * 45;
    const dy = (Math.random() - 0.5) * 45 + 15; // float downwards slightly
    sparkle.style.setProperty("--dx", `${dx}px`);
    sparkle.style.setProperty("--dy", `${dy}px`);

    document.body.appendChild(sparkle);
    setTimeout(() => sparkle.remove(), 600);
  }

  function spawnClickRipple(x: number, y: number) {
    const ripple = document.createElement("div");
    ripple.className = "quantum-click-ripple";
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;

    document.body.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  }
}

/* ============================================================================
   FEATURE 8: LUMINOUS BURNING ANALYTICS (GLOW CHIP GRAPH)
   ============================================================================ */
interface ChartParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  life: number;
  decay: number;
}

function initLuminousAnalytics() {
  const canvas = document.getElementById(
    "luminous-burn-chart",
  ) as HTMLCanvasElement | null;
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  let width = canvas.offsetWidth;
  let height = canvas.offsetHeight;
  canvas.width = width * window.devicePixelRatio;
  canvas.height = height * window.devicePixelRatio;
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

  let buyPressure = 0;
  let particles: ChartParticle[] = [];

  // Get current burn count in Quadrillions from the global BigInt
  const getRespectsNum = () => {
    const currentBig = window.aidogeRespectCount || 22974464256141700n;
    return Number(currentBig) / 1e15; // e.g. 22.9744...
  };

  const initialBig = window.aidogeRespectCount || 22974464256141700n;
  let smoothedRespects = Number(initialBig) / 1e15;

  // Initialize sliding window of 18 points representing recent burn history
  const numPoints = 18;
  const chartHistoryPoints: number[] = [];
  const startVal = smoothedRespects - 0.2;
  for (let i = 0; i < numPoints; i++) {
    const ratio = i / (numPoints - 1);
    const noise = Math.sin(i * 1.5) * 0.003;
    chartHistoryPoints.push(
      startVal + (smoothedRespects - startVal) * Math.pow(ratio, 1.2) + noise,
    );
  }

  // Active scrolling: push a new organic live value and shift out the oldest every 1.5 seconds
  setInterval(() => {
    const rVal = getRespectsNum();
    // Add micro-noise to make it look like active global decentralized updates
    const noise = (Math.random() - 0.45) * 0.0015;
    chartHistoryPoints.push(rVal + noise);
    chartHistoryPoints.shift();
  }, 1500);

  // Monitor clicks on respects burner to inject dynamic spikes and particle flows
  const burnRespectsBtn = document.getElementById("burn-respects-btn");
  if (burnRespectsBtn) {
    burnRespectsBtn.addEventListener("click", () => {
      triggerChartBurnSpike();
    });
  }

  // Handle keyboard shortcut F key respects click
  window.addEventListener("keydown", (e) => {
    if (e.key === "f" || e.key === "F") {
      // Check if inputs are focused to prevent annoying shortcuts
      if (
        document.activeElement?.tagName === "INPUT" ||
        document.activeElement?.tagName === "TEXTAREA"
      )
        return;
      triggerChartBurnSpike();
    }
  });

  function triggerChartBurnSpike() {
    // Generate explosive buy pressure surge
    buyPressure += 0.035;
    if (buyPressure > 0.22) buyPressure = 0.22; // cap to prevent spilling out

    const rVal = getRespectsNum();
    chartHistoryPoints[chartHistoryPoints.length - 1] = rVal; // update latest base value instantly

    // Spawn rich glowing cyber particles shooting off the current value point
    for (let i = 0; i < 20; i++) {
      particles.push({
        x: width - 15,
        y: height * 0.35, // starting coordinate, will align beautifully
        vx: -Math.random() * 4.0 - 1.5,
        vy: (Math.random() - 0.5) * 5.0,
        size: Math.random() * 3 + 1.5,
        color: Math.random() > 0.45 ? "#00f0ff" : "#ff2a5f",
        alpha: 1.0,
        life: 1.0,
        decay: Math.random() * 0.025 + 0.015,
      });
    }
  }

  // Main drawing loop
  const drawChart = () => {
    if (!canvas || !ctx) return;

    // Handle resizes smoothly
    const parentEl = canvas.parentNode as HTMLElement | null;
    if (!parentEl) return;
    const currentWidth = parentEl.clientWidth;
    const currentHeight = parentEl.clientHeight;
    if (currentWidth !== width || currentHeight !== height) {
      width = currentWidth;
      height = currentHeight;
      canvas.width = width * window.devicePixelRatio;
      canvas.height = height * window.devicePixelRatio;
      ctx.resetTransform();
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
    }

    ctx.clearRect(0, 0, width, height);

    // Smoothly decay transient buy pressure on each frame
    if (buyPressure > 0) {
      buyPressure *= 0.94;
    }

    const currentBig = window.aidogeRespectCount || 22974464256141700n;
    const respectsNum = getRespectsNum();

    // LERP to smooth the numeric displayed value
    smoothedRespects += (respectsNum - smoothedRespects) * 0.08;

    // Synchronize to razor-sharp HTML HUD labels
    const burnedValEl = document.getElementById("live-chart-burned-val");
    const burnedPctEl = document.getElementById("live-chart-burned-pct");
    if (burnedValEl) {
      burnedValEl.textContent = `${smoothedRespects.toFixed(6)}Q`;
    }
    if (burnedPctEl) {
      const percentBurned = (
        (Number(currentBig) / 210000000000000000) *
        100
      ).toFixed(6);
      burnedPctEl.textContent = `(${percentBurned}%)`;
    }

    const time = Date.now();

    // 1. Draw Dotted Cybergrid Lines
    ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
    ctx.lineWidth = 1;
    ctx.setLineDash([4, 4]);

    // Horizontals
    for (let y = 15; y < height; y += 22) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
    // Verticals
    for (let x = 20; x < width; x += 35) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    ctx.setLineDash([]); // Reset line dashes

    // Calculate dynamic auto-scaling Y boundaries to let the line fill the viewport beautifully
    const minVal = Math.min(...chartHistoryPoints);
    let maxVal = Math.max(...chartHistoryPoints);
    if (buyPressure > 0) {
      maxVal = Math.max(maxVal, respectsNum + buyPressure);
    }

    const range = maxVal - minVal;
    const padding = range * 0.15 || 0.005;
    const yMin = minVal - padding;
    const yMax = maxVal + padding;

    const marginX = 10;
    const spacingX = (width - marginX * 2) / (numPoints - 1);

    // Compute coordinate points
    const points = chartHistoryPoints.map((val, idx) => {
      const x = marginX + idx * spacingX;

      let valWithPressure = val;
      // Add buy pressure curve to the tail end of the trendline
      if (idx === numPoints - 1) {
        valWithPressure += buyPressure;
      } else if (idx === numPoints - 2) {
        valWithPressure += buyPressure * 0.65;
      } else if (idx === numPoints - 3) {
        valWithPressure += buyPressure * 0.3;
      }

      // Add dynamic micro-vibration so the chart feels live, vibrant, and energetic
      const vibration = Math.sin(time * 0.008 + idx * 0.7) * (range * 0.008);
      valWithPressure += vibration;

      const pct = (valWithPressure - yMin) / (yMax - yMin);

      // Map percentage to vertical height (invert Y because smaller Y is higher up)
      let y = height - (pct * height * 0.72 + height * 0.14);
      y = Math.max(10, Math.min(height - 10, y));
      return { x, y };
    });

    // 2. Draw Glow Filled Gradient Area Underneath Chart
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, "rgba(255, 42, 95, 0.28)");
    gradient.addColorStop(0.5, "rgba(0, 240, 255, 0.1)");
    gradient.addColorStop(1, "rgba(0, 240, 255, 0)");

    ctx.beginPath();
    ctx.moveTo(marginX, height);
    points.forEach((p) => {
      ctx.lineTo(p.x, p.y);
    });
    ctx.lineTo(points[points.length - 1].x, height);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // 3. Draw Luminous Trendline
    const isSpiked = buyPressure > 0.05;
    ctx.shadowBlur = isSpiked ? 15 : 8;
    ctx.shadowColor = isSpiked
      ? "rgba(0, 240, 255, 1)"
      : "rgba(255, 42, 95, 0.85)";
    ctx.strokeStyle = isSpiked ? "#00f0ff" : "#ff2a5f";
    ctx.lineWidth = 2.4;

    ctx.beginPath();
    points.forEach((p, idx) => {
      if (idx === 0) {
        ctx.moveTo(p.x, p.y);
      } else {
        // Curve fit utilizing cubic-interpolation approximation
        const prev = points[idx - 1];
        const cpX1 = prev.x + spacingX * 0.5;
        const cpY1 = prev.y;
        const cpX2 = prev.x + spacingX * 0.5;
        const cpY2 = p.y;
        ctx.bezierCurveTo(cpX1, cpY1, cpX2, cpY2, p.x, p.y);
      }
    });
    ctx.stroke();

    // 4. Update and Render Particle Sparks (Ember Flow)
    const lastP = points[points.length - 1];

    // Ambient micro-ember release from the live endpoint
    if (Math.random() < 0.25) {
      particles.push({
        x: lastP.x,
        y: lastP.y,
        vx: -Math.random() * 2 - 0.5,
        vy: (Math.random() - 0.5) * 1.5,
        size: Math.random() * 2 + 1,
        color: "#00f0ff",
        alpha: 0.8,
        life: 1.0,
        decay: Math.random() * 0.04 + 0.02,
      });
    }

    ctx.shadowBlur = 0;
    particles = particles.filter((p) => p.life > 0);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;
      ctx.fillStyle = p.color;
      ctx.globalAlpha = Math.max(0, p.life);
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.globalAlpha = 1.0; // reset transparency

    // 5. Draw Glowing endpoint Target Node
    ctx.shadowBlur = 12;
    ctx.shadowColor = "#00f0ff";
    ctx.fillStyle = "#ffffff";
    ctx.beginPath();
    ctx.arc(lastP.x, lastP.y, 4.5, 0, Math.PI * 2);
    ctx.fill();

    const pulseRadius = 5 + Math.sin(time * 0.008) * 3.5;
    ctx.strokeStyle = "rgba(0, 240, 255, 0.7)";
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.arc(lastP.x, lastP.y, pulseRadius, 0, Math.PI * 2);
    ctx.stroke();

    ctx.shadowBlur = 0; // reset shadow glow

    requestAnimationFrame(drawChart);
  };

  drawChart();
}

/* ============================================================================
   FEATURE 7: INTERACTIVE HOLOGRAPHIC TIMELINE SCROLL DECODER
   ============================================================================ */
function initHolographicTimeline() {
  const nodes = document.querySelectorAll(".scroll-reveal-node");
  if (nodes.length === 0) return;

  // Intersection Observer for scroll tricker trigger
  const observerOptions = {
    root: null,
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const node = entry.target;
        node.classList.add("visible");

        // Trigger cyber sound sweep
        playSpatialUISound("tab");

        // Trigger dynamic glitch and typing effect on card
        triggerCardDecryption(node);

        // Stop observing once loaded to avoid constant typing trigger
        observer.unobserve(node);
      }
    });
  }, observerOptions);

  nodes.forEach((n) => observer.observe(n));

  function triggerCardDecryption(node: Element) {
    const descEl = node.querySelector(".node-desc");
    const titleEl = node.querySelector(".node-title");
    const headerEl = node.querySelector(".node-glitch-header");

    // 1. Digital glitch text scramble on headers
    if (titleEl) {
      scrambleText(titleEl.textContent, titleEl, 12);
    }
    if (headerEl) {
      scrambleText(headerEl.textContent, headerEl, 8);
    }

    // 2. Real-time dynamic typewriter typing
    if (descEl) {
      const fullText = descEl.getAttribute("data-text") || descEl.textContent;
      descEl.textContent = "";

      let i = 0;
      const type = () => {
        if (i < fullText.length) {
          descEl.innerHTML += fullText.charAt(i);
          i++;
          setTimeout(type, 12); // fast futuristic typing
        }
      };
      // Short offset for aesthetics
      setTimeout(type, 200);
    }
  }

  // Glitch characters list
  const glyphs = "01_X_#_[_]_/_*_&_@_%_$_?_!";
  function scrambleText(originalText: string, element: Element, steps = 10) {
    let iteration = 0;
    const interval = setInterval(() => {
      element.textContent = originalText
        .split("")
        .map((char, index) => {
          if (index < iteration) {
            return originalText[index];
          }
          return glyphs[Math.floor(Math.random() * glyphs.length)];
        })
        .join("");

      if (iteration >= originalText.length) {
        clearInterval(interval);
        element.textContent = originalText; // restore exact
      }
      iteration += originalText.length / steps;
    }, 40);
  }
}

/* ============================================================================
   FEATURE 10: SOLAR SHADOWS & FEATURE 11: HUD RADAR NAVIGATION
   ============================================================================ */
function initDynamicHUDAndShadows() {
  const cards = document.querySelectorAll<HTMLElement>(
    ".altar-card, .viewer-screen, .social-card, .stat-card, .legend-card, .terminal-container, .tax-dashboard-container, .node-card",
  );
  const radar = document.getElementById("hud-radar");
  const radarCoord = document.getElementById("radar-coord-val");
  const radarSector = document.getElementById("radar-sector-val");

  let mouseX = 0;
  let mouseY = 0;
  let scrollY = window.scrollY;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // --- FEATURE 11: UPDATE RADAR COORDINATES FROM MOUSE ---
    if (radarCoord) {
      // Map coordinates to 000-999 bounds relative to viewport
      const pctX = Math.round((mouseX / window.innerWidth) * 999);
      const pctY = Math.round((mouseY / window.innerHeight) * 999);
      radarCoord.textContent = `X:${pctX.toString().padStart(3, "0")} Y:${pctY.toString().padStart(3, "0")}`;
    }

    // --- FEATURE 10: DYNAMIC SOLAR SHADOW MAPPING ---
    cards.forEach((card) => {
      const rect = card.getBoundingClientRect();
      const cardCX = rect.left + rect.width / 2;
      const cardCY = rect.top + rect.height / 2;

      // Delta vector from cursor to card center
      const dx = cardCX - mouseX;
      const dy = cardCY - mouseY;

      // Compute distance and angle
      const dist = Math.sqrt(dx * dx + dy * dy);
      const maxDist = 700;
      const scaleOffset = Math.min(dist / maxDist, 1.0) * 10; // Max 10px offset shadows

      const angle = Math.atan2(dy, dx);
      const sx = Math.cos(angle) * scaleOffset;
      const sy = Math.sin(angle) * scaleOffset;

      // Card specific lighting themes
      let glowColor = "rgba(0, 240, 255, 0.18)"; // Cyan
      if (
        card.classList.contains("altar-card") ||
        card.classList.contains("node-card") ||
        card.classList.contains("social-card")
      ) {
        glowColor = "rgba(255, 42, 95, 0.18)"; // Pink
      }

      // Dynamic shadow update on element
      card.style.boxShadow = `${sx}px ${sy}px 25px ${glowColor}, inset 0 0 15px rgba(255, 255, 255, 0.03)`;
    });
  });

  // --- FEATURE 11: HUD RADAR ACTIVE SECTOR TRACKING ---
  const sectors = [
    { id: "SECTOR_MEMOR", el: document.getElementById("memorial-board") },
    {
      id: "SECTOR_CHRONO",
      el: document.getElementById("memory-timeline-section"),
    },
    { id: "SECTOR_TERMINAL", el: document.getElementById("token-terminal") },
    { id: "SECTOR_TAX_ENG", el: document.getElementById("tax-dashboard") },
    { id: "SECTOR_SOCIAL", el: document.getElementById("community-box") },
  ];

  const updateRadarActiveSector = () => {
    const viewportHeightCenter = window.innerHeight / 2;
    let closestSector = "SECTOR_VOID";
    let minDistance = Infinity;

    sectors.forEach((sec) => {
      if (!sec.el) return;
      const rect = sec.el.getBoundingClientRect();
      const elementCenterY = rect.top + rect.height / 2;
      const dist = Math.abs(viewportHeightCenter - elementCenterY);

      if (dist < minDistance) {
        minDistance = dist;
        closestSector = sec.id;
      }
    });

    // Default fallbacks for specific pages
    if (closestSector === "SECTOR_VOID") {
      closestSector = document.getElementById("community-box")
        ? "SECTOR_SOCIAL"
        : "SECTOR_HOME";
    }

    if (radarSector && radarSector.textContent !== closestSector) {
      radarSector.textContent = closestSector;
      // Trigger subtle chime beep on sector change
      playSpatialUISound("hover");
    }
  };

  // Run on scroll and resize
  window.addEventListener("scroll", () => {
    scrollY = window.scrollY;
    updateRadarActiveSector();
  });
  window.addEventListener("resize", updateRadarActiveSector);

  // Initial run
  updateRadarActiveSector();
}
