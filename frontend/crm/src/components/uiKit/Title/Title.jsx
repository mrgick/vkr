import styles from "./Title.module.css"

export const Title = (props) => {
    return (
        <h1 className={props.theme==="white" ? styles.white : styles.title}>{props.text}</h1>
    )
};

