/**
 * АТЕЛЬЕ VESTA — 3D Архитектурный павильон лофта
 * Высокоточная визуализация интерьера в Three.js
 * Натуральный дневной свет, контактные тени, французский паркет и тактильные материалы.
 */

(function () {
  'use strict';

  function waitForThree() {
    if (typeof THREE === 'undefined') {
      setTimeout(waitForThree, 50);
      return;
    }
    initArchitecturalStage();
  }

  function initArchitecturalStage() {
    const canvas = document.getElementById('stageCanvas');
    if (!canvas) return;

    const container = canvas.parentElement;
    let width = container.clientWidth;
    let height = container.clientHeight;

    // Сцена и рендерер
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xE8E3D9);

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.set(6.2, 4.2, 7.5);

    const renderer = new THREE.WebGLRenderer({
      canvas: canvas,
      antialias: true,
      powerPreference: 'high-performance'
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;

    // Переменные состояния сцены
    const state = {
      wood: 'oak',
      fabric: 'boucle',
      stone: 'travertine',
      lighting: 'daylight',
      sofaShape: 'chaise', // chaise / straight
      cameraTarget: new THREE.Vector3(0, 0.6, 0),
      cameraDesiredPos: new THREE.Vector3(6.2, 4.2, 7.5),
      cameraLookAt: new THREE.Vector3(0, 0.6, 0),
      isDragging: false
    };

    // Материалы и палитра
    const colorTokens = {
      oak: 0xD3B890,
      walnut: 0x5C4033,
      ash: 0x282624,
      boucle: 0xEDE9E1,
      linen: 0xD6CEBF,
      leather: 0x8C4E3A,
      travertine: 0xDFD7C7,
      nero: 0x222222,
      brass: 0xA6824B,
      blackMetal: 0x1A1918,
      wallColor: 0xEEE9E0,
      floorWood: 0xC9AF8C
    };

    // Создание текстуры французского паркета «шеврон»
    function createParquetTexture() {
      const cvs = document.createElement('canvas');
      cvs.width = 1024;
      cvs.height = 1024;
      const ctx = cvs.getContext('2d');

      ctx.fillStyle = '#C4A987';
      ctx.fillRect(0, 0, 1024, 1024);

      // Планки паркета
      const plankW = 64;
      const plankH = 256;
      ctx.strokeStyle = 'rgba(70, 50, 30, 0.15)';
      ctx.lineWidth = 1.5;

      for (let y = 0; y < 1024; y += plankH) {
        for (let x = 0; x < 1024; x += plankW) {
          // Естественная вариация оттенков досок
          const grainShift = (Math.sin(x * 12 + y * 7) * 0.5 + 0.5) * 16 - 8;
          ctx.fillStyle = `rgb(${196 + grainShift}, ${169 + grainShift * 0.9}, ${135 + grainShift * 0.8})`;
          ctx.fillRect(x, y, plankW, plankH);
          ctx.strokeRect(x, y, plankW, plankH);

          // Легкие волокна дерева
          ctx.fillStyle = 'rgba(60, 40, 20, 0.04)';
          for (let k = 0; k < 6; k++) {
            ctx.fillRect(x, y + k * 42, plankW, 2);
          }
        }
      }

      const tex = new THREE.CanvasTexture(cvs);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(5, 5);
      return tex;
    }

    const parquetTex = createParquetTexture();

    // =========================================================================
    // АРХИТЕКТУРА ЛОФТА (СТЕНЫ, ПОЛ, ОКНА В ПОЛ)
    // =========================================================================
    const roomGroup = new THREE.Group();
    scene.add(roomGroup);

    // Пол
    const floorGeo = new THREE.PlaneGeometry(16, 16);
    const floorMat = new THREE.MeshStandardMaterial({
      map: parquetTex,
      roughness: 0.42,
      metalness: 0.05
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    roomGroup.add(floor);

    // Задняя стена
    const backWallGeo = new THREE.PlaneGeometry(16, 8);
    const wallMat = new THREE.MeshStandardMaterial({
      color: colorTokens.wallColor,
      roughness: 0.88,
      metalness: 0.02
    });
    const backWall = new THREE.Mesh(backWallGeo, wallMat);
    backWall.position.set(0, 4, -5.5);
    backWall.receiveShadow = true;
    roomGroup.add(backWall);

    // Правая стена с простенком
    const rightWall = new THREE.Mesh(new THREE.PlaneGeometry(16, 8), wallMat);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(8, 4, 2.5);
    rightWall.receiveShadow = true;
    roomGroup.add(rightWall);

    // Левое панорамное окно в пол (Стальная рама и стекло)
    const windowFrameMat = new THREE.MeshStandardMaterial({
      color: colorTokens.blackMetal,
      roughness: 0.6
    });

    const windowGroup = new THREE.Group();
    windowGroup.position.set(-6.5, 0, 0);

    // Рамы окна
    const mullionGeoY = new THREE.BoxGeometry(0.08, 6.5, 0.08);
    const mullionGeoX = new THREE.BoxGeometry(0.08, 0.08, 8);

    [-3, -1, 1, 3].forEach(z => {
      const mullion = new THREE.Mesh(mullionGeoY, windowFrameMat);
      mullion.position.set(0, 3.25, z);
      mullion.castShadow = true;
      windowGroup.add(mullion);
    });

    [0.1, 2.2, 4.4, 6.4].forEach(y => {
      const mullion = new THREE.Mesh(mullionGeoX, windowFrameMat);
      mullion.position.set(0, y, 0);
      mullion.castShadow = true;
      windowGroup.add(mullion);
    });

    // Светлый фон за окном (терраса лофта)
    const outdoorBackdrop = new THREE.Mesh(
      new THREE.PlaneGeometry(24, 12),
      new THREE.MeshBasicMaterial({ color: 0xECE5D8 })
    );
    outdoorBackdrop.rotation.y = Math.PI / 2;
    outdoorBackdrop.position.set(-8.5, 5, 0);
    windowGroup.add(outdoorBackdrop);

    roomGroup.add(windowGroup);

    // Шерстяной ковер ручной вязки
    const rugGeo = new THREE.BoxGeometry(5.2, 0.02, 3.8);
    const rugMat = new THREE.MeshStandardMaterial({
      color: 0xDDD6C8,
      roughness: 0.95,
      metalness: 0.0
    });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.position.set(0.2, 0.01, 0.4);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    // Контактная тень под мебелью (мягкий градиентный шейдер)
    function makeSoftContactShadow(w, d) {
      const cvs = document.createElement('canvas');
      cvs.width = 256;
      cvs.height = 256;
      const ctx = cvs.getContext('2d');
      const grad = ctx.createRadialGradient(128, 128, 20, 128, 128, 124);
      grad.addColorStop(0, 'rgba(18, 16, 14, 0.55)');
      grad.addColorStop(0.5, 'rgba(18, 16, 14, 0.2)');
      grad.addColorStop(1, 'rgba(18, 16, 14, 0)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 256, 256);

      const tex = new THREE.CanvasTexture(cvs);
      const geo = new THREE.PlaneGeometry(w, d);
      const mat = new THREE.MeshBasicMaterial({
        map: tex,
        transparent: true,
        depthWrite: false
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = -Math.PI / 2;
      mesh.position.y = 0.015;
      return mesh;
    }

    const sofaShadow = makeSoftContactShadow(4.2, 2.8);
    sofaShadow.position.set(0.1, 0.015, -0.3);
    roomGroup.add(sofaShadow);

    const tableShadow = makeSoftContactShadow(2.2, 1.6);
    tableShadow.position.set(0.3, 0.015, 0.8);
    roomGroup.add(tableShadow);

    // =========================================================================
    // 2. СВЕТ И АТМОСФЕРА (УТРО / ЗОЛОТОЙ ЧАС / ВЕЧЕР)
    // =========================================================================
    const ambientLight = new THREE.AmbientLight(0xFFFBF2, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFF5E6, 2.2);
    sunLight.position.set(-8, 7.5, 2.5);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 25;
    sunLight.shadow.camera.left = -6;
    sunLight.shadow.camera.right = 6;
    sunLight.shadow.camera.top = 6;
    sunLight.shadow.camera.bottom = -6;
    sunLight.shadow.bias = -0.0004;
    scene.add(sunLight);

    // Мягкий рассеянный заполняющий свет из противоположного угла
    const bounceLight = new THREE.DirectionalLight(0xEAE4D8, 0.6);
    bounceLight.position.set(6, 4, 5);
    scene.add(bounceLight);

    // Локальный теплый свет лампы
    const lampLight = new THREE.PointLight(0xFFDF9E, 0, 4);
    lampLight.position.set(2.8, 2.1, -0.6);
    scene.add(lampLight);

    function applyLightingMode(mode) {
      state.lighting = mode;
      if (mode === 'daylight') {
        scene.background.setHex(0xE8E3D9);
        ambientLight.color.setHex(0xFFFBF2);
        ambientLight.intensity = 0.8;
        sunLight.color.setHex(0xFFF6EA);
        sunLight.intensity = 2.4;
        sunLight.position.set(-8, 7.5, 2.5);
        bounceLight.intensity = 0.6;
        lampLight.intensity = 0;
        renderer.toneMappingExposure = 1.15;
      } else if (mode === 'golden') {
        scene.background.setHex(0xD4C7B5);
        ambientLight.color.setHex(0xFCE6CC);
        ambientLight.intensity = 0.65;
        sunLight.color.setHex(0xFFAA55);
        sunLight.intensity = 3.2;
        sunLight.position.set(-9, 4.0, 1.2);
        bounceLight.intensity = 0.4;
        lampLight.intensity = 0.5;
        renderer.toneMappingExposure = 1.25;
      } else if (mode === 'nocturne') {
        scene.background.setHex(0x1F1C18);
        ambientLight.color.setHex(0x3B352E);
        ambientLight.intensity = 0.35;
        sunLight.color.setHex(0x556688);
        sunLight.intensity = 0.4;
        sunLight.position.set(-6, 8, 4);
        bounceLight.intensity = 0.15;
        lampLight.intensity = 2.6;
        renderer.toneMappingExposure = 1.4;
      }
    }

    // =========================================================================
    // 3. АРХИТЕКТУРНАЯ МЕБЕЛЬ (СКУЛЬПТУРНЫЕ ОБЪЕКТЫ)
    // =========================================================================
    const furnitureGroup = new THREE.Group();
    scene.add(furnitureGroup);

    // Материалы моделей
    let currentWoodMat = new THREE.MeshStandardMaterial({
      color: colorTokens[state.wood],
      roughness: 0.38,
      metalness: 0.04
    });

    let currentFabricMat = new THREE.MeshStandardMaterial({
      color: colorTokens[state.fabric],
      roughness: 0.86,
      metalness: 0.02
    });

    let currentStoneMat = new THREE.MeshStandardMaterial({
      color: colorTokens[state.stone],
      roughness: 0.46,
      metalness: 0.06
    });

    // 3.1 МОДУЛЬНЫЙ ДИВАН VESTA
    const sofaContainer = new THREE.Group();
    furnitureGroup.add(sofaContainer);

    let chaiseModuleMesh = null;

    function buildSofa() {
      // Очистка предыдущего дивана
      while (sofaContainer.children.length > 0) {
        sofaContainer.remove(sofaContainer.children[0]);
      }

      sofaContainer.position.set(0, 0, -0.4);

      // Массивное деревянное основание (Plinth)
      const plinthW = state.sofaShape === 'chaise' ? 3.4 : 2.6;
      const plinthGeo = new THREE.BoxGeometry(plinthW, 0.12, 1.2);
      const plinth = new THREE.Mesh(plinthGeo, currentWoodMat);
      plinth.position.set(0, 0.06, 0);
      plinth.castShadow = true;
      plinth.receiveShadow = true;
      sofaContainer.add(plinth);

      // Задняя спинка (Low architectural backrest)
      const backGeo = new THREE.BoxGeometry(plinthW, 0.52, 0.28);
      const back = new THREE.Mesh(backGeo, currentFabricMat);
      back.position.set(0, 0.38, -0.42);
      back.castShadow = true;
      back.receiveShadow = true;
      sofaContainer.add(back);

      // Основные подушки сиденья (Мягкие формы)
      const seatGeo = new THREE.BoxGeometry(1.2, 0.26, 0.88);
      const seatL = new THREE.Mesh(seatGeo, currentFabricMat);
      seatL.position.set(-0.65, 0.25, 0.1);
      seatL.castShadow = true;
      seatL.receiveShadow = true;
      sofaContainer.add(seatL);

      const seatR = new THREE.Mesh(seatGeo, currentFabricMat);
      seatR.position.set(0.65, 0.25, 0.1);
      seatR.castShadow = true;
      seatR.receiveShadow = true;
      sofaContainer.add(seatR);

      // Подушки под спину
      const pillowGeo = new THREE.BoxGeometry(1.1, 0.34, 0.2);
      const pillowL = new THREE.Mesh(pillowGeo, currentFabricMat);
      pillowL.position.set(-0.65, 0.48, -0.22);
      pillowL.rotation.x = -0.15;
      pillowL.castShadow = true;
      sofaContainer.add(pillowL);

      const pillowR = new THREE.Mesh(pillowGeo, currentFabricMat);
      pillowR.position.set(0.65, 0.48, -0.22);
      pillowR.rotation.x = -0.15;
      pillowR.castShadow = true;
      sofaContainer.add(pillowR);

      // Модуль шезлонга (Chaise Lounge)
      if (state.sofaShape === 'chaise') {
        const chaiseGeo = new THREE.BoxGeometry(0.9, 0.26, 1.8);
        chaiseModuleMesh = new THREE.Mesh(chaiseGeo, currentFabricMat);
        chaiseModuleMesh.position.set(1.4, 0.25, 0.55);
        chaiseModuleMesh.castShadow = true;
        chaiseModuleMesh.receiveShadow = true;
        sofaContainer.add(chaiseModuleMesh);

        // Деревянная консоль-полочка сбоку
        const sideShelfGeo = new THREE.BoxGeometry(0.35, 0.36, 1.1);
        const sideShelf = new THREE.Mesh(sideShelfGeo, currentWoodMat);
        sideShelf.position.set(-1.6, 0.24, 0.1);
        sideShelf.castShadow = true;
        sofaContainer.add(sideShelf);
      }
    }

    buildSofa();

    // 3.2 МОНОЛИТНЫЙ СТОЛ ARCO PLINTH
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0.1, 0, 1.1);

    // Монолитная плита травертина
    const slabGeo = new THREE.BoxGeometry(1.8, 0.26, 0.9);
    const tableSlab = new THREE.Mesh(slabGeo, currentStoneMat);
    tableSlab.position.set(0, 0.26, 0);
    tableSlab.castShadow = true;
    tableSlab.receiveShadow = true;
    tableGroup.add(tableSlab);

    // Массивные ножки-блоки
    const legBlockGeo = new THREE.BoxGeometry(0.4, 0.14, 0.8);
    const legL = new THREE.Mesh(legBlockGeo, currentStoneMat);
    legL.position.set(-0.6, 0.07, 0);
    legL.castShadow = true;
    tableGroup.add(legL);

    const legR = new THREE.Mesh(legBlockGeo, currentStoneMat);
    legR.position.set(0.6, 0.07, 0);
    legR.castShadow = true;
    tableGroup.add(legR);

    // Керамическая ваза на столе
    const vaseGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.24, 24);
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0x5C4A3A, roughness: 0.8 });
    const vase = new THREE.Mesh(vaseGeo, vaseMat);
    vase.position.set(0.4, 0.51, 0.15);
    vase.castShadow = true;
    tableGroup.add(vase);

    furnitureGroup.add(tableGroup);

    // 3.3 ЛАУНЖ-КРЕСЛО KLINT
    const chairGroup = new THREE.Group();
    chairGroup.position.set(-2.2, 0, 0.8);
    chairGroup.rotation.y = 0.55;

    // Ножки из массива
    const chairLegGeo = new THREE.CylinderGeometry(0.024, 0.016, 0.42, 16);
    [[-0.3, 0.21, 0.26], [0.3, 0.21, 0.26], [-0.3, 0.21, -0.26], [0.3, 0.21, -0.26]].forEach(pos => {
      const leg = new THREE.Mesh(chairLegGeo, currentWoodMat);
      leg.position.set(pos[0], pos[1], pos[2]);
      leg.castShadow = true;
      chairGroup.add(leg);
    });

    // Каркас сиденья
    const seatFrame = new THREE.Mesh(new THREE.BoxGeometry(0.72, 0.06, 0.68), currentWoodMat);
    seatFrame.position.set(0, 0.42, 0);
    seatFrame.castShadow = true;
    chairGroup.add(seatFrame);

    // Мягкая подушка
    const chairCushion = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.14, 0.64), currentFabricMat);
    chairCushion.position.set(0, 0.51, 0.02);
    chairCushion.castShadow = true;
    chairGroup.add(chairCushion);

    // Изогнутая спинка
    const chairBack = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.42, 0.1), currentFabricMat);
    chairBack.position.set(0, 0.72, -0.28);
    chairBack.rotation.x = -0.18;
    chairBack.castShadow = true;
    chairGroup.add(chairBack);

    furnitureGroup.add(chairGroup);

    // 3.4 ЛАТУННЫЙ ТОРШЕР NORDIC ARC
    const lampGroup = new THREE.Group();
    lampGroup.position.set(2.8, 0, -0.6);

    // Мраморное основание
    const lampBaseGeo = new THREE.CylinderGeometry(0.24, 0.26, 0.12, 32);
    const lampBaseMat = new THREE.MeshStandardMaterial({ color: 0x1A1918, roughness: 0.3 });
    const lampBase = new THREE.Mesh(lampBaseGeo, lampBaseMat);
    lampBase.position.y = 0.06;
    lampBase.castShadow = true;
    lampGroup.add(lampBase);

    // Тонкая латунная стойка с изгибом
    const poleGeo = new THREE.CylinderGeometry(0.018, 0.018, 2.2, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: colorTokens.brass, roughness: 0.3, metalness: 0.8 });
    const pole = new THREE.Mesh(poleGeo, brassMat);
    pole.position.set(0, 1.15, 0);
    pole.castShadow = true;
    lampGroup.add(pole);

    const arcArmGeo = new THREE.CylinderGeometry(0.014, 0.014, 1.1, 16);
    const arcArm = new THREE.Mesh(arcArmGeo, brassMat);
    arcArm.position.set(-0.4, 2.22, 0.1);
    arcArm.rotation.z = 1.35;
    arcArm.castShadow = true;
    lampGroup.add(arcArm);

    // Светящаяся сфера
    const globeGeo = new THREE.SphereGeometry(0.14, 32, 32);
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0xFFF8E7,
      roughness: 0.1,
      emissive: 0xFFDF9E,
      emissiveIntensity: 0.6
    });
    const globe = new THREE.Mesh(globeGeo, globeMat);
    globe.position.set(-0.9, 2.1, 0.1);
    lampGroup.add(globe);

    furnitureGroup.add(lampGroup);

    // =========================================================================
    // 4. УПРАВЛЕНИЕ МАТЕРИАЛАМИ
    // =========================================================================
    function updateMaterials() {
      currentWoodMat.color.setHex(colorTokens[state.wood]);
      currentFabricMat.color.setHex(colorTokens[state.fabric]);
      currentStoneMat.color.setHex(colorTokens[state.stone]);

      // Обновление цен в HUD
      const priceDisplay = document.getElementById('selectedPriceDisplay');
      if (priceDisplay) {
        let base = 545000;
        if (state.wood === 'walnut') base += 85000;
        if (state.fabric === 'leather') base += 120000;
        priceDisplay.textContent = base.toLocaleString('ru-RU') + ' ₽';
      }
    }

    // =========================================================================
    // 5. КИНЕМАТОГРАФИЧНЫЕ РАКУРСЫ КАМЕРЫ (PRESETS)
    // =========================================================================
    const cameraPresets = {
      lounge: { pos: [6.2, 4.2, 7.5], target: [0, 0.6, 0] },
      sofa: { pos: [1.8, 2.2, 4.2], target: [0.3, 0.5, -0.2] },
      table: { pos: [-2.4, 2.0, 3.4], target: [-0.6, 0.4, 0.6] },
      plan: { pos: [0.1, 9.8, 0.2], target: [0, 0, 0] }
    };

    function setCameraPreset(viewName) {
      const p = cameraPresets[viewName];
      if (!p) return;
      state.cameraDesiredPos.set(p.pos[0], p.pos[1], p.pos[2]);
      state.cameraTarget.set(p.target[0], p.target[1], p.target[2]);
    }

    // Интерактивное вращение мышью
    let prevMouseX = 0;
    let prevMouseY = 0;
    let sphericalTheta = Math.atan2(camera.position.x, camera.position.z);
    let sphericalPhi = Math.acos(camera.position.y / camera.position.length());
    let sphericalRadius = camera.position.length();

    canvas.addEventListener('mousedown', (e) => {
      state.isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    });

    window.addEventListener('mouseup', () => {
      state.isDragging = false;
    });

    window.addEventListener('mousemove', (e) => {
      if (!state.isDragging) return;
      const dx = e.clientX - prevMouseX;
      const dy = e.clientY - prevMouseY;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;

      sphericalTheta -= dx * 0.006;
      sphericalPhi = Math.max(0.2, Math.min(Math.PI / 2 - 0.04, sphericalPhi - dy * 0.006));

      state.cameraDesiredPos.x = state.cameraTarget.x + sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      state.cameraDesiredPos.y = state.cameraTarget.y + sphericalRadius * Math.cos(sphericalPhi);
      state.cameraDesiredPos.z = state.cameraTarget.z + sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
    });

    // Зум колесиком
    canvas.addEventListener('wheel', (e) => {
      e.preventDefault();
      sphericalRadius = Math.max(4.5, Math.min(14.0, sphericalRadius + e.deltaY * 0.005));
      state.cameraDesiredPos.x = state.cameraTarget.x + sphericalRadius * Math.sin(sphericalPhi) * Math.sin(sphericalTheta);
      state.cameraDesiredPos.y = state.cameraTarget.y + sphericalRadius * Math.cos(sphericalPhi);
      state.cameraDesiredPos.z = state.cameraTarget.z + sphericalRadius * Math.sin(sphericalPhi) * Math.cos(sphericalTheta);
    }, { passive: false });

    // =========================================================================
    // 6. СВЯЗКА С DOM-ИНТЕРФЕЙСОМ
    // =========================================================================
    // Ракурсы
    document.querySelectorAll('.cam-tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.cam-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const view = btn.dataset.view;
        setCameraPreset(view);
      });
    });

    // Свет
    document.querySelectorAll('.time-dock-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-dock-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const lightingMode = btn.dataset.time;
        applyLightingMode(lightingMode);
      });
    });

    // Образцы материалов
    document.querySelectorAll('.swatch-circle-btn').forEach(swatch => {
      swatch.addEventListener('click', () => {
        const type = swatch.dataset.category;
        const val = swatch.dataset.value;

        document.querySelectorAll(`.swatch-circle-btn[data-category="${type}"]`).forEach(s => s.classList.remove('active'));
        swatch.classList.add('active');

        if (type === 'wood') state.wood = val;
        if (type === 'fabric') state.fabric = val;
        if (type === 'stone') state.stone = val;

        updateMaterials();

        // Синхронизация с калькулятором
        window.dispatchEvent(new CustomEvent('vesta:materialChange', {
          detail: { type, value: val }
        }));
      });
    });

    // Слушатель телепорта из каталога
    window.addEventListener('vesta:teleportView', (e) => {
      const piece = e.detail?.piece;
      if (piece === 'sofa') setCameraPreset('sofa');
      else if (piece === 'chair') setCameraPreset('table');
      else if (piece === 'table') setCameraPreset('table');
      else setCameraPreset('lounge');
    });

    // =========================================================================
    // 7. РЕЗИНОВЫЙ RESIZE И АНИМАЦИОННЫЙ ЦИКЛ
    // =========================================================================
    function onWindowResize() {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    }

    window.addEventListener('resize', onWindowResize);

    // Плавный рендер-луп с интерполяцией камеры (lerp)
    function animate() {
      requestAnimationFrame(animate);

      // Плавный подлет камеры
      camera.position.lerp(state.cameraDesiredPos, 0.06);
      state.cameraLookAt.lerp(state.cameraTarget, 0.06);
      camera.lookAt(state.cameraLookAt);

      renderer.render(scene, camera);
    }

    animate();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', waitForThree);
  } else {
    waitForThree();
  }
})();
