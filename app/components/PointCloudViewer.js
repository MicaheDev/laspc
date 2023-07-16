"use client";

import { load } from "@loaders.gl/core";
import { LASLoader } from "@loaders.gl/las";
import React, { useEffect, useRef } from "react";
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Points,
  PointsMaterial,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { loadInBatches } from "@loaders.gl/core";

const PointCloudViewer = ({ lasFileUrl }) => {
  const containerRef = useRef();

  useEffect(() => {
    async function fileRender() {
      // Configuracion de Three para el renderizado
      const scene = new Scene();
      const camera = new PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10
      );
      const renderer = new WebGLRenderer();
      const controls = new OrbitControls(camera, renderer.domElement);

      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);

      // Carga de Archivo .LAS.
      const batches = await loadInBatches(lasFileUrl, LASLoader);

      for await (const batch of batches) {
        let lasData = batch.data;
        let positions = Float32Array.from(lasData.attributes.POSITION.value);
        let intensity = new Float32Array(lasData.attributes.intensity.value);

        let maxIntensity = -Infinity;
        for (let i = 0; i < intensity.length; i++) {
          if (intensity[i] > maxIntensity) {
            maxIntensity = intensity[i];
          }
        }

        // Normalizar los valores de intensidad y reducir el rango de los valores de color
        for (let i = 0; i < intensity.length; i++) {
          intensity[i] = intensity[i] / maxIntensity / 1;
        }

        // Crear una nueva matriz para almacenar los colores
        let colors = new Float32Array(intensity.length * 3);

        // Asignar los colores a la matriz
        for (let i = 0; i < intensity.length; i++) {
          colors[i * 3] = intensity[i];
          colors[i * 3 + 1] = intensity[i];
          colors[i * 3 + 2] = intensity[i];
        }

        // Calculamos el centro de la nube de puntos, sumando todas las posiciones y dividiéndolas por el número total de puntos.
        let center = [0, 0, 0];

        for (let i = 0; i < positions.length; i += 3) {
          center[0] += positions[i];
          center[1] += positions[i + 1];
          center[2] += positions[i + 2];
        }

        center = center.map((v) => v / (positions.length / 3));

        // Centramos los puntos restando las coordenadas del centro de todas las posiciones.
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] -= center[0];
          positions[i + 1] -= center[1];
          positions[i + 2] -= center[2];
        }

        /* Escalamos la nube de puntos para que esté dentro de un rango de -1 a 1. Para hacer esto, encontramos el valor absoluto máximo en 
      las posiciones (la dimensión máxima) y luego todas las posiciones se dividen por este valor. */
        let maxDimension = -Infinity;
        for (let i = 0; i < positions.length; i++) {
          const absValue = Math.abs(positions[i]);
          if (absValue > maxDimension) {
            maxDimension = absValue;
          }
        }

        for (let i = 0; i < positions.length; i++) {
          positions[i] /= maxDimension;
        }

        // Simplificamos la nube de puntos para mejorar el rendimiento.
        let samplingRate = 0.7; // Tomar el 10% de los puntos, puedes ajustar este valor según tus necesidades.

        let sampledPositions = [];
        let sampledColors = [];
        for (let i = 0; i < positions.length; i += 3) {
          if (Math.random() < samplingRate) {
            sampledPositions.push(
              positions[i],
              positions[i + 1],
              positions[i + 2]
            );
            sampledColors.push(colors[i], colors[i + 1], colors[i + 2]);
          }
        }

        positions = new Float32Array(sampledPositions);
        colors = new Float32Array(sampledColors);

        const geometry = new BufferGeometry();
        const material = new PointsMaterial({
          vertexColors: true,
        });

        /*
        //Asignacion forzada de colores.

        let minY = Math.min(...positions.filter((_, index) => index % 3 === 1));
        let maxY = Math.max(...positions.filter((_, index) => index % 3 === 1));

        // Iterar sobre las posiciones y asignar un color basado en la posición y
        for (let i = 0; i < positions.length; i += 3) {
          let y = positions[i + 1];

          // Calcular un valor de color en el rango [0, 1] basado en la posición y
          let colorValue = (y - minY) / (maxY - minY);

          // Crear un color usando el valor de color
          let color = new Color().setHSL(colorValue, 1, 0.5);

          // Almacenar el color en la matriz de colores
          colors[i] = color.r;
          colors[i + 1] = color.g;
          colors[i + 2] = color.b;
        }
        */

        geometry.setAttribute(
          "position",
          new Float32BufferAttribute(positions, 3)
        );
        geometry.setAttribute("color", new Float32BufferAttribute(colors, 3));

        const points = new Points(geometry, material);
        scene.add(points);

        camera.position.z = 2;

        const animate = () => {
          requestAnimationFrame(animate);

          // Ajustar el tamaño de los puntos en función de la distancia de la cámara.
          const distance = camera.position.distanceTo(points.position);
          material.size = 0.005 * distance;

          controls.update();
          renderer.render(scene, camera);
        };

        animate();
      }
    }

    fileRender();
  }, [lasFileUrl]);

  return <div ref={containerRef} className="viewer" />;
};

export default PointCloudViewer;
