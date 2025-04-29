export class Canvas {
    private ctx: CanvasRenderingContext2D;
    private width: number;
    private height: number;
    private penSize: number = 1;
    private colorValue: number = 0; // 0-100 where 0 - black and 100 - white

    constructor(canvasId: string, width: number, height: number) {
        const canvas = document.getElementById(canvasId) as HTMLCanvasElement;
        if (!canvas) {
            throw new Error(`Canvas width id ${canvasId} not found`);
        }

        canvas.width = width;
        canvas.height = height;

        this.width = width;
        this.height = height;
        this.ctx = canvas.getContext('2d')!;

        // Invert the Y axis to match the DBN coordinate system
        // In DBN (0,0) is in the lower left corner
        this.ctx.transform(1, 0, 0, -1, 0, height);

        // Set default background to white
        this.clear();
    }

    clear(): void {
        this.ctx.fillStyle = 'white';
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    setPenSize(size: number): void {
        this.penSize = size;
        this.ctx.lineWidth = size;
    }

    setColor(value: number): void {
        // Limit the value from 0 to 100
        value = Math.max(0, Math.min(100, value));
        this.colorValue = value;

        // Convert the value to RGB format (inverted, since 0 is black, 100 is white)
        const colorInt = Math.floor(255 * (100 - value) / 100);
        this.ctx.strokeStyle = `rgb(${colorInt}, ${colorInt}, ${colorInt})`;
        this.ctx.fillStyle = `rgb(${colorInt}, ${colorInt}, ${colorInt})`;
    }

    setPaper(value: number): void {
        // Limit the value from 0 to 100
        value = Math.max(0, Math.min(100, value));

        // Convert the value to RGB format (inverted)
        const colorInt = Math.floor(255 * (100 - value) / 100);
        this.ctx.fillStyle = `rgb(${colorInt}, ${colorInt}, ${colorInt})`;
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Restore the current drawing color
        this.setColor(this.colorValue);
    }

    drawLine(x1: number, y1: number, x2: number, y2: number): void {
        this.ctx.beginPath();
        this.ctx.moveTo(x1, y1);
        this.ctx.lineTo(x2, y2);
        this.ctx.stroke();
    }

    drawRect(x: number, y: number, width: number, height: number): void {
        this.ctx.strokeRect(x, y, width - x, height - y);
    }

    drawCircle(x: number, y: number, radius: number): void {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.stroke();
    }

    fillRect(x: number, y: number, width: number, height: number): void {
        this.ctx.fillRect(x, y, width - x, height - y);
    }

    fillCircle(x: number, y: number, radius: number): void {
        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        this.ctx.fill();
    }

    getWidht(): number {
        return this.width;
    }
    
    getHeight(): number {
        return this.height;
    }
}