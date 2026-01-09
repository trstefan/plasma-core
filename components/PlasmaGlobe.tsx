import React, { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/addons/postprocessing/UnrealBloomPass.js";
import {
  PLASMA_VERTEX,
  PLASMA_FRAGMENT,
  SHELL_VERTEX,
  SHELL_FRAGMENT,
} from "@/shaders";
import { PlasmaParams } from "@/types";

interface Props {
  params: PlasmaParams;
  onParamsChange?: (newParams: Partial<PlasmaParams>) => void;
}

const PlasmaGlobe: React.FC<Props> = ({ params }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const composerRef = useRef<EffectComposer | null>(null);
  const plasmaMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const shellFrontMatRef = useRef<THREE.ShaderMaterial | null>(null);
  const bloomPassRef = useRef<UnrealBloomPass | null>(null);
  const mainGroupRef = useRef<THREE.Group>(new THREE.Group());
  const pMatRef = useRef<THREE.ShaderMaterial | null>(null);

  const updateUniforms = useCallback(() => {
    if (plasmaMatRef.current) {
      plasmaMatRef.current.uniforms.uScale.value = params.plasmaScale;
      plasmaMatRef.current.uniforms.uBrightness.value = params.plasmaBrightness;
      plasmaMatRef.current.uniforms.uThreshold.value = params.voidThreshold;
      plasmaMatRef.current.uniforms.uColorDeep.value.set(params.colorDeep);
      plasmaMatRef.current.uniforms.uColorMid.value.set(params.colorMid);
      plasmaMatRef.current.uniforms.uColorBright.value.set(params.colorBright);
    }
    if (shellFrontMatRef.current) {
      shellFrontMatRef.current.uniforms.uColor.value.set(params.shellColor);
      shellFrontMatRef.current.uniforms.uOpacity.value = params.shellOpacity;
    }
    if (bloomPassRef.current) {
      bloomPassRef.current.strength = params.bloomStrength;
      bloomPassRef.current.radius = params.bloomRadius;
      bloomPassRef.current.threshold = params.bloomThreshold;
    }
  }, [params]);

  useEffect(() => {
    updateUniforms();
  }, [updateUniforms]);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 2.8);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const renderScene = new RenderPass(scene, camera);
    const bloomPass = new UnrealBloomPass(
      new THREE.Vector2(window.innerWidth, window.innerHeight),
      params.bloomStrength,
      params.bloomRadius,
      params.bloomThreshold
    );
    bloomPassRef.current = bloomPass;

    const composer = new EffectComposer(renderer);
    composer.addPass(renderScene);
    composer.addPass(bloomPass);
    composerRef.current = composer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 1.5;
    controls.maxDistance = 10;

    const mainGroup = mainGroupRef.current;
    scene.add(mainGroup);

    const pointLight = new THREE.PointLight(0xffffff, 1.5, 10);
    mainGroup.add(pointLight);

    const shellGeo = new THREE.SphereGeometry(1.0, 64, 64);
    const shellBackMat = new THREE.ShaderMaterial({
      vertexShader: SHELL_VERTEX,
      fragmentShader: SHELL_FRAGMENT,
      uniforms: {
        uColor: { value: new THREE.Color(0x000033) },
        uOpacity: { value: 0.2 },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.BackSide,
      depthWrite: false,
    });

    const shellFrontMat = new THREE.ShaderMaterial({
      vertexShader: SHELL_VERTEX,
      fragmentShader: SHELL_FRAGMENT,
      uniforms: {
        uColor: { value: new THREE.Color(params.shellColor) },
        uOpacity: { value: params.shellOpacity },
      },
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.FrontSide,
      depthWrite: false,
    });
    shellFrontMatRef.current = shellFrontMat;

    mainGroup.add(new THREE.Mesh(shellGeo, shellBackMat));
    mainGroup.add(new THREE.Mesh(shellGeo, shellFrontMat));

    const plasmaGeo = new THREE.SphereGeometry(0.99, 128, 128);
    const plasmaMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uScale: { value: params.plasmaScale },
        uBrightness: { value: params.plasmaBrightness },
        uThreshold: { value: params.voidThreshold },
        uColorDeep: { value: new THREE.Color(params.colorDeep) },
        uColorMid: { value: new THREE.Color(params.colorMid) },
        uColorBright: { value: new THREE.Color(params.colorBright) },
      },
      vertexShader: PLASMA_VERTEX,
      fragmentShader: PLASMA_FRAGMENT,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
    plasmaMatRef.current = plasmaMat;
    const plasmaMesh = new THREE.Mesh(plasmaGeo, plasmaMat);
    mainGroup.add(plasmaMesh);

    const pCount = 1000;
    const pPos = new Float32Array(pCount * 3);
    const pSizes = new Float32Array(pCount);
    for (let i = 0; i < pCount; i++) {
      const r = 0.95 * Math.pow(Math.random(), 0.5);
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      pPos[i * 3] = r * Math.sin(phi) * Math.cos(theta);
      pPos[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
      pPos[i * 3 + 2] = r * Math.cos(phi);
      pSizes[i] = Math.random();
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    pGeo.setAttribute("aSize", new THREE.BufferAttribute(pSizes, 1));
    const pMat = new THREE.ShaderMaterial({
      uniforms: {
        uTime: { value: 0 },
        uColor: { value: new THREE.Color(0xffffff) },
      },
      vertexShader: `
            uniform float uTime;
            attribute float aSize;
            varying float vAlpha;
            void main() {
                vec3 pos = position;
                pos.y += sin(uTime * 0.3 + pos.x * 2.0) * 0.03;
                pos.x += cos(uTime * 0.25 + pos.z * 2.0) * 0.03;
                vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mvPosition;
                gl_PointSize = (8.0 * aSize + 2.0) * (1.0 / -mvPosition.z);
                vAlpha = 0.5 + 0.5 * sin(uTime * 2.0 + aSize * 10.0);
            }
        `,
      fragmentShader: `
            uniform vec3 uColor;
            varying float vAlpha;
            void main() {
                if(length(gl_PointCoord - 0.5) > 0.5) discard;
                gl_FragColor = vec4(uColor, vAlpha * 0.4);
            }
        `,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    pMatRef.current = pMat;
    mainGroup.add(new THREE.Points(pGeo, pMat));

    const clock = new THREE.Clock();
    let frameId: number;

    const animate = () => {
      frameId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (plasmaMatRef.current)
        plasmaMatRef.current.uniforms.uTime.value = t * params.timeScale;
      if (pMatRef.current) pMatRef.current.uniforms.uTime.value = t;

      mainGroup.rotation.x += params.rotationSpeedX;
      mainGroup.rotation.y += params.rotationSpeedY;

      controls.update();
      composer.render();
    };

    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
      composer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(frameId);
      renderer.dispose();
      scene.clear();
      if (containerRef.current) containerRef.current.innerHTML = "";
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 w-full h-full cursor-move"
    />
  );
};

export default PlasmaGlobe;
