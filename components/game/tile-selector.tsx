"use client";

import { useEffect, useRef, useState } from "react";
import SuccessDialog from "./success-dialog";
import PuzzleTimer from "./puzzle-timer";

interface Props {
  src: string;
  numCols: number;
  numRows: number;
}

const TileSelector: React.FC<Props> = ({ src, numCols, numRows }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pieces, setPieces] = useState<{ id: number; img: string }[]>([]);
  const [shuffledPieces, setShuffledPieces] = useState<
    { id: number; img: string }[]
  >([]);
  const [isComplete, setIsComplete] = useState(false); // State variable for puzzle completion

  useEffect(() => {
    const fetchImage = async (url: string) => {
      const response = await fetch(url);
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    };

    fetchImage(src).then((dataUrl) => {
      const image = new Image();
      image.src = dataUrl;

      image.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0);

        // Calculate the size of each piece
        const pieceWidth = Math.floor(image.width / numCols);
        const pieceHeight = Math.floor(image.height / numRows);

        const tempPieces: { id: number; img: string }[] = [];

        for (let row = 0; row < numRows; row++) {
          for (let col = 0; col < numCols; col++) {
            const piece = ctx.getImageData(
              col * pieceWidth,
              row * pieceHeight,
              pieceWidth,
              pieceHeight
            );
            const pieceCanvas = document.createElement("canvas");
            pieceCanvas.width = pieceWidth;
            pieceCanvas.height = pieceHeight;
            const pieceCtx = pieceCanvas.getContext("2d");
            pieceCtx?.putImageData(piece, 0, 0);

            tempPieces.push({
              id: row * numCols + col,
              img: pieceCanvas.toDataURL(),
            });
          }
        }

        setPieces(tempPieces);

        for (let i = tempPieces.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [tempPieces[i], tempPieces[j]] = [tempPieces[j], tempPieces[i]];
        }
        setShuffledPieces(tempPieces);

        // Revoke the object URL after use
        URL.revokeObjectURL(dataUrl);
      };
    });

    console.log("puzzle pieces", pieces);
  }, [src]);

  const handleDragStart = (event: React.DragEvent, id: number) => {
    event.dataTransfer.setData("text/plain", id.toString());
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const sourceId = parseInt(event.dataTransfer.getData("text/plain"));
    const targetId = parseInt(event.currentTarget.id);
    if (sourceId !== targetId) {
      const newPieces = [...shuffledPieces];
      [newPieces[sourceId], newPieces[targetId]] = [
        newPieces[targetId],
        newPieces[sourceId],
      ];
      setShuffledPieces(newPieces);
      checkCompletion(newPieces);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const checkCompletion = (pieces: { id: number; img: string }[]) => {
    for (let i = 0; i < pieces.length; i++) {
      if (pieces[i].id !== i) {
        setIsComplete(false);
        return;
      }
    }
    setIsComplete(true);
  };

  return (
    <div>
      <div className="w-96 h-96 relative">
        <canvas ref={canvasRef} style={{ display: "none" }} />
        <div className={`grid grid-cols-3`}>
          {shuffledPieces.map((piece, index) => (
            <img
              key={index}
              id={index.toString()}
              src={piece.img}
              draggable="true"
              onDragStart={(e) => handleDragStart(e, index)}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              className="p-[0.8px] col-span-1 rounded-md cursor-pointer hover:shadow-2xl transition duration-200 ease-in-out"
            />
          ))}
        </div>
      </div>
      <SuccessDialog
        open={isComplete}
        solution={src}
        onContinue={() => setIsComplete(false)}
      />
    </div>
  );
};

export default TileSelector;
