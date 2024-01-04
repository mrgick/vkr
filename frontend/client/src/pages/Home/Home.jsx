import styles from "./Home.module.css";
import Layout from "../../components/Layout/Layout";

const Home = () => {
  return (
    <Layout>
      <h1>Кто мы?</h1>
<div class="about">
    <p>

        Dice Harmony - ваш проводник в мир настольных игр. Мы являемся ведущим источником новостей, обзоров и интервью с
        разработчиками, стремясь сделать настольные игры более доступными и популярными. Наша команда опытных писателей
        предоставляет информативный и увлекательный контент для всех уровней игроков. Помимо этого, у нас есть магазин,
        предлагающий широкий выбор настольных игр и аксессуаров. Добро пожаловать в увлекательный мир настольных игр с
        Dice Harmony!</p>
    </div>
    <h1>Последние новости</h1>
    <div class="news">
        <article onclick="location.href='{% url 'news_detail' pk=news.id%}';">
            {/* <h6><strong>{{news.title}}</strong></h6>
            <p>{{news.description}}</p>
            <p>{{news.date|date:'Y-m-d'}}</p> */}
        </article>
    </div>
    </Layout>
  );
};

export default Home;
