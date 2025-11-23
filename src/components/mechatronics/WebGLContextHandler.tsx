// WebGL Context Loss Handler - Prevents crashes and enables recovery
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const WebGLContextHandler = () => {
  const { gl } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;

    const handleContextLost = (event: Event) => {
      event.preventDefault();
      console.warn('WebGL context lost. Attempting to restore...');
      toast.error('3D rendering paused. Restoring...', {
        duration: 2000,
      });
    };

    const handleContextRestored = () => {
      console.log('WebGL context restored successfully.');
      toast.success('3D rendering restored!', {
        duration: 2000,
      });
    };

    canvas.addEventListener('webglcontextlost', handleContextLost);
    canvas.addEventListener('webglcontextrestored', handleContextRestored);

    return () => {
      canvas.removeEventListener('webglcontextlost', handleContextLost);
      canvas.removeEventListener('webglcontextrestored', handleContextRestored);
    };
  }, [gl]);

  return null;
};
