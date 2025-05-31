<template>
  <div
    class="ball-container"
    ref="container"
  >
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      class="ball"
      :class="{ 'bounce-animation': enableBounce }"
    >
      <defs>
        <radialGradient
          id="blobGradient"
          cx="40%"
          cy="40%"
          r="50%"
          fx="40%"
          fy="40%"
        >
          <stop
            offset="0%"
            stop-color="#5E9FFF"
            stop-opacity="0.9"
          />
          <stop
            offset="50%"
            stop-color="#3178FF"
            stop-opacity="0.9"
          />
          <stop
            offset="100%"
            stop-color="#0052FF"
            stop-opacity="0.6"
          />
        </radialGradient>
        <filter
          id="glow"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur
            stdDeviation="8"
            result="blur"
          />
          <feComposite
            in="SourceGraphic"
            in2="blur"
            operator="over"
          />
        </filter>
      </defs>

      <g transform="translate(0, 0)">
        <path
          :d="backgroundBlobPath"
          fill="rgba(0, 82, 255, 0.3)"
          filter="url(#glow)"
          transform="scale(0.95) translate(5%, 5%)"
        />
      </g>

      <!-- Main blob -->
      <path
        :d="blobPath"
        fill="url(#blobGradient)"
        filter="url(#glow)"
      />

      <!-- Highlight effect -->
      <circle
        :cx="size * 0.4"
        :cy="size * 0.4"
        :r="size * 0.2"
        fill="white"
        opacity="0.2"
      />

      <!-- Eyes -->
      <g>
        <!-- Left eye -->
        <line
          :x1="size * 0.35"
          :y1="size * 0.3"
          :x2="size * 0.35"
          :y2="size * 0.5"
          stroke="white"
          :stroke-width="size * 0.05"
          stroke-linecap="round"
        />

        <!-- Right eye -->
        <line
          :x1="size * 0.65"
          :y1="size * 0.3"
          :x2="size * 0.65"
          :y2="size * 0.5"
          stroke="white"
          :stroke-width="size * 0.05"
          stroke-linecap="round"
        />
      </g>

      <!-- Outer rim -->
      <circle
        :cx="size / 2"
        :cy="size / 2"
        :r="size * 0.45"
        fill="none"
        stroke="rgba(255, 255, 255, 0.2)"
        :stroke-width="size * 0.02"
      />
    </svg>
  </div>
</template>

<script>
export default {
  name: "ShapeChangingBall",
  props: {
    size: {
      type: Number,
      default: 180,
    },
    enableBounce: {
      type: Boolean,
      default: true,
    },
    bounceHeight: {
      type: Number,
      default: 10,
    },
    bounceDuration: {
      type: Number,
      default: 1800,
    },
  },
  data() {
    return {
      blobPath: "",
      backgroundBlobPath: "",
      animationFrame: null,
      progress: 0,
      intensity: 30,
      backgroundIntensity: 25,
    };
  },
  mounted() {
    this.startBlobAnimation();

    if (this.enableBounce) {
      const container = this.$refs.container;
      container.style.setProperty("--bounce-height", `${this.bounceHeight}px`);
      container.style.setProperty("--bounce-duration", `${this.bounceDuration}ms`);
    }
  },
  beforeUnmount() {
    if (this.animationFrame) {
      cancelAnimationFrame(this.animationFrame);
    }
  },
  methods: {
    startBlobAnimation() {
      const animate = () => {
        this.progress += 0.005;
        this.updateBlobPath();
        this.updateBackgroundBlobPath();
        this.animationFrame = requestAnimationFrame(animate);
      };

      this.updateBlobPath();
      this.updateBackgroundBlobPath();
      this.animationFrame = requestAnimationFrame(animate);
    },

    updateBlobPath() {
      this.blobPath = this.generateBlobPath(this.intensity, 0);
    },

    updateBackgroundBlobPath() {
      this.backgroundBlobPath = this.generateBlobPath(this.backgroundIntensity, 2);
    },

    generateBlobPath(intensity, offsetFactor) {
      const center = { x: this.size / 2, y: this.size / 2 };
      const radius = (this.size / 2) * 0.85;
      const points = [];
      const numPoints = 30;
      const angleStep = (2 * Math.PI) / numPoints;
      const displacementFactor = intensity * 0.4;
      const offset = this.progress + offsetFactor * 0.1;

      for (let i = 0; i <= numPoints; i++) {
        const index = i % numPoints;
        const angle = index * angleStep;

        const displacement =
          displacementFactor *
          (Math.sin(angle * 2 + offset * 2 * Math.PI) * 0.15 +
            Math.cos(angle * 3 + offset * 2 * Math.PI) * 0.15 +
            Math.sin(angle * 4 + offset * 3 * Math.PI) * 0.1 +
            Math.cos(angle * 5 + offset * 3 * Math.PI) * 0.05 +
            Math.sin(angle * 7 + offset * 3 * Math.PI) * 0.05);

        const pointRadius = radius + displacement;
        const x = center.x + pointRadius * Math.cos(angle);
        const y = center.y + pointRadius * Math.sin(angle);

        points.push({ x, y });
      }

      let path = `M ${points[0].x} ${points[0].y}`;

      for (let i = 1; i < points.length; i++) {
        const p0 = points[i - 1];
        const p1 = points[i];

        const dist = Math.sqrt(Math.pow(p1.x - p0.x, 2) + Math.pow(p1.y - p0.y, 2));
        const controlPointDistance = dist * 0.25;

        const prevIndex = i - 2 >= 0 ? i - 2 : points.length - 2;
        const nextIndex = i + 1 < points.length ? i + 1 : 1;

        const previousPoint = points[prevIndex];
        const nextPoint = points[nextIndex];

        const tangent1 = this.normalize({
          x: p1.x - previousPoint.x,
          y: p1.y - previousPoint.y,
        });

        const tangent2 = this.normalize({
          x: nextPoint.x - p0.x,
          y: nextPoint.y - p0.y,
        });

        const cp1 = {
          x: p0.x + tangent1.x * controlPointDistance,
          y: p0.y + tangent1.y * controlPointDistance,
        };

        const cp2 = {
          x: p1.x - tangent2.x * controlPointDistance,
          y: p1.y - tangent2.y * controlPointDistance,
        };

        path += ` C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${p1.x} ${p1.y}`;
      }

      return path;
    },

    normalize(vector) {
      const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
      if (length === 0) return { x: 0, y: 0 };
      return { x: vector.x / length, y: vector.y / length };
    },
  },
};
</script>

<style scoped>
.ball-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.ball {
  filter: drop-shadow(0 0 20px rgba(0, 82, 255, 0.4));
  transform-origin: center center;
}

.bounce-animation {
  animation: bounce var(--bounce-duration, 1800ms) infinite ease-in-out alternate;
}

@keyframes bounce {
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(calc(var(--bounce-height, 10px) * -1));
  }
  100% {
    transform: translateY(0);
  }
}
</style>
