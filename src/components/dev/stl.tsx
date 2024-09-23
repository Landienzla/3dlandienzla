"use client";
import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import {
  // Button,
  Box,
  // IconButton,
  // Menu,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
// import RotateLeftIcon from "@mui/icons-material/RotateLeft";
// import RotateRightIcon from "@mui/icons-material/RotateRight";

const STLViewer = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedModel, setSelectedModel] = useState<string>("model1");
  const [loadModalState, setLoadModalState] = useState<boolean>(false);
  const [meshes, setMeshes] = useState<THREE.Mesh[]>([]);
  let controls: OrbitControls;

  useEffect(() => {
    const width = mountRef.current?.clientWidth || 300;
    const height = mountRef.current?.clientHeight || 300;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      // window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    // renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.shadowMap.enabled = true;

    mountRef.current?.appendChild(renderer.domElement);
    scene.background = new THREE.Color(0xffffff);
    // Add lighting
    const ambientLight = new THREE.AmbientLight(0x007bff, 1);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    const gridHelper = new THREE.GridHelper(10000, 400); // Large grid
    scene.add(gridHelper);

    // Load STL models
    const loader = new STLLoader();
    const modelFiles = {
      model1: "./test.stl",
      model2: "./test2.stl",
      model3: "./test3.stl", // Add your models here
    };
    const loadModel = (modelKey: string) => {
      // Clear existing meshes
      meshes.forEach((mesh) => scene.remove(mesh));
      setMeshes([]); // Clear meshes from state

      // Load the new model
      // @ts-ignore
      loader.load(modelFiles[modelKey], (geometry: any) => {
        const boundingBox = new THREE.Box3().setFromObject(
          new THREE.Mesh(geometry)
        );
        const center = new THREE.Vector3();
        const size = new THREE.Vector3();
        boundingBox.getCenter(center);
        boundingBox.getSize(size);

        // Center the geometry on X and Z, and move Y to touch the grid
        geometry.translate(-center.x, -boundingBox.min.y, -center.z);

        const material = new THREE.MeshPhongMaterial({ color: 0xffffff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        scene.add(mesh);
        setMeshes((prev) => [...prev, mesh]); // Add the new mesh to state

        // Position camera based on the new object size
        camera.position.set(size.x, size.y, size.z * 2);
      });
    };

    loadModel(selectedModel); // Load the initially selected model

    // Add OrbitControls
    controls = new OrbitControls(camera, renderer.domElement);
    controls.autoRotate = true;
    // controls.dampingFactor = 0.25;
    // controls.enableZoom = true;
    // controls.enablePan = true;

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Clean up on unmount
    return () => {
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [selectedModel, loadModalState]); // Rerun effect when the selected model changes

  // Handle camera presets
  const handleCameraPreset = (view: "top" | "front" | "side") => {
    if (controls) {
      if (view === "top") {
        controls.object.position.set(0, 200, 0);
      } else if (view === "front") {
        controls.object.position.set(0, 0, 200);
      } else if (view === "side") {
        controls.object.position.set(200, 0, 0);
      }
      controls.object.lookAt(0, 0, 0);
      controls.update();
    }
  };

  // Handle model rotation
  const rotateModel = (axis: "x" | "y", angle: number) => {
    meshes.forEach((mesh) => {
      if (axis === "x") mesh.rotation.x += angle;
      if (axis === "y") mesh.rotation.y += angle;
    });
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        position: "relative",
        backgroundColor: "black",
        color: "white",
      }}
    >
      {/* 3D Scene */}
      <div ref={mountRef} />

      {/* Model Selector */}
      {/* <FormControl
        variant="outlined"
        style={{ width: 200, backgroundColor: "white" }}
      >
        <InputLabel>Model</InputLabel>
        <Select
          value={selectedModel}
          onChange={(event) => setSelectedModel(event.target.value as string)}
          label="Model"
          // onOpen={() => setLoadModalState(!loadModalState)}
          onSelectCapture={() => setLoadModalState(!loadModalState)}
        >
          <MenuItem value="model1">Model 1</MenuItem>
          <MenuItem value="model2">Model 2</MenuItem>
          <MenuItem value="model3">Model 3</MenuItem>
        </Select>
      </FormControl> */}

      {/* Camera presets */}
      {/* <Box display="flex" justifyContent="space-around" marginTop={2}>
        <Button onClick={() => handleCameraPreset("top")}>Top View</Button>
        <Button onClick={() => handleCameraPreset("front")}>Front View</Button>
        <Button onClick={() => handleCameraPreset("side")}>Side View</Button>
      </Box> */}

      {/* Controls for Rotation */}
      {/* <Box
        display="flex"
        alignItems="center"
        justifyContent="space-between"
        marginTop={2}
      >
        <IconButton
          onClick={() => rotateModel("x", Math.PI / 4)}
          style={{ color: "white" }}
        >
          <RotateLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => rotateModel("x", -Math.PI / 4)}
          style={{ color: "white" }}
        >
          <RotateRightIcon />
        </IconButton>
      </Box> */}
    </Box>
  );
};

export default STLViewer;
