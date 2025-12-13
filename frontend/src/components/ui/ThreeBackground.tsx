import React, { useRef, useMemo, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

const Stars = (props: any) => {
    const ref = useRef<any>();
    const [sphere] = useState(() => random.inSphere(new Float32Array(8000), { radius: 1.2 }));

    useFrame((state, delta) => {
        if (ref.current) {
            // Base rotation
            ref.current.rotation.x -= delta / 15;
            ref.current.rotation.y -= delta / 20;

            // Scroll interaction: accelerating rotation and shifting perspective
            const scrollY = window.scrollY;
            ref.current.rotation.z = scrollY * 0.0005;
            ref.current.position.y = -scrollY * 0.0002;

            // Subtle zoom effect based on scroll
            // state.camera.position.z = 1 - (scrollY * 0.0001); 
        }
    });

    return (
        <group rotation={[0, 0, Math.PI / 4]}>
            <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
                <PointMaterial
                    transparent
                    color="#60a5fa" // Brighter Blue
                    size={0.005} // Significantly larger
                    sizeAttenuation={true}
                    depthWrite={false}
                    opacity={1}
                />
            </Points>
        </group>
    );
};

// Also a subtle mesh gradient or fog?
const Scene = () => {
    return (
        <>
            <Stars />
            <ambientLight intensity={0.5} />
        </>
    )
}



export const ThreeBackground = () => {
    return (
        <div className="fixed inset-0 min-h-screen z-0 bg-[#050505]">
            {/* Gradient Overlay for visual richness */}
            <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 via-black/40 to-black pointer-events-none z-10" />

            <Canvas camera={{ position: [0, 0, 1] }}>
                <Suspense fallback={null}>
                    <Scene />
                </Suspense>
            </Canvas>
        </div>
    );
};
