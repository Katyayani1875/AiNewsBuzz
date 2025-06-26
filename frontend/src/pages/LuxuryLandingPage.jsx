// src/pages/LuxuryLandingPage.jsx (Final Version: "The Data Weave")

import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import * as THREE from 'three';
import { gsap } from 'gsap';

// A self-contained style component for the animated "aurora" button border
const AuroraStyle = () => (
  <style>{`
    @keyframes aurora {
      from { --aurora-angle: 0deg; }
      to { --aurora-angle: 360deg; }
    }
    @property --aurora-angle {
      syntax: '<angle>';
      initial-value: 0deg;
      inherits: false;
    }
  `}</style>
);

const LuxuryLandingPage = () => {
    const canvasRef = useRef(null);
    const uiContainerRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // --- Scene, Camera, Renderer ---
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.z = 15;
        
        const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, antialias: true, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        const clock = new THREE.Clock();
        
        // --- "THE DATA WEAVE" - Particle System ---
        const particleCount = 20000;
        const positions = new Float32Array(particleCount * 3);
        const randoms = new Float32Array(particleCount);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 50;
            positions[i3 + 1] = (Math.random() - 0.5) * 50;
            positions[i3 + 2] = (Math.random() - 0.5) * 50;
            randoms[i] = Math.random();
        }

        const particleGeometry = new THREE.BufferGeometry();
        particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particleGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

        // This custom shader creates the "wow-factor" animation
        const particleMaterial = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0 },
                uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                uSize: { value: 70.0 },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uIntro: { value: 0.0 }
            },
            vertexShader: `
                uniform float uTime;
                uniform float uPixelRatio;
                uniform float uSize;
                uniform vec2 uMouse;
                uniform float uIntro;
                attribute float aRandom;
                varying float vDistance;

                void main() {
                    vec3 pos = position;
                    pos.z += sin(pos.x * 0.1 + uTime * 0.5) * (aRandom * 2.0);
                    pos.z += cos(pos.y * 0.1 + uTime * 0.3) * (aRandom * 2.0);
                    
                    float mouseDistance = distance(pos.xy, uMouse * 25.0);
                    float strength = smoothstep(5.0, 0.0, mouseDistance);
                    pos.z += strength * 5.0;
                    pos.x += strength * (uMouse.x * 0.5) * aRandom * 2.0;
                    pos.y += strength * (uMouse.y * 0.5) * aRandom * 2.0;

                    pos *= uIntro;

                    vec4 modelPosition = modelMatrix * vec4(pos, 1.0);
                    vec4 viewPosition = viewMatrix * modelPosition;
                    gl_Position = projectionMatrix * viewPosition;
                    
                    vDistance = length(viewPosition.xyz);
                    gl_PointSize = uSize * aRandom * uPixelRatio * (1.0 / -viewPosition.z);
                }
            `,
            fragmentShader: `
                varying float vDistance;
                void main() {
                    float strength = 1.0 - (distance(gl_PointCoord, vec2(0.5)) * 2.0);
                    float opacity = smoothstep(30.0, 15.0, vDistance);
                    gl_FragColor = vec4(0.5, 0.8, 1.0, strength * opacity);
                }
            `,
            transparent: true,
            blending: THREE.AdditiveBlending,
            depthWrite: false,
        });

        const particles = new THREE.Points(particleGeometry, particleMaterial);
        scene.add(particles);

        // --- GSAP ANIMATION ---
        gsap.set(uiContainerRef.current, { opacity: 0 });

        gsap.to(particleMaterial.uniforms.uIntro, {
            value: 1.0,
            duration: 4,
            ease: 'expo.out',
            delay: 0.5
        });
        
        gsap.to(uiContainerRef.current, {
            opacity: 1,
            duration: 2,
            delay: 2.0,
            ease: 'power3.out'
        });

        // --- Render Loop & Event Listeners ---
        const mouse = new THREE.Vector2();
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            particleMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
        };
        window.addEventListener('resize', handleResize);
        
        const handleMouseMove = (e) => {
            mouse.x = (e.clientX / window.innerWidth) - 0.5;
            mouse.y = (e.clientY / window.innerHeight) - 0.5;
            gsap.to(particleMaterial.uniforms.uMouse.value, {
                x: mouse.x,
                y: -mouse.y,
                duration: 1.5,
                ease: 'power3.out'
            });
        };
        window.addEventListener('mousemove', handleMouseMove);
        
        let animationFrameId;
        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);
            const elapsedTime = clock.getElapsedTime();
            
            particleMaterial.uniforms.uTime.value = elapsedTime;
            
            renderer.render(scene, camera);
        };
        animate();

        // --- Cleanup Function ---
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            cancelAnimationFrame(animationFrameId);
            renderer.dispose();
            scene.traverse(obj => {
                if (obj.geometry) obj.geometry.dispose();
                if (obj.material) obj.material.dispose();
            });
        };
    }, []);

    return (
        <>
            <AuroraStyle />
            <div className="w-full min-h-screen bg-gradient-to-br from-[#030014] to-[#100c2f] text-white font-['Inter',_sans-serif] overflow-hidden">
                
                {/* Canvas is in the absolute background */}
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
                
                {/* The UI container sits on top and is centered */}
                <main ref={uiContainerRef} className="relative z-10 min-h-screen w-full flex flex-col items-center justify-center text-center p-4">
                    <div className="max-w-3xl">
                        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 [text-shadow:0_4px_30px_rgba(255,255,255,0.1)]">
                            AI NewsBuzz
                        </h1>
                        <p className="mt-4 max-w-xl text-lg md:text-xl text-blue-200/80 tracking-wide">
                            Where Global Information Meets Artificial Clarity.
                        </p>
                        
                        <div className="mt-12">
                            <Link to="/register" className="relative group inline-block">
                              <div 
                                className="absolute -inset-0.5 bg-gradient-to-r from-cyan-400 to-violet-500 rounded-full blur-lg opacity-75 group-hover:opacity-100 transition duration-300"
                                style={{ animation: 'aurora 8s linear infinite' }}>
                              </div>
                              <div className="relative text-lg font-bold py-4 px-10 bg-black/80 backdrop-blur-sm rounded-full leading-none flex items-center transition-transform duration-300 group-hover:scale-105">
                                Get Started
                              </div>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        </>
    );
};

export default LuxuryLandingPage;