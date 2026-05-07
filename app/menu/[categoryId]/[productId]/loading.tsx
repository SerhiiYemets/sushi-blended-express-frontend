import Spinner from '@/components/Spinner/Spinner';
import styles from './loading.module.css';

export default function Loading() {
    return (
        <div className={styles.container}>
            <div className={styles.sidebar} />
                <div className={styles.content}>
                    <Spinner />
            </div>
        </div>
    );
}