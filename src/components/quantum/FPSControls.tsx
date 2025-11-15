import { useEffect, useRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';

export const useFPSControls = () => {
  const { camera } = useThree();
  const euler = useRef(new THREE.Euler(0, 0, 0, 'YXZ'));
  const mouseMovement = useRef({ x: 0, y: 0 });
  const isLocked = useRef(false);

  useEffect(() => {
    const onMouseMove = (event: MouseEvent) => {
      if (!isLocked.current) return;

      const movementX = event.movementX || 0;
      const movementY = event.movementY || 0;

      mouseMovement.current.x = movementX;
      mouseMovement.current.y = movementY;

      euler.current.setFromQuaternion(camera.quaternion);
      euler.current.y -= movementX * 0.002;
      euler.current.x -= movementY * 0.002;
      euler.current.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, euler.current.x));

      camera.quaternion.setFromEuler(euler.current);
    };

    const onPointerLockChange = () => {
      isLocked.current = document.pointerLockElement === document.body;
    };

    const onClick = () => {
      if (!isLocked.current) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('pointerlockchange', onPointerLockChange);
    document.addEventListener('click', onClick);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('pointerlockchange', onPointerLockChange);
      document.removeEventListener('click', onClick);
    };
  }, [camera]);

  return { euler: euler.current, isLocked: isLocked.current };
};
