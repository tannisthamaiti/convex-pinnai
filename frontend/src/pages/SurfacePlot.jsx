import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Delaunator from 'delaunator';

const SurfacePlot = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0, 0, 2);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 0, 5);
    scene.add(light);
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambient);

    Promise.all([
      fetch("/cumoil_surface.json").then(res => res.json()),
      fetch("/max_cumoil_path.json").then(res => res.json())
    ]).then(([data, pathData]) => {
      const vertices = data.map(p => [p.x - 0.5, p.y - 0.5, p.z - 0.5]);
      const flat2D = vertices.map(([x, y]) => [x, y]);

      const delaunay = Delaunator.from(flat2D);
      const geometry = new THREE.BufferGeometry();
      const positions = [];
      const colors = [];

      const cumoilValues = data.map(p => p.cumoil);
      const cumoilMin = Math.min(...cumoilValues);
      const cumoilMax = Math.max(...cumoilValues);

      for (let i = 0; i < delaunay.triangles.length; i += 3) {
        for (let j = 0; j < 3; j++) {
          const idx = delaunay.triangles[i + j];
          const [x, y, z] = vertices[idx];
          positions.push(x, y, z);

          const norm = (data[idx].cumoil - cumoilMin) / (cumoilMax - cumoilMin);
          const color = new THREE.Color().setHSL((1 - norm) * 0.7, 1.0, 0.7);
          colors.push(color.r, color.g, color.b);
        }
      }

      geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      geometry.computeVertexNormals();

      const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        side: THREE.DoubleSide,
        flatShading: true,
      });

      const mesh = new THREE.Mesh(geometry, material);
      scene.add(mesh);

      // Add path as red line
      const pathPoints = pathData.map(p => new THREE.Vector3(p.x - 0.5, p.y - 0.5, p.z - 0.5));
      const pathGeometry = new THREE.BufferGeometry().setFromPoints(pathPoints);
      const pathMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const pathLine = new THREE.Line(pathGeometry, pathMaterial);
      scene.add(pathLine);

      const axesHelper = new THREE.AxesHelper(0.2);
      axesHelper.position.set(-0.5, -0.5, -0.5);
      scene.add(axesHelper);

      animate();
    });

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <div
        style={{
          position: 'absolute',
          top: 10,
          left: 20,
          fontSize: '20px',
          fontWeight: 'bold',
          color: '#333',
          backgroundColor: 'rgba(255,255,255,0.8)',
          padding: '4px 8px',
          borderRadius: '8px'
        }}
      >
        Production Result: WELL CUMOIL
      </div>
      <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
    </div>
  );
};

export default SurfacePlot;