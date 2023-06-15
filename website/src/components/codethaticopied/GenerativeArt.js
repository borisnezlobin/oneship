import React from 'react';
import styled from 'styled-components';
import { Spring } from 'react-spring';

// copied from joshwcomeau.com
import {
  getScaledCanvasProps,
} from './canvas.helpers';
import useMousePosition from './use-mouse-position.hook';
import useBoundingBox from './useBoundingBox.hook';
import usePrefersReducedMotion from './use-prefers-reduced-motion.hook';

const clamp = (val, min = 0, max = 1) =>
  Math.max(min, Math.min(max, val));


const GAP = 12;

function draw(
  x,
  y,
  canvasBox,
  numRows,
  numCols,
  lineLength,
  lineWidth,
  timeSince,
  prefersReducedMotion,
  ctx
) {
  const relativeMousePos = {
    x: parseFloat(JSON.stringify(x)),
    y: parseFloat(JSON.stringify(y)),
  };
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  const radius = lineLength * 0.5;
  const horizontalGap = lineLength + GAP;
  const verticalGap = lineLength + GAP;

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const distanceFromOriginPoint = Math.sqrt(rowIndex ** 2 + colIndex ** 2);
      const t = distanceFromOriginPoint * 0.05 + 0.5;
      if (t > timeSince && !prefersReducedMotion) {
        continue;
      }

      const centerX = colIndex * horizontalGap + horizontalGap;
      const centerY = rowIndex * verticalGap + verticalGap;

      const deltaX = centerX - relativeMousePos.x;
      const deltaY = centerY - relativeMousePos.y;

      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      const hypRatio = radius / distance;

      const xRatio = deltaX * hypRatio;
      const yRatio = deltaY * hypRatio;

      // const dampenBy = clamp(normalize((distance * distance), 0, 300, 1, 0), 0, 1);
      const dampenBy = clamp((1 / clamp(distance * distance, 0.001, 10000000000000)) * 5000, 0, 1);
      const p1 = {
        x: centerX - xRatio * dampenBy,
        y: centerY - yRatio * dampenBy,
      };
      const p2 = {
        x: centerX + xRatio * dampenBy,
        y: centerY + yRatio * dampenBy,
      };

      ctx.beginPath();
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.strokeStyle = "rgba(125, 125, 125, 0.25)";
      ctx.stroke();
      ctx.closePath();
    }
  }
}

const GenerativeArt = ({
  lineLength = 36,
  lineWidth = 4,
  numRows = (window.innerHeight) / (lineLength + GAP) - 1,
  numCols = (window.innerWidth) / (lineLength + GAP) - 1,
}) => {
  const prefersReducedMotion = usePrefersReducedMotion();

  const startAt = React.useRef(Date.now());
  const [timeSince, setTimeSince] = React.useState(0);

  const width = window.innerWidth;
  const height = window.innerHeight;

  const mousePos = useMousePosition();
  const [canvasRef, canvasBox] = useBoundingBox();
  const contextRef = React.useRef(null);

  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    contextRef.current = canvasRef.current.getContext('2d');
  }, [canvasRef]);

  const strokeColor = React.useRef(null);

  React.useEffect(() => {
    strokeColor.current = getComputedStyle(
      document.documentElement
    ).getPropertyValue('--green');

    if (!mousePos || !canvasBox) {
      return;
    }

    draw(
      mousePos.x,
      mousePos.y,
      canvasBox,
      numRows,
      numCols,
      lineLength,
      lineWidth,
      timeSince,
      prefersReducedMotion,
      contextRef.current
    );
    // Whatever
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  React.useEffect(() => {
    if (timeSince < 3) {
      window.requestAnimationFrame(() => {
        setTimeSince((Date.now() - startAt.current) / 1000);
      });
    }
  }, [timeSince]);

  const scaledCanvasProps = getScaledCanvasProps(width, height);

  return (
    <>
      <Spring
        to={{ x: mousePos ? mousePos.x : 0, y: mousePos ? mousePos.y : 0 }}
        config={{ tension: 300, friction: 20 }}
      >
        {(props) => {
          if (!canvasBox) {
            return null;
          }

          draw(
            props.x,
            props.y,
            canvasBox,
            numRows,
            numCols,
            lineLength,
            lineWidth,
            timeSince,
            prefersReducedMotion,
            contextRef.current
          );
          return null;
        }}
      </Spring>
      <Canvas
        ref={canvasRef}
        {...scaledCanvasProps}
        width={window.innerWidth}
        height={window.innerHeight}
      />
    </>
  );
};

const Canvas = styled.canvas`
  display: block;
  position: absolute;
  top: 0;
  width: 100vw;
  height: 100vh;
`;

export default GenerativeArt;
