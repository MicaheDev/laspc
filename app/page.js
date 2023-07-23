'use client'

import PointCloudViewer from './components/PointCloudViewer';

export default function Home() {
  return (
    <div>
      <PointCloudViewer lasFileUrl="/n3_con camino.las" />
    </div>
  );
}