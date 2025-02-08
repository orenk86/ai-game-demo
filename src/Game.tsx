import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import bgImg from "./assets/bg.png";
import bananasImg from "./assets/bananas.png";
import clownImg from "./assets/clown-in-a-clown-car.png";
import flyingPigImg from "./assets/flying-pig.png";
import birthdayCakeImg from "./assets/birthday-cake.png";
import ufoImg from "./assets/ufo.png";

const GAME_HEIGHT = 800;

const obstacleTypes = [
  { width: 100, height: 100, image: `url(${bananasImg})` },
  { width: 100, height: 100, image: `url(${clownImg})` },
  { width: 100, height: 100, image: `url(${flyingPigImg})` },
  { width: 100, height: 100, image: `url(${birthdayCakeImg})` },
];

type Obstacle = { x: number, y: number, width: number, height: number, image: string };

const Game = () => {
  const [positionY, setPositionY] = useState(200);
  const [positionX, setPositionX] = useState(50);
  const [obstacles, setObstacles] = useState<Obstacle[]>([]);
  const gameRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (gameRef.current) {
      gameRef.current.focus();
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setObstacles((prev) =>
        prev.map((obs) => ({ ...obs, x: obs.x - 5 })).filter((obs) => obs.x > -100)
      );
    }, 50);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const spawnObstacle = setInterval(() => {
      const imageIndex = Math.floor(Math.random() * obstacleTypes.length);
      const randomObstacle = obstacleTypes[imageIndex];
      setObstacles((prev) => [...prev, { x: 1500, y: Math.random() * GAME_HEIGHT, ...randomObstacle }]);
    }, 2000);
    return () => clearInterval(spawnObstacle);
  }, []);

  const handleKeyDown = (e: { key: string; }) => {
    if (e.key === "ArrowUp") {
      setPositionY((prev) => Math.max(prev - 20, 0));
    }
    if (e.key === "ArrowDown") {
      setPositionY((prev) => Math.min(prev + 20, GAME_HEIGHT - 20));
    }
    if (e.key === "ArrowLeft") {
      setPositionX((prev) => Math.max(prev - 20, 0));
    }
    if (e.key === "ArrowRight") {
      setPositionX((prev) => Math.min(prev + 100, GAME_HEIGHT)); // Adjusted max X position
    }
  };

  return (
    <div
      ref={gameRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className={`relative w-full h-[800px] overflow-hidden outline-none bg-cover bg-center`}
      style={{ backgroundImage: `url(${bgImg})` }}
    >
      <motion.img
        src={ufoImg}
        alt="UFO Player"
        animate={{ x: positionX, y: positionY }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{
          position: "absolute",
          width: "80px", // Adjust size if needed
          height: "50px",
        }}
      />
      {obstacles.map((obs, index) => (
        <div
          key={index}
          style={{
            position: "absolute",
            top: obs.y,
            left: obs.x,
            width: obs.width,  // Adjust according to sprite size
            height: obs.height, // Adjust according to sprite size
            backgroundImage: obs.image,
            backgroundSize: "100px 100px", // Adjust to full sprite sheet dimensions
            backgroundRepeat: "no-repeat"
          }}
        />
      ))}
    </div>
  );
};

export default Game;
