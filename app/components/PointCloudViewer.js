'use client'

import { load } from '@loaders.gl/core';
import { LASLoader } from '@loaders.gl/las';
import React, { useEffect, useRef } from 'react';
import { BufferGeometry, Color, Float32BufferAttribute, Points, PointsMaterial, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';


const PointCloudViewer = ({ lasFileUrl }) => {
  const containerRef = useRef();

  useEffect(() => {

    async function fileRender() {

      // Carga de Archivo .LAS
      const lasData = await load(lasFileUrl, LASLoader)
      let positions = Float32Array.from(lasData.attributes.POSITION.value)
      
      /* 
      Aun no se si la variable colors es usada por PointsMaterial,
      ya que los valores devueltos por el archivo .LAS son todos de color blanco
 
      - let colors = new Float32Array(lasData.attributes.COLOR_0.value);
      */

      /* 
      - Calculamos el centro de la nube de puntos, sumando todas las posiciones y dividiéndolas por el número total de puntos.
      */

      let center = [0,0,0]

      for (let i = 0; i < positions.length; i += 3) {
        center[0] += positions[i];
        center[1] += positions[i + 1];
        center[2] += positions[i + 2];
      }
      
      center = center.map(v => v / (positions.length / 3));

      /*
      - Centramos los puntos restando las coordenadas del centro de todas las posiciones.
      */
      
      for (let i = 0; i < positions.length; i += 3) {
        positions[i] -= center[0];
        positions[i + 1] -= center[1];
        positions[i + 2] -= center[2];
      }

      /*
      - Escalamos la nube de puntos para que esté dentro de un rango de -1 a 1. Para hacer esto, encontramos el valor absoluto máximo en 
      las posiciones (la dimensión máxima) y luego todas las posiciones se dividen por este valor.
      */
      
      let maxDimension = Math.max(...positions.map(Math.abs));
      
      for (let i = 0; i < positions.length; i++) {
        positions[i] /= maxDimension;
      }

      const scene = new Scene();
      const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 10);
      const renderer = new WebGLRenderer();
      const controls = new OrbitControls( camera, renderer.domElement );



      renderer.setSize(window.innerWidth, window.innerHeight);
      containerRef.current.appendChild(renderer.domElement);


      const geometry = new BufferGeometry();
      const material = new PointsMaterial({
        color: new Color(0xffffff),
        size: 0.0030
      });

      geometry.setAttribute('position', new Float32BufferAttribute(positions, 3));

      const points = new Points(geometry, material);
      scene.add(points);

      camera.position.z = 1;

      const animate = () => {
        requestAnimationFrame(animate);
        controls.update()
        renderer.render(scene, camera);
      };

      animate();
    }

    fileRender()
  }, [lasFileUrl]);

  return <div ref={containerRef} />;
};

export default PointCloudViewer;
