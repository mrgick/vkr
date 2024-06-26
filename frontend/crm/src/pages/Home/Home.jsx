import styles from "./Home.module.css";
import Layout from "../../components/Layout/Layout";
import React from "react";
import { Title } from "../../components/uiKit";

const Home = (props) => {
  return (
    <Layout className={styles.layout}>
      <Title theme="white" text="Администраторская панель" />
      <div className={styles.about}>
        <p>Дорогие коллеги! </p>
        <p>
          Мы с вами работаем в уникальном месте — «Dice Harmony». Это ведущий
          портал о настольных играх, который объединяет людей со всего мира. Наш
          сайт ежедневно посещают тысячи человек, которые хотят узнать больше об
          этом замечательном хобби. И мы помогаем им в этом!
        </p>
        <p>
          Каждый день мы публикуем интересные новости, обзоры новых игр и
          интервью с их создателями. Мы делаем настольные игры ближе и понятнее
          для каждого человека. И это наша общая заслуга!
        </p>
        <p>
          Кроме того, наш интернет-магазин предлагает огромный выбор настольных
          игр и аксессуаров к ним. Благодаря этому всё необходимое для отличного
          вечера в кругу семьи или друзей всегда под рукой.
        </p>
        <p>
          Давайте продолжать делать настольные игры популярными и доступными!
          Вместе мы сможем добиться ещё больших успехов!
        </p>
      </div>
    </Layout>
  );
};

export default Home;
