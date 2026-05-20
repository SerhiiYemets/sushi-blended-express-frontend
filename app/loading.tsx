"use client";

import { ScaleLoader } from "react-spinners";
import type { CSSProperties } from "react";
import styles from "./loading.module.css";

const override: CSSProperties = {
    display: "block",
    margin: "0 auto",
};

export default function Loading() {
    return (
        <div className={styles.wrapper}>
        <ScaleLoader
            color="#E76F51"
            loading
            cssOverride={override}
            aria-label="Načítání"
        />
        <span className={styles.text}>Načítám data...</span>
        </div>
    );
}



