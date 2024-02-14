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
        <main
            style={{
                backgroundColor: "black",
                height: "100vh",
            }}
        >
            <canvas
                style={{
                    position: "fixed",
                }}
                ref={canvasRef}
            ></canvas>
            <div>
                <h1
                    style={{
                        position: "absolute",
                        right: "10%",
                        bottom: "10%",
                        color: "white",
                        fontFamily: "Popping, sans-serif",
                    }}
                >
                    Refractored by Shahil Yadav
                </h1>
            </div>
        </main>
    );
}
export default App;
