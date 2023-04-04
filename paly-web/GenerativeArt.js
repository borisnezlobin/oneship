import React from 'react';
import styled from 'styled-components';
import { Spring } from 'react-spring/renderprops.cjs';

import {
  getDevicePixelRatio,
  getScaledCanvasProps,
} from '@helpers/canvas.helpers';
import useMousePosition from '@hooks/use-mouse-position.hook';
import useBoundingBox from '@hooks/use-bounding-box.hook';
import { clamp, normalize } from '@utils';

import { ConfigContext } from '../ConfigContext';

const GAP = 12;

function draw(
  x,
  y,
  canvasBox,
  numRows,
  numCols,
  lineLength,
  lineWidth,
  lineColor,
  timeSince,
  ctx
) {
  // To avoid motion for those who have preferred not to see it,
  // I'll force a constant mouse position of the top-left corner
  // of the canvas.

  const relativeMousePos = {
        x: x - canvasBox.left,
        y: y - canvasBox.top,
      };

  ctx.clearRect(0, 0, canvasBox.width, canvasBox.height);

  const radius = lineLength * 0.5;
  const horizontalGap = lineLength + GAP;
  const verticalGap = lineLength + GAP;

  for (let rowIndex = 0; rowIndex < numRows; rowIndex++) {
    for (let colIndex = 0; colIndex < numCols; colIndex++) {
      const distanceFromOriginPoint = Math.sqrt(rowIndex ** 2 + colIndex ** 2);
      const t = distanceFromOriginPoint * 0.05 + 0.5;
      if (t > timeSince) {
        continue;
      }

      const centerX = colIndex * horizontalGap + horizontalGap;
      const centerY = rowIndex * verticalGap + verticalGap;

      const deltaX = centerX - relativeMousePos.x;
      const deltaY = centerY - relativeMousePos.y;

      const distance = Math.sqrt(deltaX ** 2 + deltaY ** 2);

      // const xOffset =
      const hypRatio = radius / distance;

      const xRatio = deltaX * hypRatio;
      const yRatio = deltaY * hypRatio;

      const dampenBy = clamp(normalize(distance, 0, 300, 1, 0), 0, 1);

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
      ctx.strokeStyle = lineColor;
      ctx.stroke();
      ctx.closePath();
    }
  }
}

const GenerativeArt = ({
  numRows = 8,
  numCols = 16,
  lineLength = 12,
  lineWidth = 3,
}) => {

  const startAt = React.useRef(Date.now());
  const [timeSince, setTimeSince] = React.useState(0);

  const { colorMode } = React.useContext(ConfigContext);

  const horizontalGap = lineLength + GAP;
  const verticalGap = lineLength + GAP;

  // We want a "gap" on either side, so that lines at the edge
  // that swivel aren't truncated by the canvas limits.
  const width = horizontalGap * (numCols + 1);
  const height = verticalGap * (numRows + 1);

  const mousePos = useMousePosition();
  const [canvasRef, canvasBox] = useBoundingBox();
  const contextRef = React.useRef(null);

  // TODO: Should I use an offscreen canvas?
  React.useEffect(() => {
    if (!canvasRef.current) {
      return;
    }
    contextRef.current = canvasRef.current.getContext('2d');

    const devicePixelRatio = getDevicePixelRatio();

    contextRef.current.scale(devicePixelRatio, devicePixelRatio);
  }, [canvasRef]);

  const strokeColor = React.useRef(null);

  // Handle re-drawing when the colorMode is changed.
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
      strokeColor.current,
      timeSince,
      contextRef.current
    );
    // Whatever
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [colorMode]);

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
            strokeColor.current,
            timeSince,
            contextRef.current
          );
          return null;
        }}
      </Spring>
      <Canvas ref={canvasRef} {...scaledCanvasProps} />
    </>
  );
};

const Canvas = styled.canvas`
  display: block;
`;

export default GenerativeArt;
