{
  const hero = document.querySelector('.hero-stage');
  const canvas = hero.querySelector('.stage-water');
  const avatar = hero.querySelector('.avatar-button');
  const greeting = hero.querySelector('.avatar-greeting');
  const pointer = [-2, -2];
  const rippleCount = 14;
  const ripples = new Float32Array(rippleCount * 4);
  const now = () => performance.now() / 1000;
  const paused = () => hero.hasAttribute('data-paused');
  let nextRipple = 0;
  let lastMove = 0;
  let lastPointerTime = 0;
  let waveTimer;
  let glanceTimer;

  function addRipple(x, y, strength, time) {
    ripples.set([x, y, time, strength], nextRipple * 4);
    nextRipple = (nextRipple + 1) % rippleCount;
    const delay = Math.hypot((x - .5) * hero.clientWidth, (y - .75) * hero.clientHeight);
    if (delay > 220 || strength < .45) return;
    clearTimeout(glanceTimer);
    glanceTimer = setTimeout(() => {
      if (!paused()) {
        avatar.style.setProperty('--dip', '6px');
        avatar.style.setProperty('--head-pitch', '-7deg');
        glanceTimer = setTimeout(() => {
          avatar.style.removeProperty('--dip');
          avatar.style.removeProperty('--head-pitch');
        }, 420);
      }
    }, Math.min(420, delay * 2));
  }

  function point(event) {
    const rect = hero.getBoundingClientRect();
    return [(event.clientX - rect.left) / rect.width, (event.clientY - rect.top) / rect.height];
  }

  hero.addEventListener('pointermove', event => {
    if (paused() || event.pointerType === 'touch') return;
    const [x, y] = point(event);
    const time = now();
    const dx = x - pointer[0];
    const dy = y - pointer[1];
    const speed = pointer[0] < 0 ? 0 : Math.hypot(dx * hero.clientWidth, dy * hero.clientHeight) / Math.max(16, (time - lastPointerTime) * 1000);
    lastPointerTime = time;
    if (time - lastMove > .075 && (pointer[0] < 0 || Math.hypot(dx, dy) > .003)) {
      addRipple(x, y, .17 + Math.min(speed, 2) * .23, time);
      lastMove = time;
    }
    pointer[0] = x;
    pointer[1] = y;
    avatar.style.setProperty('--head-yaw', `${(x - .5) * 17}deg`);
    avatar.style.setProperty('--head-tilt', `${(x - .5) * 8}deg`);
    avatar.style.setProperty('--eye-x', `${(x - .5) * 42}%`);
    avatar.style.setProperty('--eye-y', `${(y - .55) * 36}%`);
    avatar.style.setProperty('--eye-dx', `${(x - .5) * 9}%`);
    avatar.style.setProperty('--eye-dy', `${(y - .55) * 8}%`);
  }, { passive: true });

  function clearLook() {
    pointer.fill(-2);
    avatar.removeAttribute('style');
  }
  hero.addEventListener('pointerleave', clearLook);
  hero.addEventListener('click', event => {
    if (paused() || event.detail === 0 || event.target.closest('.stage-toggle, dialog')) return;
    addRipple(...point(event), 1.2, now());
  });

  function blink() {
    if (!paused() && !document.hidden && !avatar.hasAttribute('data-waving')) {
      avatar.setAttribute('data-blink', '');
      setTimeout(() => avatar.removeAttribute('data-blink'), 125);
    }
    setTimeout(blink, 3100 + Math.random() * 1800);
  }
  setTimeout(blink, 2200);
  avatar.addEventListener('click', () => {
    greeting.textContent = 'Hi, I’m Mini Q!';
    if (!paused()) avatar.setAttribute('data-waving', '');
    clearTimeout(waveTimer);
    waveTimer = setTimeout(() => {
      avatar.removeAttribute('data-waving');
      greeting.textContent = '';
    }, 1500);
  });

  const gl = canvas.getContext('webgl', { alpha: false, antialias: false });
  if (gl) {
    const vertex = `
      attribute vec2 position;
      varying vec2 uv;
      void main() {
        uv = position * .5 + .5;
        uv.y = 1. - uv.y;
        gl_Position = vec4(position, 0., 1.);
      }
    `;
    const fragment = `
      #ifdef GL_FRAGMENT_PRECISION_HIGH
      precision highp float;
      #else
      precision mediump float;
      #endif
      varying vec2 uv;
      uniform sampler2D water;
      uniform vec2 crop;
      uniform vec2 pointer;
      uniform float aspect;
      uniform float time;
      uniform float motionTime;
      uniform vec4 ripples[14];
      void main() {
        vec2 metric = vec2(aspect, 1.);
        vec2 p = uv * metric;
        vec2 offset = vec2(
          sin(p.y*18. + motionTime*.65) + .55*sin(p.x*15. + p.y*11. - motionTime*.75),
          cos(p.x*15. - motionTime*.65) + .5*sin(p.y*21. + p.x*8. + motionTime*.46)
        ) * .0031;
        vec2 cursor = (uv-pointer)*metric;
        float nearCursor = exp(-dot(cursor,cursor)*100.);
        offset += cursor / max(.022, length(cursor)) * nearCursor * .006;
        float shimmer = 0.;
        for (int i = 0; i < 14; i++) {
          vec4 r = ripples[i];
          float age = time-r.z;
          vec2 d = (uv-r.xy)*metric;
          float len = length(d);
          float band = len-age*.44;
          float spread = .026 + age*.043;
          float envelope = exp(-(band/spread)*(band/spread));
          float damping = smoothstep(0., .035, age) * (1.-smoothstep(.28, 1.65, age));
          float wave = sin(band*112.) * envelope * damping * r.w;
          offset += d/max(len,.022) * wave*.037;
          shimmer += wave*.095;
        }
        vec2 sampleAt = ((uv-.5) + offset/metric)*crop*.98+.5;
        vec3 color = texture2D(water, sampleAt).rgb;
        color += vec3(.60,.85,.89) * (shimmer + nearCursor*.018);
        gl_FragColor = vec4(color,1.);
      }
    `;
    const program = gl.createProgram();
    for (const [type, code] of [[gl.VERTEX_SHADER, vertex], [gl.FRAGMENT_SHADER, fragment]]) {
      const shader = gl.createShader(type);
      gl.shaderSource(shader, code);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) console.warn(gl.getShaderInfoLog(shader));
      gl.attachShader(program, shader);
      gl.deleteShader(shader);
    }
    gl.linkProgram(program);
    if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
      gl.useProgram(program);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const position = gl.getAttribLocation(program, 'position');
      gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(position);
      gl.bindTexture(gl.TEXTURE_2D, gl.createTexture());
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      const uniforms = Object.fromEntries(['crop', 'aspect', 'pointer', 'time', 'motionTime', 'ripples[0]']
        .map(name => [name, gl.getUniformLocation(program, name)]));
      const texture = new Image();
      texture.src = 'assets/hero-water.jpg';
      texture.decode().then(() => {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, texture);
        let visible = true;
        let frame = 0;
        let previousTime = now();
        let motionTime = 0;
        const shouldAnimate = () => !paused() && visible && !document.hidden;
        function draw() {
          frame = 0;
          const time = now();
          if (shouldAnimate()) motionTime += Math.min(time - previousTime, .05);
          previousTime = time;
          gl.uniform1f(uniforms.time, time);
          gl.uniform1f(uniforms.motionTime, motionTime);
          gl.uniform2fv(uniforms.pointer, pointer);
          gl.uniform4fv(uniforms['ripples[0]'], ripples);
          gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
          if (shouldAnimate()) frame = requestAnimationFrame(draw);
        }
        function sync() {
          cancelAnimationFrame(frame);
          draw();
        }
        function resize() {
          const ratio = Math.min(1.35, devicePixelRatio);
          canvas.width = Math.max(1, Math.round(canvas.clientWidth * ratio));
          canvas.height = Math.max(1, Math.round(canvas.clientHeight * ratio));
          gl.viewport(0, 0, canvas.width, canvas.height);
          const aspect = canvas.width / canvas.height;
          const imageAspect = texture.naturalWidth / texture.naturalHeight;
          gl.uniform1f(uniforms.aspect, aspect);
          gl.uniform2f(uniforms.crop, Math.min(1, aspect / imageAspect), Math.min(1, imageAspect / aspect));
          sync();
        }
        new ResizeObserver(resize).observe(hero);
        new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; sync(); }).observe(hero);
        new MutationObserver(() => {
          if (paused()) {
            clearLook();
            ripples.fill(0);
            avatar.removeAttribute('data-waving');
            avatar.removeAttribute('data-blink');
          }
          sync();
        }).observe(hero, { attributes: true, attributeFilter: ['data-paused'] });
        document.addEventListener('visibilitychange', sync);
        canvas.addEventListener('webglcontextlost', () => {
          visible = false;
          cancelAnimationFrame(frame);
          canvas.removeAttribute('data-ready');
        });
        resize();
        canvas.setAttribute('data-ready', '');
      }).catch(() => {});
    }
  }
}

