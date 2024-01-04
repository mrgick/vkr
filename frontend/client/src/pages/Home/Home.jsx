import styles from "./Home.module.css";
import Layout from "../../components/Layout/Layout";
import React, { useEffect, useState } from "react";
import Title from "../../components/uiKit/Title/Title";

const Home = (props) => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(`http://127.0.0.1:8000/news/last-news/`);
      const newData = await response.json();
      setData(newData);
    };

    fetchData();
  }, []);

  return (
    <Layout className={styles.layout}>
      <Title theme="white" text="Кто мы?"/>
      <div className={styles.about}>
        <p>
          Dice Harmony - ваш проводник в мир настольных игр. Мы являемся ведущим
          источником новостей, обзоров и интервью с разработчиками, стремясь
          сделать настольные игры более доступными и популярными. Наша команда
          опытных писателей предоставляет информативный и увлекательный контент
          для всех уровней игроков. Помимо этого, у нас есть магазин,
          предлагающий широкий выбор настольных игр и аксессуаров. Добро
          пожаловать в увлекательный мир настольных игр с Dice Harmony!
        </p>
      </div>
      <h1>Последние новости</h1>
      <div className={styles.news}>
        {data.map((x) => (
          <article key={x.id} className={styles.article}>
            <h6>
              <strong>{x.title}</strong>
            </h6>
            <p>{x.description}</p>
            <p>{new Date(x.date).toLocaleDateString("ru-RU")}</p>
          </article>
        ))}
      </div>
    </Layout>
  );
};

export default Home;
