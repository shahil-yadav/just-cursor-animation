// Just a mouse animation by 'Shahil यादव'

import { Trail, Params, Pointer } from "./types";
const DefaulParams = {
    pointsNumber: 40,
    widthFactor: 0.3,
    mouseThreshold: 0.6,
    spring: 0.4,
    friction: 0.5,
};

export class MouseAnimate {
    animationId?: number;
    color?: string;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    params: Params;
    trail: Trail[] = [];
    mouseMoved = false;
    pointer: Pointer = {
        x: 0.5 * window.innerWidth,
        y: 0.5 * window.innerHeight,
    };

    constructor(canvas: HTMLCanvasElement, color?: string, options?: Params) {
        this.canvas = canvas;
        const ctx = canvas.getContext("2d");

        if (ctx === null)
            throw new Error("The canvas element passed is undefined");
        this.ctx = ctx;

        if (options !== undefined) {
            this.params = {
                ...DefaulParams,
                ...options,
            };
        }
        if (color !== undefined) {
            this.color = color;
        }

        this.params = DefaulParams;
        this.trail = this.createTrail();

        // Bind the update function to MouseAnimateInstance
        this.update = this.update.bind(this);
        this.setupCanvas = this.setupCanvas.bind(this);
        this.setMouseMove = this.setMouseMove.bind(this);
        this.setTouchMove = this.setTouchMove.bind(this);
        this.setClick = this.setClick.bind(this);
    }

    startAnimation() {
        this.attatchEventListeners();
        this.setupCanvas();
        this.update(0);
    }
    exitAnimation() {
        this.removeEventListeners();

        // Cancel Every Window Animation Frame
        if (this.animationId !== undefined) {
            window.cancelAnimationFrame(this.animationId);
        }
    }

    createTrail(): Trail[] {
        const trail = new Array(this.params.pointsNumber);
        for (let i = 0; i < this.params.pointsNumber; i++) {
            trail[i] = {
                x: this.pointer.x,
                y: this.pointer.y,
                dx: 0,
                dy: 0,
            };
        }
        return trail;
    }

    updateMousePosition(eX: number, eY: number) {
        this.pointer.x = eX;
        this.pointer.y = eY;
    }

    setupCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    update(t: number) {
        // for intro motion
        if (!this.mouseMoved) {
            this.pointer.x =
                (0.5 + 0.3 * Math.cos(0.002 * t) * Math.sin(0.005 * t)) *
                window.innerWidth;
            this.pointer.y =
                (0.5 + 0.2 * Math.cos(0.005 * t) + 0.1 * Math.cos(0.01 * t)) *
                window.innerHeight;
        }
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.trail.forEach((p, pIdx) => {
            const prev = pIdx === 0 ? this.pointer : this.trail[pIdx - 1];
            const spring =
                pIdx === 0 ? 0.4 * this.params.spring : this.params.spring;
            p.dx += (prev.x - p.x) * spring;
            p.dy += (prev.y - p.y) * spring;
            p.dx *= this.params.friction;
            p.dy *= this.params.friction;
            p.x += p.dx;
            p.y += p.dy;
        });

        this.ctx.lineCap = "round";
        this.ctx.strokeStyle = this.color || "black";
        this.ctx.beginPath();
        this.ctx.moveTo(this.trail[0].x, this.trail[0].y);

        for (let i = 1; i < this.trail.length - 1; i++) {
            const xc = 0.5 * (this.trail[i].x + this.trail[i + 1].x);
            const yc = 0.5 * (this.trail[i].y + this.trail[i + 1].y);
            this.ctx.quadraticCurveTo(this.trail[i].x, this.trail[i].y, xc, yc);
            this.ctx.lineWidth =
                this.params.widthFactor * (this.params.pointsNumber - i);
            this.ctx.stroke();
        }
        this.ctx.lineTo(
            this.trail[this.trail.length - 1].x,
            this.trail[this.trail.length - 1].y
        );
        this.ctx.stroke();

        this.animationId = window.requestAnimationFrame(this.update);
    }

    setMouseMove(e: MouseEvent) {
        this.mouseMoved = true;
        this.updateMousePosition(e.pageX, e.pageY);
    }

    setTouchMove(e: TouchEvent) {
        this.mouseMoved = true;
        this.updateMousePosition(
            e.targetTouches[0].pageX,
            e.targetTouches[0].pageY
        );
    }

    setClick(e: MouseEvent) {
        this.updateMousePosition(e.pageX, e.pageY);
    }

    attatchEventListeners() {
        window.addEventListener("resize", this.setupCanvas);
        window.addEventListener("click", this.setClick);
        window.addEventListener("mousemove", this.setMouseMove);
        window.addEventListener("touchmove", this.setTouchMove);
    }

    removeEventListeners() {
        window.removeEventListener("resize", this.setupCanvas);
        window.removeEventListener("click", this.setClick);
        window.removeEventListener("mousemove", this.setMouseMove);
        window.removeEventListener("touchmove", this.setTouchMove);
    }
}

export {};
