import React, { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface FPVCameraProps {
  vehiclePosition: { x: number; y: number; z: number };
  vehicleRotation: { x: number; y: number; z: number };
  enabled: boolean;
}

export const FPVCamera: React.FC<FPVCameraProps> = ({
  vehiclePosition,
  vehicleRotation,
  enabled,
}) => {
  const cameraRef = useRef<THREE.PerspectiveCamera>(null);
  const { camera, gl } = useThree();
  
  useFrame(() => {
    if (!enabled || !cameraRef.current) return;
    
    // Position camera slightly forward and up from vehicle
    const offset = new THREE.Vector3(0, 0.3, 0.5);
    const euler = new THREE.Euler(vehicleRotation.x, vehicleRotation.y, vehicleRotation.z);
    offset.applyEuler(euler);
    
    cameraRef.current.position.set(
      vehiclePosition.x + offset.x,
      vehiclePosition.y + offset.y,
      vehiclePosition.z + offset.z
    );
    
    // Look forward from vehicle
    const lookAt = new THREE.Vector3(0, 0, -2);
    lookAt.applyEuler(euler);
    cameraRef.current.lookAt(
      vehiclePosition.x + lookAt.x,
      vehiclePosition.y + lookAt.y,
      vehiclePosition.z + lookAt.z
    );
  });
  
  useEffect(() => {
    if (enabled && cameraRef.current) {
      // Camera is controlled by useFrame
    }
  }, [enabled]);
  
  if (!enabled) return null;
  
  return (
    <PerspectiveCamera
      ref={cameraRef}
      makeDefault={enabled}
      fov={75}
      near={0.1}
      far={1000}
    />
  );
};
