# Get started with Animations

```
import { useEffect, useRef } from "react";
import { MouseAnimate } from "../../animation-ts/animate";

function App() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    useEffect(() => {
        if (canvasRef.current === null) {
            return;
        }
        const mouseAnimate = new MouseAnimate(canvasRef.current, "red");
        mouseAnimate.startAnimation();
        return () => {
            mouseAnimate.removeEventListeners();
        };
    }, []);
    return (
        <canvas style={{position: "fixed"}} ref={canvasRef}></canvas>
    );
}
export default App;

```

In the cleanup function, remember to detatch the event listeners.
