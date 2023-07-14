'use client'

import PointCloudViewer from './components/PointCloudViewer';

export default function Home() {
  return (
    <div>
      <PointCloudViewer lasFileUrl="/s1.las" />
    </div>
  );
}