{
  const phone = document.querySelector('.stage-phone');
  const dialog = document.querySelector('#mini-q-call');
  const status = dialog.querySelector('.call-status');
  const slot = dialog.querySelector('.call-slot');
  const fallback = dialog.querySelector('.call-fallback');
  let request;

  phone.addEventListener('click', async () => {
    dialog.showModal();
    status.textContent = 'Connecting to Runway…';
    fallback.hidden = true;
    const controller = new AbortController();
    request = controller;
    const timeout = setTimeout(() => controller.abort(), 7000);
    try {
      const page = await fetch('mini-q-call.html', { signal: controller.signal });
      if (!page.ok) throw new Error('Call page unavailable');
      const markup = new DOMParser().parseFromString(await page.text(), 'text/html');
      const key = markup.querySelector('script[data-pub-key]').dataset.pubKey;
      const check = await fetch('https://api.dev.runwayml.com/v1/embeds/validate', {
        headers: { Authorization: `Bearer ${key}` },
        signal: controller.signal,
      });
      if (!check.ok || !(await check.json()).valid) throw new Error('Runway origin unavailable');
      if (!dialog.open || request !== controller) return;
      const frame = document.createElement('iframe');
      frame.src = 'mini-q-call.html';
      frame.title = 'Mini Q video call powered by Runway';
      frame.allow = 'camera; microphone; autoplay';
      slot.replaceChildren(frame);
      status.textContent = '';
    } catch {
      if (dialog.open && request === controller) {
        status.textContent = 'Live calling is unavailable at this address. You can open the original call page.';
        fallback.hidden = false;
      }
    } finally {
      clearTimeout(timeout);
    }
  });
  dialog.addEventListener('close', () => {
    request?.abort();
    request = undefined;
    slot.replaceChildren();
  });
}
