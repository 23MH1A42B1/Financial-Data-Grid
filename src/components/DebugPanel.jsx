import { useEffect, useState } from "react";

export default function DebugPanel({
  renderedRows,
  scrollIndex,
  totalRows
}) {
  const [fps, setFps] = useState(0);

  useEffect(() => {
    let frameCount = 0;
    let lastTime = performance.now();

    const loop = (time) => {
      frameCount++;
      if (time - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = time;
      }
      requestAnimationFrame(loop);
    };

    requestAnimationFrame(loop);
  }, []);

  return (
    <div data-test-id="debug-panel">
      <div data-test-id="debug-fps">FPS: {fps}</div>
      <div data-test-id="debug-rendered-rows">
        Rendered: {renderedRows}
      </div>
      <div data-test-id="debug-scroll-position">
        Row {scrollIndex} / {totalRows}
      </div>
    </div>
  );
}
