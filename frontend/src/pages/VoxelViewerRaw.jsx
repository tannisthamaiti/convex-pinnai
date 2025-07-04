import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Slider, MenuItem, Select, FormControl, InputLabel } from "@mui/material";

const getRandomColor = () => Math.floor(Math.random() * 0xffffff);

const VoxelViewerRaw = () => {
  const mountRef = useRef(null);
  const [voxels, setVoxels] = useState([]);
  const [depthRange, setDepthRange] = useState([0, 15000]);
  const [latRange, setLatRange] = useState([30, 40]);
  const [longRange, setLongRange] = useState([-100, -90]);
  const [formationFilter, setFormationFilter] = useState("All");
  const [formationColors, setFormationColors] = useState({});

  useEffect(() => {
    fetch("/voxels_with_latlong_unk.json")
      .then((res) => res.json())
      .then((data) => {
        const voxelsData = data.voxels || [];
        const uniqueLabels = Array.from(new Set(voxelsData.map(v => v.label)));
        const colors = {};
        uniqueLabels.forEach(label => {
          colors[label] = getRandomColor();
        });
        setFormationColors(colors);
        setVoxels(voxelsData);
      });
  }, []);

  useEffect(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    const camera = new THREE.PerspectiveCamera(75, mountRef.current.clientWidth / mountRef.current.clientHeight, 0.1, 10000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    mountRef.current.innerHTML = "";
    mountRef.current.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(50, 100, 50);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    const filtered = voxels.filter((v) => {
      return (
        v.z >= depthRange[0] &&
        v.z <= depthRange[1] &&
        v.y >= latRange[0] &&
        v.y <= latRange[1] &&
        v.x >= longRange[0] &&
        v.x <= longRange[1] &&
        (formationFilter === "All" || v.label === formationFilter)
      );
    });

    const BOX_SIZE = 100;
    const xVals = filtered.map(v => v.x);
    const yVals = filtered.map(v => v.y);
    const zVals = filtered.map(v => v.z);
    const xMin = Math.min(...xVals), xMax = Math.max(...xVals);
    const yMin = Math.min(...yVals), yMax = Math.max(...yVals);
    const zMin = Math.min(...zVals), zMax = Math.max(...zVals);

    const scaledVoxels = filtered.map(v => ({
      ...v,
      scaledX: ((v.x - xMin) / (xMax - xMin || 1)) * BOX_SIZE,
      scaledY: ((v.y - yMin) / (yMax - yMin || 1)) * BOX_SIZE,
      scaledZ: ((v.z - zMin) / (zMax - zMin || 1)) * BOX_SIZE,
    }));

    const group = new THREE.Group();
    scaledVoxels.forEach((voxel) => {
      const color = formationColors[voxel.label] || 0xaaaaaa;
      const material = new THREE.MeshLambertMaterial({ color });
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const cube = new THREE.Mesh(geometry, material);
      cube.position.set(voxel.scaledX, voxel.scaledY, voxel.scaledZ);
      cube.userData = {
        label: voxel.label,
        original: `Lat: ${voxel.y.toFixed(2)}, Long: ${voxel.x.toFixed(2)}, Depth: ${voxel.z.toFixed(2)}`,
      };
      group.add(cube);
    });
    scene.add(group);

    const box = new THREE.Box3().setFromObject(group);
    const center = new THREE.Vector3();
    box.getCenter(center);
    camera.position.set(center.x + 50, center.y + 50, center.z + 50);
    controls.target.copy(center);
    controls.update();

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const tooltip = document.createElement("div");
    tooltip.style.position = "absolute";
    tooltip.style.padding = "4px 8px";
    tooltip.style.background = "rgba(0, 0, 0, 0.7)";
    tooltip.style.color = "white";
    tooltip.style.display = "none";
    tooltip.style.pointerEvents = "none";
    tooltip.style.borderRadius = "4px";
    document.body.appendChild(tooltip);

    const onMouseMove = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(group.children);
      if (intersects.length > 0) {
        const data = intersects[0].object.userData;
        tooltip.innerHTML = `<b>${data.label}</b><br/>${data.original}`;
        tooltip.style.left = `${event.clientX + 10}px`;
        tooltip.style.top = `${event.clientY + 10}px`;
        tooltip.style.display = "block";
      } else {
        tooltip.style.display = "none";
      }
    };

    window.addEventListener("mousemove", onMouseMove);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.body.removeChild(tooltip);
      renderer.dispose();
    };
  }, [voxels, depthRange, latRange, longRange, formationFilter, formationColors]);

  const uniqueLabels = Array.from(new Set(voxels.map((v) => v.label)));

  return (
    <div>
      <div style={{ display: "flex", gap: "1rem", alignItems: "center", padding: "1rem" }}>
        <div>
          <div>Depth Range</div>
          <Slider
            value={depthRange}
            onChange={(e, val) => setDepthRange(val)}
            min={0}
            max={15000}
            step={100}
            valueLabelDisplay="auto"
          />
        </div>
        <div>
          <div>Lat Range</div>
          <Slider
            value={latRange}
            onChange={(e, val) => setLatRange(val)}
            min={30}
            max={40}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </div>
        <div>
          <div>Long Range</div>
          <Slider
            value={longRange}
            onChange={(e, val) => setLongRange(val)}
            min={-100}
            max={-90}
            step={0.1}
            valueLabelDisplay="auto"
          />
        </div>
        <FormControl>
          <InputLabel>Formation</InputLabel>
          <Select
            value={formationFilter}
            onChange={(e) => setFormationFilter(e.target.value)}
            style={{ width: 120 }}
          >
            <MenuItem value="All">All</MenuItem>
            {uniqueLabels.map((label) => (
              <MenuItem key={label} value={label}>{label}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
      <div ref={mountRef} style={{ width: "100%", height: "80vh" }}></div>
      
    </div>
  );
};

export default VoxelViewerRaw;