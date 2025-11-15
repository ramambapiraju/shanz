import { useEffect } from 'react';

export const useFPSControls = (onMouseMove: (deltaX: number, deltaY: number) => void) => {
  useEffect(() => {
    let isLocked = false;

    const handleMouseMove = (event: MouseEvent) => {
      if (!isLocked) return;
      onMouseMove(event.movementX || 0, event.movementY || 0);
    };

    const handlePointerLockChange = () => {
      isLocked = document.pointerLockElement !== null;
    };

    const handleClick = () => {
      if (!isLocked && document.pointerLockElement === null) {
        document.body.requestPointerLock();
      }
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('pointerlockchange', handlePointerLockChange);
    document.addEventListener('click', handleClick);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('pointerlockchange', handlePointerLockChange);
      document.removeEventListener('click', handleClick);
      if (document.pointerLockElement) {
        document.exitPointerLock();
      }
    };
  }, [onMouseMove]);
};
