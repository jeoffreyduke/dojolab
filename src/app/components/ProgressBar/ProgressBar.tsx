import React, { useEffect, useState } from "react";
import styles from "./ProgressBar.module.css";

interface Props {
  type: "width" | "height";
  progress: number;
  total: number;
  reached: boolean | undefined | null;
}

const ProgressBar = ({ type, progress, total, reached }: Props) => {
  const [percent, setPercent] = useState(0);

  useEffect(() => {
    setPercent(Math.round((progress / total) * 100));
  }, [progress, total]);

  return (
    <div className={styles.progressBar}>
      {type === "width" ? (
        <div
          className={styles.progress}
          style={
            type === "width"
              ? { width: `${percent}%` }
              : { height: `${percent}%` }
          }
        ></div>
      ) : reached ? (
        <div
          className={styles.progress}
          style={{ height: `${percent}%` }}
        ></div>
      ) : (
        <div className={styles.progressGrey}></div>
      )}
    </div>
  );
};

export default ProgressBar;
