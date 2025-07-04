import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import Delaunator from 'delaunator';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography
} from '@mui/material';

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
        scene.add(createLabel('Lat', new THREE.Vector3(1.1, 0, 0)));
        scene.add(createLabel('Long', new THREE.Vector3(0, 1.1, 0)));
        scene.add(createLabel('Dept', new THREE.Vector3(0, 0, 1.1)));
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

  return <div ref={mountRef} className="w-full h-full" />;
};

const DualSurfacePlot = () => {
  const [resultPath, setResultPath] = useState([]);

  const handleSubmit = async (lat, lon) => {
    try {
      const response = await fetch('https://etscan.org/dijkstrainput', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ lat: parseFloat(lat), lon: parseFloat(lon) }),
      });
      if (!response.ok) throw new Error(`API error: ${response.status}`);
      const data = await response.json();
      console.log("API Response:", data);
      setResultPath(data.path || []);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const InputSidebar = ({ onSubmit }) => {
    const [lat, setLat] = useState('');
    const [lon, setLon] = useState('');

    const handleFormSubmit = (e) => {
      e.preventDefault();
      onSubmit(lat, lon);
    };

    return (
      <div className="w-[300px] p-6 bg-white border-l border-gray-200 shadow-md">
        <h4 className="text-2xl font-bold text-slate-700 mb-6">Enter coordinates to optimize well placement</h4>
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="latitude" className="text-sm font-medium text-gray-700">Latitude</label>
            <input
              id="latitude"
              type="number"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="29.7604"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="longitude" className="text-sm font-medium text-gray-700">Longitude</label>
            <input
              id="longitude"
              type="number"
              value={lon}
              onChange={(e) => setLon(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm"
              placeholder="-95.3698"
            />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow">
            Submit
          </button>
        </form>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex h-[75vh]">
        <div className="flex-1 flex flex-col">
          <div className="flex-1 border-b-2 border-gray-300">
            <SurfacePanel dataUrl="/cumoil_surface.json" />
          </div>
          <div className="flex-1">
            <SurfacePanel dataUrl="/max_cumoil_path.json" />
          </div>
        </div>
        <InputSidebar onSubmit={handleSubmit} />
      </div>

      <div className="w-full px-4 pb-4">
        <Typography variant="h6" className="font-bold text-blue-700 mb-2">
          <h4>Optimized Path Result</h4>
        </Typography>
        <div className="max-h-[300px] overflow-auto border border-gray-300 rounded-md shadow-sm">
          <TableContainer component={Paper} className="min-w-full">
            <Table stickyHeader size="small">
              <TableHead>
                <TableRow className="bg-gray-100">
                  <TableCell>#</TableCell>
                  <TableCell>Latitude (&deg;)</TableCell>
                  <TableCell>Longitude (&deg;)</TableCell>
                  <TableCell>Depth (m)</TableCell>
                  <TableCell>Cumoil (m&sup3;)</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {resultPath.map((point, index) => {
                  console.log(`Row ${index + 1}:`, point);
                  return (
                    <TableRow key={index}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{point.lat?.toFixed(3) ?? 'N/A'}</TableCell>
                      <TableCell>{point.lon?.toFixed(3) ?? 'N/A'}</TableCell>
                      <TableCell>{point.dept?.toFixed(3) ?? 'N/A'}</TableCell>
                      <TableCell>{point.cumoil?.toFixed(3) ?? 'N/A'}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </div>
    </div>
  ); 
};

export default DualSurfacePlot;
