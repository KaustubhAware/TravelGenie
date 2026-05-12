import Globe from "react-globe.gl";
import { useEffect, useRef } from "react";

export default function GlobeComponent() {

  const globeRef = useRef();

  useEffect(() => {

    if (globeRef.current) {

      globeRef.current.controls().autoRotate = true;

      globeRef.current.controls().autoRotateSpeed = 0.5;

      globeRef.current.controls().enableZoom = false;

      globeRef.current.pointOfView(
        {
          lat: 20,
          lng: 78,
          altitude: 2.2,
        },
        0
      );
    }

  }, []);

  return (

    <div className="absolute inset-0">

      <Globe
        ref={globeRef}
        width={1200}
        height={700}
        backgroundColor="rgba(0,0,0,0)"
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
      />

    </div>

  );
}