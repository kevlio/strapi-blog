import React, { useState, useEffect } from "react";
import "./App.css";

import axios from "axios";
import ReactMarkDown from "react-markdown";

interface Article {
  id: number;
  attributes: {
    title: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;

    users_permissions_user: {
      data: {
        attributes: {
          blocked: boolean;
          confirmed: boolean;
          createdAt: string;
          email: string;
          provider: string;
          updatedAt: string;
          username: string;
        };
      };
      id: number;
    };
  };
}

interface ApiData {
  data: Article[];
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

function App() {
  const [articles, setArticles] = useState<Article[]>([]);

  useEffect(() => {
    getArticles();
  }, []);

  const getArticles = async () => {
    try {
      const response = await axios.get<ApiData>(
        "http://localhost:8082/api/articles?populate=*"
      );
      const articles = response.data.data;
      setArticles(articles);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div
      className="App"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "1rem",
      }}
    >
      <h1>Strapi blog test</h1>
      {articles.map((article) => (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            border: "1px solid white",
            padding: "0.5rem",
          }}
          key={article.id}
        >
          <h2 style={{ marginBlock: "0" }}>{article.attributes.title}</h2>
          <ReactMarkDown>{article.attributes.content}</ReactMarkDown>
          <h3 style={{ alignSelf: "flex-end" }}>
            {article.attributes.users_permissions_user.data.attributes.username}
            ,{" "}
            {article.attributes.publishedAt
              .replace("T", " ")
              .replace("Z", "")
              .slice(0, 16)}
          </h3>
        </div>
      ))}
    </div>
  );
}

export default App;
