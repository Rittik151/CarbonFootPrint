import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

const Resources = () => {
  const articles = [
    {
      id: '1',
      title: "How to Use Reforestation Projects to Offset Your Carbon Footprint",
      summary: "Among the many methods of reducing your carbon footprint is participating in reforestation initiatives. You help lower greenhouse emissions in [...]",
      category: "Carbon Offsetting",
      date: "May 15, 2023"
    },
    {
      id: '2',
      title: "10 Simple Ways to Reduce Your Carbon Footprint at Home",
      summary: "It doesn't have to be difficult or expensive to minimize your carbon footprint. Small changes in your daily habits may [...]",
      category: "Lifestyle",
      date: "April 28, 2023"
    },
    {
      id: '3',
      title: "Understanding Your Carbon Footprint: What It Is and Why It Matters",
      summary: "As we as a society strive to reduce our environmental impact and combat climate change, the concept of 'carbon footprint' [...]",
      category: "Education",
      date: "March 10, 2023"
    }
  ];

  return (
    <>
      <Header />
      <main className="resources-page" style={{backgroundColor:"rgb(159, 221, 227)"}}>
        <div className="container" style={{backgroundColor:"rgb(159, 221, 227)"}}>
          <h1>Educational Resources</h1>
          <p className="page-description">Learn how to reduce your environmental impact with our collection of articles and guides.</p>
          
          <div className="articles-list">
            {articles.map((article) => (
              <article className="article-preview" key={article.id}>
                <div className="article-meta">
                  <span className="category">{article.category}</span>
                  <span className="date">{article.date}</span>
                </div>
                <h2 className="article-title">{article.title}</h2>
                <p className="article-summary">{article.summary}</p>
                <Link to={`/article/${article.id}`} className="read-more">Read more »</Link>
              </article>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default Resources;