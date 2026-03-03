class Clock {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.radius = this.canvas.width / 2;
        this.isPaused = false;
        
        // Stop spacją
        window.addEventListener('keydown', (e) => {
            if (e.code === 'Space') {
                this.isPaused = !this.isPaused;
            }
        });

        this.animate();
    }

    drawFace() {
        const ctx = this.ctx;
        ctx.beginPath();
        ctx.arc(0, 0, this.radius * 0.95, 0, 2 * Math.PI);
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Rysowanie kresek godzinowych
        for (let i = 0; i < 12; i++) {
            ctx.save();
            ctx.rotate(i * Math.PI / 6);
            ctx.beginPath();
            ctx.moveTo(0, -this.radius * 0.85);
            ctx.lineTo(0, -this.radius * 0.92);
            ctx.lineWidth = 4;
            ctx.stroke();
            ctx.restore();
        }
    }

    drawHand(angle, length, width, color) {
        const ctx = this.ctx;
        ctx.save();          // Zapisanie stanu układu współrzędnych
        ctx.rotate(angle);   // Obrót układu o wyliczony kąt
        ctx.beginPath();
        ctx.strokeStyle = color;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.moveTo(0, 10);   // Lekkie wystawienie wskazówki za środek
        ctx.lineTo(0, -length);
        ctx.stroke();
        ctx.restore();       // Przywrócenie stanu dla następnej wskazówki
    }

    update() {
        if (this.isPaused) return;

        const now = new Date();
        const ms = now.getMilliseconds();
        const sec = now.getSeconds() + ms / 1000; // Płynny ruch sekundnika
        const min = now.getMinutes() + sec / 60;
        const hr = now.getHours() % 12 + min / 60;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.save();
        
        // Przeniesieniue układu współrzędnych
        this.ctx.translate(this.radius, this.radius);

        this.drawFace();

        // Rysowanie wskazówek
        this.drawHand(hr * Math.PI / 6, this.radius * 0.5, 8, '#333');    // Godzinowa
        this.drawHand(min * Math.PI / 30, this.radius * 0.7, 5, '#666');   // Minutowa
        this.drawHand(sec * Math.PI / 30, this.radius * 0.85, 2, '#d40000'); // Sekundowa

        // Środek zegara
        this.ctx.beginPath();
        this.ctx.arc(0, 0, 5, 0, 2 * Math.PI);
        this.ctx.fillStyle = '#333';
        this.ctx.fill();

        this.ctx.restore();
    }

    animate() {
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

const myClock = new Clock('clockCanvas');