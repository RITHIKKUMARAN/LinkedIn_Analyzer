import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Sphere, MeshDistortMaterial, Float } from '@react-three/drei';
import * as THREE from 'three';

const AnimatedSphere = () => {
    const meshRef = useRef<THREE.Mesh>(null);

    useFrame((state) => {
        if (meshRef.current) {
            // Rotate based on mouse
            const t = state.clock.getElapsedTime();
            meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, state.mouse.y * 0.2, 0.1);
            meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, state.mouse.x * 0.2, 0.1);
        }
    });

    return (
        <Float speed={2} rotationIntensity={1.5} floatIntensity={2}>
            <Sphere args={[1, 100, 200]} scale={2.4}>
                <MeshDistortMaterial
                    color="#aa4b6b"
                    attach="material"
                    distort={0.4}
                    speed={2}
                    roughness={0.2}
                    metalness={0.8}
                />
            </Sphere>
        </Float>
    );
};

export const Hero3D = () => {
    return (
        <div className="absolute top-0 right-0 w-full h-[80vh] md:w-1/2 z-0 pointer-events-none opacity-60">
            <Canvas camera={{ position: [0, 0, 5] }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 10, 5]} intensity={1} />
                <pointLight position={[-10, -10, -5]} intensity={0.5} color="#3b82f6" />
                <AnimatedSphere />
            </Canvas>
        </div>
    );
};
