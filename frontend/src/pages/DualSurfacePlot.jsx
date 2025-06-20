import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Delaunator from 'delaunator';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const interpolateSpline = (data, numPoints = 200) => {
  const curvePoints = data.map(p => new THREE.Vector3(p.x, p.y, p.z));
  const curve = new THREE.CatmullRomCurve3(curvePoints, false, 'catmullrom', 0.5);
  const cumoilValues = data.map(p => p.cumoil);
  const interpolated = [];
  for (let i = 0; i <= numPoints; i++) {
    const t = i / numPoints;
    const point = curve.getPoint(t);
    const cumoil = interpolateValue(cumoilValues, t);
    interpolated.push({ x: point.x, y: point.y, z: point.z, cumoil });
  }
  return interpolated;
};

const interpolateValue = (values, t) => {
  const scaledT = t * (values.length - 1);
  const i = Math.floor(scaledT);
  const f = scaledT - i;
  if (i >= values.length - 1) return values[values.length - 1];
  return values[i] * (1 - f) + values[i + 1] * f;
};

const createSurfaceMesh = (data) => {
  if (data.length < 10) data = interpolateSpline(data, 300);
  const vertices = data.map(p => [p.x - 0.5, p.y - 0.5, p.z - 0.5]);
  const flat2D = vertices.map(([x, y]) => [x, y]);
  const delaunay = Delaunator.from(flat2D);
  const geometry = new THREE.BufferGeometry();
  const positions = [], colors = [];
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
  return new THREE.Mesh(geometry, new THREE.MeshStandardMaterial({
    vertexColors: true, side: THREE.DoubleSide, flatShading: true
  }));
};

const createLabel = (text, position) => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'black';
  ctx.font = 'bold 40px Arial';
  ctx.fillText(text, 32, 40);
  const texture = new THREE.CanvasTexture(canvas);
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  sprite.scale.set(0.2, 0.1, 1);
  sprite.position.copy(position);
  return sprite;
};

const SurfacePanel = ({ dataUrl }) => {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!mountRef.current) return;
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xfafafa);
    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(0.5, 0.5, 3);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    mountRef.current.appendChild(renderer.domElement);
    scene.add(new THREE.DirectionalLight(0xffffff, 1).position.set(0, 0, 5));
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    fetch(dataUrl)
      .then(res => res.json())
      .then(data => {
        const mesh = createSurfaceMesh(data);
        scene.add(mesh);
        const gridXZ = new THREE.GridHelper(2, 10);
        gridXZ.position.set(0, -0.5, 0);
        scene.add(gridXZ);
        const gridXY = new THREE.GridHelper(2, 10);
        gridXY.rotation.x = Math.PI / 2;
        gridXY.position.set(0, 0, -0.5);
        scene.add(gridXY);
        const gridYZ = new THREE.GridHelper(2, 10);
        gridYZ.rotation.z = Math.PI / 2;
        gridYZ.position.set(-0.5, 0, 0);
        scene.add(gridYZ);
        scene.add(new THREE.AxesHelper(1));
        scene.add(createLabel('X', new THREE.Vector3(1.1, 0, 0)));
        scene.add(createLabel('Y', new THREE.Vector3(0, 1.1, 0)));
        scene.add(createLabel('Z', new THREE.Vector3(0, 0, 1.1)));
        const controls = new OrbitControls(camera, renderer.domElement);
        const animate = () => {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        };
        animate();
      });
    return () => {
      while (mountRef.current?.firstChild) {
        mountRef.current.removeChild(mountRef.current.firstChild);
      }
    };
  }, [dataUrl]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

const InputSidebar = ({ onSubmit }) => {
  const [lat, setLat] = useState('');
  const [lon, setLon] = useState('');

  return (
    <div style={{
      width: '250px',
      padding: '20px',
      backgroundColor: '#f4f4f4',
      borderLeft: '1px solid #ccc',
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    }}>
      <h3>Well Planing </h3>
      <label>Enter Starting Latitude:
        <input type="number" value={lat} onChange={e => setLat(e.target.value)} />
      </label>
      <label>Enter Starting Longitude:
        <input type="number" value={lon} onChange={e => setLon(e.target.value)} />
      </label>
      <button onClick={() => onSubmit(lat, lon)}>Submit</button>
    </div>
  );
};

const DualSurfacePlot = () => {
  const handleSubmit = (lat, lon) => {
    console.log("Latitude:", lat, "Longitude:", lon);
    // TODO: trigger a search or marker on the 3D plot
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flex: 1, borderBottom: '2px solid #aaa' }}>
          <SurfacePanel dataUrl="/cumoil_surface.json" />
        </div>
        <div style={{ flex: 1 }}>
          <SurfacePanel dataUrl="/max_cumoil_path.json" />
        </div>
      </div>
      <InputSidebar onSubmit={handleSubmit} />
    </div>
  );
};

export default DualSurfacePlot;
